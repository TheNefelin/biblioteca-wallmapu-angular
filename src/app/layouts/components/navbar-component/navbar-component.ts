import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { AuthButtonComponent } from "@features/auth/components/auth-button-component/auth-button-component";
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-navbar-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  ROUTES_PAGES = ROUTES_CONSTANTS.PAGES;
  ROUTES_HOME = ROUTES_CONSTANTS.HOME;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 10);
  }

  handleLogoClick(event: Event): void {
    if (this.router.url === this.ROUTES_HOME.ROOT) {
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
