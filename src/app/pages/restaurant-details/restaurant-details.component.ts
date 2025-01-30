import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { DishService } from '../../services/dish.service';
import { Restaurant } from '../../models/restaurant';
import { Dish } from '../../models/dish';

@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  templateUrl: './restaurant-details.component.html',
  styleUrls: ['./restaurant-details.component.css'],
  imports: [CommonModule]
})
export class RestaurantDetailsComponent implements OnInit {
  restaurant: Restaurant | null = null;
  dishes: Dish[] = [];
  basket: { dish: Dish; quantity: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restaurantService: RestaurantService,
    private dishService: DishService
  ) {}

  ngOnInit(): void {
    const restaurantId = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(restaurantId)) {
      // Fetch restaurant details safely
      this.restaurantService.getRestaurantById(restaurantId).subscribe({
        next: (response) => {
          console.log("Restaurant API Response:", response);
          this.restaurant = response?.restaurant || null;
        },
        error: (err) => {
          console.error('Error fetching restaurant:', err);
          this.restaurant = null;
          this.router.navigate(['/dashboard']); 
        }
      });

      // Fetch dishes safely
      this.dishService.getDishesByRestaurant(restaurantId).subscribe({
        next: (response) => {
          console.log("Dishes API Response:", response);
          this.dishes = response?.dishes || [];
        },
        error: (err) => {
          console.error('Error fetching dishes:', err);
          this.dishes = []; 
        }
      });
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  // Add dish to the basket
  addToBasket(dish: Dish): void {
    const existingItem = this.basket.find(item => item.dish.id === dish.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.basket.push({ dish, quantity: 1 });
    }
  }

  // Remove dish from the basket
  removeFromBasket(index: number): void {
    this.basket.splice(index, 1);
  }

  // Proceed to checkout
  goToCheckout(): void {
    localStorage.setItem('basket', JSON.stringify(this.basket));
    this.router.navigate(['/checkout']);
  }
}
