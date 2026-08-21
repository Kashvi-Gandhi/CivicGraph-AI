// client/src/components/drawer/NodeDetailDrawer.jsx
import React from "react";
import { X, Download, CheckSquare, ShieldAlert } from "lucide-react";
import axios from "axios";

export default function NodeDetailDrawer({ nodeData, onClose }) {
  if (!nodeData) return null;

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/document/export-pdf",
        {
          documentTitle: nodeData.documentTemplate?.documentTitle,
          subject: nodeData.label,
          bodyContent: `Notice regarding: ${nodeData.description}`,
        },
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${nodeData.label}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Error generating PDF draft.");
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 p-6 flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <span className="text-xs font-bold px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full">
            Step {nodeData.stepNumber} Action Plan
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Title & Info */}
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          {nodeData.label}
        </h2>
        <p className="text-sm text-slate-600 mb-6">{nodeData.description}</p>

        {/* Required Documents */}
        {nodeData.requiredDocuments?.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <CheckSquare className="w-4 h-4" /> Required Evidence
            </h4>
            <ul className="space-y-1 text-sm text-slate-700">
              {nodeData.requiredDocuments.map((doc, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />{" "}
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="border-t pt-4">
        {nodeData.documentTemplate?.hasTemplate ? (
          <button
            onClick={handleDownloadPDF}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow transition"
          >
            <Download className="w-4 h-4" /> Download Official PDF Draft
          </button>
        ) : (
          <div className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 p-3 rounded-lg border border-amber-200">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            Standard action step—no template needed.
          </div>
        )}
      </div>
    </div>
  );
}
