const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware} = require('./middleware')
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie('token', token, {
      maxAge: 24*60*60*1000,
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    })

    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
});

router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ userId: req.userId,role: req.role });
});



// Route สำหรับ logout
router.post("/logout", (req, res) => {
  // ลบ cookies ที่เก็บ JWT token
  res.clearCookie("token", {
    httpOnly: true,  // ทำให้แน่ใจว่า cookies นี้ไม่สามารถเข้าถึงได้ผ่าน JavaScript
    secure: false,    // ใช้ secure เมื่อทำงานบน HTTPS
    sameSite: "lax" // เพื่อรองรับการใช้งาน Cross-site
  });
  
  // ตอบกลับสถานะว่า logout สำเร็จ
  res.status(200).json({ message: "Logout successful" });
});



module.exports = router;
