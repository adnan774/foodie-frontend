import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://ec2-44-206-239-1.compute-1.amazonaws.com:8100/api/users';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password });
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, userData);
  }
}
