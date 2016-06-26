var models  = require('../models');
var express = require('express');
var router  = express.Router();

var DEBUG = true;
/* At the top, with other redirect methods before other routes */
router.get('*',function(req,res,next){
  //do i update time here since they are logged in and 'doing something'
  if(req.session_state.username){
    //update time?
    console.log("request made"+req.session_state.loginTime);
    var date = new Date();
    if((date - req.session_state.loginTime) >60000 ){
      //logout?
      req.session_state.reset();
      res.redirect('/');
      console.log("logout");
    }
    else{
      req.session_state.loginTime = date;
      console.log("updating login time" +req.session_state.loginTime);
    }
    console.log("skipping if");
  }
  if(!DEBUG && req.headers['x-forwarded-proto']!='https')
    res.redirect('https://still-ocean-25340.herokuapp.com'+req.url)
  else
    next(); /* Continue to other routes if we're not redirecting */
});

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

    res.set('Cache-Control', 'max-age='+(8/*hrs*/*60/*min*/*60/*s*/)+', public');
    res.set('Vary', 'Cookie');
    res.render('index', {
      title: 'Nwen304 Group-3',
      users: users,
      loggedIn: loggedIn
    });
  }).catch(function (err) {
    res.status(400);    //Set the HTTP error code
    console.log("Bad Request " + err.message);
  });
});

module.exports = router;