import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';


import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      
       // หากไม่ใช่ผู้ใช้ที่รับรอง
       if (!isAuthenticated) {
        return false; // ไม่อนุญาตให้เข้าถึง
      }


      // ตรวจสอบบทบาทและเส้นทาง
      const role = authService.getRole(); // สมมติว่าได้สร้างฟังก์ชันนี้ใน AuthService
      const path = route.routeConfig?.path;

      if (role === 'admin') { 
        return true; // Admin สามารถเข้าถึงทุกอย่าง
      } else if (role === 'user') {
        // User สามารถเข้าถึงได้ทุกหน้ายกเว้น admin และ adminboardgame
        if (path === 'admin' || path === 'adminboardgame') {
          router.navigate(['/home']); // เปลี่ยนเส้นทางไปหน้าโฮม
          return false; // ไม่อนุญาต
        }
        return true; // สามารถเข้าถึงได้
      }

      return false; // ในกรณีที่ไม่มีบทบาท
    })
  );
};
