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
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login successful!',
          });
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000); // หน่วงเวลา 2 วินาที ก่อน redirect
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
