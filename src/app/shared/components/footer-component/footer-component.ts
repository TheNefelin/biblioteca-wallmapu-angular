import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-component',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './footer-component.html',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
