const mongoose = require('mongoose');


const UserIDs = new mongoose.Schema({
    id: { type: String, required: true },
}
)

module.exports = mongoose.model('UserID', UserIDs);
