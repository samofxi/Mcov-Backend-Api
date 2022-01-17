const PDFDocument = require('pdfkit');
const qrcode = require('qrcode');
const EmailService = require('./mailer');

async function QrGenerator(id, Nachname, Uhrzeit, Datum, req, res) {

    let code = await qrcode.toDataURL(id);
    const doc = new PDFDocument({ bufferPages: true, font: 'Courier' });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    const fileName = `${id}_QrCode.pdf`;

    doc.image(code, { fit: [100, 100] }).font('Times-Roman')
        .text(id, 90, 180)
        .moveDown(0.5);

    doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        let mailOptions = {
            from: '"MCON Schnelltestzentrum" <noreply@mcov.de>',
            to: 'salmankt99@gmail.com',
            subject: 'Ihre Terminbestätigung MCOV Schnelltest',
            html: `<p>Sehr geehrte Frau/Herr ${Nachname},</p>
            <p><br />Ihr Termin wurde bei uns erfolgreich gebucht.<br />Um den Test durchzuf&uuml;hren, brauchen wir ein amtliches Ausweisdokument und ihre Versichertenkarte.<br />Bei Kindern ohne Ausweisdokument reicht die Versichertenkarte aus.</p>
            <p>Ihr ID/your ID:</p>
            <p>${id}</p>
            <p>Datum/date:</p>
            <p>${Datum}, ${Uhrzeit}</p>
            <p>Teststation: Renweg 5, 93049 Regensburg</p>
            <p><strong>Sie k&ouml;nnen den enthaltenden QR-Code jederzeit bei uns wiederverwenden.</strong></p>
            <p>Dear Madam/sir XX,<br />your date is checked in successfully.<br />In order to do the test, we need to check your photo ID and health insurance card with the registration. For children the health insurance card is accepted.<br />Please note the code within this E-Mail may be used once a day.</p>
            <p><strong>Im positiven Fall werden Ihre Daten direkt an das f&uuml;r Sie zust&auml;ndige Gesundheitsamt weitergeleitet (Gesetzesvorgabe gem&auml;&szlig; IfSG &sect;6) und Sie m&uuml;ssen sich sofort in h&auml;usliche Quarant&auml;ne begeben. Ein PCR-Test ist zus&auml;tzlich notwendig &ndash; bitte wenden Sie sich hierf&uuml;r an Ihren Hausarzt. Das Gesundheitsamt wird mit Ihnen Kontakt aufnehmen und das weitere Vorgehen besprechen.</strong></p>
            <p>Haben Sie Fragen? Gerne k&ouml;nnen Sie sich telefonisch bei unserem Personal melden <br /><a href="tel:+4912345678" class="sc-gKclnd dwtERi"> +4912345678 </a><br />If something is not clear yet, feel free to contact us<br /><a href="tel:+4912345678" class="sc-gKclnd dwtERi"> +4912345678 </a></p>
            <p><a href="https://mcov.de/datenschutz" s="" target="_blank" rel="noopener" title="Datenschutz"> Datenschutz </a></p>`,
            attachments: [{
                filename: fileName,
                content: pdfData,
                contentType: 'application/pdf'
            }]
        };
        EmailService.EmailService(mailOptions, req, res);
    });
    doc.end();
}

module.exports = { QrGenerator };