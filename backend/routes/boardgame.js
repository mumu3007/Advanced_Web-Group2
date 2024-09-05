const express = require('express');
const Menu = require('../models/Menu')

module.exports = (client) => {
  const router = express.Router();

  const database = client.db('cafeboardgame');

  router.get('/boardgame', async (req, res) => {
    try {
      const items = await database.collection('Boardgame').find({}).toArray();
      res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching menu:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.get('/boardgame/:gameName', async (req, res) => {
    try {
      const gameName = req.params.gameName;
      const items = await database.collection('Boardgame').find({ name: gameName }).toArray();
      res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching boardgame:", error);
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

  router.patch('/boardgame', async (req, res) => {
    const newData = req.body;
    console.log('Received data:', newData); // ตรวจสอบข้อมูลที่ได้รับ
    try {
      // ใช้ insertOne เพื่อเพิ่มข้อมูลเดียว
      const result = await database.collection('Boardgame').updateOne(
        { name: newData.name },
        {
          $set: { 'description': newData.description, 'quantity': newData.quantity },
          $currentDate: { lastModified: true }
        }
      );
      console.log('Update result:', result); // ตรวจสอบผลลัพธ์การ insert
      res.status(201).json(result);
    } catch (error) {
      console.error("Error updating boardgame item:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  router.delete('/boardgame/:gameName', async (req, res) => {
    try {
      const gameName = req.params.gameName;
      const gameItems = await database.collection('Boardgame').deleteOne({ name: gameName });
      res.status(200).json(gameItems);
    } catch (error) {
      console.error("Error delete game:", error);
      res.status(500).send("Internal Server Error");
    }
  });




  return router;
};
