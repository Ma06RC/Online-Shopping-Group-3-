var models = require('../models');
var addresses = require('../addresses');
var express = require('express');
var router = express.Router();

router.post('/create', function (req, res) {
    models.User.create({
        username: req.body.username,
        password: req.body.password
    }).then(function (results) {
        console.log(results);
        res.redirect('/');
    });
});

router.get('/:user_id/destroy', function (req, res) {
    models.User.destroy({
        where: {
            id: req.params.user_id
        }
    }).then(function () {
        res.redirect('/');
    });
});

router.get('/signup', function (req, res) {
    res.render('signup', {title: "Sign up", secureAddress: addresses.SECURE});
});

router.get('/login', function (req, res) {
    res.render('login', {title: "Login Page", message: "Please enter your username and password",
               secureAddress: addresses.SECURE});
});

router.post('/login', function (req, res) {
    models.User.find({
        where: {
            username: req.body.username,
            password: req.body.password
        }
    }).then(function (user) {
        if (user == null) {
            res.render('login', {title: 'Login',
                message: "username " + req.body.username + " or password is incorrect",
                secureAddress: addresses.SECURE});
        } else {
            req.session_state.username = user.username;
            res.redirect(addresses.ADDRESS+'/');
        }
    });
});

router.get('/logout', function (req, res) {
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
