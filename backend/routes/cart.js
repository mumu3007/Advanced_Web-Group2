const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Ordercoffee = require('../models/OrderCoffee');
const Ordercake = require('../models/OrderCake');
const Cakemenu = require('../models/CakeMenu');
const Cart = require('../models/Cart');
const Boardgame = require('../models/Boardgame')
const router = express.Router();


router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user_id: req.params.userId ,status: false})
      .populate({
        path: 'ordercoffee_id',
        populate: {
          path: 'coffee_id', // Populate coffee_id from ordercoffee_id
          select: 'name' // เลือกเฉพาะฟิลด์ที่คุณต้องการจาก coffee_id เช่น name และ price
        }
      })
      .populate({
        path: 'ordercake_id',
        populate: {
          path: 'cake_id', // Populate coffee_id from ordercoffee_id
          select: 'name description' // เลือกเฉพาะฟิลด์ที่คุณต้องการจาก coffee_id เช่น name และ price
        }
      })
      .populate({
        path: 'boardgame_id',
        select: 'name description price photo',
        populate: { path: 'type', select: 'name' }  // เลือกเฉพาะฟิลด์ที่ต้องการดึงมา รวมถึงฟิลด์ image_url
      });


    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    
    // ฟังก์ชันนับ ID ที่ซ้ำ
    const countDuplicateIds = (idArray) => {
      return idArray.reduce((acc, id) => {
        if (id) {  // ตรวจสอบว่า id ไม่เป็นค่าว่าง
          acc[id] = (acc[id] || 0) + 1;
        }
        return acc;
      }, {});
    };

    // นับจำนวนซ้ำในแต่ละประเภท
    const ordercoffeeCount = countDuplicateIds(cart.ordercoffee_id.map(item => item._id.toString()));
    const ordercakeCount = countDuplicateIds(cart.ordercake_id.map(item => item._id.toString()));
    const boardgameCount = countDuplicateIds(cart.boardgame_id.map(item => item._id.toString()));

    // ส่ง cart พร้อมจำนวน ID ที่ซ้ำ
    res.status(200).json({
      cart,
      counts: {
        ordercoffee: ordercoffeeCount,
        ordercake: ordercakeCount,
        boardgame: boardgameCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/add', async (req, res, next) => {
  try {
    const { user_id, ordercoffee_id, ordercake_id, boardgame_id ,boardgame_quantity} = req.body;
    const total_price = 0
    // Validate the IDs
    if (!user_id || !Array.isArray(ordercoffee_id) || !Array.isArray(ordercake_id) || !Array.isArray(boardgame_id)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // if (boardgame_id.length !== boardgame_quantity.length) {
    //   return res.status(400).json({ message: "Boardgame ID and quantity arrays must have the same length" });
    // }

    const countDuplicateIds = (idArray) => {
      return idArray.reduce((acc, id) => {
        if (id) {  // ตรวจสอบว่า id ไม่เป็นค่าว่าง
          acc[id] = (acc[id] || 0) + 1;
        }
        return acc;
      }, {});
    };
    const ordercoffeeCount = countDuplicateIds(ordercoffee_id);
const ordercakeCount = countDuplicateIds(ordercake_id);

     // Calculate the total quantities for boardgames
     const boardgameCount = boardgame_id.reduce((acc, id, index) => {
      const quantity = boardgame_quantity[index];
      if (id && quantity > 0) {
        acc[id] = (acc[id] || 0) + quantity;
      }
      return acc;
    }, {});

    console.log("Ordercoffee Count:", ordercoffeeCount);
    console.log("OrderCake Count:", ordercakeCount);
    console.log("Boardgame Count:", boardgameCount);

    const [ordercoffees, ordercakes, boardgames] = await Promise.all([
      Ordercoffee.find({ '_id': { $in: Object.keys(ordercoffeeCount) } }),
      Ordercake.find({ '_id': { $in: Object.keys(ordercakeCount) } }),
      Boardgame.find({ '_id': { $in: Object.keys(boardgameCount) } })
    ]);

    const ordercoffeeTotal = ordercoffees.reduce((sum, item) => sum + (item.total_price * ordercoffeeCount[item._id]), 0);
    const ordercakeTotal = ordercakes.reduce((sum, item) => sum + (item.total_price * ordercakeCount[item._id]), 0);
  const boardgameTotal = boardgames.reduce((sum, item) => sum + (item.price * boardgameCount[item._id]), 0);

    const totalPriceToAdd = ordercoffeeTotal + ordercakeTotal + boardgameTotal;

    // Find or create a cart for the user
    let cart = await Cart.findOne({ user_id, status: false });
    if (!cart) {
      cart = new Cart({
        user_id,
        ordercoffee_id: [],
        ordercake_id: [],
        boardgame_id: [],
        total_price: total_price,
      });
    }
    // Update cart with new items
    if (ordercoffee_id.length > 0) {
      cart.ordercoffee_id.push(...ordercoffee_id)
    }
    if (ordercake_id.length > 0) {
      cart.ordercake_id.push(...ordercake_id);
    }
    if (boardgame_id.length > 0) {
      boardgame_id.forEach((id, index) => {
        const quantity = boardgame_quantity[index];
        for (let i = 0; i < quantity; i++) {
          cart.boardgame_id.push(id);
        }
      });
    }
    const finalOrdercoffeeCount = countDuplicateIds(cart.ordercoffee_id);
    const finalOrdercakeCount = countDuplicateIds(cart.ordercake_id);
    const finalBoardgameCount = countDuplicateIds(cart.boardgame_id);

    console.log("Final Ordercoffee Count:", finalOrdercoffeeCount);
    console.log("Final Ordercake Count:", finalOrdercakeCount);
    console.log("Final Boardgame Count:", finalBoardgameCount);

    cart.total_price += totalPriceToAdd;

    const updatedCart = await cart.save();

    res.status(200).json({
      cart: updatedCart,
      counts: {
        ordercoffee: finalOrdercoffeeCount,
        ordercake: finalOrdercakeCount,
        boardgame: finalBoardgameCount
    }});
  } catch (err) {
    next(err);
  }
});

router.delete('/ordercoffee/:orderCoffeeId', async (req, res, next) => {
  try {
    const { orderCoffeeId } = req.params;

    const deletedOrders = await Ordercoffee.find({ _id: orderCoffeeId });

    if (!deletedOrders.length) {
      return res.status(404).json({ message: 'No OrderCakes found' });
    }

    const totalPriceToDeduct = deletedOrders.reduce((sum, order) => sum + order.total_price, 0);

    await Ordercoffee.deleteOne({ _id: orderCoffeeId });

    const orderCoffeeIds = deletedOrders.map(order => order._id);

    let cart = await Cart.findOneAndUpdate(
      { ordercoffee_id: { $in: orderCoffeeIds } },
      { $pull: { ordercoffee_id: { $in: orderCoffeeIds } } },
      { new: true }  // ให้คืนค่าตะกร้าหลังจากที่อัปเดตเสร็จแล้ว
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.total_price -= totalPriceToDeduct;

    await cart.save();

    res.status(200).send({ message: 'Order coffee deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.delete('/ordercake/:userId/:cakeId/', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const cakeId = req.params.cakeId;

    const deletedOrders = await Ordercake.find({ user_id: userId, cake_id: cakeId });

    if (!deletedOrders.length) {
      return res.status(404).json({ message: 'No OrderCakes found' });
    }

    const totalPriceToDeduct = deletedOrders.reduce((sum, order) => sum + order.total_price, 0);

    await Ordercake.deleteMany({ user_id: userId, cake_id: cakeId });

    const orderCakeIds = deletedOrders.map(order => order._id);

    let cart = await Cart.findOneAndUpdate(
      { user_id: userId, status: false, ordercake_id: { $in: orderCakeIds } },
      { $pull: { ordercake_id: { $in: orderCakeIds } } },
      { new: true }  // ให้คืนค่าตะกร้าหลังจากที่อัปเดตเสร็จแล้ว
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.total_price -= totalPriceToDeduct;

    await cart.save();

    res.json({
      message: 'All OrderCakes deleted, total price updated, and Cart updated successfully',
      cart
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/boardgame/:userId/:boardgameId', async (req, res, next) => {
  try {
    const  boardgameId  = req.params.boardgameId;
    const  userId  = req.params.userId;

    const deletedOrders = await Boardgame.find({ _id: boardgameId });
    const deletedCart = await Cart.findOne({ user_id: userId, status: false });

    
    // ถ้าไม่พบ ordercake ที่ตรงกัน
    if (!deletedOrders.length) {
      return res.status(404).json({ message: 'No Boardgame found' });
    }

    if (!deletedCart) {
      return res.status(404).json({ message: 'No deleteCart found' });
    }

    const totalPriceToDeduct = deletedOrders.reduce((sum, order) => sum + order.price, 0) ;
    const boardgameIds = deletedOrders.map(order => order._id);

    let cart = await Cart.findOneAndUpdate(
      { user_id: userId, status: false, boardgame_id: { $in: boardgameIds } },
      { $pull: { boardgame_id: { $in: boardgameIds } } },
      { new: true }  // ให้คืนค่าตะกร้าหลังจากที่อัปเดตเสร็จแล้ว
    );


    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }


    // นับจำนวน boardgame_id[] ที่ตรงกับ boardgameId
    const matchingBoardgamesCount = deletedCart.boardgame_id.filter(id => id.toString() === boardgameId).length;

    // หักลบราคาที่ถูกลบออกจาก total_price ใน cart
    // cart.total_price -= totalPriceToDeduct *  matchingBoardgamesCount;
    cart.total_price -= totalPriceToDeduct * matchingBoardgamesCount;

    // บันทึก cart ที่อัปเดตแล้ว
    await cart.save();

    res.status(200).send({
      message: 'BoardgameOrder deleted successfully',
      cart,   // จำนวน boardgame_id ทั้งหมดใน cart
      matchingBoardgamesCount,
      deletedCart // จำนวน boardgame_id ที่ตรงกับ boardgameId
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// router.delete('/ordercake/:userId/:cakeId/', async (req, res, next) => {
//   try {
//     const userId  = req.params.userId;
//     const cakeName = req.params.cakeName;
//     const deletedOrder = await Ordercake.deleteMany({ user_id: userId, cake_id: cakeId });
//     if (!deletedOrder) {
//       return res.status(404).json({ message: 'orderCakeId not found' });
//     }

//     await Cart.updateMany(
//       { 'ordercake_id': orderCakeId },
//       { $pull: { ordercake_id: orderCakeId } }
//     );
    
//     res.json({ message: 'orderCakeId deleted successfully' });
//   } catch (err) {
//     next(err);
//   }
// });

// router.post('/cart', async (req, res, next) => {
//   try {
//     const { total_price, user_id, ordercoffee_id, cake_id, boardgame_id } = req.body;

//     // Validate user
//     const user = await User.findById(user_id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Retrieve documents by arrays of IDs
//     const [orders, cakes, boardgames] = await Promise.all([
//       Ordercoffee.find({ _id: { $in: ordercoffee_id } }),
//       Cakemenu.find({ _id: { $in: cake_id } }),
//       Boardgame.find({ _id: { $in: boardgame_id } })
//     ]);

//     // Check if all IDs were valid
//     if (orders.length !== ordercoffee_id.length) {
//       return res.status(404).json({ message: "One or more order IDs not found" });
//     }
//     if (cakes.length !== cake_id.length) {
//       return res.status(404).json({ message: "One or more cake IDs not found" });
//     }
//     if (boardgames.length !== boardgame_id.length) {
//       return res.status(404).json({ message: "One or more boardgame IDs not found" });
//     }

//     // Create and save the new cart
//     const newCart = new Cart({
//       total_price,
//       user_id: user._id,
//       ordercoffee_id, // Array of Ordercoffee IDs
//       cake_id,        // Array of Cake IDs
//       boardgame_id    // Array of Boardgame IDs
//     });

//     const savedCart = await newCart.save();

//     res.status(201).json(savedCart);
//   } catch (err) {
//     next(err);
//   }
// });

//--------------------------------------- ความหวังสุดท้ายของไกด์-----------------------------------------------
// router.delete('/:userId/cart/:itemType/:itemId', async (req, res, next) => {
//   try {
//     const { userId, itemType, itemId } = req.params;

//     // หา cart ของ user ที่ต้องการ
//     let cart = await Cart.findOne({ user_id: userId, status: false });
//     if (!cart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }

//     // ลบรายการในตะกร้าตาม itemType
//     switch (itemType) {
//       case 'ordercoffee':
//         await Cart.updateOne(
//           { user_id: userId, status: false },
//           { $pull: { ordercoffee_id: itemId } }
//         );
//         await Ordercoffee.deleteOne({ _id: itemId });
//         break;

//       case 'ordercake':
//         await Cart.updateOne(
//           { user_id: userId, status: false },
//           { $pull: { ordercake_id: itemId } }
//         );
//         await Ordercake.deleteOne({ _id: itemId });
//         break;

//       case 'boardgame':
//         await Cart.updateOne(
//           { user_id: userId, status: false },
//           { $pull: { boardgame_id: itemId } }
//         );
//         // Boardgame ไม่ถูกลบออกจาก collection แต่จะถูกลบจากตะกร้าเท่านั้น
//         break;

//       default:
//         return res.status(400).json({ message: 'Invalid item type' });
//     }

//     // ตรวจสอบว่าตะกร้ามีรายการเหลืออยู่หรือไม่
//     cart = await Cart.findOne({ user_id: userId, status: false });
//     if (!cart.ordercoffee_id.length && !cart.ordercake_id.length && !cart.boardgame_id.length) {
//       // ถ้าตะกร้าไม่มีสินค้าเลย ก็ลบตะกร้านี้ออก
//       await Cart.deleteOne({ user_id: userId, status: false });
//       return res.status(200).json({ message: 'Cart deleted as it is empty now' });
//     }

//     res.status(200).json({ message: 'Item removed from cart successfully', cart });
//   } catch (err) {
//     next(err);
//   }
// });

router.delete('/:userId/cart/ordercake/:cakeId', async (req, res, next) => {
  try {
    const { userId, cakeId } = req.params;

    // หา cart ของ user ที่ต้องการ
    let cart = await Cart.findOne({ user_id: userId, status: false });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // ค้นหา ordercakes ทั้งหมดที่มี cake_id ตรงกันใน cart
    const orderCakesToDelete = await Ordercake.find({ _id: { $in: cart.ordercake_id }, cake_id: cakeId });
    if (!orderCakesToDelete.length) {
      return res.status(404).json({ message: 'No matching orderCakes found in the cart' });
    }

    // ลบ ordercakes ทั้งหมดที่มี cake_id ตรงกัน
    const orderCakeIdsToDelete = orderCakesToDelete.map(order => order._id);
    await Ordercake.deleteMany({ _id: { $in: orderCakeIdsToDelete } });

    // ลบ cake_ids จาก cart
    await Cart.updateOne(
      { user_id: userId, status: false },
      { $pull: { ordercake_id: { $in: orderCakeIdsToDelete } } }
    );

    // ตรวจสอบว่าตะกร้ามีรายการเหลืออยู่หรือไม่
    cart = await Cart.findOne({ user_id: userId, status: false });
    if (!cart.ordercoffee_id.length && !cart.ordercake_id.length && !cart.boardgame_id.length) {
      // ถ้าตะกร้าไม่มีสินค้าเลย ก็ลบตะกร้านี้ออก
      await Cart.deleteOne({ user_id: userId, status: false });
      return res.status(200).json({ message: 'Cart deleted as it is empty now' });
    }

    res.status(200).json({ message: 'All matching cakes removed from cart successfully', cart });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
