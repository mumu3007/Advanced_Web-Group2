const mongoose = require('mongoose')

const boardGameSchema = new mongoose.Schema({
    name: String,
    description: String,
    quantity: Number,
    price: Number,
    photo: String,
    create_at: {type: Date , default:Date.now},
    status: {type: Boolean, default:false},
    type:{type: mongoose.Schema.Types.ObjectId, ref: "Boardgametype"},
});  // Explicitly set collection name
  
module.exports = mongoose.model('Boardgame', boardGameSchema);