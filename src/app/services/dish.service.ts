import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish } from '../models/dish';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private baseUrl = 'http://localhost:8080/api/dishes'; 

  constructor(private http: HttpClient) {}

  // Get all dishes 
  getAllDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.baseUrl);
  }

  // Get dish by ID 
  getDishById(id: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.baseUrl}/${id}`);
  }

  // Get dishes by restaurant 
  getDishesByRestaurant(restaurantId: number): Observable<{ dishes: Dish[] }> {
    return this.http.get<{ dishes: Dish[] }>(`${this.baseUrl}/restaurant/${restaurantId}`);
  }
  

  createDish(dish: any): Observable<Object> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Unauthorized: No user ID found!");
      return new Observable(observer => {
        observer.error("Unauthorized: No user ID found!");
      });
    }
  
    const headers = new HttpHeaders({ 'userId': userId });
    return this.http.post(this.baseUrl, dish, { headers });
  }
  
  
  
  

  // Delete a dish 
  deleteDish(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
