const mongoose = require('mongoose');
const doc = require('../models/doctors');
const { doctors } = require('./doctors');
const { v4: uuid} = require('uuid');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

mongoose.connect(process.env.db_url, {
    useNewUrlParser: true, useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Connected");
});
const seedDB = async () => {
    await doc.deleteMany({});
    for (let i = 0; i < 40; i++) {
        const phnnum = Math.floor(Math.random() * 10000000);
        // console.log(doctors[i].name);
        const doctor = new doc({
            dept: `${doctors[i].dept}`,
            name: `${doctors[i].name}`,
            regno: `${doctors[i].regno}`,
            timings:`${doctors[i].timings}`,
            days:`${doctors[i].days}`,
            image: `${doctors[i].image}`,
            description: `${doctors[i].description}`,
        });
        await doctor.save();
        
    }
    console.log('saved')
}

seedDB().then(() => {
    mongoose.connection.close();
});