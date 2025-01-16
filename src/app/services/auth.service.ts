import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  isAuthenticated(): boolean {
    // Check if user is authenticated by checking the token
    return !!localStorage.getItem('token');
  }

  logout() {
    // Clear token or user session (this would be based on your authentication method)
    localStorage.removeItem('token');
    this.router.navigate(['/login']); // Redirect to login
  }
}
