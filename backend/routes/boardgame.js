const express = require('express');
// Ensure the correct path to the model
const Boardgame = require('../models/Boardgame');
const Boardgametype = require('../models/BoardgameType');
const mongoose = require('mongoose');
const router = express.Router();

//get all games
router.get('/all', async (req, res, next) => {
  try {
    const Boardgames = await Boardgame.find();
    res.json(Boardgames);
  } catch (err) {
    next(err);
  }
});

//get by id game
router.get('/:id', async (req, res, next) => {
  try {
    const id = String(req.params.id)
    const boardgameID = new mongoose.Types.ObjectId(id)

    const boardgame = await Boardgame.aggregate([
      {
        $match: {
          _id: boardgameID
        }
      },
      {
        $lookup: {
          from: "boardgametypes",   //collection name
          localField: "type",       // ตัวแปรที่จะต้องเก็บเป็น Fk
          foreignField: "_id",      // idที่เอามาจากตารางfk
          as: "BoardgameTypeDetails"
        }
      }
    ]);

    res.json(boardgame);
  } catch (err) {
    next(err);
  }
});

//create boardgame มี boardGameType._id มาด้วย
router.post('/boardgame', async (req, res, next) => {
  try {
    const { name, price, description, quantity, photo, type } = req.body;

    const boardGameType = await Boardgametype.findById(type);

    //ถ้าไม่พบ Boardgametype ให้ส่งข้อผิดพลาดกลับ
    if (!boardGameType) {
      return res.status(404).json({ message: "Boardgame type not found" });
    }
    
    //Create a new boardgame document
    const newBoardgame = new Boardgame({
      name,
      description,
      quantity,
      price,
      photo,
      type: boardGameType._id // เชื่อมโยง Boardgametype
    });

    // Save the new boardgame to the database
    const savedBoardgame = await newBoardgame.save();

    res.status(201).json(savedBoardgame);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try{
    const id = req.params.id
    const updatedBoardgame = req.body;
    await Boardgame.findByIdAndUpdate({_id:id} ,updatedBoardgame, {new: true})
    .then((updatedBoardgame) =>{
      res.status(200).json(updatedBoardgame)
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
  } catch (err) {
    next(err);
  }
})


module.exports = router;
