const mongoose = require('mongoose')

const orderCakeSchema = new mongoose.Schema({
    total_price: Number,
    quantity: Number,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cake_id: { type: mongoose.Schema.Types.ObjectId, ref: "CakeMenu" },
});  // Explicitly set collection name

module.exports = mongoose.model('Ordercake', orderCakeSchema);


