var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var clientSessions = require("client-sessions");


var routes = require('./routes/index');
var users = require('./routes/users');
var listings = require('./routes/listings');

var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var models = require('./models');

var app = express();

passport.use(new Strategy({
      clientID: '496438923889701',
      //process.env.CLIENT_ID,
      clientSecret: 'b007bf66831f20c35bce0099c16784e3',
      //process.env.CLIENT_SECRET,
      callbackURL: 'https://still-ocean-25340.herokuapp.com/login/facebook/return'//'http://localhost:3000/login/facebook/return'//
    },
    function(accessToken, refreshToken, profile, cb) {
      models.User.findOrCreate({ username: profile.id }, function (err, user) {
        return cb(err, user);
      });
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

// Define routes.
app.get('/login/facebook',
    passport.authenticate('facebook'));

app.get('/login/facebook/return',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('profile', { user: req.user });
    });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(clientSessions({
  secret: '33df9e76c8ccb4e8e1d190ae87f092e6e22a9d5ca3fd7cd6ff39L', // This hex was random, but now it's constant
  cookie: {secure: false} // TODO should this be true so cookies are not sent over http instead of SSL???
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/listings', listings);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
