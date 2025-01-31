import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Order } from '../models/order';
import { OrderItem } from '../models/order-item';
import { map } from 'rxjs/operators';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://ec2-44-206-239-1.compute-1.amazonaws.com:8100/api/orders';

  constructor(private http: HttpClient) {}

  // Get all orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<{ status: string; orders: Order[] }>(`${this.baseUrl}`)
      .pipe(map(response => response.orders)); 
  }

  // Get order by ID
  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  // Get orders by user ID 
  getOrdersByUser(userId: number): Observable<Order[]> {
    return this.http.get<{ status: string; orders: Order[] }>(`${this.baseUrl}/user/${userId}`)
      .pipe(map(response => response.orders)); 
  }

  // Get order items for a specific order
  getOrderItemsByOrderId(orderId: number): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(`${this.baseUrl.replace('/orders', '/order-items/order')}/${orderId}`);
  }

  // Create a new order
  createOrder(orderData: any): Observable<Order> {
    console.log("📤 Sending order request:", orderData);
    
    return this.http.post<Order>(this.baseUrl, orderData).pipe(
      tap(response => console.log("Order Created Successfully:", response)), 
      catchError(error => {
        console.error("Error placing order:", error);
        return throwError(() => error);
      })
    );
  }


  // Delete an order
  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
