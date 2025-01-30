import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { DishService } from '../../services/dish.service';
import { Router } from '@angular/router';
import { Restaurant } from '../../models/restaurant';
import { Dish } from '../../models/dish'; 

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AdminDashboardComponent implements OnInit {
  
  newRestaurant = { name: '', location: '', cuisine: '' };
  newDish = { name: '', price: 0, restaurantId: null };

  restaurants: Restaurant[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private dishService: DishService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (restaurants: Restaurant[]) => {
        this.restaurants = restaurants || [];
      },
      error: (err) => console.error("Error fetching restaurants:", err)
    });
  }

  addRestaurant(): void {
    if (!this.newRestaurant.name || !this.newRestaurant.location || !this.newRestaurant.cuisine) {
      alert("Please fill in all restaurant fields.");
      return;
    }

    this.restaurantService.createRestaurant(this.newRestaurant).subscribe({
      next: () => {
        alert("Restaurant added successfully!");
        this.newRestaurant = { name: '', location: '', cuisine: '' };
        this.loadRestaurants();
      },
      error: (err) => console.error("Error adding restaurant:", err)
    });
  }

  addDish(): void {
    if (!this.newDish.name || this.newDish.price <= 0 || !this.newDish.restaurantId) {
      alert("Please fill in all dish fields and select a restaurant.");
      return;
    }
  
    const selectedRestaurant = this.restaurants.find(r => r.id == this.newDish.restaurantId);
    if (!selectedRestaurant) {
      alert("Invalid restaurant selection.");
      return;
    }
  
    const dishPayload = {
      name: this.newDish.name,
      price: this.newDish.price,
      restaurant: selectedRestaurant
    };
  
    const dishObservable = this.dishService.createDish(dishPayload);
    if (!dishObservable) {
      console.error("Dish creation service returned undefined.");
      return;
    }
  
    dishObservable.subscribe({
      next: () => {
        alert("Dish added successfully!");
        this.newDish = { name: '', price: 0, restaurantId: null }; 
      },
      error: (err) => console.error("Error adding dish:", err)
    });
  }
  
}
