import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { CreateGenreModel, GenreModel, UpdateGenreModel } from '@features/book-genre/models/genre-model';
import { GenreService } from '@features/book-genre/services/genre-service';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { extractErrorMessage } from '@core/utils/error-handler';
import { GenreListComponents } from "@features/book-genre/components/genre-list-components/genre-list-components";
import { GenreFormComponents } from '@features/book-genre/components/genre-form-components/genre-form-components';
import { SectionHeaderComponent } from '@shared/components/section-header-component/section-header-component';

@Component({
  selector: 'app-genre-form-page',
  imports: [
    GenreFormComponents, 
    SectionHeaderComponent, 
    MessageSuccessComponent, 
    MessageErrorComponent, 
    ModalActionComponent, 
    GenreListComponents,
  ],
  templateUrl: './genre-form-page.html',
})
export class GenreFormPage {
  private location = inject(Location);
  
  protected readonly selectedGenre = signal<GenreModel | null>(null);
  protected readonly selectedGenreToDelete = signal<GenreModel | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');
  
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getGenreRX,
      this.saveGenreRX,
      this.deleteGenreRX,
    ].some(e => e.isLoading())
  );

  private readonly genreService = inject(GenreService);
  private readonly saveGenrePayload = signal<CreateGenreModel | UpdateGenreModel | null>(null);
  private readonly deleteGenrePayload = signal<number | null>(null);
  private readonly getGenrePayload = computed<PaginationRequestModel<null>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
    }
  });
  protected readonly computedPaginationGenreList = computed<PaginationResponseModel<GenreModel[]> | null>(() => this.getGenreRX.value() ?? null);

  private readonly getGenreRX = rxResource({
    params: () => this.getGenrePayload(),
    stream: ({ params }) => {

       return this.genreService.getAllPagination(params).pipe(
        map(response => response),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly saveGenreRX = rxResource({
    params: () => this.saveGenrePayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      
      const request$ = 'id_genre' in params && params.id_genre > 0
         ? this.genreService.update(params.id_genre, params)
        : this.genreService.create(params);

      return request$.pipe(
        map(response => {
          this.successMessage.set('Guardado correctamente');
          return response;
        }),
        tap(() => {
          this.onClear();
          this.onReload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly deleteGenreRX = rxResource({
    params: () => this.deleteGenrePayload(),
    stream: ({ params: id_subject }) => { 
      if (!id_subject) return of(null);

       return this.genreService.delete(id_subject).pipe(
        map(response => {
          this.successMessage.set('Eliminado correctamente');
          return response;
        }),
        tap(() => {
          this.onClear();
          this.onReload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        }),
        finalize(() => {
          this.onCloseModal();
        }),
      );
    },
  });

  protected onSearchFilter(searchText: string): void {
    this.search.set(searchText);
  }
  
  protected onSelectedGenre(item: GenreModel): void {
    this.selectedGenre.set(item);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  protected onFormSubmit(form: GenreModel): void {
    const payload: CreateGenreModel | UpdateGenreModel = form.id_genre > 0
    ? {
        id_genre: form.id_genre,
        name: form.name,
      } as UpdateGenreModel
    : {
        name: form.name,
      } as CreateGenreModel;

    this.saveGenrePayload.set(payload);
  }

  protected onDeleteGenre(item: GenreModel): void {
    this.onOpenModal();
    this.selectedGenreToDelete.set(item);
  }

  protected onOpenModal(): void {
    this.isModalOpen.set(true);
  }

  protected onCloseModal(): void {
    this.isModalOpen.set(false);
  }

  protected onConfirmModal(): void {
    if (!this.selectedGenreToDelete()) return;
    const id_author = this.selectedGenreToDelete()?.id_genre ?? null

    this.deleteGenrePayload.set(id_author);
  }
  
  protected onClear(): void{
    this.selectedGenreToDelete.set(null);
    this.selectedGenre.set(null);
    this.errorMessage.set(null);
  }

  protected onReload(): void {
    this.getGenreRX.reload();
  }

  protected onNextPage(): void {
    const totalPages = this.computedPaginationGenreList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  protected onPrevPage(): void {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  protected navigateBack(): void {
    this.location.back();
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
    this.successMessage.set(null);
  }
}
