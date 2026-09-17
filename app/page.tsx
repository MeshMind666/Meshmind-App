"use client";

import React, { useState } from "react";
import { Mic, MicOff, Shield, Cpu, Database, Blocks, Radio, Sparkles, Send, AlertCircle, Bot } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { useAgentSocket } from "../hooks/useAgentSocket";
import { VoiceWaveform } from "../components/VoiceWaveform";
import { FloatingHUD } from "../components/FloatingHUD";
import { EscrowControls } from "../components/EscrowControls";

export default function Home() {
  const [speaker, setSpeaker] = useState("Alice");
  const [counterparty, setCounterparty] = useState("David");
  const [customInput, setCustomInput] = useState("");

  const {
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
  } = useAgentSocket();

  const handleTranscriptChunk = (chunk: string, isFinal: boolean) => {
    sendTranscript(chunk, speaker, counterparty);
  };

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    isSecure,
    error: speechError,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechRecognition({
    onTranscriptChunk: handleTranscriptChunk,
  });

  const handleSimulateSpeech = (text: string) => {
    setTranscript((prev) => prev + " " + text);
    sendTranscript(text, speaker, counterparty);
  };

  const handleSendCustomInput = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customInput.trim()) return;
    handleSimulateSpeech(customInput.trim());
    setCustomInput("");
  };


  return (
    <main className="min-h-screen p-6 md:p-12 max-w-6xl mx-auto space-y-8">
      {/* Ambient Floating HUD */}
      <FloatingHUD
        alert={hudAlert}
        onDismiss={() => setHudAlert(null)}
        onAction={sendHUDAction}
        actionFeedback={lastActionAck?.message}
      />

      {/* Top Navigation / Brand */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20">
              M
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Meshmind ZK-Escrow
              <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                opBNB + Greenfield
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Sovereign Real-Time Voice AI Escrow with In-Memory CausalDAG &amp; Client-Side Privacy Shield
          </p>
        </div>

        {/* Engine WebSocket Status */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-400 animate-ping" : "bg-amber-400"
              }`}
            />
            <span className="text-slate-300">
              {isConnected ? "Engine Connected" : "Connecting Backend..."}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Voice Ingestion & Transcription (7 cols) */}
        <section className="lg:col-span-7 space-y-6">
          {/* Voice Input Card */}
          <div className="relative overflow-hidden rounded-3xl backdrop-blur-md bg-slate-900/50 border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
            {/* Header with Title & Speaker Setup */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  Voice Negotiation Stream
                </h2>
                <p className="text-xs text-slate-400">
                  Thu âm trực tiếp từ trình duyệt Chromium qua Web Speech API
                </p>
              </div>

              {/* Speaker & Counterparty Setup with Clear Labels */}
              <div className="flex items-center gap-2 text-xs bg-slate-950/80 p-1.5 px-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Bạn:</span>
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    className="w-16 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-center font-semibold focus:outline-none focus:border-emerald-500"
                    placeholder="Bạn"
                    title="Tên người nói (Speaker)"
                  />
                </div>
                <span className="text-slate-600 font-bold">vs</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-medium">Đối tác:</span>
                  <input
                    type="text"
                    value={counterparty}
                    onChange={(e) => setCounterparty(e.target.value)}
                    className="w-20 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 text-center font-semibold focus:outline-none focus:border-emerald-500"
                    placeholder="Đối tác"
                    title="Tên đối tác đàm phán (Counterparty)"
                  />
                </div>
              </div>
            </div>

            {/* Quick-Select Counterparty Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs -mt-2">
              <span className="text-[11px] text-slate-400">Chọn nhanh đối tác:</span>
              {[
                { name: "David", badge: "Có nợ cũ" },
                { name: "Acme Corp", badge: "VIP" },
                { name: "Satoshi", badge: "Verified" },
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setCounterparty(p.name)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] transition flex items-center gap-1.5 ${
                    counterparty.toLowerCase() === p.name.toLowerCase()
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium shadow-sm shadow-emerald-500/10"
                      : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <span>{p.name}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                      p.name === "David"
                        ? "bg-amber-400/15 text-amber-400 border border-amber-400/30"
                        : "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30"
                    }`}
                  >
                    {p.badge}
                  </span>
                </button>
              ))}
            </div>

            {/* Audio Waveform */}
            <VoiceWaveform isListening={isListening} />

            {/* Live Mic Action Button */}
            <div className="flex items-center justify-center">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`group relative flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 shadow-2xl ${
                  isListening
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-950/50"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-950/50"
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-5 h-5 animate-pulse" />
                    <span>Dừng thu âm (Stop Mic)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    <span>Bắt đầu nói (Start Mic Stream)</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile / Insecure HTTP Notice */}
            {(!isSecure || speechError) && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-1">
                  <p className="font-semibold text-amber-200">Lưu ý Microphone trên điện thoại:</p>
                  <p className="text-amber-300/80 leading-relaxed">
                    Trình duyệt di động (Safari/Chrome) yêu cầu <strong>HTTPS</strong> để mở quyền micro trực tiếp. Khi kết nối qua IP LAN HTTP, bạn hãy chạm vào ô nhập bên dưới và bấm nút <strong>Micro trên bàn phím ảo của điện thoại</strong> để nói tiếng Việt!
                  </p>
                </div>
              </div>
            )}

            {/* Direct Voice Dictation & Text Input Bar */}
            <form onSubmit={handleSendCustomInput} className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Nhập hoặc bấm Micro trên bàn phím điện thoại để nói..."
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="submit"
                disabled={!customInput.trim()}
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi</span>
              </button>
            </form>

            {/* Simulation Quick-Clicks */}
            <div className="pt-2 border-t border-slate-800/80">

              <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                Hoặc thử các câu thoại mẫu để kiểm tra HUD &amp; Causal DAG:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() =>
                    handleSimulateSpeech("Tôi chuẩn bị chốt hợp đồng với David.")
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Kích hoạt HUD David (Check Debt)</span>
                </button>
                <button
                  onClick={() =>
                    handleSimulateSpeech("Tôi đồng ý trả 500 USDT hoàn thành Landing Page trước ngày 30/09.")
                  }
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-300 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Chốt kèo 500 USDT (Create DAG Node)</span>
                </button>
              </div>
            </div>

            {/* Real-time Transcription Stream Box */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Live Speech Transcript (Real-Time)
              </label>
              <div className="min-h-32 max-h-48 overflow-y-auto p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-sans text-sm text-slate-200 leading-relaxed">
                {transcript || interimTranscript ? (
                  <>
                    <span>{transcript}</span>
                    <span className="text-emerald-400 italic"> {interimTranscript}</span>
                  </>
                ) : (
                  <span className="text-slate-600 italic">
                    Chưa có âm thanh. Hãy bấm nút micro hoặc chọn câu thoại mẫu ở trên...
                  </span>
                )}
              </div>
            </div>

            {/* AI Agent Real-Time Feedback Sentinel */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900/70 to-slate-900/50 border border-emerald-500/25 shadow-lg flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    AI Escrow Sentinel
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {speaker} ↔ {counterparty}
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed font-sans text-xs">
                  {agentFeedback ||
                    `Đang lắng nghe phiên đàm phán giữa ${speaker} & ${counterparty}. Tự động bóc tách cam kết cọc hợp đồng & cảnh báo rủi ro ngầm qua CausalDAG.`}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Escrow Action & Architecture Blueprint (5 cols) */}
        <section className="lg:col-span-5 space-y-6">
          {/* Escrow Web3 Controls */}
          <EscrowControls
            commitment={lastCommitment}
            vaultUnlocked={vaultUnlocked}
            onAuthenticateVault={authenticateVault}
          />

          {/* 6-Tier Architecture Verification Badge */}
          <div className="rounded-2xl bg-slate-900/40 border border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              6-Tier Sovereign System Status
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                <span className="text-slate-300 flex items-center gap-2">
                  <Mic className="w-3.5 h-3.5 text-emerald-400" /> TẦNG 1: Web Speech &amp; HUD
                </span>
                <span className="text-emerald-400 font-mono">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                <span className="text-slate-300 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-teal-400" /> TẦNG 2: Privacy Shield (Presidio)
                </span>
                <span className="text-emerald-400 font-mono">&lt; 5ms CPU</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                <span className="text-slate-300 flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-sky-400" /> TẦNG 3: Agent Orchestrator
                </span>
                <span className="text-emerald-400 font-mono">FastAPI WS</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                <span className="text-slate-300 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-indigo-400" /> TẦNG 4: CausalDAG Memory
                </span>
                <span className="text-emerald-400 font-mono">RAM &lt; 0.1ms</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                <span className="text-slate-300 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-purple-400" /> TẦNG 5: BNB Greenfield Vault
                </span>
                <span className="text-emerald-400 font-mono">AES-256-GCM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60">
                <span className="text-slate-300 flex items-center gap-2">
                  <Blocks className="w-3.5 h-3.5 text-amber-400" /> TẦNG 6: opBNB Escrow Contract
                </span>
                <span className="text-emerald-400 font-mono">Chain 5611</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
