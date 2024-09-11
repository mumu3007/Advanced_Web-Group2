import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true; // สามารถเข้าถึงได้
      } else {
        router.navigate(['/login']); // ไปที่หน้า login
        return false;
      }
    })
  );
};
