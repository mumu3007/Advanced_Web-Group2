const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Ordercoffee = require('../models/OrderCoffee');
const Cakemenu = require('../models/CakeMenu');
const Cart = require('../models/Cart');
const Boardgame = require('../models/Boardgame')
const router = express.Router();


router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.params.userId ,status: false})
      .populate('ordercoffee_id')
      .populate('cake_id')
      .populate({
        path: 'boardgame_id',
        select: 'name description price photo',
        populate: { path: 'type', select: 'name' }  // เลือกเฉพาะฟิลด์ที่ต้องการดึงมา รวมถึงฟิลด์ image_url
      });


    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ฟังก์ชันนับ ID ที่ซ้ำ
    const countDuplicateIds = (idArray) => {
      return idArray.reduce((acc, id) => {
        if (id) {  // ตรวจสอบว่า id ไม่เป็นค่าว่าง
          acc[id] = (acc[id] || 0) + 1;
        }
        return acc;
      }, {});
    };

    // นับจำนวนซ้ำในแต่ละประเภท
    const ordercoffeeCount = countDuplicateIds(cart.ordercoffee_id.map(item => item._id.toString()));
    const cakeCount = countDuplicateIds(cart.cake_id.map(item => item._id.toString()));
    const boardgameCount = countDuplicateIds(cart.boardgame_id.map(item => item._id.toString()));

    // ส่ง cart พร้อมจำนวน ID ที่ซ้ำ
    res.status(200).json({
      cart,
      counts: {
        ordercoffee: ordercoffeeCount,
        cake: cakeCount,
        boardgame: boardgameCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/add', async (req, res, next) => {
  try {
    const { user_id, ordercoffee_id, cake_id, boardgame_id } = req.body;
    const total_price = 0
    // Validate the IDs
    if (!user_id || !Array.isArray(ordercoffee_id) || !Array.isArray(cake_id) || !Array.isArray(boardgame_id)) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const countDuplicateIds = (idArray) => {
      return idArray.reduce((acc, id) => {
        if (id) {  // ตรวจสอบว่า id ไม่เป็นค่าว่าง
          acc[id] = (acc[id] || 0) + 1;
        }
        return acc;
      }, {});
    };
    const ordercoffeeCount = countDuplicateIds(ordercoffee_id);
    const cakeCount = countDuplicateIds(cake_id);
    const boardgameCount = countDuplicateIds(boardgame_id);

    console.log("Ordercoffee Count:", ordercoffeeCount);
    console.log("Cake Count:", cakeCount);
    console.log("Boardgame Count:", boardgameCount);

    const [ordercoffees, cakes, boardgames] = await Promise.all([
      Ordercoffee.find({ '_id': { $in: Object.keys(ordercoffeeCount) } }),
      Cakemenu.find({ '_id': { $in: Object.keys(cakeCount) } }),
      Boardgame.find({ '_id': { $in: Object.keys(boardgameCount) } })
    ]);

    const ordercoffeeTotal = ordercoffees.reduce((sum, item) => sum + (item.price * ordercoffeeCount[item._id]), 0);
    const cakeTotal = cakes.reduce((sum, item) => sum + (item.price * cakeCount[item._id]), 0);
    const boardgameTotal = boardgames.reduce((sum, item) => sum + (item.price * boardgameCount[item._id]), 0);

    const totalPriceToAdd = ordercoffeeTotal + cakeTotal + boardgameTotal;

    // Find or create a cart for the user
    let cart = await Cart.findOne({ user_id, status: false });
    if (!cart) {
      cart = new Cart({
        user_id,
        ordercoffee_id: [],
        cake_id: [],
        boardgame_id: [],
        total_price: total_price,
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
    const finalOrdercoffeeCount = countDuplicateIds(cart.ordercoffee_id);
    const finalCakeCount = countDuplicateIds(cart.cake_id);
    const finalBoardgameCount = countDuplicateIds(cart.boardgame_id);

    console.log("Final Ordercoffee Count:", finalOrdercoffeeCount);
    console.log("Final Cake Count:", finalCakeCount);
    console.log("Final Boardgame Count:", finalBoardgameCount);

    cart.total_price += totalPriceToAdd;

    const updatedCart = await cart.save();

    res.status(200).json({
      cart: updatedCart,
      counts: {
        ordercoffee: finalOrdercoffeeCount,
        cake: finalCakeCount,
        boardgame: finalBoardgameCount
    }});
  } catch (err) {
    next(err);
  }
});

// router.post('/cart', async (req, res, next) => {
//   try {
//     const { total_price, user_id, ordercoffee_id, cake_id, boardgame_id } = req.body;

//     // Validate user
//     const user = await User.findById(user_id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Retrieve documents by arrays of IDs
//     const [orders, cakes, boardgames] = await Promise.all([
//       Ordercoffee.find({ _id: { $in: ordercoffee_id } }),
//       Cakemenu.find({ _id: { $in: cake_id } }),
//       Boardgame.find({ _id: { $in: boardgame_id } })
//     ]);

//     // Check if all IDs were valid
//     if (orders.length !== ordercoffee_id.length) {
//       return res.status(404).json({ message: "One or more order IDs not found" });
//     }
//     if (cakes.length !== cake_id.length) {
//       return res.status(404).json({ message: "One or more cake IDs not found" });
//     }
//     if (boardgames.length !== boardgame_id.length) {
//       return res.status(404).json({ message: "One or more boardgame IDs not found" });
//     }

//     // Create and save the new cart
//     const newCart = new Cart({
//       total_price,
//       user_id: user._id,
//       ordercoffee_id, // Array of Ordercoffee IDs
//       cake_id,        // Array of Cake IDs
//       boardgame_id    // Array of Boardgame IDs
//     });

//     const savedCart = await newCart.save();

//     res.status(201).json(savedCart);
//   } catch (err) {
//     next(err);
//   }
// });




module.exports = router;
