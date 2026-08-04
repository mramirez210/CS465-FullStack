var express = require('express');
var router = express.Router();
var controller = require('../controllers/travel');

/* GET travel page */
router.get('/travel', controller.travel); 

module.exports = router;