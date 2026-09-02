import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, catchError, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { CopyFormComponents } from "@features/copy/components/copy-form-components/copy-form-components";
import { CopyService } from '@features/copy/services/copy-service';
import { CopyDetailModel, CopyModel, CreateCopyModel, UpdateCopyModel } from '@features/copy/models/copy-model';
import { BookService } from '@features/book/services/book-service';
import { EditionService } from '@features/edition/services/edition-service';
import { BookModel } from '@features/book/models/book-model';
import { EditionModel } from '@features/edition/models/edition-model';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { CopyListComponents } from "@features/copy/components/copy-list-components/copy-list-components";
import { MutationService } from '@core/services/mutation-service';

@Component({
  selector: 'app-copy-form-page',
  imports: [
    DatePipe,
    NgOptimizedImage,
    SectionHeaderComponent,
    CopyFormComponents,
    CopyListComponents
  ],
  templateUrl: './copy-form-page.html',
})
export class CopyFormPage {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly mutation = inject(MutationService);

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

  readonly copyId = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => Number(params.get('copyId')) || 0)
    ),
    { initialValue: 0 }
  );

  // SERVICES -------------------------------------------------------
  // ----------------------------------------------------------------

  private readonly bookService = inject(BookService)
  private readonly getBookPayload = signal<number | null>(this.bookId());
  protected readonly computedBook = computed<BookModel | null>(() => this.getBookRX.value() ?? null);

  private readonly editionService = inject(EditionService);
  private readonly getEditionPayload = signal<number | null>(this.editionId());
  protected readonly computedEdition = computed<EditionModel | null>(() => this.getEditionRX.value() ?? null);

  private readonly copyService = inject(CopyService);
  private readonly getCopyByEditionPayload = signal<number | null>(this.editionId());
  private readonly isSaving = signal<boolean>(false);
  protected readonly computedCopyList = computed<CopyDetailModel[]>(() => this.getCopyByEditionRX.value() ?? []);
  protected readonly selectedCopy = computed<CopyModel | null>(() => {
    const id = this.copyId();
    const list = this.computedCopyList();
    if (id <= 0 || !list.length) return null;

    const item = list.find(e => e.id_copy === id);
    if (!item) return null;

    return { ...item } as CopyModel;
  });

  private readonly validateSelectedCopyEffect = effect(() => {
    const id = this.copyId();
    const list = this.computedCopyList();

    if (id > 0 && list.length > 0) {
      const exists = list.some(c => c.id_copy === id);
      if (!exists) {
        this.selectCopy(0);
      }
    }
  });

  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getBookRX,
      this.getEditionRX,
      this.getCopyByEditionRX,
    ].some(r => r.isLoading())
  );

  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book || id_book === 0) return of(null);

      return this.bookService.getById(id_book).pipe(
        catchError(err => {
          console.error('[CopyService::CopyFormPage] getBook:', err);
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
          console.error('[EditionService::CopyFormPage] getEdition:', err);
          return of(null);
        })
      );
    }
  });

  private readonly getCopyByEditionRX = rxResource({
    params: () => this.getCopyByEditionPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition || id_edition === 0) return of(null);

      return this.copyService.getAllByEditionId(id_edition).pipe(
        catchError(err => {
          console.error('[CopyService::CopyFormPage] getCopyByEdition:', err);
          return of(null);
        })
      );
    }
  });

  protected selectCopy(id_copy: number): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { copyId: id_copy },
      queryParamsHandling: 'merge'
    });
  }

  protected formSubmit(form: CopyModel): void {
    const edition_id = this.getEditionPayload()
    if (!edition_id) return

    const id = form.id_copy;
    const payload: CreateCopyModel | UpdateCopyModel = id > 0
    ? {
        id_copy: form.id_copy,
        signature_topography: form.signature_topography,
        edition_id: edition_id,
        copy_number: form.copy_number,
        status_id: form.status_id,
      }
    : {
        signature_topography: form.signature_topography,
        edition_id: edition_id,
        copy_number: form.copy_number,
      };

    this.mutation.run(
      id > 0
        ? this.copyService.update(id, payload as UpdateCopyModel)
        : this.copyService.create(payload as CreateCopyModel),
      { isSaving: this.isSaving },
      {
        successMsg: id > 0 ? 'Ejemplar modificado correctamente' : 'Ejemplar guardado correctamente',
        errorMsg: id > 0 ? 'Error al modificar el Ejemplar' : 'Error al guardar el Ejemplar',
        onSuccess: () => {
          this.getCopyByEditionRX.reload();
        },
      }
    );
  }

  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM(this.bookId(), this.editionId())]);
  }
}