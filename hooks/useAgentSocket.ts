"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export interface HUDAlertData {
  entity: string;
  insights: Array<{ relation: string; detail: string; type: string }>;
  hudSummary: string;
  latencyMs: number;
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

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const defaultHost = typeof window !== "undefined" ? window.location.hostname : "localhost";
    const resolvedUrl = serverUrl || `ws://${defaultHost}:8000/ws/agent`;
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
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

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
    }
  }, []);

  return {
    isConnected,
    hudAlert,
    setHudAlert,
    lastCommitment,
    vaultUnlocked,
    lastActionAck,
    sendTranscript,
    authenticateVault,
    sendHUDAction,
  };
}
