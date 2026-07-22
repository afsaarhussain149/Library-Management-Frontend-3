import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  standalone: false,
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.css'
})
export class AdminHeaderComponent {
  isMenuOpen = false;
  isNavbarHidden = false;
  isLoggedIn = false;
  private lastScrollTop = 0;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = !event.url.includes('/login');
      }
    });
  }

  @Output() openComplaint = new EventEmitter<void>();
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    this.isNavbarHidden = scrollTop > this.lastScrollTop && scrollTop > 100;
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
