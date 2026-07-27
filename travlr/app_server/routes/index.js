var express = require('express');
var router = express.Router();

/* GET home page - redirect to /travel */
router.get('/', function(req, res, next) {
  res.redirect('/travel'); });

module.exports = router;