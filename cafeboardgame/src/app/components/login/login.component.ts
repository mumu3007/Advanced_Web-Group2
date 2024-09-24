import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { MessageService } from 'primeng/api'; // Import MessageService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService] // Add MessageService provider
})
export class LoginComponent {
  user = { email: '', password: '' };
  message: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService // Inject MessageService
  ) {}

  login() {
    this.authService.login(this.user).subscribe(
      response => {
        if (response.error) {
          this.message = response.error;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Login failed. Please try again.',
          });
        } else {
          // ตรวจสอบบทบาทของผู้ใช้
          const role = this.authService.getRole(); // สมมติว่ามีฟังก์ชันนี้ใน AuthService
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login successful!',
          });
  
          // เปลี่ยนเส้นทางตามบทบาท
          if (role === 'admin') {
            this.router.navigate(['/admin']); // ไปยังหน้า admin
          } else {
            this.router.navigate(['/home']); // ไปยังหน้า home สำหรับผู้ใช้ทั่วไป
          }
        }
      },
      error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      }
    );
  }
  
}
