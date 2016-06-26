var models = require('../models');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
var Promise = require('promise');

var genSalt = Promise.denodeify(bcrypt.genSalt);
var hash = Promise.denodeify(bcrypt.hash);


router.post('/create', function (req, res) {
	 // It's the server side behaviour that matters here, so don't hide any requests from us.
	 res.set('Cache-Control', 'no-cache');
    if (req.body.password == req.body.password_check) {
        models.User.find({
            where: {username: req.body.username}
        }).then(function(results) {
            if (results) {
                // TODO add feedback message.
                res.render('signup', {
                    title: "username is already taken"});
                //res.redirect('/users/signup');
            }
            return genSalt(saltRounds);
        }).then(function (salt) {
            return hash(req.body.password, salt);
        }).then(function(hash){
            return models.User.create({
                username: req.body.username,
                password: hash
            })
        }).then(function (results) {
            if(results == null){        // test if the results is null
                res.status(404);    //Set the HTTP error code
                console.log("Not Found \n");
            }

            console.log(results);
            //req.session_state.username = user.username; // log the user in
            res.redirect('/');
        }).catch(function (err) {
            res.status(400);    //Set the HTTP error code
            console.log("Bad Request " + err.message);

        });
    } else {
        res.redirect('/users/signup');
    }
});

router.post('/:user_id/destroy', function (req, res) {
	 res.set('Cache-Control', 'no-cache'); // It's the behaviour that matters here.
    models.User.destroy({
        where: {
            id: req.params.user_id
        }
    }).then(function () {
        res.redirect('/');
    });
});

router.get('/signup', function (req, res) {
	 res.set('Cache-Control', 'public'); // We aren't going to be updating this UI too quickly.
    res.render('signup', {title: "Sign up"});
});


router.get('/login', function (req, res) {
	 res.set('Cache-Control', 'public'); // We aren't going to be updating this UI too quickly.
    res.render('login', {title: "Login Page", message: "Please enter your username and password"});
});

router.post('/login', function (req, res) {
    var hash;
	 res.set('Cache-Control', 'no-cache'); // The behaviour matters here.
    genSalt(saltRounds).then(function (salt) {
        console.log("Succesfull created SALT");
        return hash(req.body.password, salt);
    }).then(function(_hash){
        hash = _hash;
        console.log("Succesfull created HASH");
        return models.User.find({
            where: {
                username: req.body.username
            }
        });
    }).then(function (user) {
        console.log("FOUND USER");
        if (user == null) {
            res.status(404);    //Set the HTTP error code
            console.log("Not Found "+ req.body.username);      //prints out the error

            res.render('login', {title: 'Login',
                message: "username " + req.body.username + " or password is incorrect"});

        } else {
            console.log("USER EXISTS");
            bcrypt.compare(user.password, hash, function (err, result) {
                console.log("COMPARED PASSWORD");
                if(result && !err){
                    console.log("EQUAL PASSWORD");
                    req.session_state.username = user.username;
                    req.session_state.userID = user.id;
                    //set the login time here
                    //var date = new Date();
                    //req.session_state.loginTime = date.getMinutes();
                    //console.log("setting login time");
                    res.redirect('/');
                }
                else{
                    console.log("NOT EQUAL");
                    res.status(404);    //Set the HTTP error code
                    console.log("Incorrect Password for "+ req.body.username);      //prints out the error

                    res.render('login', {title: 'Login',
                        message: "username " + req.body.username + " or password is incorrect"});
                }

            });
        }
    });
});

router.get('/logout', function (req, res) {
	 res.set('Cache-Control', 'no-cache');
    req.session_state.reset();
    res.redirect('/');
});
/*
 router.post('/:user_id/tasks/create', function (req, res) {
 models.Task.create({
 title: req.body.title,
 UserId: req.params.user_id
 }).then(function() {
 res.redirect('/');
 });
 });

 router.get('/:user_id/tasks/:task_id/destroy', function (req, res) {
 models.Task.destroy({
 where: {
 id: req.params.task_id
 }
 }).then(function() {
 res.redirect('/');
 });
 });
 */


module.exports = router;
