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

router.post('/cart/add', async (req, res, next) => {
  try {
    const { user_id, ordercoffee_id, cake_id, boardgame_id, total_price } = req.body;

    // Validate the IDs
    if (!user_id || !Array.isArray(ordercoffee_id) || !Array.isArray(cake_id) || !Array.isArray(boardgame_id)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const [ordercoffees, cakes, boardgames] = await Promise.all([
      Ordercoffee.find({ '_id': { $in: ordercoffee_id } }),
      Cakemenu.find({ '_id': { $in: cake_id } }),
      Boardgame.find({ '_id': { $in: boardgame_id } })
    ]);

    const ordercoffeeTotal = ordercoffees.reduce((sum, item) => sum + item.total_price, 0);
    const cakeTotal = cakes.reduce((sum, item) => sum + item.price, 0);
    const boardgameTotal = boardgames.reduce((sum, item) => sum + item.price, 0);

    const totalPriceToAdd = ordercoffeeTotal + cakeTotal + boardgameTotal;

    // Find or create a cart for the user
    let cart = await Cart.findOne({ user_id, status: false });
    if (!cart) {
      cart = new Cart({
        user_id,
        ordercoffee_id: [],
        cake_id: [],
        boardgame_id: [],
        total_price: 0,
      });
    }
    // Update cart with new items
    if (ordercoffee_id.length > 0) {
      cart.ordercoffee_id.push(...ordercoffee_id)
    }
    if (cake_id.length > 0) {
      cart.cake_id.push(...cake_id);
    }
    if (boardgame_id.length > 0) {
      cart.boardgame_id.push(...boardgame_id);
    }

    cart.total_price += totalPriceToAdd;

    const updatedCart = await cart.save();

    res.status(200).json(updatedCart);
  } catch (err) {
    next(err);
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
