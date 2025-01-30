import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OrderItem } from '../models/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private baseUrl = 'http://localhost:8080/api/order-items';

  constructor(private http: HttpClient) {}

  // Get all order items
  getAllOrderItems(): Observable<OrderItem[]> {
    return this.http.get<OrderItem[]>(this.baseUrl).pipe(
      catchError(error => {
        console.error("Error fetching all order items:", error);
        return of([]); 
      })
    );
  }

  // Get order items by Order ID 
  getOrderItemsByOrderId(orderId: number): Observable<OrderItem[]> {
    return this.http.get<{ status: string; orderItems: OrderItem[] }>(`${this.baseUrl}/order/${orderId}`)
      .pipe(
        map(response => {
          if (response && response.status === "SUCCESS" && Array.isArray(response.orderItems)) {
            return response.orderItems;
          } else {
            console.error("Invalid order items response:", response);
            return [];
          }
        }),
        catchError(error => {
          console.error(`Error fetching order items for Order ID ${orderId}:`, error);
          return of([]); 
        })
      );
  }

  // Create a new order item
  createOrderItem(orderItem: OrderItem): Observable<OrderItem> {
    return this.http.post<OrderItem>(this.baseUrl, orderItem).pipe(
      catchError(error => {
        console.error("Error creating order item:", error);
        return of(null as any); 
      })
    );
  }

  // Get a single order item by its ID
  getOrderItemById(id: number): Observable<OrderItem> {
    return this.http.get<OrderItem>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching order item with ID ${id}:`, error);
        return of(null as any); 
      })
    );
  }

  // Delete an order item by ID
  deleteOrderItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error deleting order item with ID ${id}:`, error);
        return of(undefined);
      })
    );
  }
}
