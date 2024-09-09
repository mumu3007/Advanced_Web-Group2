const mongoose = require('mongoose')

const boardGameTypeSchema = new mongoose.Schema({
    name: String
});  // Explicitly set collection name
  
module.exports = mongoose.model('Boardgametype', boardGameTypeSchema);