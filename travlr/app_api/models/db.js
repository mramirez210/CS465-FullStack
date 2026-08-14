const mongoose = require('mongoose');
const readline = require('readline');

const host = process.env.DB_HOST || '127.0.0.1';
const dbURI = process.env.MONGODB_URI ||
  process.env.DB_URI ||
  `mongodb://${host}:27017/travlr`;

let connectionPromise;

const connect = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose);
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(dbURI, {
      serverSelectionTimeoutMS: 5000
    }).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  return connectionPromise;
};

const close = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  connectionPromise = undefined;
};

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', (error) => {
  console.error('Mongoose connection error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

if (process.platform === 'win32') {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('SIGINT', () => {
    process.emit('SIGINT');
  });
}

const gracefulShutdown = async (message) => {
  try {
    await close();
    console.log(`Mongoose disconnected through ${message}`);
  } catch (error) {
    console.error('Mongoose shutdown error:', error.message);
  }
};

process.once('SIGUSR2', async () => {
  await gracefulShutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});

process.once('SIGINT', async () => {
  await gracefulShutdown('app termination');
  process.exit(0);
});

process.once('SIGTERM', async () => {
  await gracefulShutdown('app shutdown');
  process.exit(0);
});

require('./travlr');
require('./user');
connect().catch((err) => {
  console.error('Failed to connect to MongoDB on startup:', err.message);
});

module.exports = {
  close,
  connect,
  dbURI,
  mongoose
};
