import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EditionModel } from '@features/edition/models/edition-model';
import { EditionService } from '@features/edition/services/edition-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { catchError, map, of, tap } from 'rxjs';
import { EditionFormComponents } from "@features/edition/components/edition-form-components/edition-form-components";
import { EditionImageService } from '@features/edition/services/edition-image-service';
import { ImagePreviewVM } from '@features/edition/models/vm.image-preview';

@Component({
  selector: 'app-edition-form-page',
  imports: [
    SectionHeaderComponent,
    EditionFormComponents
],
  templateUrl: './edition-form-page.html',
})
export class EditionFormPage {
  private readonly state = history.state as {
    title: string,
    id_book: number;
    id_edition: number;
  };

  private readonly router = inject(Router);
  protected readonly id_book = signal<number>(this.state.id_book ?? 0);
  protected readonly id_edition = signal<number>(this.state.id_edition);
  protected readonly isEditMode = signal<boolean>(this.id_edition() > 0)
  protected readonly title = signal<string>(this.isEditMode() ? `Modificar Ejemplar para: ${this.state.title}` : `Crear Ejemplar para: ${this.state.title}` )
  protected readonly editionForm = signal<EditionModel>({
    id_edition: 0,
    edition: '',
    isbn: '',
    publication_year: 0,
    pages: 0,
    cover_image: '',
    created_at: '',
    updated_at: '',
    book_id: 0,
    editorial_id: 0
  });
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() => this.editionGetRX.isLoading());

  private readonly editionService = inject(EditionService);

  private readonly editionGetRX = rxResource({
    params: () => this.id_edition(),
    stream: ({ params: id }) => {
      if (!id || id == 0) return of(null);

      return this.editionService.getById(id).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(edition => {
          if (!edition) {
            this.isEditMode.set(false);
            return;
          }

          this.editionForm.set(edition)
          this.isEditMode.set(true);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly editionImageService = inject(EditionImageService);
  private readonly newImagePayload = signal<File | null>(null);

  private readonly newEditionImageRX = rxResource({
    params: () => this.newImagePayload(),
    stream: ({ params: file }) => {
      if (!file) return of(null);

      return this.editionImageService.create(file).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(url => {
          if (!url) return;

          this.editionForm.update(e => ({ 
            ...e, 
            cover_image: url
          }));          
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.FORM, this.id_book()]);
  }
}
