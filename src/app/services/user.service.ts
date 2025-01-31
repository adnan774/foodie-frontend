import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://ec2-44-206-239-1.compute-1.amazonaws.com:8100/api/users';

  // Track login status dynamically
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // Get user by ID
  getUserById(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  // Signup user
  signup(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, user);
  }

  getUserRole(): string {
    return localStorage.getItem('role') || 'USER';
  }

  login(username: string, password: string) {
    return this.http.post<{ status: string; token: string; user: { id: number; role: string } }>(
      `${this.baseUrl}/login`,
      { username, password }
    );
  }
  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    this.isLoggedInSubject.next(false);
  }

  setLoginStatus(status: boolean) {
    this.isLoggedInSubject.next(status);
  }
}
