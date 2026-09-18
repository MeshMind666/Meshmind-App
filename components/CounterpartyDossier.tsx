"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, Award, UserCheck, AlertTriangle, ChevronDown, ChevronUp, Network, DollarSign } from "lucide-react";
import { SubgraphVisualizer, SubgraphData } from "./SubgraphVisualizer";

interface CounterpartyDossierProps {
  counterparty: string;
  onEnforceEscrow?: () => void;
}

interface EntityProfile {
  entity: string;
  raw_query: string;
  trust_score: number;
  status: "HIGH_RISK" | "VIP_TIER" | "VERIFIED_PARTNER" | "STANDARD";
  debt_amount: number;
  deal_count: number;
  insights: Array<{ relation: string; detail: string; type?: string }>;
  subgraph?: SubgraphData;
}

export const CounterpartyDossier: React.FC<CounterpartyDossierProps> = ({ counterparty, onEnforceEscrow }) => {
  const [profile, setProfile] = useState<EntityProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSubgraph, setShowSubgraph] = useState(false);

  useEffect(() => {
    if (!counterparty.trim()) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/agent/entity/${encodeURIComponent(counterparty)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setProfile(data);
        }
      })
      .catch((err) => console.warn("Failed to fetch counterparty profile:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [counterparty]);

  if (!profile && !loading) return null;

  const getStatusBadge = () => {
    if (!profile) return null;
    switch (profile.status) {
      case "HIGH_RISK":
        return {
          label: "Cảnh Báo Rủi Ro (High Risk)",
          bg: "bg-rose-500/15 border-rose-500/30 text-rose-300",
          barColor: "bg-rose-500",
          icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />,
        };
      case "VIP_TIER":
        return {
          label: "Đối Tác VIP (Tier 1)",
          bg: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
          barColor: "bg-emerald-400",
          icon: <Award className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case "VERIFIED_PARTNER":
        return {
          label: "Đã Xác Thực (Verified)",
          bg: "bg-cyan-500/15 border-cyan-500/30 text-cyan-300",
          barColor: "bg-cyan-400",
          icon: <UserCheck className="w-3.5 h-3.5 text-cyan-400" />,
        };
      default:
        return {
          label: "Chuẩn Hóa (Standard)",
          bg: "bg-slate-800 border-slate-700 text-slate-300",
          barColor: "bg-teal-400",
          icon: <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />,
        };
    }
  };

  const statusConfig = getStatusBadge();

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white uppercase shadow-inner">
            {counterparty.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">{profile?.entity || counterparty}</span>
              {statusConfig && (
                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-medium flex items-center gap-1 ${statusConfig.bg}`}>
                  {statusConfig.icon}
                  <span>{statusConfig.label}</span>
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400">Personal CRM &amp; Long-Term Memory Dossier</span>
          </div>
        </div>

        {/* Trust Score Percentage Pill */}
        {profile && (
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-mono">Trust Score</span>
            <span className={`text-base font-bold font-mono ${profile.trust_score < 70 ? "text-rose-400" : "text-emerald-400"}`}>
              {profile.trust_score}%
            </span>
          </div>
        )}
      </div>

      {/* Trust Score Progress Bar */}
      {profile && statusConfig && (
        <div className="space-y-1">
          <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
            <div
              className={`h-full transition-all duration-500 rounded-full ${statusConfig.barColor}`}
              style={{ width: `${Math.min(100, Math.max(10, profile.trust_score))}%` }}
            />
          </div>
        </div>
      )}

      {/* Debt Warning Banner if debt > 0 */}
      {profile && profile.debt_amount > 0 && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
            <span>Nợ xấu tồn đọng: <strong>{profile.debt_amount} USDT</strong></span>
          </div>
          {onEnforceEscrow && (
            <button
              onClick={onEnforceEscrow}
              className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-[11px] transition shadow-sm shadow-rose-900/50"
            >
              Ép Cọc 100%
            </button>
          )}
        </div>
      )}

      {/* Key Insights Chips */}
      {profile && profile.insights && profile.insights.length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {profile.insights.map((ins, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
            >
              • {ins.detail}
            </span>
          ))}
        </div>
      )}

      {/* 2-Hop Graph Toggle */}
      {profile && profile.subgraph && profile.subgraph.nodes && profile.subgraph.nodes.length > 0 && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowSubgraph(!showSubgraph)}
            className="flex items-center gap-1.5 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition"
          >
            <Network className="w-3.5 h-3.5" />
            <span>{showSubgraph ? "Ẩn đồ thị quan hệ ngầm (LTM Subgraph)" : "Xem đồ thị quan hệ ngầm (LTM Subgraph)"}</span>
            {showSubgraph ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showSubgraph && (
            <div className="mt-2 animate-fadeIn">
              <SubgraphVisualizer subgraph={profile.subgraph} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
