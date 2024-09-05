const express = require('express');
const Menu = require('../models/Menu')

module.exports = (client) => {
  const router = express.Router();
  
  const database = client.db('cafeboardgame');
  
  router.get('/menu', async (req, res) => {
    try {
      const menuItems = await database.collection('Menu').find({}).toArray();
      res.status(200).json(menuItems);
    } catch (error) {
      console.error("Error fetching menu:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.post('/menu', async (req, res) => {
  const newMenuItem = req.body; // คาดว่ามีข้อมูลเป็น object
  
  console.log('Received data:', newMenuItem); // ตรวจสอบข้อมูลที่ได้รับ

  try {
    // ตรวจสอบว่าข้อมูลที่รับเข้ามาเป็น object
    if (Array.isArray(newMenuItem)) {
      throw new Error('Expected object but received array');
    }

    // ใช้ insertOne เพื่อเพิ่มข้อมูลเดียว
    const result = await database.collection('Menu').insertOne(newMenuItem);
    console.log('Insert result:', result); // ตรวจสอบผลลัพธ์การ insert
    res.status(201).json(result);
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).send("Internal Server Error");
  }
});


  return router; 
};
