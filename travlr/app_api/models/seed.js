require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { close, connect } = require('./db');
const Trip = require('./travlr');
const User = require('./user');

const tripsPath = path.join(__dirname, '..', '..', 'data', 'trips.json');
const trips = JSON.parse(fs.readFileSync(tripsPath, 'utf8'));
const admin = {
  name: process.env.ADMIN_NAME || 'Travlr Administrator',
  email: process.env.ADMIN_EMAIL || 'admin@travlr.com',
  password: process.env.ADMIN_PASSWORD || 'Travlr123!'
};

const seedDatabase = async () => {
  try {
    await connect();
    await Trip.deleteMany({});
    const insertedTrips = await Trip.insertMany(trips);

    let adminUser = await User.findOne({ email: admin.email }).exec();
    if (!adminUser) {
      adminUser = new User({ name: admin.name, email: admin.email });
    } else {
      adminUser.name = admin.name;
    }
    adminUser.setPassword(admin.password);
    await adminUser.save();

    console.log(`Seeded ${insertedTrips.length} trips into the travlr database.`);
    console.log(`Seeded administrator account ${adminUser.email}.`);
  } catch (error) {
    console.error('Database seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await close();
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
