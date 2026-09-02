import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { EditionService } from '@features/edition/services/edition-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { catchError, map, of, switchMap } from 'rxjs';
import { EditionFormComponents } from "@features/edition/components/edition-form-components/edition-form-components";
import { EditionImageService } from '@features/edition/services/edition-image-service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateEditionModel, UpdateEditionModel } from '@features/edition/models/edition-model';
import { EditionFormVM } from '@features/edition/models/vm.edition-form-model';
import { CopyService } from '@features/copy/services/copy-service';
import { CopyModel, SaveCopyModel } from '@features/copy/models/copy-model';
import { BookService } from '@features/book/services/book-service';
import { BookModel } from '@features/book/models/book-model';
import { CopyListForEditionComponents } from "@features/copy/components/copy-list-for-edition-components/copy-list-for-edition-components";
import { MutationService } from '@core/services/mutation-service';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { CopyFormComponents } from "@features/copy/components/copy-form-components/copy-form-components";

@Component({
  selector: 'app-edition-form-page',
  imports: [
    SectionHeaderComponent,
    EditionFormComponents,
    CopyListForEditionComponents,
    CopyFormComponents
],
  templateUrl: './edition-form-page.html',
})
export class EditionFormPage {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mutation = inject(MutationService);
  private readonly confirmService = inject(ModalConfirmService);

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

  // SERVICES -------------------------------------------------------------------------

  private readonly bookService = inject(BookService);
  private readonly getBookPayload = signal<number | null>(this.bookId());
  protected readonly computedBook = computed<BookModel | null>(() => this.getBookRX.value() ?? null);

  private readonly editionService = inject(EditionService);
  private readonly getEditionPayload = signal<number | null>(this.editionId());

  private readonly copyService = inject(CopyService)
  protected readonly copy = {
    selectedItem: signal<CopyModel | null>(null),
    isLoading: computed<boolean>(() => this.getCopyByEditionRX.isLoading()),
    showForm: signal<boolean>(false),
    dataList: computed<CopyModel[]>(() => this.getCopyByEditionRX.value() ?? [])
  }

  private readonly editionImageService = inject(EditionImageService);
  protected readonly isSaving = signal<boolean>(false);

  protected readonly isEditMode = computed<boolean>(() => !!this.getEditionPayload())
  protected readonly title = computed<string>(() =>
    this.isEditMode()
    ? `Modificar Edición de: ${ this.computedBook()?.title }`
    : `Crear Edición para: ${ this.computedBook()?.title }`
  )
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getEditionRX,
      this.getCopyByEditionRX,
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
      formats: edition?.formats ?? [],
      created_at: edition?.created_at ?? '',
      updated_at: edition?.updated_at ?? '',
      file: null,
      isNewImg: !edition?.cover_image,
    };
  });

  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book || id_book === 0) return of(null);

      return this.bookService.getById(id_book).pipe(
        catchError(err => {
          console.error('[BookService::EditionFormPage] getBook:', err);
          return of(null);
        })
      );
    }
  });

  private readonly getEditionRX = rxResource({
    params: () => this.getEditionPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition || id_edition === 0) return of(null);

      return this.editionService.getById(id_edition).pipe(
        catchError(err => {
          console.error('[EditionService::EditionFormPage] getEdition:', err);
          return of(null);
        })
      );
    }
  });

  private readonly getCopyByEditionRX = rxResource({
    params: () => this.editionId(),
    stream: ({ params: id_edition }) => {
      if (!id_edition || id_edition === 0) return of(null);

      return this.copyService.getAllByEditionId(id_edition).pipe(
        catchError(err => {
          console.error('[CopyService::EditionFormPage] getCopy:', err);
          return of(null);
        })
      );
    }
  });

  // Edition Acctions ----------------------------------------------------------------------
  protected formSubmit(form: EditionFormVM): void {
    const basePayload = {
      ...form,
      format_ids: form.formats.map(e => e.id_format),
    }

    const payload: CreateEditionModel | UpdateEditionModel = basePayload.id_edition === 0
      ? (basePayload as CreateEditionModel)
      : (basePayload as UpdateEditionModel);

    const id = basePayload.id_edition;

    const request$ = basePayload.file
      ? this.editionImageService.create(basePayload.file).pipe(
          switchMap(url => this.saveEdition(id, { ...payload, cover_image: url }))
        )
      : this.saveEdition(id, payload);

    this.mutation.run(
      request$,
      { isSaving: this.isSaving },
      {
        successMsg: this.isEditMode() ? 'Edición modificada correctamente' : 'Edición guardada correctamente',
        errorMsg: this.isEditMode() ? 'Error al modificar la Edición' : 'Error al guardar la Edición',
        onSuccess: () => {
          this.getEditionRX.reload();
        },
      }
    );
  }

  private saveEdition(id: number, payload: CreateEditionModel | UpdateEditionModel) {
    return id > 0
      ? this.editionService.update(id, payload as UpdateEditionModel)
      : this.editionService.create(payload as CreateEditionModel);
  }

  protected deleteImage(id_edition: number): void {
    this.mutation.run(
      this.editionImageService.delete(id_edition),
      { isSaving: this.isSaving },
      {
        successMsg: 'Imagen eliminada correctamente',
        errorMsg: 'Error al eliminar la Imagen',
        onSuccess: () => this.getEditionRX.reload(),
      }
    );
  }

  // Copy Actions -------------------------------------------------------------------
  protected onReloadCopy(): void {
    this.getCopyByEditionRX.reload();
  }

  protected onCreateCopy(): void {
    this.copy.selectedItem.set(null);
    this.copy.showForm.set(true);
  }

  protected onEditCopy(item: CopyModel): void {
    this.copy.selectedItem.set(item);
    this.copy.showForm.set(true);
  }

  protected async onDeleteCopy(item: CopyModel): Promise<void> {
    if (!item) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Eliminar Copia',
      message: `¿Estás seguro que deseas eliminar la Copia (${item.signature_topography} - N° ${item.copy_number})?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.copyService.delete(item.id_copy),
      { isSaving: this.isSaving },
      {
        successMsg: 'Copia eliminada correctamente',
        errorMsg: 'Error al eliminar la Copia',
        onSuccess: () => this.getCopyByEditionRX.reload(),
      }
    );
  }

  protected submitCopyForm(item: SaveCopyModel): void {
    const id = this.copy.selectedItem()?.id_copy ?? 0
    const payload = item;
    if (!item) return;

    item.edition_id = this.editionId();

    this.mutation.run(
      id > 0
        ? this.copyService.update(id, payload)
        : this.copyService.create(payload),
      { isSaving: this.isSaving },
      {
        successMsg: id > 0
          ? `Copia N°: ${payload.copy_number} - (${payload.signature_topography}) modificado correctamente`
          : `Copia N°: ${payload.copy_number} - (${payload.signature_topography}) creado correctamente`,
        errorMsg: id > 0 ? 'Error al modificar la Copia' : 'Error al crear la Copia',
        onSuccess: () => {
          this.copy.showForm.set(false)
          this.copy.selectedItem.set(null);
          this.getCopyByEditionRX.reload();
        },
      }
    );
  }

  // Actions -----------------------------------------------------------------------------
  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.BOOK.FORM(this.bookId())]);
  }

  protected navigateToEditorial(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITORIAL.ROOT]);
  }

  protected navigateToFormat(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.FORMAT.ROOT]);
  }
}