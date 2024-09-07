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
      (response) => {
        localStorage.setItem('token', response.token);
        console.log("Login successful")
        this.router.navigate(['/protected']);
        this.message = 'Login successful!';
      },
      (error) => {
        this.message = 'Login failed!';
      }
    );
  }

}
