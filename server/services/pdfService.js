// server/services/pdfService.js
import PDFDocument from "pdfkit";

export const createLegalPDF = (data, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Stream directly to response
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=Legal_Notice.pdf`);
  doc.pipe(res);

  // Document Styling
  doc.fontSize(18).text(data.documentTitle || "OFFICIAL LEGAL NOTICE", { align: "center", underline: true });
  doc.moveDown(2);

  doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  doc.fontSize(12).text(`To: ${data.recipient || "[Recipient Name / Authority]"}`);
  doc.text(`Subject: ${data.subject || "Formal Demand & Legal Notice"}`);
  doc.moveDown(2);

  doc.fontSize(11).text(
    data.bodyContent ||
      "Sir/Madam,\n\nI am issuing this notice regarding an unaddressed grievance. Despite previous communications, the matter remains unresolved. Please treat this as a formal action request before escalation to official regulatory bodies.",
    { align: "justify" }
  );

  doc.moveDown(3);
  doc.text("Sincerely,", { align: "right" });
  doc.text("[Complainant / Citizen]", { align: "right" });

  doc.end();
};