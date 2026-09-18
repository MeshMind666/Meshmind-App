"use client";

import React from "react";
import { GitFork, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export interface SubgraphNode {
  node_id: string;
  node_type?: string;
  type?: string;
  label: string;
  properties?: Record<string, any>;
  status?: string;
}

export interface SubgraphEdge {
  edge_id?: string;
  source_id: string;
  target_id: string;
  relation: string;
  properties_json?: string;
}

export interface SubgraphData {
  root_entity?: string;
  node_count?: number;
  edge_count?: number;
  nodes?: SubgraphNode[];
  edges?: SubgraphEdge[];
}

interface SubgraphVisualizerProps {
  subgraph?: SubgraphData | null;
  className?: string;
}

export const SubgraphVisualizer: React.FC<SubgraphVisualizerProps> = ({ subgraph, className = "" }) => {
  if (!subgraph || !subgraph.nodes || subgraph.nodes.length === 0) {
    return null;
  }

  // Create node lookup map
  const nodeMap = new Map<string, SubgraphNode>();
  subgraph.nodes.forEach((n) => nodeMap.set(n.node_id, n));

  const getRelationBadge = (relation: string) => {
    const relUpper = (relation || "").toUpperCase();
    if (relUpper.includes("DEBT") || relUpper.includes("DISPUTED") || relUpper.includes("WARNING")) {
      return {
        bg: "bg-rose-500/10 border-rose-500/30 text-rose-300",
        icon: <ShieldAlert className="w-3 h-3 text-rose-400" />,
      };
    }
    if (relUpper.includes("REPUTATION") || relUpper.includes("POSITIVE") || relUpper.includes("VIP")) {
      return {
        bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
      };
    }
    return {
      bg: "bg-amber-500/10 border-amber-500/30 text-amber-300",
      icon: <Sparkles className="w-3 h-3 text-amber-400" />,
    };
  };

  const edges = subgraph.edges || [];

  return (
    <div className={`p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <GitFork className="w-3.5 h-3.5 text-emerald-400" />
          2-Hop Knowledge Provenance ({subgraph.node_count ?? subgraph.nodes.length} Nodes, {edges.length} Edges)
        </span>
        <span className="text-[10px] font-mono text-slate-500">LTM SQLite Graph</span>
      </div>

      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
        {edges.length > 0 ? (
          edges.slice(0, 4).map((edge, idx) => {
            const src = nodeMap.get(edge.source_id)?.label || edge.source_id;
            const tgt = nodeMap.get(edge.target_id)?.label || edge.target_id;
            const style = getRelationBadge(edge.relation);

            return (
              <div
                key={edge.edge_id || idx}
                className="flex items-center justify-between gap-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px]"
              >
                <span className="font-semibold text-white truncate max-w-[90px]">{src}</span>
                <span className={`px-2 py-0.5 rounded-full border text-[10px] flex items-center gap-1 shrink-0 ${style.bg}`}>
                  {style.icon}
                  <span>{edge.relation}</span>
                </span>
                <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />
                <span className="text-slate-300 truncate max-w-[120px] text-right" title={tgt}>
                  {tgt}
                </span>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-slate-500 italic p-2">Chưa có liên kết đa tầng được ghi nhận.</div>
        )}
      </div>
    </div>
  );
};
