const mongoose = require('mongoose');

// Define the schema for the CoffeeMenu
const coffeeMenuSchema = new mongoose.Schema({
  name: String,
  s_price: Number,
  m_price: Number,
  l_price: Number,
  photo: {
    filename: {
      type: String,
      required: true, // ชื่อไฟล์รูปภาพที่อัปโหลด
    },
    filePath: {
      type: String,
      required: true, // เส้นทางไฟล์ที่เก็บในระบบ
    },
    fileType: {
      type: String,
      required: true, // ประเภทไฟล์ (เช่น image/jpeg, image/png)
    },
    fileSize: {
      type: Number,
      required: true, // ขนาดไฟล์เป็น byte
    },
  },
  type_coffee: [String],
  status: String

});  // Explicitly set collection name

module.exports = mongoose.model('Coffeemenu', coffeeMenuSchema);
