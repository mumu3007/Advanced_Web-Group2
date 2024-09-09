// src/app/components/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userData: any; // ตัวแปรเก็บข้อมูลผู้ใช้

  userId: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUserId().subscribe((id) => {
      this.userId = id;
      // ทำสิ่งที่คุณต้องการกับ userId

      //--------------//
      if (this.userId) {
        this.loadUserData(this.userId); // เรียกใช้ getUserById เพื่อดึงข้อมูลผู้ใช้
      }
      //--------------//
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
}
