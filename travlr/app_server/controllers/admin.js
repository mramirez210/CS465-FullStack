var fs = require('fs');
var path = require('path');
var Trip = require('../../app_api/models/travlr');

var tripsFile = path.join(__dirname, '../../data/trips.json');
var roomsFile = path.join(__dirname, '../../data/rooms.json');
var mealsFile = path.join(__dirname, '../../data/meals.json');

function readTrips() {
  var file = fs.readFileSync(tripsFile, 'utf8');
  return JSON.parse(file || '[]');
}

function writeTrips(trips) {
  fs.writeFileSync(tripsFile, JSON.stringify(trips, null, 2), 'utf8');
}

function readJson(filePath) {
  var file = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(file || '[]');
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

var dashboard = (req, res) => {
  res.render('admin_dashboard', {
    title: 'Admin Dashboard',
  });
};

var trips = async (req, res) => {
  try {
    var travelData = await Trip.find({}).lean();
    res.render('admin_trips', {
      title: 'Admin - Manage Trips',
      trips: travelData,
    });
  } catch (error) {
    res.status(500).send('Unable to load trips');
  }
};

var newTrip = (req, res) => {
  res.render('admin_trip_form', {
    title: 'Add New Trip',
    action: '/admin/trips',
    trip: {},
    submitLabel: 'Create Trip',
  });
};

var createTrip = async (req, res) => {
  var newTrip = {
    code: req.body.code || 'TRIP-NEW',
    name: req.body.name || 'New Trip',
    length: req.body.length || '1 day',
    start: req.body.start ? new Date(req.body.start) : new Date(),
    resort: req.body.resort || 'TBD',
    perPerson: req.body.perPerson || '$0',
    image: req.body.image || '/images/reef1.jpg',
    description: req.body.description || '',
  };
  try {
    await Trip.create(newTrip);
    res.redirect('/admin/trips');
  } catch (error) {
    res.status(400).send('Unable to create trip');
  }
};

var editTrip = async (req, res) => {
  var trip = await Trip.findById(req.params.id).lean();
  if (!trip) {
    return res.status(404).send('Trip not found');
  }
  if (trip.start) {
    trip.startInput = new Date(trip.start).toISOString().slice(0, 10);
  }
  res.render('admin_trip_form', {
    title: 'Edit Trip',
    action: '/admin/trips/' + req.params.id,
    trip: trip,
    submitLabel: 'Update Trip',
  });
};

var updateTrip = async (req, res) => {
  var updated = await Trip.findByIdAndUpdate(
    req.params.id,
    {
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start ? new Date(req.body.start) : undefined,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description,
    },
    { runValidators: true }
  );
  if (!updated) {
    return res.status(404).send('Trip not found');
  }
  res.redirect('/admin/trips');
};

var deleteTrip = async (req, res) => {
  await Trip.findByIdAndDelete(req.params.id);
  res.redirect('/admin/trips');
};

var newRoom = (req, res) => {
  res.render('admin_room_form', {
    title: 'Add New Room',
    action: '/admin/rooms',
    room: {},
    submitLabel: 'Create Room',
  });
};

var rooms = (req, res) => {
  var roomData = readJson(roomsFile);
  res.render('admin_rooms', {
    title: 'Admin - Manage Rooms',
    rooms: roomData,
  });
};

var createRoom = (req, res) => {
  var rooms = readJson(roomsFile);
  var newRoom = {
    name: req.body.name || 'New Room',
    image: req.body.image || '/images/first-class.jpg',
    description: req.body.description || '',
    rate: req.body.rate || 'Rate: 0 / Day',
  };
  rooms.push(newRoom);
  writeJson(roomsFile, rooms);
  res.redirect('/admin/rooms');
};

var editRoom = (req, res) => {
  var index = parseInt(req.params.index, 10);
  var rooms = readJson(roomsFile);
  var room = rooms[index];
  if (!room) {
    return res.status(404).send('Room not found');
  }
  res.render('admin_room_form', {
    title: 'Edit Room',
    action: '/admin/rooms/' + index,
    room: room,
    submitLabel: 'Update Room',
  });
};

var updateRoom = (req, res) => {
  var index = parseInt(req.params.index, 10);
  var rooms = readJson(roomsFile);
  if (!rooms[index]) {
    return res.status(404).send('Room not found');
  }
  rooms[index] = {
    name: req.body.name || rooms[index].name,
    image: req.body.image || rooms[index].image,
    description: req.body.description || rooms[index].description,
    rate: req.body.rate || rooms[index].rate,
  };
  writeJson(roomsFile, rooms);
  res.redirect('/admin/rooms');
};

var deleteRoom = (req, res) => {
  var index = parseInt(req.params.index, 10);
  var rooms = readJson(roomsFile);
  if (index >= 0 && index < rooms.length) {
    rooms.splice(index, 1);
    writeJson(roomsFile, rooms);
  }
  res.redirect('/admin/rooms');
};

var newMeal = (req, res) => {
  res.render('admin_meal_form', {
    title: 'Add New Meal',
    action: '/admin/meals',
    meal: {},
    submitLabel: 'Create Meal',
  });
};

var meals = (req, res) => {
  var mealData = readJson(mealsFile);
  res.render('admin_meals', {
    title: 'Admin - Manage Meals',
    meals: mealData,
  });
};

var createMeal = (req, res) => {
  var meals = readJson(mealsFile);
  var newMeal = {
    name: req.body.name || 'New Meal',
    image: req.body.image || '/images/seafoods.jpg',
    headline: req.body.headline || '',
    description: req.body.description || '',
  };
  meals.push(newMeal);
  writeJson(mealsFile, meals);
  res.redirect('/admin/meals');
};

var editMeal = (req, res) => {
  var index = parseInt(req.params.index, 10);
  var meals = readJson(mealsFile);
  var meal = meals[index];
  if (!meal) {
    return res.status(404).send('Meal not found');
  }
  res.render('admin_meal_form', {
    title: 'Edit Meal',
    action: '/admin/meals/' + index,
    meal: meal,
    submitLabel: 'Update Meal',
  });
};

var updateMeal = (req, res) => {
  var index = parseInt(req.params.index, 10);
  var meals = readJson(mealsFile);
  if (!meals[index]) {
    return res.status(404).send('Meal not found');
  }
  meals[index] = {
    name: req.body.name || meals[index].name,
    image: req.body.image || meals[index].image,
    headline: req.body.headline || meals[index].headline,
    description: req.body.description || meals[index].description,
  };
  writeJson(mealsFile, meals);
  res.redirect('/admin/meals');
};

var deleteMeal = (req, res) => {
  var index = parseInt(req.params.index, 10);
  var meals = readJson(mealsFile);
  if (index >= 0 && index < meals.length) {
    meals.splice(index, 1);
    writeJson(mealsFile, meals);
  }
  res.redirect('/admin/meals');
};

module.exports = {
  dashboard,
  trips,
  newTrip,
  createTrip,
  editTrip,
  updateTrip,
  deleteTrip,
  rooms,
  newRoom,
  createRoom,
  editRoom,
  updateRoom,
  deleteRoom,
  meals,
  newMeal,
  createMeal,
  editMeal,
  updateMeal,
  deleteMeal,
};
