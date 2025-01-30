import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true, 
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [CommonModule, FormsModule, RouterModule] 
})
export class SignupComponent {
  
  user: any = { role: 'USER' }; 

  constructor(private userService: UserService, private router: Router) {}

  signup(signupForm: NgForm) {
    if (signupForm.invalid) return; 

    this.userService.signup(this.user).subscribe({
      next: (response: any) => {
        if (response) { 
          alert('Signup successful! Please login.');
          signupForm.reset(); 
          this.router.navigate(['/login']);
        } else {
          alert('Signup failed. Please try again.');
        }
      },
      error: (err) => {
        console.error('Signup error:', err);
        alert('Something went wrong. Please try again.');
      }
    });
  }
}
