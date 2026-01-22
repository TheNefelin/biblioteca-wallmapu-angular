import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@shared/components/footer-component/footer-component';
import { NavbarComponent } from '@shared/components/navbar-component/navbar-component';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './public-layout.html',
})
export class PublicLayout {

}
