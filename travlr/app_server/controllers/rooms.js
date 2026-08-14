const fs = require('fs');
const path = require('path');

const roomsFile = path.join(__dirname, '../../data/rooms.json');

function readRooms() {
    const file = fs.readFileSync(roomsFile, 'utf8');
    return JSON.parse(file || '[]');
}

/* GET rooms view */
const rooms = (req, res) => {
    const roomList = readRooms();
    res.render('rooms', {
        title: 'Travlr Rooms',
        rooms: roomList,
    });
};

module.exports = {
    rooms
};
