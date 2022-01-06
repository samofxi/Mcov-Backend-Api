const mongoose = require('mongoose');


const history = new mongoose.Schema({
    id:{type:String, required:true},
    user_id:{type: mongoose.Schema.Types.ObjectId, ref: 'UserData' , required:true},
    Ergebnis: {type:String, required:true},
    Time: { type: String, default: Date() }


}
)

module.exports = mongoose.model('UserHistory', history);
