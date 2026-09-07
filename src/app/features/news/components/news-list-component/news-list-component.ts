import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { NewsModel } from '@features/news/models/news-model';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";

@Component({
  selector: 'app-news-list-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgOptimizedImage,
    LoadingComponent,
    ButtonComponent,
    PaginationComponent
  ],
  templateUrl: './news-list-component.html',
})
export class NewsListComponent {
  readonly newsList = input<NewsModel[]>([]);
  readonly isLoading = input<boolean>(false);
  readonly totalPages = input<number>(0);
  readonly currentPage = input<number>(0);
  protected readonly prevPage = output<void>();
  protected readonly nextPage = output<void>();  
  protected readonly reload = output<void>();
  protected readonly create = output<void>();
  protected readonly edit = output<NewsModel>();
  protected readonly delete = output<NewsModel>();
}
