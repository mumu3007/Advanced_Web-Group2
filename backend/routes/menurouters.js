const express = require('express');
const Coffeemenu = require('../models/CoffeeMenu'); // Ensure the correct path to the model
const CakeMenu = require('../models/CakeMenu');
const router = express.Router();
const multer = require("multer");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');


//--------------------------------- upload image -----------------------------------------------------------

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


//--------------------------------- Get all coffee menus -----------------------------------------------

router.get('/coffeemenu', async (req, res, next) => {
  try {
    const coffeemenus = await Coffeemenu.find().sort({ create_at: -1 });

    // เพิ่ม URL ของรูปภาพให้แต่ละ payment
    const coffemenusWithPhotoUrl = coffeemenus.map(coffeemenu => {
      const photoUrl = `${req.protocol}://${req.get('host')}/${coffeemenu.photo.filePath}`;
      return {
        ...coffeemenu._doc,
        photoUrl,  // เพิ่ม URL ของรูปภาพเข้าไปในผลลัพธ์
      };
    });
    res.json(coffemenusWithPhotoUrl);
  } catch (err) {
    next(err);
  }
});

//--------------------------------- Get Recommended menus ------------------------------------------------

router.get('/recommended_coffee', async (req, res, next) => {
  try {
    const coffeemenus = await Coffeemenu.find({ status: "recommended" });
    const coffemenusWithPhotoUrl = coffeemenus.map(coffeemenu => {
      const photoUrl = `${req.protocol}://${req.get('host')}/${coffeemenu.photo.filePath}`;
      return {
        ...coffeemenu._doc,
        photoUrl,
      };
    });
    res.json(coffemenusWithPhotoUrl);
  } catch (err) {
    next(err);
  }
});

//--------------------------------- Get a coffee menu by ID ----------------------------------------------

router.get('/coffeemenu/:id', async (req, res, next) => {
  try {
    const coffeemenu = await Coffeemenu.findById(req.params.id);
    if (!coffeemenu) {
      return res.status(404).json({ message: 'Coffee menu not found' });
    }
    res.json(coffeemenu);
  } catch (err) {
    next(err);
  }
});

//--------------------------------- Create a new coffee menu (POST) ---------------------------------------

router.post('/coffeemenu', upload.single("photo"), async (req, res, next) => {
  try {
    const { name, s_price, m_price, l_price, type_coffee, status } = req.body;
    const parsedType_coffee = JSON.parse(type_coffee);

    const newCoffeeMenu = new Coffeemenu({
      name,
      s_price,
      m_price,
      l_price,
      photo: {
        filename: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      },
      type_coffee: parsedType_coffee,
      status
    });
   
    const savedCoffeeMenu = await newCoffeeMenu.save();

    res.status(201).json(savedCoffeeMenu);
  } catch (err) {
    next(err);
  }
});

//------------------ ยังทำงานไม่ได้ ติดหาด้วยไอดีเพราะว่า ใน database เป็น objecId แต่รับมาเป็นตัวเลขธรรม --------------------

router.put('/coffeemenu/:id', async (req, res, next) => {
  try {
    const { name, s_price, m_price, l_price, photo, type_coffee, status } = req.body;


    // Convert the ID to ObjectId
    const objectId = new mongoose.ObjectId(req.params.id);

    // Find the menu by ID and update it with the provided data
    const updatedCoffeeMenu = await Coffeemenu.findByIdAndUpdate(
      objectId,
      { name, s_price, m_price, l_price, photo, type_coffee, status },
      { new: true, runValidators: true } // Ensure it returns the updated document and applies validation
    );

    // Check if the coffee menu exists
    if (!updatedCoffeeMenu) {
      return res.status(404).json({ message: 'Coffee menu not found' });
    }

    // Respond with the updated menu
    res.json(updatedCoffeeMenu);
  } catch (err) {
    // Pass any errors to the error handler
    next(err);
  }
});

//------------------------ Update Coffee Menu ---------------------------------------------------------

router.patch('/coffeemenu/:id', upload.single("photo"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name, s_price, m_price, l_price, type_coffee, status } = req.body;

    // แปลง type_coffee เป็น array
    let parsedType_coffee;
    parsedType_coffee = JSON.parse(type_coffee);

    // สร้าง object สำหรับการอัปเดต
    const updatedCoffeeMenu = {
      name,
      s_price,
      m_price,
      l_price,
      type_coffee: parsedType_coffee, 
      status,
    };
    
     // ค้นหาข้อมูลของเมนูกาแฟเดิม
     const existingCoffeeMenu= await Coffeemenu.findById(id);
     console.log(existingCoffeeMenu.photo)

    // ถ้ามีรูปภาพใหม่ถูกอัปโหลด ให้ทำการอัปเดตรูปภาพ
    if (req.file) {
      console.log('File uploaded:', req.file);
      updatedCoffeeMenu.photo = {
        filename: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      };
      if (existingCoffeeMenu.photo && existingCoffeeMenu.photo.filePath) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(existingCoffeeMenu.photo.filePath));
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
    const result = await Coffeemenu.findByIdAndUpdate({_id: id}, updatedCoffeeMenu, { new: true });

    // ส่งข้อมูลที่อัปเดตกลับ
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

//------------------------- Delete coffee menu by ID ------------------------------------------

router.delete('/coffeemenu/:id', async (req, res, next) => {
  try {
    const deletedCoffeeMenu = await Coffeemenu.findByIdAndDelete(req.params.id);
    
    if (!deletedCoffeeMenu) {
      return res.status(404).json({ message: 'ไม่พบเมนูกาแฟ' });
    }

    // ตรวจสอบว่ามีฟิลด์ photo อยู่หรือไม่ และลบไฟล์ที่เชื่อมโยง
    if (deletedCoffeeMenu.photo && deletedCoffeeMenu.photo.filePath) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(deletedCoffeeMenu.photo.filePath));
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('เกิดข้อผิดพลาดในการลบรูปภาพ:', err);
        }
      });
    }
    res.json({ message: 'ลบเมนูกาแฟสำเร็จ' });
  } catch (err) {
    next(err);
  }
});




