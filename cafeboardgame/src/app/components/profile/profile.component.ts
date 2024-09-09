// src/app/components/profile/profile.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent  {
  userData: any; // ตัวแปรเก็บข้อมูลผู้ใช้
  isLoading = true; // ใช้ในการบ่งชี้ว่ากำลังโหลดข้อมูล
  error: string | null = null; // เก็บข้อความข้อผิดพลาด

  constructor(private authService: AuthService, private router: Router) {}

}
