const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
   total_price: Number,
   user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
   ordercoffee_id:[{type: mongoose.Schema.Types.ObjectId, ref: "Ordercoffee"}],
   cake_id: [{type: mongoose.Schema.Types.ObjectId, ref: "CakeMenu"}],
   boardgame_id:[{type: mongoose.Schema.Types.ObjectId, ref: "Boardgame"}],
});   

module.exports = mongoose.model('Cart', cartSchema);

