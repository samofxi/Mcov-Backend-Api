const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.strato.de",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.user, // generated ethereal user
        pass: process.env.pass, // generated ethereal password
    },
});

function EmailService(mailOptions, req, res) {
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.send(error);
                }
                res.send('Email gesendet!');
            });
        }
    });


}
module.exports = { EmailService };