//--------------------------------- Get all cake menus -----------------------------------------------

router.get('/cakemenu', async (req, res, next) => {
  try {
    const cakemenus = await CakeMenu.find().sort({ create_at: -1 });;

    // เพิ่ม URL ของรูปภาพให้แต่ละ payment
    const cakemenusWithPhotoUrl = cakemenus.map(cakemenu => {
      const photoUrl = `${req.protocol}://${req.get('host')}/${cakemenu.photo.filePath}`;
      return {
        ...cakemenu._doc,
        photoUrl,  // เพิ่ม URL ของรูปภาพเข้าไปในผลลัพธ์
      };
    });

    res.json(cakemenusWithPhotoUrl);
  } catch (err) {
    next(err);
  }
});

//--------------------------------- Get all cake menus by ID  -----------------------------------------------

router.get('/cakemenu/:id', async (req, res, next) => {
  try {
    const cakemenu = await CakeMenu.findById(req.params.id);
    if (!cakemenu) {
      return res.status(404).json({ message: 'cakemenu not found' });
    }
    const photoUrl = `${req.protocol}://${req.get('host')}/${cakemenu.photo.filePath}`;
    const cakemenuWithPhotoUrl = {
      ...cakemenu._doc,
      photoUrl,  
    };

    res.json(cakemenuWithPhotoUrl);
  } catch (err) {
    next(err);
  }
});

//--------------------------------- Create a new cake menu (POST) ---------------------------------------

router.post('/cakemenu', upload.single("photo"), async (req, res, next) => {
  try {
    const { name, price, description } = req.body;

    const newCakeMenu = new CakeMenu({
      name,
      price,
      description,
      photo: {
        filename: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      },
    });

    const savedCakeMenu = await newCakeMenu.save();

    res.status(201).json(savedCakeMenu);
  } catch (err) {
    next(err);
  }
});

//------------------------ Update cake Menu ---------------------------------------------------------

router.patch('/cakemenu/:id', upload.single("photo"), async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedCakeMenu = req.body;

     // ค้นหาเมนูเค้กอันเดิม
     const existingCakemenu = await CakeMenu.findById(id);
     console.log(existingCakemenu.photo)

    // ถ้ามีรูปภาพใหม่ถูกอัปโหลด ให้ทำการอัปเดตรูปภาพ
    if (req.file) {
      console.log('File uploaded:', req.file);
      updatedCakeMenu.photo = {
        filename: req.file.filename,
        filePath: req.file.path,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
      };
      if (existingCakemenu.photo && existingCakemenu.photo.filePath) {
        const oldImagePath = path.join(__dirname, '..', 'uploads', path.basename(existingCakemenu.photo.filePath));
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
    const result = await CakeMenu.findByIdAndUpdate({_id: id}, updatedCakeMenu, { new: true });

    // ส่งข้อมูลที่อัปเดตกลับ
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

//------------------------- Delete cake menu by ID ------------------------------------------

router.delete('/cakemenu/:id', async (req, res, next) => {
  try {
    const deletedcakemenu = await CakeMenu.findByIdAndDelete(req.params.id);
    
    if (!deletedcakemenu) {
      return res.status(404).json({ message: 'ไม่พบเมนูเค้ก' });
    }

    // ตรวจสอบว่ามีฟิลด์ photo อยู่หรือไม่ และลบไฟล์ที่เชื่อมโยง
    if (deletedcakemenu.photo && deletedcakemenu.photo.filePath) {
      const imagePath = path.join(__dirname, '..', 'uploads', path.basename(deletedcakemenu.photo.filePath));
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('เกิดข้อผิดพลาดในการลบรูปภาพ:', err);
        }
      });
    }
    res.json({ message: 'ลบเมนูเค้กสำเร็จ' });
  } catch (err) {
    next(err);
  }
});

//----------------------------------------------------------------------------------------------------------------------------

function numberToHexString(num) {
  let hex = num.toString(16);
  while (hex.length < 24) {
    hex = '0' + hex;
  }
  return hex;
}


module.exports = router;
