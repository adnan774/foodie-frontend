import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule],
})
export class HomeComponent {
  
  constructor(private router: Router) {}

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('token'); 
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
