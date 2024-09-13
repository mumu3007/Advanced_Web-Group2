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

  constructor(private cartsService: CartsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe((id) => {
      this.userId = id;
      if (this.userId) {
        this.loadUserData(this.userId); // ใช้ userId ในการโหลดข้อมูลอื่น ๆ
        this.loadCart(this.userId)
      }
    });
  }
  loadUserData(id: string) {
    console.log('User ID:', id);
  }

  loadCart(userId: string): void {
    this.cartsService.getCart(userId).subscribe(
      (cart) => {
        // รวมสินค้าที่ซ้ำกัน
        const combinedItems: { [key: string]: any } = {};

        // ดึงข้อมูลของแต่ละประเภทสินค้า
        const allItems = [
          ...cart.cart.ordercoffee_id,
          ...cart.cart.cake_id,
          ...cart.cart.boardgame_id
        ];

        allItems.forEach((item: any) => {
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
}
