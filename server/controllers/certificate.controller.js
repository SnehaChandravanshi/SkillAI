const PDFDocument = require("pdfkit");

exports.generateCertificate = async (req, res) => {
    try {
        const { user, roadmap } = req.body;

        const doc = new PDFDocument({ size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${roadmap.skill}_certificate.pdf`
        );

        doc.pipe(res);

        doc.fontSize(26).text("Certificate of Completion", {
            align: "center",
        });

        doc.moveDown(2);

        doc.fontSize(16).text(
            "This is to certify that",
            { align: "center" }
        );

        doc.moveDown();
        doc.fontSize(20).text(
            user.name || user.email,
            { align: "center" }
        );

        doc.moveDown();
        doc.fontSize(16).text(
            "has successfully completed the skill:",
            { align: "center" }
        );

        doc.moveDown();
        doc.fontSize(22).text(
            roadmap.skill,
            { align: "center" }
        );

        doc.moveDown(3);
        doc.fontSize(14).text(
            `Issued on: ${new Date().toDateString()}`,
            { align: "center" }
        );

        doc.end();
    } catch (err) {
        console.error("CERTIFICATE ERROR:", err);
        res.status(500).json({ msg: "Certificate generation failed" });
    }
};
