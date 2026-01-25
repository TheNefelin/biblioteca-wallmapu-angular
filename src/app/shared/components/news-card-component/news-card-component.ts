import { NgOptimizedImage } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News } from '@shared/models/news';

@Component({
  selector: 'app-news-card-component',
  imports: [
    RouterLink,
    NgOptimizedImage,
  ],
  templateUrl: './news-card-component.html',
})
export class NewsCardComponent {
  @Input({ required: true }) news!: News;

  newsRouterLink = computed<[string, number]>(() => 
    ['/news', this.news.id] as [string, number]
  );
}