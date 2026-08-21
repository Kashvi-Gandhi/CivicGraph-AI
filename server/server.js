// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import flowRoutes from "./routes/flowRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/flow", flowRoutes);
app.use("/api/document", documentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CivicGraph Backend running on port ${PORT}`);
});