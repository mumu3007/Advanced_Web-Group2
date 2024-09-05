const mongoose = require('mongoose')

const manuSchema = mongoose.Schema({
    name: {
        type: String
    },
    Price: {
        type: Number
    },
})

module.exports = mongoose.model('Menu', manuSchema)