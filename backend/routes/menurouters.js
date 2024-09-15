const express = require('express');
const Coffeemenu = require('../models/CoffeeMenu'); // Ensure the correct path to the model
const CakeMenu = require('../models/CakeMenu');
const router = express.Router();
const mongoose = require('mongoose');

// Get all coffee menus
router.get('/coffeemenu', async (req, res, next) => {
  try {
    const coffeemenus = await Coffeemenu.find();
    res.json(coffeemenus);
  } catch (err) {
    next(err);
  }
});

router.get('/recommended_coffee', async (req, res, next) => {
  try {
    const coffeemenus = await Coffeemenu.find({ status: "recommended" });
    res.json(coffeemenus);
  } catch (err) {
    next(err);
  }
});

// Get a coffee menu by ID
router.get('/coffeemenu/:id', async (req, res, next) => {
  try {
    const coffeemenu = await Coffeemenu.findById(req.params.id);
    if (!coffeemenu) {
      return res.status(404).json({ message: 'Coffee menu not found' });
    }
    res.json(coffeemenu);
  } catch (err) {
    next(err);
  }
});

// Create a new coffee menu (POST)
router.post('/coffeemenu', async (req, res, next) => {
  try {
    const { name, s_price, m_price, l_price, photo, type_coffee, status } = req.body;

    // Create a new CoffeeMenu document
    const newCoffeeMenu = new Coffeemenu({
      name,
      s_price,
      m_price,
      l_price,
      photo,
      type_coffee,
      status
    });

    // Save the new menu to the database
    const savedCoffeeMenu = await newCoffeeMenu.save();

    // Respond with the newly created menu
    res.status(201).json(savedCoffeeMenu);
  } catch (err) {
    // Pass any errors to the error handler
    next(err);
  }
});

//ยังทำงานไม่ได้ ติดหาด้วยไอดีเพราะว่า ใน database เป็น objecId แต่รับมาเป็นตัวเลขธรรม
router.put('/coffeemenu/:id', async (req, res, next) => {
  try {
    const { name, s_price, m_price, l_price, photo, type_coffee, status } = req.body;


    // Convert the ID to ObjectId
    const objectId = new mongoose.ObjectId(req.params.id);

    // Find the menu by ID and update it with the provided data
    const updatedCoffeeMenu = await Coffeemenu.findByIdAndUpdate(
      objectId,
      { name, s_price, m_price, l_price, photo, type_coffee, status },
      { new: true, runValidators: true } // Ensure it returns the updated document and applies validation
    );

    // Check if the coffee menu exists
    if (!updatedCoffeeMenu) {
      return res.status(404).json({ message: 'Coffee menu not found' });
    }

    // Respond with the updated menu
    res.json(updatedCoffeeMenu);
  } catch (err) {
    // Pass any errors to the error handler
    next(err);
  }
});



// Delete a coffee menu by ID (DELETE)
router.delete('/coffeemenu/:id', async (req, res, next) => {
  try {
    const deletedCoffeeMenu = await Coffeemenu.findByIdAndDelete(req.params.id);
    if (!deletedCoffeeMenu) {
      return res.status(404).json({ message: 'Coffee menu not found' });
    }
    res.json({ message: 'Coffee menu deleted successfully' });
  } catch (err) {
    next(err);
  }
});

router.get('/cakemenu', async (req, res, next) => {
  try {
    const cakemenus = await CakeMenu.find();
    res.json(cakemenus);
  } catch (err) {
    next(err);
  }
});




router.get('/cakemenu/:id', async (req, res, next) => {
  try {
    const cakemenu = await CakeMenu.findById(req.params.id);
    if (!cakemenu) {
      return res.status(404).json({ message: 'cakemenu not found' });
    }
    res.json(cakemenu);
  } catch (err) {
    next(err);
  }
});


router.post('/cakemenu', async (req, res, next) => {
  try {
    const { name, price, description, photo } = req.body;

    // Create a new CoffeeMenu document
    const newCakeMenu = new CakeMenu({
      name,
      price,
      description,
      photo
    });

    // Save the new menu to the database
    const savedCakeMenu = await newCakeMenu.save();

    // Respond with the newly created menu
    res.status(201).json(savedCakeMenu);
  } catch (err) {
    // Pass any errors to the error handler
    next(err);
  }
});


function numberToHexString(num) {
  let hex = num.toString(16);
  while (hex.length < 24) {
    hex = '0' + hex;
  }
  return hex;
}


module.exports = router;
