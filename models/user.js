const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const usersSchema = new Schema({
    // username: {
    //     type: String,
    //     required: [true, 'Username cannot be blank']
    // },
    // password: {
    //     type: String,
    //     required: [true, 'Password cannot be blank']
    // }
    email: {
        type: String,
        required: true,
        unique: true
    }
});

usersSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', usersSchema);