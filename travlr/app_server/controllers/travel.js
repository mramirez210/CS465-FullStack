/* GET travel view. */
const travel = async (req, res, next) => {
  const endpoint = process.env.TRAVLR_API_URL ||
    `${req.protocol}://${req.get('host')}/api/trips`;

  try {
    const response = await fetch(endpoint, {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      const error = new Error(`Trip API returned HTTP ${response.status}.`);
      error.status = response.status;
      throw error;
    }

    const trips = await response.json();

    if (!Array.isArray(trips)) {
      const error = new Error('Trip API returned an invalid response.');
      error.status = 502;
      throw error;
    }

    return res.render('travel', {
      title: 'Travlr Getaways',
      trips,
      message: trips.length === 0 ? 'No trips are currently available.' : null
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  travel
};
