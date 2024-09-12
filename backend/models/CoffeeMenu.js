const mongoose = require('mongoose');

// Define the schema for the CoffeeMenu
const coffeeMenuSchema = new mongoose.Schema({
  name: String,
  s_price: Number,
  m_price: Number,
  l_price: Number,
  photo: String,
  type_coffee: [String],
  status: String

});  // Explicitly set collection name

module.exports = mongoose.model('Coffeemenu', coffeeMenuSchema);
