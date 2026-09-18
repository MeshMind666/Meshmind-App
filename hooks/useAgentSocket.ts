"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface HUDAlertData {
  entity: string;
  insights: Array<{ relation: string; detail: string; type: string }>;
  hudSummary: string;
  latencyMs: number;
  subgraph?: any;
}

export interface CommitmentData {
  dealId: string;
  status: string;
  terms: {
    deliverable: string;
    amount: number | null;
    token: string;
    deadline?: string;
  };
  graphStateRoot: string;
  greenfieldSynced: boolean;
}

export interface HUDActionAck {
  action: string;
  status: string;
  entity: string;
  message: string;
}

export function useAgentSocket(serverUrl?: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [hudAlert, setHudAlert] = useState<HUDAlertData | null>(null);
  const [lastCommitment, setLastCommitment] = useState<CommitmentData | null>(null);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [lastActionAck, setLastActionAck] = useState<HUDActionAck | null>(null);
  const [agentFeedback, setAgentFeedback] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Resolve WebSocket URL with env var support (for Vercel / production)
    let resolvedUrl: string | undefined = serverUrl || process.env.NEXT_PUBLIC_WS_URL;
    if (!resolvedUrl) {
      if (typeof window !== "undefined") {
        const isSecure = window.location.protocol === "https:";
        const host = window.location.hostname;
        if (host === "localhost" || host === "127.0.0.1") {
          resolvedUrl = "ws://localhost:8000/ws/agent";
        } else {
          resolvedUrl = (isSecure ? "wss" : "ws") + "://169.58.197.144.sslip.io/ws/agent";
        }
      } else {
        resolvedUrl = "ws://localhost:8000/ws/agent";
      }
    }
    const sessionId = "session_" + Math.random().toString(36).substring(2, 9);
    const ws = new WebSocket(`${resolvedUrl}?session_id=${sessionId}`);


    ws.onopen = () => {
      console.log("Connected to Meshmind Agent Engine WebSocket");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "HUD_ALERT") {
          setHudAlert({
            entity: data.entity,
            insights: data.insights,
            hudSummary: data.hud_summary,
            latencyMs: data.latency_ms,
            subgraph: data.subgraph,
          });
        } else if (data.type === "COMMITMENT_RECORDED") {
          setLastCommitment({
            dealId: data.deal_id,
            status: data.status,
            terms: data.terms,
            graphStateRoot: data.graph_state_root,
            greenfieldSynced: data.greenfield_synced,
          });
        } else if (data.type === "VAULT_UNLOCKED") {
          setVaultUnlocked(true);
        } else if (data.type === "HUD_ACTION_ACK") {
          setLastActionAck({
            action: data.action,
            status: data.status,
            entity: data.entity,
            message: data.message,
          });
        } else if (data.type === "AGENT_FEEDBACK") {
          if (data.agent_message) {
            setAgentFeedback(data.agent_message);
          }
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onclose = () => {
      // Check if backend is reachable via HTTP proxy before marking disconnected
      fetch("/api/agent/health")
        .then((r) => r.json())
        .then((d) => {
          if (d.status === "ONLINE") setIsConnected(true);
          else setIsConnected(false);
        })
        .catch(() => setIsConnected(false));
    };

    // Initial check for HTTP proxy
    fetch("/api/agent/health")
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "ONLINE") setIsConnected(true);
      })
      .catch(() => {});

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, [serverUrl]);

  const sendTranscript = useCallback((text: string, speaker: string, counterparty: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "TRANSCRIPT_CHUNK",
          text,
          speaker,
          counterparty,
        })
      );
    } else {
      // Fallback via Next.js reverse proxy (works 100% on HTTPS tunnels like ngrok/localtunnel)
      fetch("/api/agent/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, speaker, counterparty }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.hud_alert) {
            setHudAlert({
              entity: data.hud_alert.entity,
              insights: data.hud_alert.insights,
              hudSummary: data.hud_alert.hud_summary,
              latencyMs: data.hud_alert.latency_ms,
              subgraph: data.hud_alert.subgraph,
            });
          }
          if (data.commitment) {
            setLastCommitment({
              dealId: data.commitment.deal_id,
              status: data.commitment.status,
              terms: data.commitment.terms,
              graphStateRoot: data.commitment.graph_state_root,
              greenfieldSynced: data.commitment.greenfield_synced,
            });
          }
          if (data.agent_message) {
            setAgentFeedback(data.agent_message);
          }
          setIsConnected(true);
        })
        .catch((err) => console.warn("HTTP transcript fallback error:", err));
    }
  }, []);

  const authenticateVault = useCallback((wallet: string, signature: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "AUTHENTICATE_VAULT",
          wallet,
          signature,
        })
      );
    }
  }, []);

  const sendHUDAction = useCallback((action: string, entity: string, insightId?: string, payload?: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(
        JSON.stringify({
          type: "HUD_ACTION",
          action,
          entity,
          insight_id: insightId,
          payload,
        })
      );
    } else {
      // Fallback via Next.js reverse proxy
      fetch("/api/agent/hud_action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, entity, insight_id: insightId, payload }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLastActionAck({
            action: data.action,
            status: data.status,
            entity: data.entity,
            message: data.message,
          });
          setIsConnected(true);
        })
        .catch((err) => console.warn("HTTP hud_action fallback error:", err));
    }
  }, []);

  const exportContextPod = useCallback(async (sessionId: string = "default_session") => {
    try {
      const res = await fetch("/api/agent/vault/export_pod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      console.warn("Error exporting context pod:", err);
      return null;
    }
  }, []);

  return {
    isConnected,
    hudAlert,
    setHudAlert,
    lastCommitment,
    vaultUnlocked,
    lastActionAck,
    agentFeedback,
    sendTranscript,
    authenticateVault,
    sendHUDAction,
    exportContextPod,
  };
}
