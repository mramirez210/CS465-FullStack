const mongoose = require('mongoose');
const readLine = require('readline');

const host = process.env.DB_HOST || '127.0.0.1';
// Added port 27017 explicitly
const dbURI = `mongodb://${host}:27017/travlr`;

// Make initial connection to DB directly (no setTimeout)
const connect = async () => {
  try {
    await mongoose.connect(dbURI);
  } catch (err) {
    console.error('Mongoose initial connection error:', err);
  }
};

// Monitor connection events
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error: ', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Windows specific listener for SIGINT
if (process.platform === 'win32') {
  const r1 = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  r1.on('SIGINT', () => {
    process.emit("SIGINT");
  });
}

// Graceful Shutdown helper
const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    if (callback) callback();
  });
};

// Listeners for graceful shutdown
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});

process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  gracefulShutdown('app shutdown', () => {
    process.exit(0);
  });
});

// Trigger connection
connect();

// Import Mongoose schema
require('./travlr');

module.exports = mongoose;