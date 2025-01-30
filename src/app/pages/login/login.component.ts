import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
    this.userService.login(this.username, this.password).subscribe({
      next: (response) => {
        if (response.status === "SUCCESS") {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.user.id.toString()); 
          localStorage.setItem('role', response.user.role); 
          this.userService.setLoginStatus(true);
          alert('Login Successful'); 
          this.router.navigate(['/dashboard']);
        } else {
          alert("Invalid username or password."); 
        }
      },
      error: (err) => {
        console.error("Login Error:", err);
        alert("Something went wrong. Please try again.");
      }
    });
  }
  
}
