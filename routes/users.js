const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const flash = require('connect-flash');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware')
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require('cookie-parser');

router.get('/register', (req, res) => {
    res.render('register');
});
router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.flash('success', 'Welcome to Medi-Care!');
        res.redirect('/')
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));
router.get('/login', (req, res) => {
    res.render('login');
});
router.post('/login', storeReturnTo,
    // passport.authenticate logs the user in and clears req.session
    passport.authenticate('local',
        { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
            req.flash('success', 'Welcome back!');
            // const redirectUrl = res.locals.returnTo || '/appointment'; // update this line to use res.locals.returnTo now
            // res.redirect(redirectUrl);
            res.redirect('/');
        });
        router.get('/logout', (req, res, next) => {
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                req.flash('success', 'Goodbye!');
                res.redirect('/');
            })
        });
// router.post('/login', passport.authenticate('local',
//     { failureFlash: true, failureRedirect: '/login' }, catchAsync, (req, res) => {
//         req.flash('success', 'Welcome back!');
//         const redirectUrl = res.locals.returnTo || '/'; // update this line to use res.locals.returnTo now
//         res.redirect(redirectUrl);
//     }));
module.exports = router;