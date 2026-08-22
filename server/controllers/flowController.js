import supabase from '../config/supabaseClient.js';
import { generateFlowFromAI } from '../services/aiService.js';

export const createFlow = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }

    // Generate graph data from AI or fallback service
    const flowData = await generateFlowFromAI(prompt);

    // Save to Supabase DB if client is configured
    let savedCaseId = null;
    if (supabase) {
      const { data, error } = await supabase
        .from('cases')
        .insert([
          {
            title: flowData.caseTitle || 'Civic Dispute',
            user_prompt: prompt,
            nodes_json: flowData.nodes,
            edges_json: flowData.edges,
          },
        ])
        .select();

      if (!error && data && data.length > 0) {
        savedCaseId = data[0].id;
      } else if (error) {
        console.error('Supabase Insert Error:', error.message);
      }
    }

    return res.json({
      success: true,
      caseId: savedCaseId,
      caseTitle: flowData.caseTitle,
      nodes: flowData.nodes,
      edges: flowData.edges,
    });
  } catch (err) {
    console.error('Flow Controller Error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};