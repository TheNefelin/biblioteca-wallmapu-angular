import { Component, computed, inject, signal } from '@angular/core';
import { EditionDetailModel, EditionFilterModel } from '@features/edition/models/edition-model';
import { CrudPage } from '@shared/base/crud-page';
import { HeaderComponent } from "@shared/components/header-component/header-component";
import { PaginationComponent } from "@shared/components/pagination-component/pagination-component";
import { SearchFilterComponent } from "@features/home/components/search-filter-component/search-filter-component";
import { EditionCardListComponent } from "@features/edition/components/edition-card-list-component/edition-card-list-component";
import { PaginationRequestModel } from '@shared/models/pagination-request-model';
import { Router } from '@angular/router';
import { LoggerService } from '@core/services/logger-service';
import { EditionService } from '@features/edition/services/edition-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { AuthorModel } from '@features/book-author/models/author-model';
import { FormatModel } from '@features/format/models/format-model';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { GenreModel } from '@features/book-genre/models/genre-model';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { SubjectModel } from '@features/book-subject/models/subject-model';

@Component({
  selector: 'app-edition-page',
  imports: [
    HeaderComponent,
    PaginationComponent,
    SearchFilterComponent,
    EditionCardListComponent
  ],
  templateUrl: './edition-page.html',
})
export class EditionPage extends CrudPage<EditionDetailModel> {
  private readonly router = inject(Router);
  private readonly logger = inject(LoggerService);

  // FILTER STATE ------------------------------------------------------------------
  private readonly id_author = signal<number>(0);
  private readonly id_editorial = signal<number>(0);
  private readonly id_genre = signal<number>(0);
  private readonly id_format = signal<number>(0);  
  private readonly id_subject = signal<number>(0);

  protected readonly getPaginationPayload = computed<PaginationRequestModel<EditionFilterModel>>(() => ({
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

  // EDITION SERVICE AND STATE -----------------------------------------------------
  private readonly editionService = inject(EditionService);
  protected readonly edition = {
    dataList: computed<EditionDetailModel[]>(() => this.getEditionRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getEditionRX.isLoading() && !this.getEditionRX.hasValue()),
  };
      
 // FETCHS --------------------------------------------------------------------------
  private readonly getEditionRX = rxResource({
    params: () => this.getPaginationPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.editionService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          this.logger.error('EditionService::EditionPage', 'getEditionRX', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS --------------------------------------------------
  protected override readonly limit = signal<number>(60);

  protected override reload(): void {
    this.getEditionRX.reload();
  }

  // ACTIONS ------------------------------------------------------------------------  
  searchText(text: string) {
    this.onFilterChange({ search: text, limit: this.limit() });
  }

  onLimitChange(limit: number): void {
    this.limit.set(limit);
    this.currentPage.set(1);
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
}
