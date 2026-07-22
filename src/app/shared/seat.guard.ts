import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SeatGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Check if user is logged in (for example, token exists)
    const isLoggedIn = !!sessionStorage.getItem('takeuserdetails');

    if (!isLoggedIn) {
      // If not logged in, redirect to login
      this.router.navigate(['/login']);
      return false;
    }

    // If logged in, allow route
    return true;
  }
}
