const mongoose = require('mongoose')

const boardGameSchema = new mongoose.Schema({
    name: String,
    Description: String,
    quantity: Number,
  }, { collection: 'Boardgame' });  // Explicitly set collection name
  
const boardgame = mongoose.model('Boardgame', boardGameSchema)

module.exports = boardgame;