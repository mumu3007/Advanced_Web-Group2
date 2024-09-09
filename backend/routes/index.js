const express = require('express');
const registerRoutes = require('./register');
const boardgameRoutes = require('./boardgame');
const boardgameTypeRoutes = require('./boardgametype');
const menuRoutes = require('./menurouters');
const orderRoutes = require('./ordercoffee');
const authRoutes = require('./auth')
const userRoutes = require('./user')
const jwt = require('jsonwebtoken');

const { authMiddleware } = require('./middleware');

const router = express.Router();


router.use('/register', registerRoutes); 
router.use('/auth', authRoutes);

router.use('/user', authMiddleware,userRoutes); 
router.use('/boardgame',authMiddleware, boardgameRoutes);  
router.use('/menu',authMiddleware, menuRoutes); 
router.use('/boardgametype', boardgameTypeRoutes); 
router.use('/ordercoffee', orderRoutes); 


module.exports = router;
