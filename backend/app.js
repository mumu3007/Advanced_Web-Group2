const dotenv = require("dotenv");
const fs = require("fs");

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const authRoutes = require('./routes/auth');
const boardgameRoutes = require("./routes/boardgame");
const menuRoutes = require("./routes/menurouters");


dotenv.config();
const mongoURI = process.env.MONGO_URI;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

const PORT = 3000;

app.listen(PORT, async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Successfully connected to MongoDB");
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
});
