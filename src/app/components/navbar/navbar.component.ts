import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  
  isUserLoggedIn: boolean = false; 
  isAdmin: boolean = false; 

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.userService.isLoggedIn$.subscribe((status) => {
      this.isUserLoggedIn = status;
      this.isAdmin = this.userService.getUserRole() === 'ADMIN'; 
    });
  }

  logout() {
    this.userService.logout(); 
    this.router.navigate(['/login']); 
  }
}
