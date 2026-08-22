// server/services/pdfService.js
import PDFDocument from 'pdfkit';

export function generateNoticePDF(docData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header Banner
      doc.rect(50, 40, 495, 60).fill('#0f172a');
      doc.fillColor('#ffffff').fontSize(18).text('OFFICIAL LEGAL NOTICE & ACTION DOCUMENT', 65, 58, { characterSpacing: 1 });
      doc.fontSize(9).fillColor('#94a3b8').text('GENERATED VIA CIVICGRAPH AI DISPUTE ENGINE', 65, 80);

      doc.moveDown(4);

      // Metadata Block
      doc.fillColor('#334155').fontSize(10);
      doc.text(`DATE OF ISSUANCE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
      doc.text(`ACTION STEP: ${docData.nodeTitle || 'Formal Grievance'}`);
      doc.text(`DISPUTE CATEGORY: Civil & Consumer Rights`);
      
      doc.moveDown(1);
      doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown(1.5);

      // Section 1: Detailed Statement
      doc.fillColor('#0f172a').fontSize(12).text('1. STATEMENT OF CLAIM & NOTICE PREAMBLE', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#334155').text(
        docData.templateText || docData.description || 'Notice is hereby served regarding non-compliance with statutory obligations...',
        { align: 'justify', lineGap: 5 }
      );

      doc.moveDown(1.5);

      // Section 2: Statutory Obligations & Explanation
      doc.fillColor('#0f172a').fontSize(12).text('2. STATUTORY CONTEXT & LEGAL EXPLANATION', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#334155').text(
        `Under applicable local consumer protection laws and civil tenancy regulations, all parties are bound to adhere to agreed contractual terms in good faith. Failure to resolve this matter within the stipulated timeframe of this notice may result in escalated proceedings before the administrative tribunals or competent civil court. The recipient is advised to review the evidence portfolio attached.`,
        { align: 'justify', lineGap: 5 }
      );

      doc.moveDown(1.5);

      // Section 3: Evidence Checklist
      doc.fillColor('#0f172a').fontSize(12).text('3. REQUIRED ATTACHMENTS & EVIDENCE PORTFOLIO', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).fillColor('#334155').text(
        'The following supporting documentation is annexed to this formal action document:'
      );
      doc.moveDown(0.5);
      
      doc.fontSize(9).fillColor('#475569');
      doc.text('• Copy of original agreement / contract receipts');
      doc.text('• Recorded communication timeline (emails, notices, chat records)');
      doc.text('• Proof of financial transaction / non-refund proof');

      doc.moveDown(3);

      // Signature Block
      doc.fontSize(10).fillColor('#0f172a').text('ISSUED BY (Complainant / Authorized Representative):');
      doc.moveDown(2.5);
      doc.text('_____________________________________');
      doc.text('Signature / Stamp');

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}