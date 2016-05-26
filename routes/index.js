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
    if(users == null) {
      res.status(404);    //Set the HTTP error code
      console.log("Not Found \n");
    }

    res.render('index', {
      title: 'Express',
      users: users,
      loggedIn: loggedIn
    });
  }).catch(function (err) {
    res.status(400);    //Set the HTTP error code
    console.log("Bad Request " + err.message);
  });
});

module.exports = router;