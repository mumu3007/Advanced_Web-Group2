const express = require('express');
const registerRoutes = require('./register');
const boardgameRoutes = require('./boardgame');
const menuRoutes = require('./menurouters');
const authRoutes = require('./auth')

const router = express.Router();

router.use('/register', registerRoutes); 
router.use('/auth', authRoutes);
router.use('/boardgame', boardgameRoutes);  
router.use('/menu', menuRoutes); 

module.exports = router;
