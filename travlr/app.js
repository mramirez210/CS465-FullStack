require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var passport = require('passport');

// 1. Load database & schemas FIRST
var db = require('./app_api/models/db');

// 2. Load passport SECOND (now 'users' schema exists!)
require('./app_api/config/passport');

var apiRouter = require('./app_api/routes/index');
var indexRouter = require('./app_server/routes/index');
var usersRouter = require('./app_server/routes/users');
var travelRouter = require('./app_server/routes/travel');

var app = express();

if (process.env.SKIP_DB_CONNECTION !== 'true') {
  db.connect().catch(function(error) {
    console.error('Initial MongoDB connection failed:', error.message);
  });
}

app.set('views', path.join(__dirname, 'app_server', 'views'));
hbs.registerPartials(path.join(__dirname, 'app_server', 'views', 'partials'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/api', function(req, res, next) {
  var allowedOrigins = [
    'http://localhost:4200',
    'http://127.0.0.1:4200'
  ];
  var requestOrigin = req.get('Origin');

  if (allowedOrigins.includes(requestOrigin)) {
    res.header('Access-Control-Allow-Origin', requestOrigin);
  }
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  return next();
});
app.use('/api', apiRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/travel', travelRouter);

app.use(function(err, req, res, next) {
  if (!req.originalUrl.startsWith('/api/')) {
    return next(err);
  }

  console.error('API error:', err.message);
  return res.status(err.status || 500).json({
    message: err.status ? err.message : 'Unable to process the API request.'
  });
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;