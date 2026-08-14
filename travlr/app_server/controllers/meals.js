const fs = require('fs');
const path = require('path');

const mealsFile = path.join(__dirname, '../../data/meals.json');

function readMeals() {
    const file = fs.readFileSync(mealsFile, 'utf8');
    return JSON.parse(file || '[]');
}

/* GET meals view */
const meals = (req, res) => {
    const mealList = readMeals();
    res.render('meals', {
        title: 'Travlr Meals',
        meals: mealList,
    });
};

module.exports = {
    meals
};