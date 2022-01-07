const mongoose = require('mongoose');


const termine = new mongoose.Schema({
    id:{type:String, required:true},
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'UserData' , required:true},
    Date: {type:String, required:true},
    Uhrzeit: { type: String, required:true }


}
)

module.exports = mongoose.model('TermineHistory', termine);
