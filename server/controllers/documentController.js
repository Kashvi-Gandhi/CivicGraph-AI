// server/controllers/documentController.js
import { generateNoticePDF } from '../services/pdfService.js';
import supabase from '../config/supabaseClient.js';

export async function exportNoticePDF(req, res) {
  try {
    const { caseId, nodeId, nodeTitle, description, templateText } = req.body;

    // Generate the PDF Buffer using PDFKit
    const pdfBuffer = await generateNoticePDF({
      nodeTitle,
      description,
      templateText,
    });

    // Log the event to Supabase generated_documents table
    if (supabase) {
      await supabase.from('generated_documents').insert([
        {
          case_id: caseId || null,
          node_id: nodeId || 'node_step',
          document_title: nodeTitle || 'Official Notice',
          content_summary: description || 'Generated Legal Notice PDF',
        },
      ]);
    }

    // Set HTTP headers for PDF download stream
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${(nodeTitle || 'Legal_Notice').replace(/[^a-zA-Z0-0]/g, '_')}.pdf"`
    );

    return res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF Controller Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate PDF document' });
  }
}