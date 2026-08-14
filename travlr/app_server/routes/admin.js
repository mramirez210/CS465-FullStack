var express = require('express');
var router = express.Router();
var adminController = require('../controllers/admin');

router.get('/', adminController.dashboard);

/* GET admin trip list. */
router.get('/trips', adminController.trips);
router.get('/trips/new', adminController.newTrip);
router.post('/trips', adminController.createTrip);
router.get('/trips/:id/edit', adminController.editTrip);
router.post('/trips/:id', adminController.updateTrip);
router.post('/trips/:id/delete', adminController.deleteTrip);

/* GET/POST admin room and meal creation forms. */
router.get('/rooms', adminController.rooms);
router.get('/rooms/new', adminController.newRoom);
router.post('/rooms', adminController.createRoom);
router.get('/rooms/:index/edit', adminController.editRoom);
router.post('/rooms/:index', adminController.updateRoom);
router.post('/rooms/:index/delete', adminController.deleteRoom);

router.get('/meals', adminController.meals);
router.get('/meals/new', adminController.newMeal);
router.post('/meals', adminController.createMeal);
router.get('/meals/:index/edit', adminController.editMeal);
router.post('/meals/:index', adminController.updateMeal);
router.post('/meals/:index/delete', adminController.deleteMeal);

module.exports = router;
