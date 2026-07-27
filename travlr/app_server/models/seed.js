// Bringing in the DB connection and Trip schema
const Mongoose = require('./db');
const Trip = require('./travlr');

// Reading seed data from the json file
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// Helper function to ensure Mongoose is connected before querying
const waitForConnection = () => {
  return new Promise((resolve, reject) => {
    // readyState 1 means 'connected'
    if (Mongoose.connection.readyState === 1) {
      return resolve();
    }
    // If not connected yet, listen for the 'connected' event
    Mongoose.connection.once('connected', resolve);
    Mongoose.connection.once('error', reject);
  });
};

// Delete any existing records, then insert seed data
const seedDB = async () => {
  try {
    // 1. Wait until Mongoose is fully connected to MongoDB
    await waitForConnection();

    // 2. Perform operations safely
    await Trip.deleteMany({});
    console.log('Cleared existing trips...');

    await Trip.insertMany(trips);
    console.log('Seed data successfully inserted!');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    // 3. Gracefully close connection and exit
    await Mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seed process
seedDB();