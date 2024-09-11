const mongoose = require('mongoose')

const orderCoffeeSchema = new mongoose.Schema({
    size: String,
    description: String,
    total_price: Number,
    sweetness_Level: String,
    Type_order: String,
    coffee_id:{type: mongoose.Schema.Types.ObjectId, ref: "Coffeemenu"},
});  // Explicitly set collection name
  
module.exports = mongoose.model('Ordercoffee', orderCoffeeSchema);