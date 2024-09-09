const express = require('express');
const registerRoutes = require('./register');
const boardgameRoutes = require('./boardgame');
const boardgameTypeRoutes = require('./boardgametype');
const menuRoutes = require('./menurouters');
const orderRoutes = require('./ordercoffee');
const authRoutes = require('./auth')

const router = express.Router();

router.use('/register', registerRoutes); 
router.use('/auth', authRoutes);
router.use('/boardgame', boardgameRoutes);  
router.use('/menu', menuRoutes); 
router.use('/boardgametype', boardgameTypeRoutes); 
router.use('/ordercoffee', orderRoutes); 



module.exports = router;
