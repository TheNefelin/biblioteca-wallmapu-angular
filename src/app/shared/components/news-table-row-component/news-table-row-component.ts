import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { NewsModel } from '@core/models/news-model';
import { ROUTES } from '@shared/constants/routes';

@Component({
  selector: 'app-news-table-row-component',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './news-table-row-component.html',
})
export class NewsTableRowComponent {
  private router = inject(Router);
  readonly news = input.required<NewsModel>();

  protected onEdit(item: NewsModel): void {
    this.router.navigate([ROUTES.PROTECTED.ADMIN.NEWS, 'form'], { state: { url: item } });
  }
}
