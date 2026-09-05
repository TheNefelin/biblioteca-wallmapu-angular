import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BookModel } from '@features/book/models/book-model';
import { BookService } from '@features/book/services/book-service';
import { CopyDetailModel } from '@features/copy/models/copy-model';
import { CopyService } from '@features/copy/services/copy-service';
import { EditionModel } from '@features/edition/models/edition-model';
import { EditionService } from '@features/edition/services/edition-service';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { AuthStore } from '@features/auth/services/auth-store';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { MutationService } from '@core/services/mutation-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { CopyListForReservationComponents } from "@features/copy/components/copy-list-for-reservation-components/copy-list-for-reservation-components";
import { ButtonComponent } from "@shared/components/button-component/button-component";

export function pickInitialCopy(
  editions: readonly EditionModel[],
  copies: readonly CopyDetailModel[],
  idEdition: number,
): { copy: CopyDetailModel; edition: EditionModel } | null {
  const selectedEdition = editions.find(edition => edition.id_edition === idEdition);
  if (!selectedEdition) return null;

  const candidateCopies = copies.filter(copy => copy.edition_id === idEdition);
  if (candidateCopies.length === 0) return null;

  const copy =
    candidateCopies.find(candidate => candidate.is_availability) ??
    candidateCopies.find(candidate => !candidate.is_availability);
  if (!copy) return null;

  return { copy, edition: selectedEdition };
}

@Component({
  selector: 'app-reservation-page',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
    CopyListForReservationComponents,
    ButtonComponent,
  ],
  templateUrl: './reservation-page.html',
})
export class ReservationPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly confirmService = inject(ModalConfirmService);
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

  // SERVICES -------------------------------------------------------------------------
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getBookRX,
      this.getEditionRX,
      this.getCopyRX,
    ].some(r => r.isLoading())
  );

  private readonly auth = inject(AuthStore);
  protected readonly isAuthenticated = computed<boolean>(() => this.auth.isAuthenticated());

  private readonly reservationService = inject(ReservationService);
  protected readonly isSaving = signal<boolean>(false);

  private readonly bookService = inject(BookService);
  protected readonly book = computed<BookModel | null>(() => this.getBookRX.value() ?? null);

  private readonly editionService = inject(EditionService);
  protected readonly edition = {
    dataList: computed<EditionModel[]>(() => this.getEditionRX.value() ?? []),
    selectedItem: signal<EditionModel | null>(null),
  }

  private readonly copyService = inject(CopyService);
  protected readonly copy = {
    dataList: computed<CopyDetailModel[]>(() => this.getCopyRX.value() ?? []),
    selectedItem: signal<CopyDetailModel | null>(null),
  }

  private readonly autoSelectEffect = effect(() => {
    const result = pickInitialCopy(
      this.edition.dataList(),
      this.copy.dataList(),
      this.editionId(),
    );
    if (!result) return;

    this.copy.selectedItem.set(result.copy);
    this.edition.selectedItem.set(result.edition);
  });

  private readonly getBookRX = rxResource({
    params: () => this.bookId(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.bookService.getById(id_book).pipe(
        catchError(err => {
          console.error('[BookService::ReservationPage] getBook:', err);
          return of(null);
        })
      );
    }
  });

  private readonly getEditionRX = rxResource({
    params: () => this.bookId(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.editionService.getAllByBook(id_book).pipe(
        catchError(err => {
          console.error('[EditionService::ReservationPage] getEdition:', err);
          return of(null);
        })
      );
    }
  });

  private readonly getCopyRX = rxResource({
    params: () => this.bookId(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.copyService.getAllByBookId(id_book).pipe(
        catchError(err => {
          console.error('[CopyService::ReservationPage] getCopy:', err);
          return of(null);
        })
      );
    }
  });
   
  // RESERVATION ACTIONS ----------------------------------------------------------------
  protected onSelectedCopy(item: CopyDetailModel): void {
    const selectedEdition = this.edition.dataList().find(e => e.id_edition === item.edition_id); 
    if (!selectedEdition) return;

    this.copy.selectedItem.set(item);
    this.edition.selectedItem.set(selectedEdition);

    this.viewportScroller.scrollToPosition([0, 0]);
  }

  protected async onConfirmReservation(): Promise<void> {
    const copyId = this.copy.selectedItem()?.id_copy;
    if (!copyId) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Crear Reserva',
      message: `¿Seguro que deseas reservar el libro "${this.book()?.title}"?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.reservationService.create({ copy_id: copyId }),
      { isSaving: this.isSaving },
      {
        successMsg: 'Reserva registrada correctamente',
        errorMsg: 'Error al crear la Reserva',
        onSuccess: () => this.getCopyRX.reload(),
      }
    );
  }
}
