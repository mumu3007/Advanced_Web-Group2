import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user = { email: '', password: '' };
  message: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.user).subscribe(
      response => {
        if (response.error) {
          this.message = response.error;
        } else {
          // รีไดเรกไปยังหน้า home หรือหน้าอื่นหลังจากล็อกอินสำเร็จ
          this.router.navigate(['/home']);
          console.log('Login successful');
        }
      },
      error => {
        console.log('Login failed', error);
        this.message = 'Login failed. Please try again.';
      }
    );
  }

}
