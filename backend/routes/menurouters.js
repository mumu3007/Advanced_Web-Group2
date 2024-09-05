const express = require('express');
const Menu = require('../models/Menu')

module.exports = (client) => {
  const router = express.Router();
  const database = client.db('cafeboardgame');

  router.get('/menu', async (req, res) => {
    try {
      const menuItems = await database.collection('CoffeeMenu').find({}).toArray();
      res.status(200).json(menuItems);
    } catch (error) {
      console.error("Error fetching menu:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get('/menu/:menuName', async (req, res) => {
    try {
      const menuName = req.params.menuName;
      const menuItems = await database.collection('CoffeeMenu').find({ name: menuName }).toArray();
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
      // ใช้ insertOne เพื่อเพิ่มข้อมูลเดียว
      const result = await database.collection('CoffeeMenu').insertMany(newMenuItem);
      console.log('Insert result:', result); // ตรวจสอบผลลัพธ์การ insert
      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding menu item:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.patch('/menu', async (req, res) => {
    const newData = req.body;
    console.log('Received data:', newData); // ตรวจสอบข้อมูลที่ได้รับ
    try {
      // ใช้ insertOne เพื่อเพิ่มข้อมูลเดียว
      const result = await database.collection('CoffeeMenu').updateOne(
        { name: newData.name },
        {
          $set: { 'price': newData.price },
          $currentDate: { lastModified: true }
        }
      );
      console.log('Update result:', result); // ตรวจสอบผลลัพธ์การ insert
      res.status(201).json(result);
    } catch (error) {
      console.error("Error updating menu item:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.delete('/menu/:menuName', async (req, res) => {
    try {
      const menuName = req.params.menuName;
      const menuItems = await database.collection('CoffeeMenu').deleteOne({ name: menuName });
      res.status(200).json(menuItems);
    } catch (error) {
      console.error("Error delete menu:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  return router;
};
