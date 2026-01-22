import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@shared/components/footer-component/footer-component';
import { NavbarComponent } from '@shared/components/navbar-component/navbar-component';
import { ArrowUpComponent } from "@shared/components/arrow-up-component/arrow-up-component";

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,    
    ArrowUpComponent
],
  templateUrl: './public-layout.html',
})
export class PublicLayout {

}
