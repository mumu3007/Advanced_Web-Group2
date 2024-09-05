const express = require('express');
// Ensure the correct path to the model
const boardgame = require('../models/Boardgame');
const router = express.Router();

router.get('/boardgame', async (req, res, next) => {
  try {
    const Boardgames = await boardgame.find();
    res.json(Boardgames);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
