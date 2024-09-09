// src/app/guards/auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { map, tap } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    tap(isAuthenticated => {
      console.log('Is authenticated:', isAuthenticated); // ดีบักค่า isAuthenticated
    }),
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true; // สามารถเข้าถึงได้
      } else {
        console.log('Redirecting to login'); // ดีบักเมื่อไปหน้า login
        router.navigate(['/login']); // ไปที่หน้า login
        return false;
      }
    })
  );
};
