import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { EditionService } from '@features/edition/services/edition-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { catchError, map, of, switchMap } from 'rxjs';
import { EditionFormComponents } from "@features/edition/components/edition-form-components/edition-form-components";
import { EditionImageService } from '@features/edition/services/edition-image-service';
import { ActivatedRoute, Router } from '@angular/router';
import { EditionModel, SaveEditionModel } from '@features/edition/models/edition-model';
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
      map(params => Number(params.get('id_book')) || 0)
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
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getBookRX,
      this.getEditionRX,
    ].some(r => r.isLoading())
  );

  private readonly bookService = inject(BookService);
  protected readonly book = computed<BookModel | null>(() => this.getBookRX.value() ?? null);

  private readonly editionService = inject(EditionService);
  private readonly editionImageService = inject(EditionImageService);
  protected readonly edition = {
    isSaving: signal<boolean>(false),
    data: computed<EditionModel | null>(() => {
      const data = this.getEditionRX.value()
      if (!data) return null
  
      return {
        ...data,
        book_id: this.bookId(),
      }
    })
  }

  private readonly copyService = inject(CopyService)
  protected readonly copy = {
    selectedItem: signal<CopyModel | null>(null),
    dataList: computed<CopyModel[]>(() => this.getCopyByEditionRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getCopyByEditionRX.isLoading()),
    isSaving: signal<boolean>(false),
    showForm: signal<boolean>(false),
  }

  protected readonly isEditMode = computed<boolean>(() => !! this.edition.data())
  protected readonly heading = computed<string>(() =>
    this.isEditMode()
    ? `Modificar Edición de: ${ this.book()?.title }`
    : `Crear Edición para: ${ this.book()?.title }`
  )

  private readonly getBookRX = rxResource({
    params: () => this.bookId(),
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
    params: () => this.editionId(),
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
  protected submitEditionForm(form: { id: number, data: SaveEditionModel, img: File | null }): void {
    const id = form.id;
    const img = form.img;
    const payload = { ...form.data };
    payload.book_id = this.bookId();

    const request$ = img
      ? this.editionImageService.upload(img).pipe(
          switchMap(url => this.saveEdition(id, { ...payload, cover_image: url }))
        )
      : this.saveEdition(id, payload);

    this.mutation.run(
      request$,
      { isSaving: this.edition.isSaving },
      {
        successMsg: this.isEditMode() ? 'Edición modificada correctamente' : 'Edición guardada correctamente',
        errorMsg: this.isEditMode() ? 'Error al modificar la Edición' : 'Error al guardar la Edición',
        onSuccess: (result) => this.onEditionSaved(result),
      }
    );
  }

  private onEditionSaved(result: EditionModel | null | undefined): void {
    if (!this.isEditMode() && result) {
      this.router.navigate([
        ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM(result.id_edition, this.bookId())
      ]);
    } else {
      this.getEditionRX.reload();
    }
  }

  private saveEdition(id: number, payload: SaveEditionModel) {
    return id > 0
      ? this.editionService.update(id, payload)
      : this.editionService.create(payload);
  }

  protected deleteImage(id_edition: number): void {
    this.mutation.run(
      this.editionImageService.delete(id_edition),
      { isSaving: this.edition.isSaving },
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
      { isSaving: this.copy.isSaving },
      {
        successMsg: 'Copia eliminada correctamente',
        errorMsg: 'Error al eliminar la Copia',
        onSuccess: () => this.getCopyByEditionRX.reload(),
      }
    );
  }

  protected submitCopyForm(item: SaveCopyModel): void {
    const id = this.copy.selectedItem()?.id_copy ?? 0
    if (!item) return;

    const payload: SaveCopyModel = { ...item, edition_id: this.editionId() };

    this.mutation.run(
      id > 0
        ? this.copyService.update(id, payload)
        : this.copyService.create(payload),
      { isSaving: this.copy.isSaving },
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