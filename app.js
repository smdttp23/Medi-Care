const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const doc = require('./models/doctors');
const User = require('./models/user');
const Appt = require('./models/appt');
const Users = require('./routes/users');
const bodyParser = require("body-parser");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require("express-session");
// const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const userRoute = require('./routes/users');
const flash = require('connect-flash');
const { isLoggedIn } = require('./middleware');
require('dotenv').config({ path: path.resolve(__dirname, "./.env") });
const PDFDocument = require('pdfkit');
const fs = require('fs');
const puppeteer = require('puppeteer');
const ejs = require('ejs')
// Initalise a new express application
const app = express();
const port = 3000;


mongoose.connect(process.env.db_url, {   //mongo to mongoose
  useNewUrlParser: true, useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs'); // Setting our view engine as EJS
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'))

const sessionConfig = {
  secret: 'thisisasecret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
// This allows us to pass data from the form to server=>middleware
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get("/", (req, res) => {
  res.render("index");
});
app.use('/', userRoute);
app.get('/history', (req, res) => {
  res.render('history')
})
app.get('/doctors', async (req, res) => {
  const doctor = await doc.find({});
  res.render('doctors/show', { doctor });
});
app.get('/api/doctors', async (req, res) => {
  const selectedDepartment = req.query.department;

  try {
    const doctors = await doc.find({ dept: selectedDepartment });
    console.log(doctors);
    res.json(doctors);
  }
  catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'An error occurred while fetching doctors' });
  }
});

app.get('/doctors/Cardiology', async (req, res) => {
  const doctor = await doc.find({ dept: 'Cardiology' });
  res.render('doctors/cardio', { doctor })

})
app.get('/doctors/Pediatrics', async (req, res) => {
  const doctor = await doc.find({ dept: 'Pediatrics' });
  res.render('doctors/pedia', { doctor })

})
app.get('/doctors/Dentistry', async (req, res) => {
  const doctor = await doc.find({ dept: 'Dentistry' });
  res.render('doctors/dentistry', { doctor })

})
app.get('/doctors/Dermatology', async (req, res) => {
  const doctor = await doc.find({ dept: 'Dermatology' });
  res.render('doctors/Derm', { doctor })

})
app.get('/doctors/Hepatology', async (req, res) => {
  const doctor = await doc.find({ dept: 'Hepatology' });
  res.render('doctors/Hepa', { doctor })

})
app.get('/doctors/Orthopaedic', async (req, res) => {
  const doctor = await doc.find({ dept: 'Orthopaedics' });
  res.render('doctors/Ortho', { doctor })

})
app.get('/doctors/Gynecology', async (req, res) => {
  const doctor = await doc.find({ dept: 'Gynecology' });
  res.render('doctors/Gynec', { doctor })

})
app.get('/doctors/Opthalmology', async (req, res) => {
  const doctor = await doc.find({ dept: 'Opthalmology' });
  res.render('doctors/Opthal', { doctor })

})
app.get('/doctors/Neurology', async (req, res) => {
  const doctor = await doc.find({ dept: 'Neurology' });
  res.render('doctors/Neuro', { doctor })

})

app.get("/appointment", isLoggedIn, async (req, res) => {
  const doctor = await doc.find({});
  res.render('appointment', { doctor });
});
app.get('/appointment/history', isLoggedIn, async (req, res) => {
  const userEmail = req.user.email;
  console.log(userEmail);
  const bookings = await Appt.find({ userEmail: userEmail });
  bookings.forEach((appointment) => {
    console.log('Name:', appointment.name);
    console.log('Phone Number:', appointment.phno);
    console.log('Age:', appointment.age);
    console.log('Height:', appointment.height);
    console.log('Weight:', appointment.weight);
    console.log('Department:', appointment.Select1);
    console.log('Doctor Consulted:', appointment.Select2);
    console.log('Appointment Time:', appointment.apptTime);
  })
  res.render('history', { bookings });
});
app.post("/appointment/history", isLoggedIn, async (req, res) => {
  const appointment = await new Appt({
    name: req.body.name,
    phno: req.body.phno,
    age: req.body.age,
    weight: req.body.weight,
    height: req.body.height,
    userEmail: req.user.email,
    Select1: req.body.Select1,
    Select2: req.body.Select2,
    apptTime: req.body.timeSlot
  }).save();
  res.send('<script>alert("Appointment Booked Successfully! Please check your Medical Records for further updates"); window.location.href = "/";</script>');
});

