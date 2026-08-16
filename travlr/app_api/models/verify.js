const { close, connect } = require('./db');
const Trip = require('./travlr');

const requiredFields = [
  'code',
  'name',
  'length',
  'start',
  'resort',
  'perPerson',
  'image',
  'description'
];

const retrieveTrips = async () => {
  await connect();

  try {
    const trips = await Trip.find({}).sort({ code: 1 }).lean();

    if (trips.length === 0) {
      throw new Error('The trips collection is empty. Run npm run db:seed first.');
    }

    for (const trip of trips) {
      for (const field of requiredFields) {
        if (trip[field] === undefined || trip[field] === null) {
          throw new Error(`Trip ${trip.code || trip._id} is missing ${field}.`);
        }
      }
    }

    return trips;
  } finally {
    await close();
  }
};

if (require.main === module) {
  retrieveTrips()
    .then((trips) => {
      console.log(JSON.stringify(trips, null, 2));
      console.log(`Verified ${trips.length} trips returned from MongoDB as JSON.`);
    })
    .catch((error) => {
      console.error('Database verification failed:', error.message);
      process.exitCode = 1;
    });
}

module.exports = retrieveTrips;
