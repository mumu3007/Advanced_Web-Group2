const express = require('express');
const Ordercake = require('../models/OrderCake');
const CakeMenu = require('../models/CakeMenu');
const mongoose = require('mongoose');
const router = express.Router();

//get by id 
router.get('/:id', async (req, res, next) => {
    try {
        const id = String(req.params.id)
        const orderCakeID = new mongoose.Types.ObjectId(id)

        const order = await Ordercake.aggregate([
            {
                $match: {
                    _id: orderCakeID
                }
            },
            {
                $lookup: {
                    from: "cakemenus",   //collection name
                    localField: "cake_id",       // ตัวแปรที่จะต้องเก็บเป็น Fk
                    foreignField: "_id",      // idที่เอามาจากตารางfk
                    as: "CakeMenuDetails"
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
        const {  total_price, quantity, cake_id } = req.body;

        const cakeMenu = await CakeMenu.findById(cake_id);

        if (!cakeMenu) {
            return res.status(404).json({ message: "CakeMenu type not found" });
        }

        //Create a new order document
        const newOrdercake = new Ordercake({
            total_price,
            quantity,
            cake_id: cakeMenu._id // เชื่อมโยง coffeeMenu
        });

        // Save the new order to the database
        const savedOrdercake = await newOrdercake.save();

        res.status(201).json(savedOrdercake);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
