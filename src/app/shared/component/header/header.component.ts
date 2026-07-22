import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
  isNavbarHidden = false;
  private lastScrollTop = 0;

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

  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }

    this.isMenuOpen = false;
  }

}
