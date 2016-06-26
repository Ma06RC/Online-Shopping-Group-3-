var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var clientSessions = require("client-sessions");
var profile = require('./routes/profile');


var routes = require('./routes/index');
var users = require('./routes/users');
var listings = require('./routes/listings');
var facebookLogin = require('./routes/facebookOAuth');


var app = express();

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
  cookie: {secure: true}, // TODO should this be true so cookies are not sent over http instead of SSL???
  duration: /*24 * 60 * 60 * */10 * 1000, // how long the session will stay valid in ms
  activeDuration: 1000 * 10 /** 5  */// if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/listings', listings);
app.use('/facebook', facebookLogin);
app.use('/profile',profile);

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
