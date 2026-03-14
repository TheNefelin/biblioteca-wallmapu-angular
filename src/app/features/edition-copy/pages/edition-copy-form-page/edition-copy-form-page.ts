import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EditionCopyService } from '@features/edition-copy/services/edition-copy-service';
import { catchError, map, of, tap } from 'rxjs';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';
import { EditionCopyFormComponents } from "@features/edition-copy/components/edition-copy-form-components/edition-copy-form-components";
import { EditionCopyDetailModel } from '@features/edition-copy/models/edition-copy-detail-model';
import { EditionCopyFormModel } from '@features/edition-copy/models/edition-copy-form-model';

@Component({
  selector: 'app-edition-copy-form-page',
  imports: [
    SectionHeaderComponent,
    EditionCopyFormComponents
],
  templateUrl: './edition-copy-form-page.html',
})
export class EditionCopyFormPage {
  private readonly router = inject(Router);

  readonly state = history.state as {
    book_title: string,
    id_book: number,
    id_edition: number,
    id_copy: number,
  }
  
  protected readonly editionCopyDetail = signal<EditionCopyDetailModel>({
    id_copy: this.state.id_copy,
    edition_id: this.state.id_edition,
    barcode: '',
    signature_topography: '',
    copy_number: 0,
    created_at: '',
    updated_at: '',
    status: null,
  });
  protected readonly isEditMode = computed(
    () => this.editionCopyDetail().id_copy > 0
  );
  protected readonly book_edition_name = computed<string>(() => 
    this.isEditMode() 
    ? `Modificar copia de: ${ this.state.book_title }` 
    : `Crear copia para: ${ this.state.book_title }`
  )
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.copyRX,
      this.createCopyRX,
    ].some(r => r.isLoading())
  );

  private readonly editionCopyService = inject(EditionCopyService);
  private readonly getEditionCopyPayload = signal<number | null>(this.editionCopyDetail().id_copy);

  private readonly copyRX = rxResource({
    params: () => this.getEditionCopyPayload(),
    stream: ({ params: id_copy }) => {
      if (!id_copy || id_copy == 0) return of(null);

      return this.editionCopyService.getById(id_copy).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(copy => {
          this.editionCopyDetail.update(e => ({ 
            ...e, 
            ...copy,
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

  private readonly newEditionCopyPayload = signal<EditionCopyFormModel | null>(null);

  private readonly createCopyRX = rxResource({
    params: () => this.newEditionCopyPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.editionCopyService.create(params).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(copy => {
          this.getEditionCopyPayload.set(copy.id_copy);

          this.newEditionCopyPayload.set(null);
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  protected formSubmit(form: EditionCopyFormModel): void {
    if (!form) return

    this.newEditionCopyPayload.set(form);
  }

  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM], {
      state: {
        book_title: this.state.book_title,
        id_book: this.state.id_book,
        id_edition: this.state.id_edition,
      }
    }); 
  }
}
