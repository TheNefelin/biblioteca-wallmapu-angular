import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgOptimizedImage } from "@angular/common";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-book-not-found-page',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './book-not-found-page.html',
})
export class BookNotFoundPage {

}
