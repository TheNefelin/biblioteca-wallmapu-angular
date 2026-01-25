import { NgOptimizedImage } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar-component',
  imports: [
    RouterLink,
    NgOptimizedImage,
],
  templateUrl: './navbar-component.html',
})
export class NavbarComponent {
  router = inject(Router);
  isScrolled = false;

  @HostListener('window:scroll')

  onScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  handleLogoClick(event: Event): void {
    if (this.router.url === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
