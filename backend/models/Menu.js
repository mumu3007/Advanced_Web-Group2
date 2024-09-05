const mongoose = require('mongoose')

const menuSchema = mongoose.Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
})

module.exports = mongoose.model('Menu', menuSchema)