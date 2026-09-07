import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-in-development-page',
  imports: [
    RouterLink,
  ],
  templateUrl: './in-development-page.html',
})
export class InDevelopmentPage {
  ROUTES_CONSTANTS=ROUTES_CONSTANTS
}
