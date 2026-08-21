// client/src/components/flow/CustomNode.jsx
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Clock, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

const statusColors = {
  start: "border-blue-500 bg-blue-50/50 text-blue-900",
  action_required: "border-amber-500 bg-amber-50/50 text-amber-900",
  escalation: "border-rose-500 bg-rose-50/50 text-rose-900",
  resolved: "border-emerald-500 bg-emerald-50/50 text-emerald-900",
};

const CustomNode = ({ data }) => {
  const colorClass = statusColors[data.status] || statusColors.action_required;

  return (
    <div className={`w-72 rounded-xl border-2 p-4 shadow-md backdrop-blur-md transition-all hover:shadow-xl ${colorClass}`}>
      <Handle type="target" position={Position.Top} className="!bg-slate-400 w-3 h-3" />
      
      {/* Step Header */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
          Step {data.stepNumber}
        </span>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
          <Clock className="w-3.5 h-3.5" />
          {data.timeframe}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="font-bold text-sm mb-1 leading-snug">{data.label}</h3>
      <p className="text-xs text-slate-600 line-clamp-2 mb-3">{data.description}</p>

      {/* Action Indicators */}
      <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 text-xs">
        {data.documentTemplate?.hasTemplate ? (
          <span className="flex items-center gap-1 font-semibold text-indigo-600">
            <FileText className="w-3.5 h-3.5" /> Auto-Draft Ready
          </span>
        ) : (
          <span className="text-slate-400">Action Step</span>
        )}
        <span className="text-indigo-600 hover:underline cursor-pointer font-medium">View Details →</span>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-slate-400 w-3 h-3" />
    </div>
  );
};

export default memo(CustomNode);