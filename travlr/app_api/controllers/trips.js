const Trip = require('../models/travlr');

const tripCodePattern = /^[A-Z]{3,4}-?\d{3,6}$/i;
const tripFields = [
  'code',
  'name',
  'length',
  'start',
  'resort',
  'perPerson',
  'image',
  'description'
];

const tripPayload = (body) => tripFields.reduce((payload, field) => {
  if (body[field] !== undefined) {
    payload[field] = body[field];
  }
  return payload;
}, {});

const validTripCode = (res, tripCode) => {
  if (tripCodePattern.test(tripCode)) {
    return true;
  }

  res.status(400).json({
    message: 'Invalid trip code format.'
  });
  return false;
};

const sendDatabaseError = (res, error) => {
  console.error('Trip API error:', error.message);

  if (error.code === 11000) {
    return res.status(409).json({ message: 'That trip code already exists.' });
  }

  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: 'Unable to process trip data.' });
};

/* GET /api/trips */
const tripsList = async (req, res) => {
  try {
    const trips = await Trip.find({}).sort({ code: 1 }).lean().exec();
    return res.status(200).json(trips);
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

/* POST /api/trips */
const tripsAddTrip = async (req, res) => {
  try {
    const trip = await Trip.create(tripPayload(req.body));
    return res.status(201).json(trip);
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

/* GET /api/trips/:tripCode */
const tripsFindByCode = async (req, res) => {
  const { tripCode } = req.params;

  if (!validTripCode(res, tripCode)) {
    return undefined;
  }

  try {
    const trips = await Trip.find({ code: tripCode }).lean().exec();

    if (trips.length === 0) {
      return res.status(404).json({
        message: `No trip was found with code ${tripCode}.`
      });
    }

    return res.status(200).json(trips);
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

/* PUT /api/trips/:tripCode */
const tripsUpdateTrip = async (req, res) => {
  const { tripCode } = req.params;

  if (!validTripCode(res, tripCode)) {
    return undefined;
  }

  const updateData = tripPayload(req.body);
  delete updateData.code; 

  try {
    const trip = await Trip.findOneAndUpdate(
      { code: tripCode },
      updateData,
      { returnDocument: 'after', runValidators: true }
    ).lean().exec();

    if (!trip) {
      return res.status(404).json({
        message: `No trip was found with code ${tripCode}.`
      });
    }

    return res.status(200).json(trip);
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

/* DELETE /api/trips/:tripCode */
const tripsDeleteTrip = async (req, res) => {
  const { tripCode } = req.params;

  if (!validTripCode(res, tripCode)) {
    return undefined;
  }

  try {
    const trip = await Trip.findOneAndDelete({ code: tripCode }).lean().exec();

    if (!trip) {
      return res.status(404).json({
        message: `No trip was found with code ${tripCode}.`
      });
    }

    return res.status(204).send();
  } catch (error) {
    return sendDatabaseError(res, error);
  }
};

module.exports = {
  tripsAddTrip,
  tripsDeleteTrip,
  tripsFindByCode,
  tripsList,
  tripsUpdateTrip
};
