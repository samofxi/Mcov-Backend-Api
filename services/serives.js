
const axios = require('axios');
const { param } = require('express/lib/request');
const bodyParser = require('body-parser');
const {check, validationResult}= require('express-validator');
const urlencodeParser = bodyParser.urlencoded({extended:false});
const qrcode = require('qrcode');
const crypto = require("crypto");
const user = require('../models/user.model');
const rootuser = require('../models/rootuser');
const { findOne } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const PDFDocument = require('pdfkit');
const hbs = require('nodemailer-express-handlebars');
const history = require('../models/history');


exports.homeRoutes =   (req, res)=>{
    res.render('index')
} 
exports.neuUser = async (req,res,next) =>{
        console.log(req.body);
        let id = Date.now();
        let birthday =  `${req.body.birth_date_day}.${req.body.birth_date_month}.${req.body.birth_date_year} `
        console.log(birthday);
        let olduser = await user.findOne({ Nachname: req.body.Nachname, Vorname: req.body.Vorname, email:req.body.email})
        if(!olduser){
        try {
            const newuser= await user.create({
                id: id,
                Testart: req.body.Testart,
                date: req.body.date,
                Uhrzeit:req.body.Uhrzeit,
                Vorname:req.body.Vorname,
                Nachname:req.body.Nachname,
                birthday:birthday ,
                email: req.body.email,
                Strasse:req.body.Strasse,
                Postleitzahl:req.body.Postleitzahl,
                Telefonnummer:req.body.Telefonnummer,
                Ort:req.body.Ort,
                status: 'checked-out'
            }
            )
            .then(function(data) {qrcode.toDataURL(id,(err,src) =>{
                setTimeout(function(){},10);
                res.redirect(`https://termin.mcov.de/termin/${id}`)
             })});
             let code = await qrcode.toDataURL(id);

             let transporter = nodemailer.createTransport({
                host: "smtp.strato.de",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: process.env.user, // generated ethereal user
                  pass: process.env.pass, // generated ethereal password
                },
              }); 
              // send mail with defined transport object
              let info = await transporter.sendMail({
                from: '"MCON Schnelltestzentrum" <noreply@mcov.de>', // sender address
                to: req.body.email, // list of receivers
                subject: "Ihre Terminbestätigung MCOV Schnelltest", // Subject line
                text: code, // plain text body
                html: `
                <p>Sehr geehrte Frau/Herr ${req.body.Nachname} , <br />Ihr Termin wurde bei uns erfolgreich gebucht.<br />Um den Test durchzuf&uuml;hren, brauchen wir ein amtliches Ausweisdokument und ihre Versichertenkarte.<br />Bei Kindern ohne Ausweisdokument reicht die Versichertenkarte aus. <br /><strong>Sie k&ouml;nnen den enthaltenden QR-Code jederzeit bei uns wiederverwenden.</strong></p>
                <p>Ihr ID:</p>
                <p>${id}</p>
                <p>Ihr Termin :&nbsp;</p>
                <p>${req.body.date}</p>
                <p>Teststation:&nbsp; Rennweg 5, 93049 Regensburg</p>
                <p>Dear Madam/sir&nbsp;${req.body.Nachname} ,<br />your date is checked in successfully.<br />In order to do the test, we need to check your photo ID and health insurance card with the registration. For children the health insurance card is accepted.<br />Please note the code within this e-mail may be used once a day.</p>
                <p>Im positiven Fall werden Ihre Daten direkt an das f&uuml;r Sie zust&auml;ndige Gesundheitsamt weitergeleitet (Gesetzesvorgabe gem&auml;&szlig; IfSG &sect;6) und Sie m&uuml;ssen sich sofort in h&auml;usliche Quarant&auml;ne begeben. Ein PCR Test ist zus&auml;tzlich notwendig &ndash; bitte wenden Sie sich hierf&uuml;r an Ihren Hausarzt. Das Gesundheitsamt wird mit Ihnen Kontakt aufnehmen und das weitere Vorgehen besprechen.</p>
                <p>Haben Sie Fragen? Gerne k&ouml;nnen Sie sich telefonisch bei unserem Personal melden <br />+123455 <br />If something is not clear yet, feel free to contact us<br />+12356</p>
                
                `,
                attachments: [   {   // data uri as an attachment
                    filename: `${id}_QrCOde.png`,
                    path: code
                }]

              });
             
        } catch (error) {
            res.send(error)
        }
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(442).jsonp(error.array());
        }
        }else{
            if(olduser.date != req.body.date){
                user.findByIdAndUpdate(olduser._id, {date: req.body.date, Uhrzeit:req.body.Uhrzeit} , {findByIdAndUpdate: false})
                .then(data => {
                    if(!data){
                        res.status(404).send(`can't find the current User in the database ${id}. User not fund!`)
                    }else{
                        res.redirect(`https://termin.mcov.de/termin/${olduser.id}`)
                    }
                }).catch(err => {
                    res.status(500).send({message: "Error with update Method. Please try again later!"})
                })
            }else{
                res.redirect(`https://termin.mcov.de/termin/${olduser.id}`)
            }

        }
};
exports.find = (req,res) => {
  if(req.params.id){
      const id = req.params.id;
      console.log(id);
      user.findOne({ id: id})
      .then(data => {
          if(!data){
              res.status(404).send({message: "User was not fund"});
          } else{
              qrcode.toDataURL(id,(err,src) =>{
                  res.render('view', {qr_code: src, id: id, Nachname: data.Nachname,  date: data.date,  Uhrzeit: data.Uhrzeit}); 
               });
          }
      });
  } else{
    res.render('view', {qr_code: 'no data' , id: 'no data' , Nachname: 'no data' ,  date: 'no data' ,  Uhrzeit: 'no data' })
  };

};