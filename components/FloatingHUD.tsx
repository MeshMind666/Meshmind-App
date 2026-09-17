"use client";

import React, { useState } from "react";
import { AlertTriangle, ShieldAlert, Sparkles, X, Zap, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { HUDAlertData } from "../hooks/useAgentSocket";

interface FloatingHUDProps {
  alert: HUDAlertData | null;
  onDismiss: () => void;
  onAction?: (action: string, entity: string, insightId?: string, payload?: any) => void;
  actionFeedback?: string | null;
}

export const FloatingHUD: React.FC<FloatingHUDProps> = ({
  alert,
  onDismiss,
  onAction,
  actionFeedback,
}) => {
  const [activeActions, setActiveActions] = useState<{ [key: string]: boolean }>({});
  const [resolvedMap, setResolvedMap] = useState<{ [key: string]: boolean }>({});

  if (!alert) return null;

  const hasDebtOrDispute = alert.insights.some(
    (i) => i.type === "UNPAID_DEBT" || i.relation === "DISPUTED"
  );
  const hasPreference = alert.insights.some((i) => i.type === "PREFERENCE");

  const handleEnforceEscrow = () => {
    setActiveActions((prev) => ({ ...prev, escrow: true }));
    onAction?.("ENFORCE_ESCROW", alert.entity, undefined, { ratio: 1.0 });
  };

  const handleResolveDebt = (insightIdx: number, detail: string) => {
    setResolvedMap((prev) => ({ ...prev, [insightIdx]: true }));
    onAction?.("RESOLVE_INSIGHT", alert.entity, detail, { resolved: true });
  };

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-2xl bg-slate-950/90 border border-emerald-500/40 shadow-2xl shadow-emerald-950/60 p-5 text-slate-100">
        {/* Ambient Glow Accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-teal-500/15 rounded-full blur-xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-xs tracking-wider text-emerald-300 uppercase">
                  Ambient Causal HUD
                </h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  LTM O(1) &lt; 0.1ms
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Entity: <strong className="text-white font-medium">{alert.entity}</strong>
              </span>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition"
            title="Đóng HUD"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Punchy HUD Summary */}
        <div className="mt-3 p-3 rounded-xl bg-slate-900/90 border border-slate-800/80 text-xs font-medium text-emerald-200 leading-relaxed shadow-sm">
          {alert.hudSummary}
        </div>

        {/* Insights List */}
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
          {alert.insights.map((insight, idx) => {
            const isResolved = resolvedMap[idx];
            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl flex items-start justify-between space-x-2 border transition ${
                  isResolved
                    ? "bg-slate-900/50 border-slate-800 text-slate-400 opacity-60"
                    : insight.type === "UNPAID_DEBT" || insight.relation === "DISPUTED"
                    ? "bg-rose-950/30 border-rose-500/30 text-rose-200"
                    : insight.type === "WARNING"
                    ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                    : "bg-emerald-950/30 border-emerald-500/20 text-emerald-200"
                }`}
              >
                <div className="flex items-start space-x-2">
                  {insight.type === "UNPAID_DEBT" || insight.relation === "DISPUTED" ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  ) : insight.type === "WARNING" ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold block">{insight.relation}</span>
                      {isResolved && (
                        <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/50 px-1 rounded">
                          Đã xóa nợ
                        </span>
                      )}
                    </div>
                    <span className="text-slate-300 text-[11px]">{insight.detail}</span>
                  </div>
                </div>

                {/* Inline Action for Unpaid Debt */}
                {(insight.type === "UNPAID_DEBT" || insight.relation === "DISPUTED") && !isResolved && (
                  <button
                    onClick={() => handleResolveDebt(idx, insight.detail)}
                    className="shrink-0 px-2 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-[10px] font-medium text-rose-200 transition"
                    title="Xóa khoản nợ này trong Long-Term Memory"
                  >
                    Xóa nợ
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Layer Controls (Interactive Buttons) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
            <span>Tác vụ tức thì (Instant Actions):</span>
            {actionFeedback && (
              <span className="text-emerald-400 animate-pulse text-[10px]">
                ✓ {actionFeedback}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Action 1: Enforce 100% Escrow */}
            <button
              onClick={handleEnforceEscrow}
              disabled={activeActions.escrow}
              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center space-x-1.5 transition shadow-sm ${
                activeActions.escrow
                  ? "bg-emerald-900/40 text-emerald-300 border border-emerald-500/40"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{activeActions.escrow ? "Đã khóa 100% cọc" : "Yêu cầu Escrow 100%"}</span>
            </button>

            {/* Action 2: Suggest Counter-Offer */}
            <button
              onClick={() => onAction?.("APPLY_COUNTER", alert.entity, undefined, { discount: 0 })}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/70 text-xs font-medium text-slate-200 flex items-center justify-center space-x-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gợi ý đối ứng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
