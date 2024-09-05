const express = require('express');
const authRoutes = require('./auth');
const boardgameRoutes = require('./boardgame');
const menuRoutes = require('./menurouters');

const router = express.Router();

router.use('/auth', authRoutes); 
router.use('/boardgame', boardgameRoutes);  
router.use('/menu', menuRoutes); 

module.exports = router;
