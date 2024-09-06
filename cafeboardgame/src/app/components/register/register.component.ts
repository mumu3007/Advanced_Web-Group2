import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { RegisterService } from '../../services/register/register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = { name: '', email: '', password: '' ,phone: ''};
  message: string = '';

  constructor(private registerService: RegisterService) {}

  register() {
    this.registerService.register(this.user).subscribe(
      (response) => {
        this.message = 'Registration successful!';
      },
      (error) => {
        this.message = 'Registration failed!';
      }
    );
  }

}
