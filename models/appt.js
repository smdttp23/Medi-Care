const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apptSchema = new Schema({
    name: String,
    userEmail: String,
    Select1: String,
    Select2: String,
    apptTime: String
});
const Appt = mongoose.model('Appt', apptSchema);
module.exports = Appt;