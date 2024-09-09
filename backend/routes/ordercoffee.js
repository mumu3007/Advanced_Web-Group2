const express = require('express');
const Ordercoffee = require('../models/OrderCoffee');
const Coffeemenu = require('../models/CoffeeMenu');
const mongoose = require('mongoose');
const router = express.Router();

//get by id 
router.get('/:id', async (req, res, next) => {
    try {
      const id = String(req.params.id)
      const orderID = new mongoose.Types.ObjectId(id)
  
      const order = await Ordercoffee.aggregate([
        {
          $match: {
            _id: orderID
          }
        },
        {
          $lookup: {
            from: "coffeemenus",   //collection name
            localField: "coffee_id",       // ตัวแปรที่จะต้องเก็บเป็น Fk
            foreignField: "_id",      // idที่เอามาจากตารางfk
            as: "CoffeeMenuDetails"
          }
        }
      ]);
  
      res.json(order);
    } catch (err) {
      next(err);
    }
  });
  

router.post('/order', async (req, res, next) => {
    try {
      const { size, description, totel, sweetness_Level, Type_order, coffee_id } = req.body;
  
      const coffeeMenu = await Coffeemenu.findById(coffee_id);
  
      if (!coffeeMenu) {
        return res.status(404).json({ message: "coffeeMenu type not found" });
      }
      
      //Create a new order document
      const newOrdercoffee = new Ordercoffee({
        size,
        description,
        totel,
        sweetness_Level,
        Type_order,
        coffee_id: coffeeMenu._id // เชื่อมโยง coffeeMenu
      });
  
      // Save the new order to the database
      const savedOrdercoffee = await newOrdercoffee.save();
  
      res.status(201).json(savedOrdercoffee);
    } catch (err) {
      next(err);
    }
  });
  

module.exports = router;
