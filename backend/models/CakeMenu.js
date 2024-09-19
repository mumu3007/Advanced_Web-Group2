const mongoose = require('mongoose');

// Define the schema for the CoffeeMenu
const cakeMenuSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
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
  create_at: {type: Date , default:Date.now},

});  // Explicitly set collection name

module.exports = mongoose.model('CakeMenu', cakeMenuSchema);




