const express = require('express');
const registerRoutes = require('./register');
const boardgameRoutes = require('./boardgame');
const boardgameTypeRoutes = require('./boardgametype');
const menuRoutes = require('./menurouters');
const orderRoutes = require('./ordercoffee');
const orderCakeRoutes = require('./ordercake');
const authRoutes = require('./auth')
const userRoutes = require('./user')
const cartRoutes = require('./cart')
const paymentRoutes = require('./payment')
const jwt = require('jsonwebtoken');

const { authMiddleware } = require('./middleware');

const router = express.Router();

router.use('/uploads', express.static('uploads'));


router.use('/register',registerRoutes); 
router.use('/auth', authRoutes);

router.use('/user',authMiddleware,userRoutes); 
router.use('/boardgame',authMiddleware, boardgameRoutes);  
router.use('/menu',authMiddleware ,menuRoutes); 
router.use('/boardgametype',authMiddleware, boardgameTypeRoutes); 
router.use('/ordercoffee',authMiddleware, orderRoutes); 
router.use('/ordercake',authMiddleware, orderCakeRoutes);
router.use('/cart', authMiddleware,cartRoutes); 
router.use('/payment', authMiddleware,paymentRoutes); 







module.exports = router;
