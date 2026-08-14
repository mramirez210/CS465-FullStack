const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  }
});

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    100000,
    64,
    'sha512'
  ).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  const candidateHash = crypto.pbkdf2Sync(
    password,
    this.salt,
    100000,
    64,
    'sha512'
  );
  const storedHash = Buffer.from(this.hash, 'hex');

  return storedHash.length === candidateHash.length &&
    crypto.timingSafeEqual(storedHash, candidateHash);
};

userSchema.methods.generateJWT = function() {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = mongoose.model('users', userSchema);