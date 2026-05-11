import { NgOptimizedImage, ViewportScroller } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { extractErrorMessage } from '@core/utils/error-handler';
import { AuthStore } from '@features/auth/services/auth-store';
import { BookModel } from '@features/book/models/book-model';
import { BookService } from '@features/book/services/book-service';
import { CopyDetailModel } from '@features/copy/models/copy-model';
import { CopyService } from '@features/copy/services/copy-service';
import { EditionModel } from '@features/edition/models/edition-model';
import { EditionService } from '@features/edition/services/edition-service';
import { CreateReservationModel } from '@features/reservation/models/reservation-model';
import { ReservationService } from '@features/reservation/services/reservation-service';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";
import { CopyListForReservationComponents } from "@features/copy/components/copy-list-for-reservation-components/copy-list-for-reservation-components";

@Component({
  selector: 'app-reservation-page',
  imports: [
    NgOptimizedImage,
    MessageSuccessComponent,
    MessageErrorComponent,
    LoadingComponent,
    ModalActionComponent,
    CopyListForReservationComponents,
  ],
  templateUrl: './reservation-page.html',
})
export class ReservationPage {
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

  private readonly viewportScroller = inject(ViewportScroller);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly selectedEditionId = signal<number>(this.editionId());
  protected readonly selectedEdition = computed<EditionModel | null>(() => {
    const id_edition = this.selectedEditionId();
    const editionList = this.computedEditionList();

    return editionList.find(e => e.id_edition == id_edition) ?? null;  
  });
  protected readonly selectedCopyId = signal<number>(0);
  protected readonly selectedCopy = computed<CopyDetailModel | null>(() => {
    const id_copy = this.selectedCopyId();
    const copyList = this.computedCopyList();

    return copyList.find(e => e.id_copy == id_copy) ?? null;
  });
  
  private readonly firstLoadEffect = effect(() => {
    const id_edition = this.editionId();
    const copyList = this.computedCopyList();

    const copyByEditionList = copyList.filter(e => e.edition_id == id_edition);
    if (!copyByEditionList.length) return;

    const avilityCopyByEdition = copyByEditionList.find(e => e.is_availability);
    if (avilityCopyByEdition)
      this.selectedCopyId.set(avilityCopyByEdition.id_copy)
    else
      this.selectedCopyId.set(copyByEditionList[0].id_copy)
  });

  private readonly authStore = inject(AuthStore);
  protected readonly isAuthenticated = computed<boolean>(() => this.authStore.isAuthenticated());

  protected readonly isLoadingBook = computed<boolean>(() => this.getBookRX.isLoading());
  protected readonly isLoading = computed<boolean>(() => 
    [
      this.getCopyRX,
      this.getEditionRX,
      this.createReservationRX,
    ].some(r => r.isLoading())
  ); 

  private readonly bookService = inject(BookService);
  private readonly getBookPayload = signal<number>(this.bookId());
  protected readonly computedBook = computed<BookModel | null>(() => this.getBookRX.value() ?? null);

  private readonly editionService = inject(EditionService);
  private readonly getEditionPayload = signal<number>(this.bookId());
  protected readonly computedEditionList = computed<EditionModel[]>(() => this.getEditionRX.value() ?? []);
  
  private readonly copyService = inject(CopyService);
  protected readonly computedCopyList = computed<CopyDetailModel[]>(() => this.getCopyRX.value() ?? []);
    
  private readonly reservationService = inject(ReservationService);
  private readonly createReservationPayload = signal<CreateReservationModel | null>(null);

  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.bookService.getById(id_book).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError((err) => {
          this.handleError(err)
          return of(null);
        }),
      );
    }
  });

  private readonly getEditionRX = rxResource({
    params: () => this.getEditionPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.editionService.getAllByBook(id_book).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError((err) => {
          this.handleError(err)
          return of(null);
        }),
      );
    }
  });

  private readonly getCopyRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book) return of(null);

      return this.copyService.getAllByBookId(id_book).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError((err) => {
          this.handleError(err)
          return of(null);
        }),
      );
    }
  });  

  protected readonly createReservationRX = rxResource({
    params: () => this.createReservationPayload(),
    stream: ({ params: id_copy }) => {
      if (!id_copy) return of(null);

      return this.reservationService.create(id_copy).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
        }),
        tap(() => {
          this.getCopyRX.reload();
        }),
        catchError((err) => {
          this.handleError(err)
          return of(null);
        }),
        finalize(() => this.isModalOpen.set(false)),
      );
    }
  });

  protected createReservation(): void {
    const copyId = this.selectedCopy()?.id_copy;
    if (!copyId) {
      this.errorMessage.set('Error en la reserva');
      return;
    }
    this.createReservationPayload.set({ copy_id: copyId });
  }

  protected onSelectedCopy(item: CopyDetailModel): void {
    this.selectedEditionId.set(item.edition_id);
    this.selectedCopyId.set(item.id_copy);
    this.viewportScroller.scrollToPosition([0, 0]);
  }
  
  protected openModal(): void {
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
    this.successMessage.set(null);
  }
}
