import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Dish } from '../../models/dish';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  imports: [CommonModule]
})
export class CheckoutComponent implements OnInit {
  basket: { dish: Dish; quantity: number }[] = [];

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    const storedBasket = localStorage.getItem('basket');
    this.basket = storedBasket ? JSON.parse(storedBasket) : [];
  }

  getTotalPrice(): string {
    return this.basket
      .reduce((sum, item) => sum + item.dish.price * item.quantity, 0)
      .toFixed(2);
  }

  placeOrder(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('You must be logged in to place an order.');
      return;
    }
  
    const orderData = {
      userId: Number(userId),
      items: this.basket.map(item => ({
        dishId: item.dish.id,
        quantity: item.quantity
      }))
    };
  
    console.log("Sending order request:", orderData); 
  
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        console.log("Order placed successfully!", response);
        alert('Order placed successfully!');
        localStorage.removeItem('basket'); 
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        console.error('Error placing order:', err);
        alert('Failed to place order. Try again.');
      }
    });
  }
  
}
