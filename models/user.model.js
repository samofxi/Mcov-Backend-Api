const mongoose = require('mongoose');


const user = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    Testart: { type: String, required: true },
    date: { type: String, required: true },
    Uhrzeit: { type: String, required: true },
    Vorname: { type: String, required: true },
    Nachname: { type: String, required: true },
    email: { type: String, required: true },
    Telefonnummer: { type: String, required: true },
    birthday: { type: String, required: true },
    Strasse: { type: String, required: true },
    Postleitzahl: { type: String, required: true },
    Ort: { type: String, required: true },
    status: { type: String, required: true },
    CreatedOn: { type: String, required: true },
    ModifiedOn: { type: String, required: true }

}
)

module.exports = mongoose.model('UserData', user);
