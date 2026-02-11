const PDFDocument = require("pdfkit");

exports.generateCertificate = async (req, res) => {
    try {
        const { user, roadmap } = req.body;

        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${roadmap.skill}_certificate.pdf`
        );

        doc.pipe(res);

        // Define colors
        const primaryColor = '#1a365d'; // Deep blue
        const accentColor = '#d4af37'; // Gold
        const textColor = '#2d3748'; // Dark gray

        // Page dimensions
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // Draw outer decorative border
        doc.lineWidth(3)
            .strokeColor(primaryColor)
            .rect(40, 40, pageWidth - 80, pageHeight - 80)
            .stroke();

        // Draw inner decorative border
        doc.lineWidth(1)
            .strokeColor(accentColor)
            .rect(50, 50, pageWidth - 100, pageHeight - 100)
            .stroke();

        // Draw corner ornaments
        const drawCornerOrnament = (x, y, rotation) => {
            doc.save();
            doc.translate(x, y);
            doc.rotate(rotation);
            doc.lineWidth(2)
                .strokeColor(accentColor)
                .moveTo(0, 0)
                .lineTo(30, 0)
                .stroke()
                .moveTo(0, 0)
                .lineTo(0, 30)
                .stroke();
            doc.restore();
        };

        drawCornerOrnament(60, 60, 0);
        drawCornerOrnament(pageWidth - 60, 60, 90);
        drawCornerOrnament(pageWidth - 60, pageHeight - 60, 180);
        drawCornerOrnament(60, pageHeight - 60, 270);

        // Add decorative top accent
        doc.lineWidth(2)
            .strokeColor(accentColor)
            .moveTo(pageWidth / 2 - 100, 90)
            .lineTo(pageWidth / 2 + 100, 90)
            .stroke();

        // Header - Certificate Title
        doc.fontSize(42)
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text('CERTIFICATE', 0, 120, {
                align: 'center',
                width: pageWidth
            });

        doc.fontSize(20)
            .fillColor(accentColor)
            .font('Helvetica-Oblique')
            .text('of Achievement', 0, 170, {
                align: 'center',
                width: pageWidth
            });

        // Decorative divider
        doc.lineWidth(1)
            .strokeColor(accentColor)
            .moveTo(pageWidth / 2 - 150, 210)
            .lineTo(pageWidth / 2 + 150, 210)
            .stroke();

        // Ornamental circle in the middle of divider
        doc.circle(pageWidth / 2, 210, 5)
            .fillColor(accentColor)
            .fill();

        // "This certifies that" text
        doc.fontSize(14)
            .fillColor(textColor)
            .font('Helvetica')
            .text('This is to certify that', 0, 250, {
                align: 'center',
                width: pageWidth
            });

        // Recipient name with underline
        const nameY = 290;
        doc.fontSize(28)
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text(user.name || user.email, 0, nameY, {
                align: 'center',
                width: pageWidth
            });

        // Underline for name
        doc.lineWidth(1.5)
            .strokeColor(accentColor)
            .moveTo(pageWidth / 2 - 200, nameY + 35)
            .lineTo(pageWidth / 2 + 200, nameY + 35)
            .stroke();

        // "has successfully completed" text
        doc.fontSize(14)
            .fillColor(textColor)
            .font('Helvetica')
            .text('has successfully completed the comprehensive skill program in', 0, 360, {
                align: 'center',
                width: pageWidth
            });

        // Skill name - highlighted
        const skillY = 400;
        doc.fontSize(32)
            .fillColor(accentColor)
            .font('Helvetica-Bold')
            .text(roadmap.skill, 0, skillY, {
                align: 'center',
                width: pageWidth
            });

        // Decorative underline for skill
        doc.lineWidth(2)
            .strokeColor(primaryColor)
            .moveTo(pageWidth / 2 - 180, skillY + 40)
            .lineTo(pageWidth / 2 + 180, skillY + 40)
            .stroke();

        // Achievement description
        doc.fontSize(12)
            .fillColor(textColor)
            .font('Helvetica-Oblique')
            .text('demonstrating dedication, expertise, and commitment to excellence', 0, 480, {
                align: 'center',
                width: pageWidth
            });

        // Draw decorative seal/badge
        const sealX = pageWidth / 2;
        const sealY = 560;

        // Outer circle
        doc.circle(sealX, sealY, 40)
            .lineWidth(3)
            .strokeColor(accentColor)
            .stroke();

        // Inner circle
        doc.circle(sealX, sealY, 35)
            .lineWidth(1)
            .strokeColor(primaryColor)
            .stroke();

        // Star in the center
        doc.fontSize(30)
            .fillColor(accentColor)
            .text('★', sealX - 10, sealY - 15);

        // Date section
        const dateY = 640;
        doc.fontSize(12)
            .fillColor(textColor)
            .font('Helvetica')
            .text('Date of Completion', 0, dateY, {
                align: 'center',
                width: pageWidth
            });

        doc.fontSize(14)
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text(new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }), 0, dateY + 20, {
                align: 'center',
                width: pageWidth
            });

        // Footer - Platform name
        doc.fontSize(10)
            .fillColor(primaryColor)
            .font('Helvetica-Bold')
            .text('SkillAI Platform', 0, pageHeight - 100, {
                align: 'center',
                width: pageWidth
            });

        doc.fontSize(8)
            .fillColor(textColor)
            .font('Helvetica-Oblique')
            .text('Empowering learners through AI-driven education', 0, pageHeight - 85, {
                align: 'center',
                width: pageWidth
            });

        // Bottom decorative line
        doc.lineWidth(2)
            .strokeColor(accentColor)
            .moveTo(pageWidth / 2 - 100, pageHeight - 65)
            .lineTo(pageWidth / 2 + 100, pageHeight - 65)
            .stroke();

        doc.end();
    } catch (err) {
        console.error("CERTIFICATE ERROR:", err);
        res.status(500).json({ msg: "Certificate generation failed" });
    }
};
