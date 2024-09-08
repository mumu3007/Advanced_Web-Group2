import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { AuthService } from '../../services/auth/auth.service';

import { jwtDecode } from "jwt-decode";




@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit  {

  scrolled = false;
  

  userId: string | null = null; // เก็บ userId จาก token
  userData: any; // เก็บข้อมูลผู้ใช้

  isLoggedIn = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private authService: AuthService) {}

  ngOnInit() {
    // ตรวจสอบว่าอยู่ใน browser หรือไม่
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.isLoggedIn = true;

        // ถอดรหัส token เพื่อดึง userId
        const decodedToken: any = jwtDecode(token); // ใช้ jwt-decode ในการถอดรหัส
        this.userId = decodedToken.userId;

        // เรียกฟังก์ชัน getUserById เพื่อดึงข้อมูลผู้ใช้
        if (this.userId) {
          this.getUserById(this.userId);
        }

        
      }
    }
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
    }
  }

  getUserById(userId: string) {
    this.authService.getUserById(userId).subscribe(
      (response) => {
        this.userData = response; // เก็บข้อมูลผู้ใช้
        console.log('User data:', this.userData); // แสดงข้อมูลผู้ใช้
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    )
  }

  

  

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const isScrolled = window.scrollY > 10;
    this.scrolled = isScrolled;
  }
}
