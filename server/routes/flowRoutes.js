// server/routes/flowRoutes.js
import express from "express";
import { createFlow } from "../controllers/flowController.js";

const router = express.Router();

router.post("/generate", createFlow);

export default router;