const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // รับ JWT จาก cookie
    console.log('Received token:', token); // ดีบัก
    if (!token) return res.status(401).json({ message: 'No token' });
  
    try{
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId
      console.log('Decoded JWT:', decoded); // ดีบัก
      next();
      
    }catch (error) {
        console.error('JWT verification failed:', error); // ดีบัก
      res.status(401).json({ message: 'Unauthorized'})
  
    }
  };

  module.exports = { authMiddleware }

  
  