// server/services/aiService.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy_key",
});

// Deterministic mock scenarios for instant fallback demos
const MOCK_SCENARIOS = {
  deposit: {
    caseTitle: "Security Deposit Recovery Roadmap",
    nodes: [
      {
        id: "1",
        type: "customNode",
        position: { x: 250, y: 50 },
        data: {
          label: "1. Demand Letter",
          type: "action",
          description: "Send a formal written demand letter to the landlord specifying the lease terms and full deposit refund request within 7 days.",
          checklist: ["Copy of lease agreement", "Proof of move-out inspection", "Bank account details for transfer"],
          legalNoticeTemplate: "FORMAL NOTICE FOR RETURN OF SECURITY DEPOSIT\n\nDear Landlord,\n\nI am writing to formally request the immediate return of my security deposit...",
        },
      },
      {
        id: "2",
        type: "customNode",
        position: { x: 250, y: 200 },
        data: {
          label: "2. Consumer Forum Complaint",
          type: "legal",
          description: "File an online grievance under the Consumer Protection Authority or local Small Claims Court if the demand letter is ignored.",
          checklist: ["Proof of delivery for demand letter", "Photos/Videos of move-out condition", "Rent payment receipts"],
          legalNoticeTemplate: "COMPLAINT BEFORE THE CONSUMER DISPUTES REDRESSAL COMMISSION\n\nIn the matter of unfair trade practice regarding withheld security deposit...",
        },
      },
      {
        id: "3",
        type: "customNode",
        position: { x: 250, y: 350 },
        data: {
          label: "3. Formal Summons & Hearing",
          type: "tribunal",
          description: "Attend the dispute hearing or tribunal session with documented timeline evidence.",
          checklist: ["Printed communications log", "Bank statements", "Witness statements (if any)"],
          legalNoticeTemplate: "SUMMARY OF CLAIMS & EVIDENCE TIMELINE\n\nClaimant statement for dispute resolution proceedings...",
        },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
    ],
  },
};

export async function generateFlowFromAI(userPrompt) {
  // If OpenAI API key is missing or dummy, default to Fallback Engine immediately
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
    console.log("⚠️ OpenAI key not configured. Serving Fallback Mock Flow.");
    return MOCK_SCENARIOS.deposit;
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a legal process engine. Output a JSON flowchart object containing caseTitle, nodes array (with id, type, position x/y, and data containing label, type, description, checklist, legalNoticeTemplate), and edges array.",
        },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.warn("⚠️ OpenAI API Call Failed. Switching to Fallback Engine:", err.message);
    return MOCK_SCENARIOS.deposit;
  }
}