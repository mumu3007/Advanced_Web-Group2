const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
   total_price: { type: Number, required: true },
   user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
   ordercoffee_id:[{type: mongoose.Schema.Types.ObjectId, ref: "Ordercoffee"}],
   cake_id: [{type: mongoose.Schema.Types.ObjectId, ref: "CakeMenu"}],
   boardgame_id:[{type: mongoose.Schema.Types.ObjectId, ref: "Boardgame"}],
   status: { type: Boolean, default: false }
});   

module.exports = mongoose.model('Cart', cartSchema);