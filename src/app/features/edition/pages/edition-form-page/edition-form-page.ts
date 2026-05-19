import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { EditionService } from '@features/edition/services/edition-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { catchError, map, of, tap } from 'rxjs';
import { EditionFormComponents } from "@features/edition/components/edition-form-components/edition-form-components";
import { EditionImageService } from '@features/edition/services/edition-image-service';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEditionModel, UpdateEditionModel } from '@features/edition/models/edition-model';
import { EditionFormVM } from '@features/edition/models/vm.edition-form-model';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { CopyService } from '@features/copy/services/copy-service';
import { CopyDetailModel } from '@features/copy/models/copy-model';
import { BookService } from '@features/book/services/book-service';
import { BookModel } from '@features/book/models/book-model';
import { CopyListForEditionComponents } from "@features/copy/components/copy-list-for-edition-components/copy-list-for-edition-components";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { extractErrorMessage } from '@core/utils/error-handler';
import { ButtonCreateComponent } from "@shared/components/button-create-component/button-create-component";

@Component({
  selector: 'app-edition-form-page',
  imports: [
    SectionHeaderComponent,
    EditionFormComponents,
    MessageErrorComponent,
    MessageSuccessComponent,
    CopyListForEditionComponents,
    ModalActionComponent,
    ButtonCreateComponent
],
  templateUrl: './edition-form-page.html',
})
export class EditionFormPage {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  readonly bookId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => Number(params.get('bookId')) || 0)
    ),
    { initialValue: 0 }
  );

  readonly editionId = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => Number(params.get('editionId')) || 0)
    ),
    { initialValue: 0 }
  );

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly bookService = inject(BookService);
  private readonly getBookPayload = signal<number | null>(this.bookId());
  protected readonly computedBook = computed<BookModel | null>(() => this.getBookRX.value() ?? null);

  private readonly editionService = inject(EditionService);
  private readonly getEditionPayload = signal<number | null>(this.editionId());
  private readonly addBaseEditionPayload = signal<CreateEditionModel | UpdateEditionModel | null>(null);
  private readonly addEditionPayload = signal<CreateEditionModel | UpdateEditionModel | null>(null);

  private readonly copyService = inject(CopyService)
  private readonly getCopyPayload = signal<number | null>(this.editionId());
  private readonly deleteCopyPayload = signal<number | null>(null);
  protected readonly computedCopyList = computed<CopyDetailModel[]>(() => this.getCopyRX.value() ?? [])

  private readonly editionImageService = inject(EditionImageService);
  private readonly uploadImagePayload = signal<File | null>(null);
  private readonly deleteImagePayload = signal<number | null>(null);

  protected readonly isEditMode = computed<boolean>(() => !!this.getEditionPayload())
  protected readonly title = computed<string>(() => 
    this.isEditMode() 
    ? `Modificar Edición de: ${ this.computedBook()?.title }` 
    : `Crear Edición para: ${ this.computedBook()?.title }`
  )
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getEditionRX,
      this.addEditionRX,
      this.uploadEditionImageRX,
      this.deleteEditionImageRX,
      this.getCopyRX,
      this.deleteCopyRX,
    ].some(r => r.isLoading())
  );
  protected readonly editionFormVMComputed = computed<EditionFormVM>(() => {
    const edition = this.getEditionRX.value();

    return {
      id_edition: edition?.id_edition ?? this.editionId(),
      book_id: edition?.book_id ?? this.bookId(),
      edition: edition?.edition ?? '',
      isbn: edition?.isbn ?? '',
      publication_year: edition?.publication_year ?? 0,
      pages: edition?.pages ?? 0,
      cover_image: edition?.cover_image ?? null,
      editorial_id: edition?.editorial_id ?? 0,
      created_at: edition?.created_at ?? '',
      updated_at: edition?.updated_at ?? '',
      file: null,
      isNewImg: !edition?.cover_image,
    };
  });

  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book || id_book == 0) return of(null);

      return this.bookService.getById(id_book).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });
  
  private readonly getEditionRX = rxResource({
    params: () => this.getEditionPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition || id_edition == 0) return of(null);

      return this.editionService.getById(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

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
          this.successMessage.set(response.message);
          return response.data;
        }),
        tap(edition => {
          this.getEditionPayload.set(edition.id_edition); 
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly uploadEditionImageRX = rxResource({
    params: () => this.uploadImagePayload(),
    stream: ({ params: file }) => {
      if (!file) return of(null);

      return this.editionImageService.create(file).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
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
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly deleteEditionImageRX = rxResource({
    params: () => this.deleteImagePayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition) return of(null);

      return this.editionImageService.delete(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
        }),
        tap(() => {
          this.getEditionRX.reload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });
  
  private readonly getCopyRX = rxResource({
    params: () => this.getCopyPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition) return of(null);

      return this.copyService.getAllByEditionId(id_edition).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });  

  private readonly deleteCopyRX = rxResource({
    params: () => this.deleteCopyPayload(),
    stream: ({ params: id_copy }) => {
      if (!id_copy) return of(null);
      
      return this.copyService.delete(id_copy).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
        }),
        tap(() => {
          this.openDeleteModal.set(false);
          this.getCopyRX.reload();
        }),
        catchError(err => {
          this.handleError(err);
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
    this.router.navigate(
      [
        ROUTES_CONSTANTS.PROTECTED.ADMIN.COPY.FORM(this.bookId(), this.editionId())
      ],
      {
        queryParams: { copyId: 0 }
      }
    );
  }

  protected onEditEdition(item: CopyDetailModel): void {
    this.router.navigate(
      [
        ROUTES_CONSTANTS.PROTECTED.ADMIN.COPY.FORM(this.bookId(), item.edition_id)
      ],
      {
        queryParams: { copyId: item.id_copy }
      }
    );
  }

  // onDelete --------------------------------------------------------
  protected readonly openDeleteModal = signal<boolean>(false);
  readonly selectedCopyToDelete = signal<CopyDetailModel | null>(null);
  
  protected onDeleteCopy(item: CopyDetailModel): void {
    if (!item) return;
    this.selectedCopyToDelete.set(item);
    this.openDeleteModal.set(true);
  }

  confirmDelete() {
    const selectedBookToDelete = this.selectedCopyToDelete();
    if (!selectedBookToDelete) return;
    this.deleteCopyPayload.set(selectedBookToDelete.id_copy);
    this.closeDeleteModal();
  }

  closeDeleteModal() {
    this.openDeleteModal.set(false);
  }
  // -----------------------------------------------------------------
  
  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.FORM(this.bookId())]);
  }

  protected navigateToEditorial(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITORIAL.ROOT]); 
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
    this.successMessage.set(null);
  }
}
