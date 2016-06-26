var models = require('../models');
var express = require('express');
var app = express();

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;



passport.use(new Strategy({
        clientID: '496438923889701',
        //process.env.CLIENT_ID,
        clientSecret: 'b007bf66831f20c35bce0099c16784e3',
        //process.env.CLIENT_SECRET,
        callbackURL: 'https://still-ocean-25340.herokuapp.com/login/facebook/return',//'http://localhost:3000/login/facebook/return'//
        profileFields: ['name','emails']
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log("in app.js - accessToken ", accessToken);
        console.log("in app.js - refreshToken ", refreshToken);
        console.log("in app.js - profile ", profile);
        console.log("in app.js - profileID ", profile.id);
        models.User.findOrCreate({ where:{username: profile.id } ,defaults: {password: 'FACEBOOK'}}).then( function(results){
            console.log("in apps.js - results ", results);

            return cb(null, profile)

        })
    }));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes //.
app.get('/login/', passport.authenticate('facebook',{scope: 'email'}));

app.get('/login/return',
    passport.authenticate('facebook', { failureRedirect: '/loginFail' }),

    function(req, res) {
        console.log("facebook return success");
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.render('profile', { user: req.user });
    });

module.exports = app;
