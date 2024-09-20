import { Component, OnInit } from '@angular/core';
import { CartsService } from '../../services/carts/carts.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  userId?: string | null | undefined;
  showPopup: boolean = false;
  selectedPrice: number = 0;
  selectedCartId: string | null | undefined
  cartCoffeeDetails: any[] = [];
  cartCakeDetails: any[] = [];
  cartAllName: any[] = [];
  cakeItems: any[] = [];

  constructor(private cartsService: CartsService, private authService: AuthService) { }

  ngOnInit(): void {
    if (!this.userId) {
      this.authService.getUserId().subscribe((id) => {
        console.log('User ID:', id); // ตรวจสอบว่ามีค่า id ถูกส่งกลับมาหรือไม่
        if (id && !this.userId) {
          this.userId = id;
          this.loadUserData(this.userId);
          this.loadCart(this.userId); // เรียกฟังก์ชัน loadCart() ที่นี่
        } else {
          console.error('User ID not found');
        }
      });
    }
    
  }
  
  loadUserData(id: string) {
    console.log('User ID:', id);
  }

  loadCart(userId: string): void {
    this.cartsService.getCart(userId).subscribe(
      (cart) => {
        console.log(cart)

        this.cartCoffeeDetails = [];
        this.cartCakeDetails = [];
        this.cartAllName = [];
        this.selectedCartId = cart.cart._id;

        const boardgameItems = [
          ...cart.cart.boardgame_id
        ];

        cart.cart.ordercoffee_id.forEach((ordercoffee: any) => {
          
          const orderId = ordercoffee._id;
          const coffeeName = ordercoffee.coffee_id.name;
          const coffeeSize = ordercoffee.size
          const coffeeSweet = ordercoffee.sweetness_level
          const coffeeQuantity = ordercoffee.quantity || 0;
          const coffeeTotalPrice = ordercoffee.total_price;
          const coffeePhoto = `${this.cartsService.getBaseUrl()}/${ordercoffee.coffee_id.photo.filePath}`; // ใช้ service ที่สร้างขึ้น

          this.cartCoffeeDetails.push({
            _id: orderId,
            name: coffeeName,
            size: coffeeSize,
            sweetness_level: coffeeSweet,
            quantity: coffeeQuantity,
            total_price: coffeeTotalPrice,
            photo: coffeePhoto
          });

          this.cartAllName.push({
            _id: orderId,
            name: coffeeName,
            total_price: coffeeTotalPrice,
          });

          this.totalPrice += coffeeTotalPrice
        });


        const sameCakeItems: { [key: string]: any } = {}
        cart.cart.ordercake_id.forEach((ordercake: any) => {
          const cakeId = ordercake.cake_id._id;
          const cakeName = ordercake.cake_id.name;
          const cakeQuantity = ordercake.quantity || 0;
          const cakeTotalPrice = ordercake.total_price;
          const cakeDescription = ordercake.cake_id.description
          const cakePhotoUrl = `${this.cartsService.getBaseUrl()}/${ordercake.cake_id.photo.filePath}`; // สร้าง URL

          if (!sameCakeItems[cakeName]) {
            sameCakeItems[cakeName] = {
              ...ordercake,
              cake_id: cakeId,
              name: cakeName,
              description: cakeDescription,
              quantity: cakeQuantity, // เริ่มต้นด้วยจำนวน 1
              total_price: cakeTotalPrice, // เพิ่มประเภทสินค้า (ถ้ามี)
              photo: cakePhotoUrl
            };

          } else {
            sameCakeItems[cakeName].quantity += cakeQuantity;
            sameCakeItems[cakeName].total_price += cakeTotalPrice; // ถ้ามีสินค้าซ้ำ ให้เพิ่มจำนวน
          }

          const existingItemIndex = this.cartAllName.findIndex((item) => item._id === cakeId);

          if (existingItemIndex !== -1) {
            // ถ้ามีรายการอยู่แล้ว ให้ทำการอัปเดตราคา
            this.cartAllName[existingItemIndex].total_price += cakeTotalPrice;
          } else {
            // ถ้าไม่มีรายการนั้นใน cartAllName ให้ทำการเพิ่มใหม่
            this.cartAllName.push({
              _id: cakeId,
              name: cakeName,
              total_price: cakeTotalPrice,
            });
          }

          // this.totalPrice += cakeTotalPrice
        });

        const combinedItems: { [key: string]: any } = {};
        boardgameItems.forEach((item: any) => {
          const id = item._id.toString();

          if (!combinedItems[id]) {
            combinedItems[id] = {
              ...item,
              quantity: 1,
              type: item.type ? item.type.name : 'Unknown'
            };
          } else {
            combinedItems[id].quantity++;
          }
        });

        this.cartItems = Object.values(combinedItems);
        this.cakeItems = Object.values(sameCakeItems);
        console.log(this.cartCoffeeDetails)
        console.log("cakeItems:",this.cakeItems)
        console.log(this.cartItems)
        console.log(this.cartAllName)
        this.calculateTotalPrice()

      },
      (error) => console.error('Error loading cart:', error)
    );
  }

  deleteOrderCoffee(ordercoffee_id: string) {
    this.cartsService.deleteOrdercoffee(ordercoffee_id).subscribe(
      (response) => {
        console.log('Delete successful:', response);

        // อัพเดตข้อมูล cartCoffeeDetails
        this.cartCoffeeDetails = this.cartCoffeeDetails.filter(item => item._id !== ordercoffee_id);

        // อัพเดตราคาหลังจากลบสำเร็จ
        this.totalPrice = this.cartCoffeeDetails.reduce((sum, item) => sum + item.total_price, 0);

        // โหลดข้อมูลตะกร้าใหม่ หรืออัพเดตข้อมูลใหม่
        this.loadCart(this.userId!);
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }

  deleteOrderCake(cakeId:string) {
    console.log(this.userId)
    console.log(cakeId)
    this.cartsService.deleteOrdercake(this.userId!, cakeId).subscribe(
      (response) => {
        console.log('Delete successful:', response);

        // อัพเดตข้อมูล cartCakeDetails
        this.cakeItems = this.cakeItems.filter(item => item.cake_id !== cakeId);
        // อัพเดตราคาหลังจากลบสำเร็จ
        this.totalPrice = this.cakeItems.reduce((sum, item) => sum + item.total_price, 0);

        // โหลดข้อมูลตะกร้าใหม่ หรืออัพเดตข้อมูลใหม่
        this.loadCart(this.userId!);
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }

  deleteOrderBoardgame(boardgameId: string) {
    console.log(this.userId)
    console.log(boardgameId)
    this.cartsService.deleteOrderboardgame(this.userId! ,boardgameId).subscribe(
      (response) => {
        console.log('Delete successful:', response);

        // อัพเดตข้อมูล cartCakeDetails
        this.cartItems = this.cartItems.filter(item => item._id !== boardgameId);
        // อัพเดตราคาหลังจากลบสำเร็จ
        this.totalPrice = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // โหลดข้อมูลตะกร้าใหม่ หรืออัพเดตข้อมูลใหม่
        this.loadCart(this.userId!);
      },
      (error) => {
        console.error('Error deleting order:', error);
      }
    );
  }

  removeItem(item: any): void {
    // ลบสินค้าออกจาก cartItems
    this.cartItems = this.cartItems.filter(i => i !== item);

    // อัพเดทราคาหลังจากลบ
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  calculateTotalPrice() {
    this.totalPrice = 0;
    this.totalPrice += this.cartCoffeeDetails.reduce((sum, item) => sum + item.total_price, 0);
    this.totalPrice += this.cakeItems.reduce((sum, item) => sum + item.total_price, 0);
    this.totalPrice += this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  togglePopup() {
    // ตรวจสอบว่ามีรายการในตะกร้าก่อนเปิดป๊อปอัพ
    if (this.cartItems.length > 0) {
      this.showPopup = !this.showPopup;
    } else {
      console.warn('Cart is empty. Cannot process payment.');
    }
  }
}

