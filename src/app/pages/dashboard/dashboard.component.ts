import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { RestaurantService } from '../../services/restaurant.service';
import { OrderService } from '../../services/order.service';
import { OrderItemService } from '../../services/order-item.service';
import { User } from '../../models/user';
import { Restaurant } from '../../models/restaurant';
import { Order } from '../../models/order';
import { OrderItem } from '../../models/order-item';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  restaurants: Restaurant[] = [];
  orders: { order: Order; totalPrice: number }[] = [];

  constructor(
    private userService: UserService,
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
    this.loadRestaurants();
    this.loadOrders();
  }

  loadUserDetails(): void {
    const userIdString = localStorage.getItem('userId');
    if (!userIdString || userIdString === "undefined") {
      console.error(" User ID not found in localStorage!");
      alert("Unauthorized! Please log in.");
      this.router.navigate(['/login']);
      return;
    }

    const userId = Number(userIdString);
    if (isNaN(userId)) {
      console.error(" Invalid userId in localStorage:", userIdString);
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (response: any) => {
        console.log(" User Details Response:", response);
        if (response.status === "SUCCESS" && response.user) {
          this.user = response.user;
        } else {
          console.error(" User data not found in API response:", response);
          alert(response.message || "User not found.");
        }
      },
      error: (err: any) => {
        console.error(" Error fetching user details:", err);
        alert("Failed to fetch user details.");
      }
    });
  }

  loadRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (restaurants: Restaurant[]) => {
        console.log(" Restaurants Response:", restaurants);
        this.restaurants = restaurants;
      },
      error: (err: any) => console.error(' Error fetching restaurants:', err)
    });
  }

  async loadOrders(): Promise<void> {
    const userIdString = localStorage.getItem('userId');
    if (!userIdString || userIdString === "undefined") {
      console.error(" User ID not found in localStorage!");
      return;
    }

    const userId = Number(userIdString);
    if (isNaN(userId)) {
      console.error(" Invalid userId in localStorage:", userIdString);
      return;
    }

    try {
      const orders: Order[] = await lastValueFrom(this.orderService.getOrdersByUser(userId));
      console.log("✅ Orders Response:", orders);

      this.orders = orders.map(order => ({
        order,
        totalPrice: 0
      }));

      const orderPromises = this.orders.map(async orderData => {
        try {
          const orderItems = await lastValueFrom(this.orderItemService.getOrderItemsByOrderId(orderData.order.id));
          orderData.totalPrice = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        } catch (err) {
          console.error(` Error fetching items for order ${orderData.order.id}:`, err);
          alert(`Failed to load items for Order ${orderData.order.id}. Please try again.`);
        }
      });

      await Promise.all(orderPromises);
    } catch (err) {
      console.error(' Error fetching orders:', err);
      alert("Failed to load your orders. Please try again later.");
    }
  }
}
