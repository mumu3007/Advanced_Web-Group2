const mongoose = require('mongoose')

const boardGameSchema = new mongoose.Schema({
    name: String,
    description: String,
    quantity: Number,
    price: Number,
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
    status: {type: Boolean, default:false},
    type:{type: mongoose.Schema.Types.ObjectId, ref: "Boardgametype"},
});  // Explicitly set collection name
  
module.exports = mongoose.model('Boardgame', boardGameSchema);