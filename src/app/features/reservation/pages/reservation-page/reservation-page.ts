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

@Component({
  selector: 'app-reservation-page',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
    CopyListForReservationComponents,
  ],
  templateUrl: './reservation-page.html',
})
export class ReservationPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly auth = inject(AuthStore);
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
  private readonly bookService = inject(BookService);
  protected readonly book = computed<BookModel | null>(() => this.getBookRX.value() ?? null);

  private readonly editionService = inject(EditionService);
  protected readonly editionList = computed<EditionModel[]>(() => this.getEditionRX.value() ?? []);

  private readonly copyService = inject(CopyService);
  protected readonly copyList = computed<CopyDetailModel[]>(() => this.getCopyRX.value() ?? []);

  private readonly selectedCopyId = signal<number>(0);

  private readonly reservationService = inject(ReservationService);
  protected readonly reservation = {
    selectedCopy: computed<CopyDetailModel | null>(() =>
      this.copyList().find(e => e.id_copy == this.selectedCopyId()) ?? null
    ),
    selectedEditionId: signal<number>(this.editionId()),
    isSaving: signal<boolean>(false),
  }

  protected readonly selectedEdition = computed<EditionModel | null>(() =>
    this.editionList().find(e => e.id_edition == this.reservation.selectedEditionId()) ?? null
  );

  protected readonly isAuthenticated = computed<boolean>(() => this.auth.isAuthenticated());
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getBookRX,
      this.getEditionRX,
      this.getCopyRX,
    ].some(r => r.isLoading())
  );

  private readonly firstLoadEffect = effect(() => {
    const id_edition = this.editionId();
    const copyList = this.copyList();

    const copyByEditionList = copyList.filter(e => e.edition_id == id_edition);
    if (!copyByEditionList.length) return;

    const availableCopyByEdition = copyByEditionList.find(e => e.is_availability);
    const selected = availableCopyByEdition ?? copyByEditionList[0];

    this.reservation.selectedEditionId.set(selected.edition_id);
    this.selectedCopyId.set(selected.id_copy);
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
    this.reservation.selectedEditionId.set(item.edition_id);
    this.selectedCopyId.set(item.id_copy);
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  protected async onConfirmReservation(): Promise<void> {
    const copyId = this.reservation.selectedCopy()?.id_copy;
    if (!copyId) return;

    const confirmed = await this.confirmService.confirm({
      title: 'Crear Reserva',
      message: `¿Seguro que deseas reservar el libro "${this.book()?.title}"?`,
    });
    if (!confirmed) return;

    this.mutation.run(
      this.reservationService.create({ copy_id: copyId }),
      { isSaving: this.reservation.isSaving },
      {
        successMsg: 'Reserva registrada correctamente',
        errorMsg: 'Error al crear la Reserva',
        onSuccess: () => this.getCopyRX.reload(),
      }
    );
  }
}
