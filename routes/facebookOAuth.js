var models = require('../models');
var express = require('express');
var app = express();
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
        clientID: '496438923889701',
        clientSecret: 'b007bf66831f20c35bce0099c16784e3',
        callbackURL: 'https://still-ocean-25340.herokuapp.com/facebook/login/return',
        profileFields: ['name','emails']
    },
    function(accessToken, refreshToken, profile, cb) {
        //console.log("in app.js - accessToken ", accessToken);
        //console.log("in app.js - refreshToken ", refreshToken);
        //console.log("in app.js - profile ", profile);
        //console.log("in app.js - profileID ", profile.id);
        models.User.findOrCreate({ where:{username: profile.id } ,defaults: {password: 'FACEBOOK'}}).then( function(results){
           console.log("in apps.js - result id for facebooklogin "+ results.id);
            profile.dbID = results.id;
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

app.get('/login/return',  passport.authenticate('facebook', { failureRedirect: '/facebook/loginFail' }),

    function(req, res) {
        req.session_state.username = req.user.emails[0].value;      //sets the username to be the facebook email address
        req.session_state.userID = req.user.dbID;
        //req.session_state.userID = 1235;
        res.set('Cache-Control', 'no-cache'); // Passport behaviour is important here.
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
        res.set('Cache-Control', 'no-cache'); // Passport behaviour is important here.
        res.render('profile', { user: req.user });
    });

app.get('/loginFail', function(req, res) {
	 res.set('Cache-Control', 'no-cache'); // We want to know about this.
    res.render('loginFail',{message: "FACEBOOK Login has failed for some reason"});

});


module.exports = app;
