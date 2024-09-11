import { Component, HostListener, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit   {
  scrolled = false;

  isLoggedIn = false;  // เช็คสถานะการล็อกอิน
  userData: any = null;  // เก็บข้อมูลผู้ใช้
  userId: string | null = null;  // เพิ่มตัวแปรเก็บ userId


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus(); // เช็คสถานะล็อกอินเมื่อโหลดคอมโพเนนต์
    this.authService.getUserId().subscribe((id) => {
      this.userId = id; // ดึง userId และเก็บไว้ในตัวแปร
      
      if (this.userId) {
        this.loadUserData(this.userId); // เรียกใช้ getUserById เพื่อดึงข้อมูลผู้ใช้
      }
    });
  }

  checkLoginStatus() {
    this.authService.isAuthenticated().subscribe((isAuthenticated: boolean) => {
      this.isLoggedIn = isAuthenticated;
    });
  }

  loadUserData(userId: string) {
    
    this.authService.getUserById(userId).subscribe((data) => {
      this.userData = data; // เก็บข้อมูลผู้ใช้ที่ได้รับ
      
    }, (error) => {
      console.error('Error fetching user data:', error); // ดีบักข้อผิดพลาด
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.isLoggedIn = false;
      this.userData = null;
      this.userId = null;
     

      setTimeout(() => {
        window.location.reload(); // Reload หน้าเพื่ออัปเดตการแสดงผล
      }, 1000); // 1000 มิลลิวินาที (1 วินาที)
      
    });
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const isScrolled = window.scrollY > 10;
    this.scrolled = isScrolled;
  }
}
