const mongoose = require('mongoose')

const orderCoffeeSchema = new mongoose.Schema({
    size: String,
    description: String,
    price: Number,
    sweetness_level: String,
    type_order: String,
    quantity: Number,
    coffee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Coffeemenu" },
});  // Explicitly set collection name

module.exports = mongoose.model('Ordercoffee', orderCoffeeSchema);