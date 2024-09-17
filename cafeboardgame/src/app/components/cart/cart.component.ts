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

  cartAllName: any[]=[];

  constructor(private cartsService: CartsService, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.userId) {
      this.authService.getUserId().subscribe((id) => {
        if (id && !this.userId) {
          this.userId = id;
          this.loadUserData(this.userId);
          this.loadCart(this.userId);
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

        this.selectedCartId = cart.cart._id;
       
        // รวมสินค้าที่ซ้ำกัน
        const combinedItems: { [key: string]: any } = {};

        // ดึงข้อมูลของแต่ละประเภทสินค้า
        const boardgameItems = [
          ...cart.cart.boardgame_id
        ];

        cart.cart.ordercoffee_id.forEach((ordercoffee: any) => {
          const coffeeName = ordercoffee.coffee_id.name;
          const coffeeSize = ordercoffee.size
          const coffeeSweet = ordercoffee.sweetness_level
          const coffeeQuantity = ordercoffee.quantity || 0;
          const coffeeTotalPrice = ordercoffee.total_price;
          const coffeePhoto = ordercoffee.coffee_id.photo;

          // Add the coffee details to the display array
          this.cartCoffeeDetails.push({
            name: coffeeName,
            size: coffeeSize,
            sweetness_level: coffeeSweet,
            quantity: coffeeQuantity,
            total_price: coffeeTotalPrice,
            photo: coffeePhoto
          });

          this.cartAllName.push({
            name: coffeeName,
            total_price: coffeeTotalPrice,
          });

          this.totalPrice += coffeeTotalPrice
        });

        cart.cart.ordercake_id.forEach((ordercake: any) => {
          const cakeName = ordercake.cake_id.name;
          const cakeQuantity = ordercake.quantity || 0;
          const cakeTotalPrice = ordercake.total_price;
          const cakePhoto = ordercake.cake_id.photo;
          const cakeDescription = ordercake.cake_id.description

          // Add the cake details to the display array
          this.cartCakeDetails.push({
            name: cakeName,
            description: cakeDescription,
            quantity: cakeQuantity,
            total_price: cakeTotalPrice,
            photo: cakePhoto
          });

          this.cartAllName.push({
            name: cakeName,
            total_price: cakeTotalPrice,
          });

          this.totalPrice += cakeTotalPrice
        });

        boardgameItems.forEach((item: any) => {
          const id = item._id.toString();
          
          if (!combinedItems[id]) {
            combinedItems[id] = {
              ...item,
              quantity: 1, // เริ่มต้นด้วยจำนวน 1
              type: item.type ? item.type.name : 'Unknown' // เพิ่มประเภทสินค้า (ถ้ามี)
            };
          } else {
            combinedItems[id].quantity++; // ถ้ามีสินค้าซ้ำ ให้เพิ่มจำนวน
          }
        });

        this.cartItems = Object.values(combinedItems); // แปลง object ให้เป็น array
        console.log(this.cartItems)

        // คำนวณราคาทั้งหมด
        this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      },
      (error) => console.error('Error loading cart:', error)
    );
  }

  removeItem(item: any): void {
    // ลบสินค้าออกจาก cartItems
    this.cartItems = this.cartItems.filter(i => i !== item);
    
    // อัพเดทราคาหลังจากลบ
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

