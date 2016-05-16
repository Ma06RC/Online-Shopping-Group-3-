var models  = require('../models');
var express = require('express');
var router  = express.Router();

router.get('/', function(req, res) {
  var loggedIn;
  if (req.session_state.username) {
    loggedIn = req.session_state.username;
  }
  models.User.findAll({
    include: [ models.Listing ]
  }).then(function(users) {
    res.render('index', {
      title: 'Express',
      users: users,
      loggedIn: loggedIn
    });
  });
});

module.exports = router;