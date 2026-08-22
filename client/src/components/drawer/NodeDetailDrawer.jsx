// client/src/components/drawer/NodeDetailDrawer.jsx
import React, { useState } from "react";
import axios from "axios";
import { X, Download, CheckSquare, ShieldAlert, Loader2 } from "lucide-react";

export default function NodeDetailDrawer({ nodeData, onClose }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/document/export-pdf",
        {
          nodeId: nodeData.id,
          nodeTitle: nodeData.label,
          description: nodeData.description,
          templateText: nodeData.legalNoticeTemplate,
        },
        { responseType: "blob" }
      );

      // Create a temporary object URL to trigger browser download
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${nodeData.label.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("PDF Download error:", err);
      alert("Failed to download PDF. Please check server logs.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-950 border-l border-slate-800 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-slate-100">{nodeData.label}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Action Overview
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              {nodeData.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              Required Evidence Checklist
            </h3>
            <ul className="space-y-2">
              {nodeData.checklist?.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-lg text-slate-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <button
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
        >
          {downloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" /> Download Official PDF Draft
            </>
          )}
        </button>
      </div>
    </div>
  );
}