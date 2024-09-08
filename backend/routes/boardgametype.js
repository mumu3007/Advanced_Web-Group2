const express = require('express');
const Boardgametype = require('../models/BoardgameType');

const router = express.Router();

//get all boardgametype
router.get('/all', async (req, res, next) => {
    try {
      const boardgametype = await Boardgametype.find();
      res.json(boardgametype);
    } catch (err) {
      next(err);
    }
});

// Get a boardgametype menu by ID
router.get('/:id', async (req, res, next) => {
    try {
      const boardgametype = await Boardgametype.findById(req.params.id);
      if (!boardgametype) {
        return res.status(404).json({ message: 'Boardgametype not found' });
      }
      res.json(boardgametype);
    } catch (err) {
      next(err);
    }
  });

module.exports = router;
  