import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ROUTES_CONSTANTS } from '@shared/constants/routes-constant';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { CopyFormComponents } from "@features/copy/components/copy-form-components/copy-form-components";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { CopyService } from '@features/copy/services/copy-service';
import { CopyDetailModel, CopyModel, CreateCopyModel, UpdateCopyModel } from '@features/copy/models/copy-model';
import { BookService } from '@features/book/services/book-service';
import { EditionService } from '@features/edition/services/edition-service';
import { BookModel } from '@features/book/models/book-model';
import { EditionModel } from '@features/edition/models/edition-model';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { extractErrorMessage } from '@core/utils/error-handler';
import { CopyListComponents } from "@features/copy/components/copy-list-components/copy-list-components";

@Component({
  selector: 'app-copy-form-page',
  imports: [
    DatePipe,
    NgOptimizedImage,
    SectionHeaderComponent,
    CopyFormComponents,
    MessageSuccessComponent,
    MessageErrorComponent,
    CopyListComponents
  ],
  templateUrl: './copy-form-page.html',
})
export class CopyFormPage {
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

  readonly copyId = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map(params => Number(params.get('copyId')) || 0)
    ),
    { initialValue: 0 }
  );

  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly bookService = inject(BookService)
  private readonly getBookPayload = signal<number | null>(this.bookId());
  protected readonly computedBook = computed<BookModel | null>(() => this.getBookRX.value() ?? null);

  private readonly editionService = inject(EditionService);
  private readonly getEditionPayload = signal<number | null>(this.editionId());
  protected readonly computedEdition = computed<EditionModel | null>(() => this.getEditionRX.value() ?? null);

  private readonly copyService = inject(CopyService);
  private readonly getCopyByEditionPayload = signal<number | null>(this.editionId());
  private readonly getCopyPayload = signal<number | null>(this.copyId());
  private readonly saveCopyPayload = signal<CreateCopyModel | UpdateCopyModel | null>(null);
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
      this.saveCopyRX,
    ].some(r => r.isLoading())
  );

  private readonly getBookRX = rxResource({
    params: () => this.getBookPayload(),
    stream: ({ params: id_book }) => {
      if (!id_book || id_book == 0) return of(null);
      this.successMessage.set(null);
      this.errorMessage.set(null);

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
      this.successMessage.set(null);
      this.errorMessage.set(null);

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

  private readonly getCopyByEditionRX = rxResource({
    params: () => this.getCopyByEditionPayload(),
    stream: ({ params: id_edition }) => {
      if (!id_edition || id_edition == 0) return of(null);
      this.successMessage.set(null);
      this.errorMessage.set(null);

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

  private readonly saveCopyRX = rxResource({
    params: () => this.saveCopyPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      
      const request$ = 'id_copy' in params && params.id_copy > 0
        ? this.copyService.update(params.id_copy, params)
        : this.copyService.create(params);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
        }),
        tap(copy => {
          this.getCopyPayload.set(copy.id_copy);
          this.getCopyByEditionRX.reload();
        }),
        catchError(err => {
          this.handleError(err);
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

    const payload: CreateCopyModel | UpdateCopyModel = form.id_copy > 0
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

    this.saveCopyPayload.set(payload);
  }

  protected navigateBack(): void {
    this.router.navigate([ROUTES_CONSTANTS.PROTECTED.ADMIN.EDITION.FORM(this.bookId(), this.editionId())]); 
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
    this.successMessage.set(null);
  }
}
