const mongoose = require('mongoose');

// Define the schema for the CoffeeMenu
const coffeeMenuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  photo: String

}, { collection: 'CoffeeMenu' });  // Explicitly set collection name

// Create and export the Coffeemenu model
const Coffeemenu = mongoose.model('Coffeemenu', coffeeMenuSchema);

module.exports = Coffeemenu;
