import { Location } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { FormatFormComponent } from '@features/format/components/format-form-component/format-form-component';
import { FormatListComponent } from '@features/format/components/format-list-component/format-list-component';
import { CreateFormatModel, FormatModel, UpdateFormatModel } from '@features/format/models/format-model';
import { FormatService } from '@features/format/services/format-service';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { catchError, finalize, map, of, tap } from 'rxjs';
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { ModalActionComponent } from "@shared/components/modal-action-component/modal-action-component";

@Component({
  selector: 'app-format-form-page',
  imports: [
    SectionHeaderComponent,
    FormatFormComponent,
    FormatListComponent,
    MessageSuccessComponent,
    MessageErrorComponent,
    ModalActionComponent
],
  templateUrl: './format-form-page.html',
})
export class FormatFormPage {
  private location = inject(Location);

  protected readonly selectedFormat = signal<FormatModel | null>(null);
  protected readonly selectedFormatToDelete = signal<FormatModel | null>(null);
  protected readonly isModalOpen = signal<boolean>(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');
  
  protected readonly isLoading = computed<boolean>(() =>
    [
      this.getFormatRX,
      this.saveFormatRX,
      this.deleteFormatRX,
    ].some(e => e.isLoading())
  );

  private readonly formatService = inject(FormatService);
  private readonly saveFormatPayload = signal<CreateFormatModel | UpdateFormatModel | null>(null);
  private readonly deleteFormatPayload = signal<number | null>(null);
  private readonly getFormatPayload = computed<PaginationRequestModel<null>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
    }
  });
  protected readonly computedPaginationFormatList = computed<PaginationResponseModel<FormatModel[]> | null>(() => this.getFormatRX.value() ?? null);

  private readonly getFormatRX = rxResource({
    params: () => this.getFormatPayload(),
    stream: ({ params }) => {

       return this.formatService.getAllPagination(params).pipe(
        map((response: { isSuccess: any; message: string | undefined; data: any; }) => {
          if (!response.isSuccess) throw new Error(response.message);
          return response.data;
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    },
  });

  private readonly saveFormatRX = rxResource({
    params: () => this.saveFormatPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);
      
      const request$ = 'id_format' in params && params.id_format > 0
        ? this.formatService.update(params.id_format, params)
        : this.formatService.create(params);

      return request$.pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
        }),
        tap(() => {
          this.onClear();
          this.onReload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        })
      );
    }
  });

  private readonly deleteFormatRX = rxResource({
    params: () => this.deleteFormatPayload(),
    stream: ({ params: id_format }) => { 
      if (!id_format) return of(null);

       return this.formatService.delete(id_format).pipe(
        map(response => {
          if (!response.isSuccess) throw new Error(response.message);
          this.successMessage.set(response.message);
          return response.data;
        }),
        tap(() => {
          this.onClear();
          this.onReload();
        }),
        catchError(err => {
          this.handleError(err);
          return of(null);
        }),
        finalize(() => {
          this.onCloseModal();
        }),
      );
    },
  });

  protected onSearchFilter(searchText: string): void {
    this.search.set(searchText);
  }
  
  protected onSelectedFormat(item: FormatModel): void {
    this.selectedFormat.set(item);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  protected onFormSubmit(form: FormatModel): void {
    const payload: CreateFormatModel | UpdateFormatModel = form.id_format > 0
    ? {
        id_format: form.id_format,
        name: form.name,
      } as UpdateFormatModel
    : {
        name: form.name,
      } as CreateFormatModel;

    this.saveFormatPayload.set(payload);
  }

  protected onDeleteFormat(item: FormatModel): void {
    this.onOpenModal();
    this.selectedFormatToDelete.set(item);
  }


  protected onOpenModal(): void {
    this.isModalOpen.set(true);
  }

  protected onCloseModal(): void {
    this.isModalOpen.set(false);
  }

  protected onConfirmModal(): void {
    if (!this.selectedFormatToDelete()) return;
    const id_format = this.selectedFormatToDelete()?.id_format ?? null

    this.deleteFormatPayload.set(id_format);
  }
  
  protected onClear(): void{
    this.selectedFormatToDelete.set(null);
    this.selectedFormat.set(null);
    this.errorMessage.set(null);
  }

  protected onReload(): void {
    this.getFormatRX.reload();
  }

  protected onNextPage(): void {
    const totalPages = this.computedPaginationFormatList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  protected onPrevPage(): void {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  protected navigateBack(): void {
    this.location.back();
  }

  private handleError(err: unknown): void {
    const message = err instanceof Error 
      ? err.message 
      : (err as any)?.error?.detail || (err as any)?.error?.message || 'Unexpected error';
    this.successMessage.set(null);
    this.errorMessage.set(message);
  }
}
