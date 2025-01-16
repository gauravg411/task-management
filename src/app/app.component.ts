import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Task Management';
  isOnNewTaskPage = false;

  constructor(private router: Router, public authService: AuthService) {}

  // logout() {
  //   // Clear token or user session (this would be based on your authentication method)
  //   localStorage.removeItem('token');
  //   this.router.navigate(['/login']); // Redirect to login
  // }

  // isAuthenticated(): boolean {
  //   // Check if user is authenticated by checking the token
  //   return !!localStorage.getItem('token');
  // }

  ngOnInit(): void {
    // Listen for route changes and check if we're on the "tasks/new" route
    this.router.events.subscribe(() => {
      this.isOnNewTaskPage = this.router.url.includes('/tasks/new');
    });
  }

  goBack(): void {
    // Navigate back to the previous page using Location service
    this.router.navigate(['/tasks']);  // Or any other route you want to navigate to
  }
}
