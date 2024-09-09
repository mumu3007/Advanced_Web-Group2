const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const routes = require('./routes');



dotenv.config();
const mongoURI = process.env.MONGO_URI;

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/', routes)


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
