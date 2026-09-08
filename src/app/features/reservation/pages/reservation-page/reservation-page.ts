import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import { Component, computed, effect, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BookModel } from '@features/book/models/book-model';
import { BookService } from '@features/book/services/book-service';
import { CopyDetailModel } from '@features/copy/models/copy-model';
import { CopyService } from '@features/copy/services/copy-service';
import { EditionModel } from '@features/edition/models/edition-model';
import { EditionService } from '@features/edition/services/edition-service';
import { LoggerService } from '@core/services/logger-service';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { AuthStore } from '@features/auth/services/auth-store';
import { ModalConfirmService } from '@core/services/modal-confirm-service';
import { MutationService } from '@core/services/mutation-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { CopyListForReservationComponent } from "@features/copy/components/copy-list-for-reservation-component/copy-list-for-reservation-component";
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-reservation-page',
  imports: [
    NgOptimizedImage,
    LoadingComponent,
    CopyListForReservationComponent,
    ButtonComponent,
  ],
  templateUrl: './reservation-page.html',
})
export class ReservationPage {
  private readonly logger = inject(LoggerService);
  // ROUTE PARAMS ------------------------------------------------------------------
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

  // SERVICES ------------------------------------------------------------------------
  private readonly viewportScroller = inject(ViewportScroller);
  private readonly confirmService = inject(ModalConfirmService);
  private readonly mutation = inject(MutationService);
  private readonly auth = inject(AuthStore);
  private readonly reservationService = inject(ReservationService);
  private readonly bookService = inject(BookService);
  private readonly editionService = inject(EditionService);
  private readonly copyService = inject(CopyService);

  // FETCHS ----------------------------------------------------------------------------
  private readonly getBookRX = rxResource({
    params: () => this.bookId(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.bookService.getById(id_book).pipe(
        catchError(err => {
          this.logger.error('BookService::ReservationPage', 'getBook', err);
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
          this.logger.error('EditionService::ReservationPage', 'getEdition', err);
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
          this.logger.error('CopyService::ReservationPage', 'getCopy', err);
          return of(null);
        })
      );
    }
  });

  // STATE ------------------------------------------------------------------------------
  protected readonly book = computed<BookModel | null>(() => this.getBookRX.value() ?? null);

  protected readonly edition = {
    dataList: computed<EditionModel[]>(() => this.getEditionRX.value() ?? []),
    selectedItem: signal<EditionModel | null>(null),
  }

  protected readonly copy = {
    dataList: computed<CopyDetailModel[]>(() => this.getCopyRX.value() ?? []),
    selectedItem: signal<CopyDetailModel | null>(null),
  }

  protected readonly isAuthenticated = computed<boolean>(() => this.auth.isAuthenticated());
  protected readonly isSaving = signal<boolean>(false);
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getBookRX,
      this.getEditionRX,
      this.getCopyRX,
    ].some(r => r.isLoading())
  );

  // AUTO-SELECT ---------------------------------------------------------------------
  private readonly autoSelectEffect = effect(() => {
    // 1️⃣ Siempre seleccionar la edición de la ruta (portada + datos mínimos)
    const idEdition = this.editionId();
    const selectedEdition = this.edition.dataList().find(e => e.id_edition === idEdition);
    this.edition.selectedItem.set(selectedEdition ?? null);
    if (!selectedEdition) {
      this.copy.selectedItem.set(null);
      return;
    }

    // 2️⃣ Auto-seleccionar copia: primera disponible, sino primera de la edición
    const copies = this.copy.dataList().filter(c => c.edition_id === idEdition);
    const copy = copies.find(c => c.is_availability) ?? copies[0];
    this.copy.selectedItem.set(copy ?? null);
  });

  // RESERVATION ACTIONS ----------------------------------------------------------------
  protected onSelectedCopy(item: CopyDetailModel): void {
    this.onSelectedEdition(item.edition_id);
    this.copy.selectedItem.set(item);
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

  // ACTIONS ----------------------------------------------------------------------------
  protected onSelectedEdition(id: number): void {
    const selectedEdition = this.edition.dataList().find(e => e.id_edition === id);
    this.edition.selectedItem.set(selectedEdition ?? null);
  }
}