app.post('/pdf/:id', async (req, res) => {
  const apptID = req.params.id;
  console.log(apptID);
  const docuData = await Appt.findById({ apptID });
  const docu = new PDFDocument();
  docu.pipe(fs.createWriteStream('output.pdf'));
  docu.text(`Name: ${docuData.name}`);
  docu.text(`Department: ${docuData.Select1}`);
  docu.text(`Doctor name: ${docuData.Select2}`);
  docu.text(`Date and Timings of the appointment: ${docuData.apptTime}`);
  // End the PDF document
  docu.end();
});

app.get('/appointment/page/:id', async (req, res) => {
  const appointID = req.params.id;
  const docuData = await Appt.findById(appointID);
  res.render('page', { docuData });
})
app.get('/appointment/page-generate/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const docuData = await Appt.findById(id);
    const html = await ejs.renderFile('views/page.ejs', { docuData });
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    // Generate PDF 
    const pdfn = await page.pdf({
      path: path.join(__dirname + `/public/file/${docuData.name}_appt.pdf`), // Output PDF file path
      format: 'A4'
    });
    await browser.close();
    const pdfURL = path.join(__dirname + `/public/file/${docuData.name}_appt.pdf`);
    // const browser = await puppeteer.launch();
    // const newPage = await browser.newPage();
    // const id = req.params.id;
    // const ejsTemplate = fs.readFileSync('views/page.ejs', 'utf-8');
    // await newPage.setContent(ejsTemplate);
    // await newPage.goto(`http://localhost:3000/appointment/page/${id}`, {
    //   waitUntil: "networkidle2"
    // });
    // newPage.setViewport({ width: 1680, height: 1050 });
    // const todayDate = new Date();
    // const pdfn = await newPage.pdf({
    //   path: `${path.join(__dirname, '../public/files', todayDate.getTime() + ".pdf")}`,
    //   format: "A4"
    // });
    // await browser.close();
    // const pdfURL = path.join(__dirname, '../public/files', todayDate.getTime() + ".pdf");
    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdfn.length
    });
    res.sendFile(pdfURL);

  } catch (error) {
    console.log(error.message);
  }
})
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});









// app.get('/register', (req, res)=>{
//   res.render("register");
// })
// app.post('/register', async (req, res)=>{
//   const {email, password, username} = req.body;
//   const hash = await bcrypt.hash(password, 12);
//   const user = new User({
//     email,
//     username,
//     password: hash
//   })
//   await user.save();
//   req.session.user_id = user._id;
//   res.redirect('/')
// })
// app.get('/login', (req, res)=>{
//   res.render('login')
// })
// app.post('/login', async (req, res)=>{
//   // res.send(req.body);
//   const {password, username, email} = req.body;
//   const user = await User.findOne({username});
//   const validPassword = await bcrypt.compare(password, user.password);
//   if(validPassword){
//     req.session.user_id = user._id;
//     res.render('appointment');
//   }else{
//     res.send("Incorrect username or password!");
//   }
// })
// app.post('/logout', (req, res)=>{
//   req.session.user_id = null;
//   req.session.destroy();
//   res.redirect('/');
// })

// app.use(session({secret: 'thisisnotgood.'}));
// app.get('/viewcount', (req, res) => {
//   if(req.session.count){
//       req.session.count+=1;
//   }else{
//       req.session.count+=1;
//   }
//   res.send(`You have viewed this page ${req.session.count} times!`);
// });
// const hashPassword = async (pw) =>{
//   const salt = await bcrypt.genSalt(12);
//   const hash = await bcrypt.hash(pw, salt);
//   console.log(salt);
//   console.log(hash);
// }
// hashPassword('monkey');