import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EditionCopyModel } from '@features/edition-copy/models/edition-copy-model';
import { EditionCopyService } from '@features/edition-copy/services/edition-copy-service';
import { catchError, map, of, tap } from 'rxjs';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edition-copy-form-page',
  imports: [
    JsonPipe,
    SectionHeaderComponent
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
  
  protected readonly editionCopyForm = signal<EditionCopyModel>({
    id_copy: this.state.id_copy,
    barcode: '',
    signature_topography: '',
    copy_number: 0,
    created_at: '',
    updated_at: '',
    edition_id: 0,
    status: null,
  });
  protected readonly isEditMode = signal<boolean>(this.editionCopyForm().id_copy > 0)
  protected readonly book_edition_name = computed<string>(() => 
    this.isEditMode() 
    ? `Modificar copia de: ${ this.state.book_title }` 
    : `Crear copia para: ${ this.state.book_title }`
  )
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.copyRX,
    ].some(r => r.isLoading())
  );

  private readonly editionCopyService = inject(EditionCopyService);
  private readonly getEditionCopyPayload = signal<number | null>(this.editionCopyForm().id_copy);

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
          if (!copy) {
            this.isEditMode.set(false);
            return;
          }

          this.editionCopyForm.update(e => ({ 
            ...e, 
            ...copy,
          })); 

          this.getEditionCopyPayload.set(null);
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


  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM], {
      state: {
        book_title: this.state.book_title,
        id_book: this.state.id_book,
        id_edition: this.editionCopyForm().edition_id,
      }
    }); 
  }
}
