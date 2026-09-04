import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NewsWithImagesModel } from '@features/news/models/news-with-images-model';
import { NewsService } from '@features/news/services/news-service';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { NewsFeaturedComponent } from "@features/news/components/news-featured-component/news-featured-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { NewsCardListComponent } from "@features/news/components/news-card-list-component/news-card-list-component";
import { AboutComponent } from '@features/home/components/about-component/about-component';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { EditionService } from '@features/edition/services/edition-service';
import { EditionCardListComponent } from "@features/edition/components/edition-card-list-component/edition-card-list-component";
import { SearchFilterComponent } from "@features/home/components/search-filter-component/search-filter-component";
import { EditionDetailModel, EditionFilterModel } from '@features/edition/models/edition-model';
import { extractErrorMessage } from '@core/utils/error-handler';
import { AuthorModel } from '@features/book-author/models/author-model';
import { FormatModel } from '@features/format/models/format-model';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { GenreModel } from '@features/book-genre/models/genre-model';
import { SubjectModel } from '@features/book-subject/models/subject-model';

@Component({
  selector: 'app-home.page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeaderComponent,
    SectionHeaderComponent,
    NewsFeaturedComponent,
    PaginationComponent,
    AboutComponent,
    NewsCardListComponent,
    EditionCardListComponent,
    SearchFilterComponent
],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly router = inject(Router);
  
  protected readonly totalPages = signal<number>(0);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed(() => 
    [
      this.newsRX,
      this.editionRX
    ].some(r => r.isLoading())
  );
  
  private readonly newsService = inject(NewsService);
  protected readonly firstNewsWithImages = computed<NewsWithImagesModel | null>(() => {
    const list = this.newsRX.value() ?? [];
    return list.length > 0 ? list[0] : null;
  });
  protected readonly restNewsWithImages = computed<NewsWithImagesModel[]>(() => {
    const list = this.newsRX.value() ?? [];
    return list.slice(1);
  });

  private readonly newsRX = rxResource({
    stream: () => {    
      this.errorMessage.set(null);

      return this.newsService.getAll({ page: 1, limit: 4, search: '' }).pipe(
        map(response => response.data),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly editionService = inject(EditionService);
  protected readonly editionListComputed = computed<EditionDetailModel[]>(() => this.editionRX.value() ?? []);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(20);
  private readonly search = signal<string>('');
  private readonly id_author = signal<number>(0);
  private readonly id_format = signal<number>(0);
  private readonly id_editorial  = signal<number>(0);
  private readonly id_genre  = signal<number>(0);
  private readonly id_subject  = signal<number>(0);
  protected readonly editionPayload = computed<PaginationRequestModel<EditionFilterModel>>(() => ({
    page: this.currentPage(),
    limit: this.limit(),
    search: this.search(),
    filter: {
      id_author: this.id_author(),
      id_editorial: this.id_editorial(),
      id_genre: this.id_genre(),
      id_format: this.id_format(),
      id_subject: this.id_subject(),
    }        
  }));

  private readonly editionRX = rxResource({
    params: () => this.editionPayload(),
    stream: ({ params }) => {    
      this.errorMessage.set(null);

      return this.editionService.getAllPagination(params).pipe(
        map(response => {
          this.totalPages.set(response.pages);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });  

  protected actionClicked(){
    this.router.navigate([ROUTES_CONSTANTS.HOME.NEWS.ROOT])
  }

  searchText(text: string) {
    this.search.set(text);
    this.currentPage.set(1); 
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()){
      this.currentPage.update(e => e + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  protected onSelectedAuthor(item: AuthorModel | null): void {
    this.id_author.set(item?.id_author ?? 0);
  }

  protected onSelectedFormat(item: FormatModel | null): void {
    this.id_format.set(item?.id_format ?? 0);
  }

  protected onSelectedEditorial(item: EditorialModel | null): void {
    this.id_editorial.set(item?.id_editorial ?? 0);
  }

  protected onSelectedGenre(item: GenreModel | null): void {
    this.id_genre.set(item?.id_genre ?? 0);
  }

  protected onSelectedSubject(item: SubjectModel | null): void {
    this.id_subject.set(item?.id_subject ?? 0);
  }

  protected onNavigateTo(item: EditionDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.HOME.RESERVATION.ROOT(item.book_id, item.id_edition)]);
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
  }
}
