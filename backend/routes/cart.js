const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Ordercoffee = require('../models/OrderCoffee');
const Cakemenu = require('../models/CakeMenu');
const Cart = require('../models/Cart');
const router = express.Router();

router.post('/cart', async (req, res, next) => {
    try {
      const { total_price, user_id, ordercoffee_id, cake_id, boardgame_id } = req.body;
  
      const user = await User.findById(user_id);
      const order = await Ordercoffee.findById(ordercoffee_id);
      const cake = await Cakemenu.findById(cake_id);
      const boardgame = await Ordercoffee.findById(boardgame_id);

      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      
      const newCart = new Cart({
        total_price,
        user_id: user._id,
        // ordercoffee_id: order._id,
        // cake_id: cake._id,
        // boardgame_id: boardgame._id, 
      });
  
      const savedCart = await newCart.save();
  
      res.status(201).json(savedCart);
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
