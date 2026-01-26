import { NgOptimizedImage } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ROUTES } from '@shared/constants/routes';
import { AuthButtonComponent } from "@features/auth/components/auth-button-component/auth-button-component";

@Component({
  selector: 'app-navbar-component',
  imports: [
    RouterLink,
    NgOptimizedImage,
    AuthButtonComponent
],
  templateUrl: './navbar-component.html',
})
export class NavbarComponent {
  router = inject(Router);
  isScrolled = signal(false);
  ROUTES_PAGES = ROUTES.PAGES;
  ROUTES_HOME = ROUTES.HOME;


  constructor() {
    // ✅ Scroll listener con cleanup automático usando takeUntilDestroyed
    fromEvent(window, 'scroll', { passive: true })
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.isScrolled.set(window.scrollY > 10);
      });
  }

  handleLogoClick(event: Event): void {
    if (this.router.url === this.ROUTES_HOME) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  closeDropdown(event: Event): void {
    const target = event?.target as HTMLElement;

    if (target && target.blur) {
      target.blur();
    }
  }
}
