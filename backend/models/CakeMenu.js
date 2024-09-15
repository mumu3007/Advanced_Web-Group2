const mongoose = require('mongoose');

// Define the schema for the CoffeeMenu
const cakeMenuSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    photo: String

});  // Explicitly set collection name

module.exports = mongoose.model('CakeMenu', cakeMenuSchema);




