import { Component, HostListener, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';
import { CartsService } from '../../services/carts/carts.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  showMobileMenu: boolean = false;
toggleMenu() {
  this.showMobileMenu = !this.showMobileMenu;
}
  scrolled = false;
 
  hideDropdownTimeout: any;


  isLoggedIn = false; // เช็คสถานะการล็อกอิน
  userData: any = null; // เก็บข้อมูลผู้ใช้
  userId: string | null = null; // เพิ่มตัวแปรเก็บ userId
  showDropdown: boolean = false;
  totalItemCount!: number ;

  constructor(private authService: AuthService, private router: Router,private cartsService: CartsService) {}
  openDropdown(): void {
    if (this.hideDropdownTimeout) {
      clearTimeout(this.hideDropdownTimeout);
    }
    this.showDropdown = true;
  }

  // ฟังก์ชันปิด dropdown พร้อมดีเลย์
  closeDropdown(): void {
    if (this.hideDropdownTimeout) {
      clearTimeout(this.hideDropdownTimeout);
    }

    // ตั้งเวลาในการปิด dropdown
    this.hideDropdownTimeout = setTimeout(() => {
      this.showDropdown = false;
    },500); // หน่วงเวลา 300 มิลลิวินาที
  }
  
  ngOnInit() {
    this.checkLoginStatus(); // เช็คสถานะล็อกอินเมื่อโหลดคอมโพเนนต์
    this.authService.getUserId().subscribe((id) => {
      this.userId = id; // ดึง userId และเก็บไว้ในตัวแปร

      if (this.userId) {
        this.loadUserData(this.userId);
        this.loadCart(this.userId) // เรียกใช้ getUserById เพื่อดึงข้อมูลผู้ใช้
      }
    });
  }

  checkLoginStatus() {
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  loadUserData(userId: string) {
    this.authService.getUserById(userId).subscribe(
      (data) => {
        this.userData = data; // เก็บข้อมูลผู้ใช้ที่ได้รับ
      },
      (error) => {
        console.error('Error fetching user data:', error); // ดีบักข้อผิดพลาด
      }
    );
  }
  
  loadCart(userId: string): void {
    this.cartsService.getCart(userId).subscribe(
      (cart) => {
        // รวมสินค้าที่ซ้ำกัน
        const combinedItems: { [key: string]: any } = {};
        let countItem: number = 0; // ประกาศตัวแปรเก็บจำนวนทั้งหมด
        
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
          countItem++; // เพิ่มจำนวนให้ countItem ตามจำนวนสินค้าใน allItems
        });
  
        // หลังจากรวมสินค้าซ้ำแล้ว สามารถนำ countItem ไปแสดงหรือใช้ในฟังก์ชันอื่น ๆ ได้
        console.log('Total items in cart:', countItem);
  
        // คุณอาจต้องการอัพเดตจำนวนทั้งหมดในตัวแปรใน component เช่น:
        this.totalItemCount = countItem;
  
      },
      (error) => console.error('Error loading cart:', error)
    );
  }
  

  logout() {
    this.authService.logout().subscribe(() => {
      this.isLoggedIn = false;
      this.userData = null;
      this.userId = null;

      window.location.reload(); // Reload หน้าเพื่ออัปเดตการแสดงผล
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const isScrolled = window.scrollY > 10;
    this.scrolled = isScrolled;
  }
}
