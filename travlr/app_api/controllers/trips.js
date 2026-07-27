const mongoose = require('mongoose');
const Trip = require('../models/travlr');
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
    try {
        const q = await Model
            .find({}) // empty filter returns all records
            .exec();

        if (!q || q.length === 0) {
            return res
                .status(404)
                .json({ "message": "No trips found" });
        } else {
            return res
                .status(200)
                .json(q);
        }
    } catch (err) {
        return res
            .status(500)
            .json(err);
    }
};

// GET: /trips/:tripCode - returns a single trip by code
const tripsFindByCode = async (req, res) => {
    try {
        const q = await Model
            .find({ 'code': req.params.tripCode })
            .exec();

        if (!q || q.length === 0) {
            return res
                .status(404)
                .json({ "message": "Trip not found" });
        } else {
            return res
                .status(200)
                .json(q);
        }
    } catch (err) {
        return res
            .status(500)
            .json(err);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode
};