// server/services/aiService.js
import OpenAI from "openai";

const SYSTEM_PROMPT = `
You are an expert civic rights navigator and legal path generator in India. 
Your job is to convert a user's plain-language legal/civic issue into a structured, step-by-step flowchart and executable action plan.

Respond strictly in VALID JSON matching the required schema. Do not include markdown code block formatting.
`;

const RESPONSE_SCHEMA = {
  caseTitle: "Short summary title of the issue",
  nodes: [
    {
      id: "1",
      type: "customNode",
      data: {
        label: "Step Title",
        stepNumber: 1,
        status: "action_required",
        description: "Brief overview.",
        timeframe: "7 Days",
        requiredDocuments: ["Doc 1"],
        documentTemplate: {
          hasTemplate: true,
          templateType: "Legal Notice",
          documentTitle: "Legal Notice Title",
          fieldsToPopulate: ["Field 1"]
        }
      },
      position: { x: 250, y: 0 }
    }
  ],
  edges: [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      label: "Next Step",
      animated: true
    }
  ]
};

export const generateCivicGraph = async (userPrompt) => {
  // Initialize client when function is invoked, guaranteeing env vars are loaded
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate a flowchart and action plan for this dispute: "${userPrompt}". Standard Schema Format: ${JSON.stringify(RESPONSE_SCHEMA)}` 
        }
      ],
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error in AI Service:", error);
    throw new Error("Failed to generate civic graph");
  }
};