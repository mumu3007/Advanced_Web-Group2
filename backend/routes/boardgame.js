const express = require('express');
const Menu = require('../models/Menu')

module.exports = (client) => {
  const router = express.Router();
  
  const database = client.db('cafeboardgame');
  
  router.get('/boardgame', async (req, res) => {
    try {
      const menuItems = await database.collection('Boardgame').find({}).toArray();
      res.status(200).json(menuItems);
    } catch (error) {
      console.error("Error fetching menu:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post('/boardgame', async (req, res) => {
  const item = req.body; // คาดว่ามีข้อมูลเป็น object
  
  console.log('Received data:', item); // ตรวจสอบข้อมูลที่ได้รับ

  try {
    
    // ใช้ insertOne เพื่อเพิ่มข้อมูลเดียว
    const result = await database.collection('Boardgame').insertOne(item);
    console.log('Insert result:', result); // ตรวจสอบผลลัพธ์การ insert
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).send("Internal Server Error");
  }
});


  return router; 
};
