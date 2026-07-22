import { Component, HostListener, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-student-header',
  standalone: false,
  templateUrl: './student-header.component.html',
  styleUrl: './student-header.component.css'
})
export class StudentHeaderComponent {
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

    if (scrollTop > this.lastScrollTop && scrollTop > 100) {
      // Scrolling down → hide navbar
      this.isNavbarHidden = true;
    } else {
      // Scrolling up → show navbar
      this.isNavbarHidden = false;
    }

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
