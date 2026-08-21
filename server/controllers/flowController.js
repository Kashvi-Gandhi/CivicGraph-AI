// server/controllers/flowController.js
import { generateCivicGraph } from "../services/aiService.js";

export const createFlow = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "User query/prompt is required." });
    }

    const graphData = await generateCivicGraph(prompt);
    
    // Auto-calculate dynamic Y positions for top-to-bottom layout
    const formattedNodes = graphData.nodes.map((node, index) => ({
      ...node,
      position: { x: 250, y: index * 160 } // Vertical spacing between steps
    }));

    return res.status(200).json({
      success: true,
      caseTitle: graphData.caseTitle,
      nodes: formattedNodes,
      edges: graphData.edges
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};