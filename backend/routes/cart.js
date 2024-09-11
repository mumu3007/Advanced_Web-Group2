const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Ordercoffee = require('../models/OrderCoffee');
const Cakemenu = require('../models/CakeMenu');
const Cart = require('../models/Cart');
const Boardgame = require('../models/Boardgame')
const router = express.Router();

router.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.params.userId })
      .populate('ordercoffee_id')
      .populate('cake_id')
      .populate('boardgame_id');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/cart', async (req, res, next) => {
  try {
    const { total_price, user_id, ordercoffee_id, cake_id, boardgame_id } = req.body;

    // Validate user
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Retrieve documents by arrays of IDs
    const [orders, cakes, boardgames] = await Promise.all([
      Ordercoffee.find({ _id: { $in: ordercoffee_id } }),
      Cakemenu.find({ _id: { $in: cake_id } }),
      Boardgame.find({ _id: { $in: boardgame_id } })
    ]);

    // Check if all IDs were valid
    if (orders.length !== ordercoffee_id.length) {
      return res.status(404).json({ message: "One or more order IDs not found" });
    }
    if (cakes.length !== cake_id.length) {
      return res.status(404).json({ message: "One or more cake IDs not found" });
    }
    if (boardgames.length !== boardgame_id.length) {
      return res.status(404).json({ message: "One or more boardgame IDs not found" });
    }

    // Create and save the new cart
    const newCart = new Cart({
      total_price,
      user_id: user._id,
      ordercoffee_id, // Array of Ordercoffee IDs
      cake_id,        // Array of Cake IDs
      boardgame_id    // Array of Boardgame IDs
    });

    const savedCart = await newCart.save();

    res.status(201).json(savedCart);
  } catch (err) {
    next(err);
  }
});




module.exports = router;
