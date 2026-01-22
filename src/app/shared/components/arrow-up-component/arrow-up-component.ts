import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-arrow-up-component',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './arrow-up-component.html',
})
export class ArrowUpComponent {
  
  handleArrowUpClick(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0 });
  }

}