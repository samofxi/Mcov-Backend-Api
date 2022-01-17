
const bodyParser = require('body-parser');
const qrcode = require('qrcode');
const user = require('../models/user.model');
const UserIDs = require('../models/ids');
const { findOne } = require('../models/user.model');
const jwt = require('jsonwebtoken');
const QrG = require('./qr_generator');

exports.neuUser = async (req, res, next) => {
    console.log(req.body);
    let UserIDsData = await UserIDs.find().sort({ _id: -1 }).limit(1);
    let newid = parseInt(UserIDsData[0].id) + 1
    let id = newid.toString();
    let date = Date();
    let birthday = `${req.body.birth_date_day}.${req.body.birth_date_month}.${req.body.birth_date_year} `
    let olduser = await user.findOne({ Nachname: req.body.Nachname, Vorname: req.body.Vorname, email: req.body.email })
    if (!olduser) {
        const newuserid = await UserIDs.create({
            id: id
        });

        const newuser = await user.create({
            id: id,
            Testart: req.body.Testart,
            date: req.body.date,
            Uhrzeit: req.body.Uhrzeit,
            Vorname: req.body.Vorname,
            Nachname: req.body.Nachname,
            birthday: birthday,
            email: req.body.email,
            Strasse: req.body.Strasse,
            Postleitzahl: req.body.Postleitzahl,
            Telefonnummer: req.body.Telefonnummer,
            Ort: req.body.Ort,
            status: 'checked-out',
            CreatedOn: date,
            ModifiedOn: date
        }
        ).then(function (data) {
            qrcode.toDataURL(id, (err, src) => {
                setTimeout(function () { }, 10);
                res.send({ id: id, date: req.body.date, time: req.body.Uhrzeit });
            })
        });
        //mail Function
        QrG.QrGenerator(id, req.body.Nachname, req.body.Uhrzeit, req.body.date, req, res);


    } else {
        if (olduser.date != req.body.date) {
            user.findByIdAndUpdate(olduser._id, { date: req.body.date, Uhrzeit: req.body.Uhrzeit }, { findByIdAndUpdate: false })
                .then(data => {
                    if (!data) {
                        res.status(404).send(`can't find the current User in the database ${id}. User not fund!`)
                    } else {
                        res.send('user erstellt')
                    }
                }).catch(err => {
                    res.status(500).send({ message: "Error with update Method. Please try again later!" })
                })
        } else {
            res.send('user updated!')
        }

    }
};