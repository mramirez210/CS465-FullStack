const passport = require('passport');
const User = require('../models/user');

const requiredFieldsPresent = (body) => body.name && body.email && body.password;

const register = async (req, res) => {
  if (!requiredFieldsPresent(req.body)) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (req.body.password.length < 8) {
    return res.status(400).json({
      message: 'Password must contain at least eight characters.'
    });
  }

  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email
    });
    user.setPassword(req.body.password);
    await user.save();

    return res.status(201).json({ token: user.generateJWT() });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account already uses that email.' });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    console.error('Registration error:', error.message);
    return res.status(500).json({ message: 'Unable to register the user.' });
  }
};

const login = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  return passport.authenticate('local', (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json(info || { message: 'Authentication failed.' });
    }

    return res.status(200).json({ token: user.generateJWT() });
  })(req, res, next);
};

module.exports = {
  register,
  login
};
