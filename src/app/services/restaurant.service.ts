import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../models/restaurant';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private baseUrl = 'http://localhost:8080/api/restaurants';

  constructor(private http: HttpClient) {}

  // Get all restaurants (extract restaurants properly)
  getAllRestaurants(): Observable<Restaurant[]> {
    return this.http.get<{ status: string; restaurants: Restaurant[] }>(`${this.baseUrl}`)
      .pipe(map(response => response.restaurants)); 
  }

  // Get restaurant by ID
  getRestaurantById(id: number): Observable<{ restaurant: Restaurant }> {
    return this.http.get<{ restaurant: Restaurant }>(`${this.baseUrl}/${id}`);
  }
  

  // Get restaurants by location
  getRestaurantsByLocation(location: string): Observable<Restaurant[]> {
    return this.http.get<{ status: string; restaurants: Restaurant[] }>(`${this.baseUrl}/location/${location}`)
      .pipe(map(response => response.restaurants)); // Extract restaurants properly
  }

  createRestaurant(restaurant: any): Observable<any> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("Unauthorized: No user ID found!");
      throw new Error("Unauthorized");
    }
  
    const headers = new HttpHeaders({ 'userId': userId }); // Send userId in headers
    return this.http.post(this.baseUrl, restaurant, { headers });
  }

  // Delete a restaurant
  deleteRestaurant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
