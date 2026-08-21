// server/controllers/documentController.js
import { createLegalPDF } from "../services/pdfService.js";

export const generatePDF = (req, res) => {
  try {
    const documentData = req.body;
    createLegalPDF(documentData, res);
  } catch (error) {
    res.status(500).json({ error: "PDF Generation Failed" });
  }
};