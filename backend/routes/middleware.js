const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // รับ JWT จาก cookie
   
    if (!token) return res.status(401).json({ message: 'No token' });
  
    try{
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.userId
     
      next();
      
    }catch (error) {
      
      res.status(401).json({ message: 'Unauthorized'})
  
    }
  };

  module.exports = { authMiddleware }

  
  