const express = require('express');
const multer = require("multer");
// Ensure the correct path to the model
const Boardgame = require('../models/Boardgame');
const Boardgametype = require('../models/BoardgameType');
const mongoose = require('mongoose');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// -------------upload boardgame image----------------
const fileFilter = (req, file, cb) => {
  // ตรวจสอบประเภทของไฟล์
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);  // อนุญาตไฟล์
  } else {
    cb(new Error('Only .jpeg and .png files are allowed!'), false); // ปฏิเสธไฟล์
  }
}
// การกำหนดขนาดสูงสุด
const limits = {
  fileSize: 5 * 1024 * 1024  // ขนาดไฟล์สูงสุด 5 MB
};

const storage = multer.diskStorage({
destination: function (req, file, cb) {
  cb(null, "./uploads/");
},
filename: function (req, file, cb) {
  const fileName = `${Date.now()}-${file.originalname}`;
  cb(null, fileName);
},
});

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
});

//----------------------------------------------------------


//localhost/boardgame/inactive บอร์ดเกมที่ยังไม่พร้อม
router.get('/inactive', async (req, res, next) => {
  try {
    const Boardgames = await Boardgame.find({ status: false})
    .populate('type', 'name');

       // เพิ่ม URL ของรูปภาพให้แต่ละ payment
       const boardgamesWithPhotoUrl = Boardgames.map(boardgame => {
        const photoUrl = `${req.protocol}://${req.get('host')}/${boardgame.photo.filePath}`;
        return {
          ...boardgame._doc,
          photoUrl,  // เพิ่ม URL ของรูปภาพเข้าไปในผลลัพธ์
        };
      });
      res.json(boardgamesWithPhotoUrl);
  } catch (err) {
    next(err);  // Pass any errors to the error handler
  }
});
//get 3 games
router.get('/boardgame3', async (req, res, next) => {
  try {
    const { limit = 3 } = req.query;  // Get limit from query parameters
    const Boardgames = await Boardgame.find({ status: true })
      .sort({ created_at: 1 }) // Sort by 'created_at' in ascending order (1 for ascending, -1 for descending)
      .limit(Number(limit)) // Limit the number of results based on 'limit' parameter
      .populate('type', 'name');

    // Add URL for each boardgame's photo
    const boardgamesWithPhotoUrl = Boardgames.map(boardgame => {
      const photoUrl = `${req.protocol}://${req.get('host')}/${boardgame.photo.filePath}`;
      return {
        ...boardgame._doc,
        photoUrl,  // Add photo URL to the result
      };
    });

    res.json(boardgamesWithPhotoUrl);
  } catch (err) {
    next(err);
  }
});


// router.get('/all', async (req, res, next) => {
//   try {
//     const Boardgames = await Boardgame.find({ status: true})
//     .populate('type', 'name');
//     res.json(Boardgames);
//   } catch (err) {
//     next(err);
//   }
// });

router.get('/all', async (req, res, next) => {
  try {
    const Boardgames = await Boardgame.find({ status: true})
    .populate('type', 'name');

       // เพิ่ม URL ของรูปภาพให้แต่ละ payment
       const boardgamesWithPhotoUrl = Boardgames.map(boardgame => {
        const photoUrl = `${req.protocol}://${req.get('host')}/${boardgame.photo.filePath}`;
        return {
          ...boardgame._doc,
          photoUrl,  // เพิ่ม URL ของรูปภาพเข้าไปในผลลัพธ์
        };
      });
    res.json(boardgamesWithPhotoUrl);
  } catch (err) {
    next(err);
  }
});

//get by id game
router.get('/:id', async (req, res, next) => {
  try {
    const id = String(req.params.id);
    const boardgameID = new mongoose.Types.ObjectId(id);

    const boardgame = await Boardgame.aggregate([
      {
        $match: {
          _id: boardgameID
        }
      },
      {
        $lookup: {
          from: "boardgametypes",   // ชื่อคอลเลคชั่นที่ต้องเชื่อมโยง
          localField: "type",       // ฟิลด์ที่เป็น FK
          foreignField: "_id",      // id ที่เชื่อมโยงจาก collection boardgametypes
          as: "BoardgameTypeDetails"
        }
      }
    ]);

    // ตรวจสอบว่ามีผลลัพธ์หรือไม่
    if (boardgame.length === 0) {
      return res.status(404).json({ message: "Boardgame not found" });
    }

    // ดึง object ตัวแรกออกมา
    const boardgameDetails = boardgame[0];

    // เพิ่ม URL ของรูปภาพให้กับ boardgame
    const photoUrl = `${req.protocol}://${req.get('host')}/${boardgameDetails.photo.filePath}`;
    const boardgameWithPhotoUrl = {
      ...boardgameDetails,
      photoUrl // เพิ่ม URL ของรูปภาพเข้าไปในผลลัพธ์
    };

    // ส่ง object โดยไม่ต้องห่อด้วย array
    res.json(boardgameWithPhotoUrl);
  } catch (err) {
    next(err);
  }
});


//create boardgame มี boardGameType._id มาด้วย
router.post('/boardgame', upload.single("photo"), async (req, res, next) => {
  try {
    const { name, price, description, quantity,create_at, status, type } = req.body;

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
      photo:{
        filename: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      },
      create_at,
      status,
      type: boardGameType._id // เชื่อมโยง Boardgametype
    });

    // Save the new boardgame to the database
    const savedBoardgame = await newBoardgame.save();
    res.status(201).json(savedBoardgame);
  } catch (err) {
    next(err);
  }
});

// router.patch('/:id', async (req, res, next) => {
//   try{
//     const id = req.params.id
//     const updatedBoardgame = req.body;
//     await Boardgame.findByIdAndUpdate({_id:id} ,updatedBoardgame, {new: true})
//     .then((updatedBoardgame) =>{
//       res.status(200).json(updatedBoardgame)
//     })
//     .catch((error) => {
//       res.status(400).json({ error: error.message });
//     });
//   } catch (err) {
//     next(err);
//   }
// })

router.patch('/:id', upload.single("photo"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedBoardgame = req.body;

     // ค้นหาบอร์ดเกมเก่าก่อน
     const existingBoardgame = await Boardgame.findById(id);
     console.log(existingBoardgame.photo)

    // ถ้ามีรูปภาพใหม่ถูกอัปโหลด ให้ทำการอัปเดตรูปภาพ
    if (req.file) {
      console.log('File uploaded:', req.file);
      updatedBoardgame.photo = {
        filename: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      };
      if (existingBoardgame.photo && existingBoardgame.photo.filePath) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(existingBoardgame.photo.filePath));
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('เกิดข้อผิดพลาดในการลบรูปภาพเก่า:', err);
          } else {
            console.log('ลบรูปภาพเก่าเรียบร้อยแล้ว:', oldImagePath);
          }
        });
      }
    }

    // ใช้ findByIdAndUpdate เพื่ออัปเดตข้อมูล
    const result = await Boardgame.findByIdAndUpdate({_id: id}, updatedBoardgame, { new: true });

    // ส่งข้อมูลที่อัปเดตกลับ
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});



module.exports = router;
