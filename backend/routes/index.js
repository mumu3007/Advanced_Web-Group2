const express = require('express');
const registerRoutes = require('./register');
const boardgameRoutes = require('./boardgame');
const boardgameTypeRoutes = require('./boardgametype');
const menuRoutes = require('./menurouters');
const orderRoutes = require('./ordercoffee');
const authRoutes = require('./auth')
const userRoutes = require('./user')
const cartRoutes = require('./cart')
const jwt = require('jsonwebtoken');

const { authMiddleware } = require('./middleware');

const router = express.Router();


router.use('/register',registerRoutes); 
router.use('/auth', authRoutes);

router.use('/user',userRoutes); 
router.use('/boardgame', boardgameRoutes);  
router.use('/menu', menuRoutes); 
router.use('/boardgametype', boardgameTypeRoutes); 
router.use('/ordercoffee', orderRoutes); 
router.use('/cart', cartRoutes); 




module.exports = router;
