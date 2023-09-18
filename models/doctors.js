const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorSchema = new Schema({
    name:String,
    image:String,
    regno:Number,
    description:String,
    dept:String,
    days:String,
    timings:String
});
module.exports = mongoose.model('doc', doctorSchema);