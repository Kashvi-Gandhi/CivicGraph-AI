import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { FileText, ShieldAlert, Gavel, CheckCircle2 } from "lucide-react";

const NODE_TYPES = {
  action: {
    bg: "bg-indigo-950/80 border-indigo-700/80 hover:border-indigo-500",
    badge: "bg-indigo-600/30 text-indigo-300 border-indigo-500/40",
    icon: FileText,
  },
  legal: {
    bg: "bg-amber-950/80 border-amber-700/80 hover:border-amber-500",
    badge: "bg-amber-600/30 text-amber-300 border-amber-500/40",
    icon: ShieldAlert,
  },
  tribunal: {
    bg: "bg-emerald-950/80 border-emerald-700/80 hover:border-emerald-500",
    badge: "bg-emerald-600/30 text-emerald-300 border-emerald-500/40",
    icon: Gavel,
  },
};

function CustomNode({ data }) {
  const nodeConfig = NODE_TYPES[data.type] || NODE_TYPES.action;
  const Icon = nodeConfig.icon;

  return (
    <div
      className={`px-4 py-3 rounded-xl border ${nodeConfig.bg} shadow-xl backdrop-blur-sm min-w-[220px] transition-all cursor-pointer group hover:scale-[1.02]`}
    >
      <Handle type="target" position={Position.Top} className="!bg-indigo-500 !w-3 !h-3" />
      
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${nodeConfig.badge}`}>
          {data.type || "Step"}
        </span>
        <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
      </div>

      <div className="text-sm font-semibold text-slate-100">{data.label}</div>
      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{data.description}</p>

      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1 text-indigo-400">
          <CheckCircle2 className="w-3 h-3" />
          {data.checklist?.length || 0} required items
        </span>
        <span className="text-slate-500 group-hover:text-indigo-300 transition">View Details →</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-indigo-500 !w-3 !h-3" />
    </div>
  );
}

export default memo(CustomNode);