const express = require('express');
const authController = require('../controllers/authentication');
const authenticateJWT = require('../middleware/authentication');
const tripsController = require('../controllers/trips');
const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

const router = express.Router();

router.route('/register')
  .post(authController.register);

router.route('/login')
  .post(authController.login);

router.route('/trips')
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

router.route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip)
  .delete(authenticateJWT, tripsController.tripsDeleteTrip);

module.exports = router;
