import { Component } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";
import { environment } from '@environments/environment';

@Component({
  selector: 'app-footer-component',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './footer-component.html',
})
export class FooterComponent {
  protected version = environment.version;
  protected currentYear = new Date().getFullYear();
}
