const Boardgame = require('../models/Boardgame');  // เปลี่ยน path ให้ถูกต้องตามที่โมเดลของคุณอยู่
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

// Middleware สำหรับจัดการ error ที่เกิดจาก multer
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // ข้อผิดพลาดจาก multer (เช่น ขนาดไฟล์เกิน)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: "File size should not exceed 5MB." });
    }
  } else if (err) {
    // ข้อผิดพลาดจาก fileFilter
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Import โมเดล Boardgame

router.post("/upload", upload.single("image"), handleMulterErrors,async (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: "Image file is required." });
  }
  
  try {
    // สร้างเอกสาร payment ใหม่
    const newPayment = new Payment({
      user_id: req.body.user_id,
      cart_id: req.body.cart_id, // รับ cart_id จาก body request
      status: "รอการตรวจสอบ", // กำหนดสถานะเริ่มต้น
      image: {
        filename: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      },
    });

    // บันทึกข้อมูลการชำระเงินลง MongoDB
    const savedPayment = await newPayment.save();

    // อัปเดตสถานะของ Cart เป็น true
    const updatedCart = await Cart.findByIdAndUpdate(
      req.body.cart_id,
      { status: true },
      { new: true }
    );
  
    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // นับจำนวนของแต่ละ boardgame_id ใน cart
    const countBoardgameIds = (boardgameIds) => {
      return boardgameIds.reduce((acc, boardgameId) => {
        acc[boardgameId] = (acc[boardgameId] || 0) + 1;
        return acc;
      }, {});
    };

    const boardgameIdCount = countBoardgameIds(updatedCart.boardgame_id);

    // ตรวจสอบและลดจำนวนสินค้าในตาราง boardgame
    if (Object.keys(boardgameIdCount).length > 0) {
      // ใช้ Promise.all เพื่อจัดการกับหลายรายการพร้อมกัน
      await Promise.all(
        Object.entries(boardgameIdCount).map(async ([boardgameId, count]) => {
          const boardgame = await Boardgame.findById(boardgameId);

          if (boardgame) {
            // ตรวจสอบว่ามีจำนวนเพียงพอและลดจำนวนสินค้า
            if (boardgame.quantity >= count) {
              boardgame.quantity -= count; // ลดจำนวนตามค่าที่นับได้
              await boardgame.save(); // บันทึกการเปลี่ยนแปลง
            } else {
              return res.status(400).json({
                message: `Boardgame ${boardgame.name} does not have enough stock.`,
              });
            }
          }
        })
      );
    }

    res.status(200).json({
      message: "Payment has been successfully processed!",
      payment: savedPayment, // ส่งข้อมูลการชำระเงินกลับไป
      updatedCart: updatedCart,  // ส่งข้อมูล Cart ที่ถูกอัปเดตกลับไป
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment", error: error.message });
  }
});


router.get("/", async (req, res) => {
  try {
    // ดึงข้อมูล payment ทั้งหมด
    const payments = await Payment.find()
    .populate({
      path: 'cart_id',
      select: 'total_price',
    })
    .populate({
      path: 'user_id',
      populate: {
        path: '_id',
        select: 'username',
      }
    });

    if (!payments.length) {
      return res.status(404).json({ message: "No payments found" });
    }

    // เพิ่ม URL ของรูปภาพให้แต่ละ payment
    const paymentsWithImageUrl = payments.map(payment => {
      const imageUrl = `${req.protocol}://${req.get('host')}/${payment.image.filePath}`;
      return {
        ...payment._doc,
        imageUrl,  // เพิ่ม URL ของรูปภาพเข้าไปในผลลัพธ์
      };
    });

    res.status(200).json(paymentsWithImageUrl);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments", error: error.message });
  }
});

// เปลี่ยนจาก router.put เป็น router.patch
router.patch("/:id", async (req, res) => {
  try {
    const paymentId = req.params.id;
    const { status } = req.body;

    if (!['รอการตรวจสอบ', 'ตรวจสอบแล้ว'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status: status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({
      message: 'Payment status updated successfully!',
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment status', error: error.message });
  }
});



module.exports = router;
