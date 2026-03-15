import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EditionService } from '@features/edition/services/edition-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { catchError, map, of, tap } from 'rxjs';
import { EditionFormComponents } from "@features/edition/components/edition-form-components/edition-form-components";
import { EditionImageService } from '@features/edition/services/edition-image-service';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { EditionCopyListComponents } from "@features/edition-copy/components/edition-copy-list-components/edition-copy-list-components";
import { Router } from '@angular/router';
import { EditionCopyDetailModel } from '@features/edition-copy/models/edition-copy-detail-model';
import { ModalDeleteComponent } from "@shared/components/modal-delete-component/modal-delete-component";
import { EditionCopyService } from '@features/edition-copy/services/edition-copy-service';
import { CreateEditionModel, UpdateEditionModel } from '@features/edition/models/edition-model';
import { EditionFormVM } from '@features/edition/models/vm.edition-form-model';

@Component({
  selector: 'app-edition-form-page',
  imports: [
    SectionHeaderComponent,
    EditionFormComponents,
    MessageErrorComponent,
    EditionCopyListComponents,
    ModalDeleteComponent
],
  templateUrl: './edition-form-page.html',
})
export class EditionFormPage {
  private readonly router = inject(Router);

  private readonly state = history.state as {
    book_title: string,
    id_book: number,
    id_edition: number,
  }

  protected readonly isEditMode = computed<boolean>(() => !!this.editionIdPayload())
  protected readonly title = computed<string>(() => 
    this.isEditMode() 
    ? `Modificar ejemplar de: ${ this.state.book_title }` 
    : `Crear ejemplar para: ${ this.state.book_title }`
  )
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getEditionRX,
      this.addEditionRX,
      this.uploadEditionImageRX,
      this.deleteEditionImageRX,
      this.deleteEditionCopyRX,
    ].some(r => r.isLoading())
  );
  
  private readonly editionService = inject(EditionService);
  protected readonly editionFormVMComputed = computed<EditionFormVM>(() => {
    const edition = this.getEditionRX.value();

    return {
      id_edition: edition?.id_edition ?? this.state.id_edition,
      edition: edition?.edition ?? '',
      isbn: edition?.isbn ?? '',
      publication_year: edition?.publication_year ?? 0,
      pages: edition?.pages ?? 0,
      cover_image: edition?.cover_image ?? null,
      book_id: edition?.book?.id_book ?? this.state.id_book,
      editorial_id: edition?.editorial?.id_editorial ?? 0,
      created_at: edition?.created_at ?? '',
      updated_at: edition?.updated_at ?? '',
      file: null,
      isNewImg: !edition?.cover_image,
      copies: edition?.copies ?? []
    };
  });
  private readonly editionIdPayload = signal<number | null>(this.state.id_edition);

  private readonly getEditionRX = rxResource({
    params: () => this.editionIdPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition || id_edition == 0) return of(null);

      return this.editionService.getById(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly addBaseEditionPayload = signal<CreateEditionModel | UpdateEditionModel | null>(null);
  private readonly addEditionPayload = signal<CreateEditionModel | UpdateEditionModel | null>(null);

  private readonly addEditionRX = rxResource({
    params: () => this.addEditionPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      const request$ = 'id_edition' in params && params.id_edition > 0
      ? this.editionService.update(params.id_edition, params)
      : this.editionService.create(params) 

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(edition => {
          this.editionIdPayload.set(edition.id_edition); 
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
  private readonly uploadImagePayload = signal<File | null>(null);

  private readonly uploadEditionImageRX = rxResource({
    params: () => this.uploadImagePayload(),
    stream: ({ params: file }) => {
      if (!file) return of(null);

      return this.editionImageService.create(file).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(url => {
          const base = this.addBaseEditionPayload();
          if (!base) return;
  
          this.addEditionPayload.set({
            ...base,
            cover_image: url
          });
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly deleteImagePayload = signal<number | null>(null);

  private readonly deleteEditionImageRX = rxResource({
    params: () => this.deleteImagePayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition) return of(null);

      return this.editionImageService.delete(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(() => {
          this.getEditionRX.reload();
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  private readonly editionCopyService = inject(EditionCopyService);
  private readonly deleteEditionCopyPayload = signal<number | null>(null);

  private readonly deleteEditionCopyRX = rxResource({
    params: () => this.deleteEditionCopyPayload(),
    stream: ({ params: id_copy }) => {
      if (!id_copy) return of(null);

      return this.editionCopyService.delete(id_copy).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.result;
        }),
        tap(() => {
          this.openDeleteModal.set(false);
          this.getEditionRX.reload();
        }),
        catchError(err => {
          const message = err?.error?.detail || err?.error?.message || err?.message || 'Unexpected error';
          this.errorMessage.set(message);
          return of(null);
        })
      );
    }
  });

  protected formSubmit(form: EditionFormVM): void {
    const payload: CreateEditionModel | UpdateEditionModel =
    form.id_edition === 0
      ? (form as CreateEditionModel)
      : (form as UpdateEditionModel);

    this.addBaseEditionPayload.set(payload);

    if (form.file) {
      // subir imagen primero
      this.uploadImagePayload.set(form.file);
    } else {
      // guardar directamente
      this.addEditionPayload.set(payload);
    }
  }

  protected deleteImage(id_edition: number): void {
    this.deleteImagePayload.set(id_edition);
  }

  protected onCeateCopy(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.COPY.FORM], {
      state: {
        book_title: this.state.book_title,
        id_book: this.state.id_book,
        id_edition: this.editionFormVMComputed()?.id_edition,
        id_copy: 0,
      }
    }); 
  }

  protected onEditEdition(item: EditionCopyDetailModel): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.COPY.FORM], {
      state: {
        book_title: this.state.book_title,
        id_book: this.state.id_book,
        id_edition: item.edition_id,
        id_copy: item.id_copy,
      }
    }); 
  }

  // onDelete --------------------------------------------------------
  protected readonly openDeleteModal = signal<boolean>(false);
  readonly selectedEditionCopyDetailToDelete = signal<EditionCopyDetailModel | null>(null);
  
  protected onDeleteEditionCopy(item: EditionCopyDetailModel): void {
    if (!item) return;
    this.selectedEditionCopyDetailToDelete.set(item);
    this.openDeleteModal.set(true);
  }

  confirmDelete() {
    const selectedBookToDelete = this.selectedEditionCopyDetailToDelete();
    if (!selectedBookToDelete) return;
    this.deleteEditionCopyPayload.set(selectedBookToDelete.id_copy);
  } 

  closeDeleteModal() {
    this.openDeleteModal.set(false);
  }
  // -----------------------------------------------------------------
  
  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOKS.FORM, this.state.id_book]);
  }
}
