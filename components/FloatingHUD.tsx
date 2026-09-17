"use client";

import React from "react";
import { AlertTriangle, ShieldAlert, Sparkles, X, Zap } from "lucide-react";
import { HUDAlertData } from "../hooks/useAgentSocket";

interface FloatingHUDProps {
  alert: HUDAlertData | null;
  onDismiss: () => void;
}

export const FloatingHUD: React.FC<FloatingHUDProps> = ({ alert, onDismiss }) => {
  if (!alert) return null;

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl bg-slate-950/85 border border-emerald-500/40 shadow-2xl shadow-emerald-950/40 p-5 text-slate-100">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-wide text-emerald-300 uppercase">
                Ambient Intelligence HUD
              </h3>
              <span className="text-[11px] text-slate-400">
                Entity: <strong className="text-white">{alert.entity}</strong> •{" "}
                <span className="text-emerald-400">RAM &lt; 0.1ms</span>
              </span>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Punchy HUD Summary */}
        <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm font-medium text-emerald-200">
          {alert.hudSummary}
        </div>

        {/* Insights List */}
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
          {alert.insights.map((insight, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg flex items-start space-x-2 border ${
                insight.type === "UNPAID_DEBT" || insight.relation === "DISPUTED"
                  ? "bg-rose-950/30 border-rose-500/30 text-rose-200"
                  : insight.type === "WARNING"
                  ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                  : "bg-emerald-950/30 border-emerald-500/20 text-emerald-200"
              }`}
            >
              {insight.type === "UNPAID_DEBT" || insight.relation === "DISPUTED" ? (
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              ) : insight.type === "WARNING" ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold block">{insight.relation}</span>
                <span className="text-slate-300">{insight.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
