import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // If the user is authenticated and tries to access the login page, redirect them
    if (this.authService.isAuthenticated()) {
      if (state.url === '/login') {
        // Redirect to the 'tasks' route if the user is logged in
        this.router.navigate(['/tasks']);
        return false; // Prevent accessing the login page
      }
      return true; // Allow access to the route if authenticated (for other protected routes)
    }

    // If not authenticated, allow access to login route but prevent access to protected routes
    if (state.url !== '/login') {
      this.router.navigate(['/login']); // Redirect to login page if not authenticated
      return false;
    }

    return true; // Allow access to login page if not authenticated
  }

}
