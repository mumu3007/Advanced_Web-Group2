const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart', // อ้างอิงไปยัง Cart ที่เกี่ยวข้อง
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // อ้างอิงไปยัง Cart ที่เกี่ยวข้อง
      required: true,
    },
    status: {
      type: String,
      enum: ['รอการตรวจสอบ', 'ตรวจสอบแล้ว'], // สถานะของการชำระเงิน
      default: 'รอการตรวจสอบ',
      required: true,
    },
    image: {
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
  });

module.exports = mongoose.model('Payment', paymentSchema);