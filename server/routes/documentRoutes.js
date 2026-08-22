// server/routes/documentRoutes.js
import express from 'express';
import { exportNoticePDF } from '../controllers/documentController.js';

const router = express.Router();

router.post('/export-pdf', exportNoticePDF);

export default router;