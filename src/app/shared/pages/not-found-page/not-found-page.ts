import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTES } from '@shared/constants/routes';

@Component({
  selector: 'app-not-found-page',
  imports: [
    RouterLink
],
  templateUrl: './not-found-page.html',
})
export class NotFoundPage {
  protected readonly ROUTES = ROUTES;
}
