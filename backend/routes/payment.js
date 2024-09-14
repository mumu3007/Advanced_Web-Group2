const express = require("express");
const multer = require("multer");
const path = require("path");
const Payment = require("../models/Payment"); // import model Payment
const Cart = require("../models/Cart"); // import model Cart

const router = express.Router();

const fileFilter = (req, file, cb) => {
    // ตรวจสอบประเภทของไฟล์
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);  // อนุญาตไฟล์
    } else {
      cb(new Error('Only .jpeg and .png files are allowed!'), false); // ปฏิเสธไฟล์
    }
  }

  // การกำหนดขนาดสูงสุด
const limits = {
    fileSize: 5 * 1024 * 1024  // ขนาดไฟล์สูงสุด 5 MB
  };
  

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    // สร้างเอกสาร payment ใหม่
    const newPayment = new Payment({
      cart_id: req.body.cart_id, // รับ cart_id จาก body request
      status: "pending", // กำหนดสถานะเริ่มต้น
      image: {
        filename: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      },
    });

    // บันทึกข้อมูลลง MongoDB
    const savedPayment = await newPayment.save();

        // อัปเดต status ของ Cart เป็น true
        const updatedCart = await Cart.findByIdAndUpdate(
            req.body.cart_id,  // cart_id ที่เกี่ยวข้อง
            { status: true },   // อัปเดต status เป็น true
            { new: true }       // ส่งค่ากลับเป็นเอกสารใหม่หลังอัปเดต
          );
      
          if (!updatedCart) {
            return res.status(404).json({ message: "Cart not found" });
          }
      

    res.status(200).json({
      message: "Payment created successfully!",
      payment: savedPayment, // ส่งข้อมูลการชำระเงินกลับไป
      updatedCart: updatedCart,  // ส่งข้อมูล Cart ที่ถูกอัปเดตกลับไป
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create payment", error: error.message });
  }
});

module.exports = router;
