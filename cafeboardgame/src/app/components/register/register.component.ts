import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { RegisterService } from '../../services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = { name: '', email: '', password: '' ,phone: ''};
  message: string = '';

  constructor(private registerService: RegisterService,private router: Router) {}

  register() {
    this.registerService.register(this.user).subscribe(
      (response) => {
        this.router.navigate(['/login']);
        this.message = 'Registration successful!';
      },
      (error) => {
        this.message = 'Registration failed!';
      }
    );
  }

}
