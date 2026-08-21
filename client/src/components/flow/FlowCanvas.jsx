// client/src/components/flow/FlowCanvas.jsx
import React, { useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";

export default function FlowCanvas({ initialNodes, initialEdges, onSelectNode }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Register custom node component mapping
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const handleNodeClick = (_, node) => {
    if (onSelectNode) onSelectNode(node.data);
  };

  return (
    <div className="w-full h-[80vh] border border-slate-200 rounded-2xl shadow-inner bg-slate-50 relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        fitView
      >
        <Background color="#cbd5e1" gap={16} size={1} />
        <Controls position="bottom-right" />
        <MiniMap zoomable pannable nodeStrokeWidth={3} />
      </ReactFlow>
    </div>
  );
}