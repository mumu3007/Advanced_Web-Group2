import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';
import { CartsService } from '../../services/carts/carts.service';

@Component({
  selector: 'app-navbaradmin',
  templateUrl: './navbaradmin.component.html',
  styleUrl: './navbaradmin.component.css'
})
export class NavbaradminComponent {
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

  constructor(private authService: AuthService, private router: Router, private cartsService: CartsService) { }
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
    }, 500); // หน่วงเวลา 300 มิลลิวินาที
  }

  ngOnInit() {
    this.checkLoginStatus(); // เช็คสถานะล็อกอินเมื่อโหลดคอมโพเนนต์
    this.authService.getUserId().subscribe((id) => {
      this.userId = id; // ดึง userId และเก็บไว้ในตัวแปร

      if (this.userId) {
        this.loadUserData(this.userId);
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

