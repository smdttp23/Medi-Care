const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const apptSchema = new Schema({
    name: String,
    phno: Number,
    age: Number,
    gender: String,
    height: Number,
    userEmail: String,
    Select1: String,
    Select2: String,
    apptTime: String
});
const Appt = mongoose.model('Appt', apptSchema);
module.exports = Appt;