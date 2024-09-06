const mongoose = require('mongoose')

const boardGameSchema = new mongoose.Schema({
    name: String,
    description: String,
    quantity: Number,
});  // Explicitly set collection name
  
module.exports = mongoose.model('Boardgame', boardGameSchema);