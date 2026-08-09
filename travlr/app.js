require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');
var apiRouter = require('./app_api/routes/index');

var handlebars = require('hbs');
// Bringing in the database
require('./app_api/models/db');

// Wire in our authentication module
var passport = require('passport');
require('./app_api/config/passport');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'app_server', 'views'));
// Register handlebars partials
handlebars.registerPartials(__dirname + '/app_server/views/partials');
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport
app.use(passport.initialize());

// Enable CORS
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  
  // Intercept OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Route Handlers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);
app.use('/api', apiRouter);

// Catch Unauthorized Errors from express-jwt (MUST BE AFTER ROUTES)
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res
      .status(401)
      .json({ "message": err.name + ": " + err.message });
  }
  next(err);
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// General error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;