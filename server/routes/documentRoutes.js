// server/routes/documentRoutes.js
import express from "express";
import { generatePDF } from "../controllers/documentController.js";

const router = express.Router();
router.post("/export-pdf", generatePDF);

export default router;