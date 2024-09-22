const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true},
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // เพิ่มฟิลด์ role
});

module.exports = mongoose.model('User', userSchema);
