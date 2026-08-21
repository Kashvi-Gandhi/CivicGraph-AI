// client/src/App.jsx
import React, { useState } from "react";
import axios from "axios";
import { Search, Sparkles, Scale, Loader2, ArrowRight } from "lucide-react";
import FlowCanvas from "./components/flow/FlowCanvas";
import NodeDetailDrawer from "./components/drawer/NodeDetailDrawer";

// Preset scenarios for fast demoing
const PRESET_QUERIES = [
  "Landlord refuses to return security deposit after moving out",
  "RTI request filed 40 days ago regarding local road construction has no update",
  "E-commerce site refusing refund for a damaged delivered product",
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [error, setError] = useState("");

  const handleGenerateFlow = async (queryToSubmit) => {
    const activeQuery = queryToSubmit || prompt;
    if (!activeQuery.trim()) return;

    setLoading(true);
    setError("");
    setSelectedNode(null);

    try {
      const response = await axios.post("http://localhost:5000/api/flow/generate", {
        prompt: activeQuery,
      });

      if (response.data.success) {
        setGraphData(response.data);
      } else {
        setError("Failed to parse flowchart structure. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Ensure the backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
              CivicGraph AI
            </h1>
            <p className="text-xs text-slate-400">Interactive Civic & Legal Action Engine</p>
          </div>
        </div>
        <div className="text-xs px-3 py-1 bg-indigo-950/80 border border-indigo-800/50 text-indigo-300 rounded-full font-medium">
          Hackathon MVP Prototype
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col gap-6">
        {/* Search & Prompt Panel */}
        <section className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Describe your dispute, civic issue, or legal query in plain language:
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition"
                placeholder="e.g., My landlord is deducting $1,200 for normal wear and tear..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateFlow()}
              />
            </div>
            <button
              onClick={() => handleGenerateFlow()}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Path
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Presets */}
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium">Try Preset Examples:</span>
            {PRESET_QUERIES.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(preset);
                  handleGenerateFlow(preset);
                }}
                className="text-xs bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 px-3 py-1.5 rounded-lg transition text-left"
              >
                {preset.length > 50 ? `${preset.substring(0, 50)}...` : preset}
              </button>
            ))}
          </div>
        </section>

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-950/50 border border-rose-800/80 text-rose-300 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Dynamic Canvas Container */}
        <section className="flex-1 min-h-[600px] relative">
          {graphData ? (
            <div className="flex flex-col h-full">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-200">
                  Case Path: <span className="text-indigo-400">{graphData.caseTitle}</span>
                </h2>
                <span className="text-xs text-slate-400">Click any node step to view actions and download documents</span>
              </div>
              <FlowCanvas
                initialNodes={graphData.nodes}
                initialEdges={graphData.edges}
                onSelectNode={(nodeData) => setSelectedNode(nodeData)}
              />
            </div>
          ) : (
            <div className="w-full h-[550px] border border-dashed border-slate-800 rounded-2xl bg-slate-950/40 flex flex-col items-center justify-center text-center p-8">
              <Scale className="w-12 h-12 text-slate-600 mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-slate-300 mb-1">No Active Action Graph</h3>
              <p className="text-sm text-slate-500 max-w-md">
                Enter a legal or civic issue above, or click a preset scenario to dynamically generate a visual step-by-step resolution roadmap.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Slide-over Detail Drawer */}
      {selectedNode && (
        <NodeDetailDrawer
          nodeData={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  );
}