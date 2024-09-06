const mongoose = require('mongoose');

// Define the schema for the CoffeeMenu
const coffeeMenuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  photo: String

});  // Explicitly set collection name

module.exports = mongoose.model('Coffeemenu', coffeeMenuSchema);
