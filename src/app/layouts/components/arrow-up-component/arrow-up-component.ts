import { NgOptimizedImage } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-arrow-up-component',
  imports: [
    NgOptimizedImage,
  ],
  templateUrl: './arrow-up-component.html',
})
export class ArrowUpComponent {
  handleArrowUpClick(event: Event): void {
    event.preventDefault();
    window.scrollTo({ top: 0 });
  }
}
