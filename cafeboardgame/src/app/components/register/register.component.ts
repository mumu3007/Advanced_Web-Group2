import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';
import { MessageService } from 'primeng/api'; // เพิ่มการนำเข้า MessageService

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent {
  user: User = { name: '', email: '', password: '', phone: '' };
  message: string = '';

  constructor(
    private registerService: RegisterService,
    private router: Router,
    private messageService: MessageService
  ) {}

  successMessage: string | null = null;
  errorMessage: string | null = null;

  register() {
    this.registerService.register(this.user).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration successful!',
        });
        // ทำการ redirect ไปหน้า login หลังจากสมัครสำเร็จ
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000); // หน่วงเวลา 2 วินาที ก่อน redirect
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Registration failed! Please try again.',
        });
      }
    );
  }
}
