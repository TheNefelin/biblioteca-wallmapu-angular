import { Component, computed, inject, signal } from '@angular/core';
import { NotificationListComponents } from "@features/notification/components/notification-list-components/notification-list-components";
import { NotificationFormComponents } from "@features/notification/components/notification-form-components/notification-form-components";
import { MessageSuccessComponent } from "@shared/components/message-success-component/message-success-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { PaginationResponseModel } from '@core/models/pagination-response-model';
import { CreateNotificationByEmailModel, NotificationDetailModel, NotificationFilterModel } from '@features/notification/models/notification-model';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { PaginationRequestModel } from '@core/models/pagination-request-model';
import { NotificationService } from '@features/notification/services/notification-service';
import { extractErrorMessage } from '@core/utils/error-handler';

@Component({
  selector: 'app-notification-page',
  imports: [
    NotificationListComponents, 
    NotificationFormComponents, 
    MessageSuccessComponent, 
    MessageErrorComponent
  ],
  templateUrl: './notification-page.html',
})
export class NotificationPage {
  protected readonly isReadFilter = signal<boolean>(true);
  protected readonly cleanFormTrigger = signal<number>(0);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly currentPage = signal<number>(1);
  private readonly limit = signal<number>(10);
  private readonly search = signal<string>('');
  
  protected readonly isLoadingCreateNotfication = signal<boolean>(false);
  protected readonly isLoading = computed<boolean>(() => this.getNotificationRX.isLoading())

  private readonly notificationService = inject(NotificationService);
  private readonly getNotificationPayload = computed<PaginationRequestModel<NotificationFilterModel>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        is_read: this.isReadFilter()
      }
    }
  });
  protected readonly computedPaginationAndNotificationList = computed<PaginationResponseModel<NotificationDetailModel[]> | null>(() => this.getNotificationRX.value() ?? null);
  
  private readonly getNotificationRX = rxResource({
    params: () => this.getNotificationPayload(),
    stream: ({ params }) => { 

      return this.notificationService.getAllPagination(params).pipe(
        map(response => {
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

  protected async onFormSubmit(item: CreateNotificationByEmailModel): Promise<void> {
    this.isLoadingCreateNotfication.set(true);

    try {
      const response = await firstValueFrom(
        this.notificationService.create(item)
          .pipe(catchError(err => { this.handleError(err); return of(null as any); }))
      );

      if (response?.isSuccess) {
        this.successMessage.set(response.message);
        this.cleanFormTrigger.update(e => e + 1);
        this.getNotificationRX.reload();
      }
    } finally {
      this.isLoadingCreateNotfication.set(false);
    }
  }

  protected onFilterNotRead(is_read: boolean): void {
    this.isReadFilter.set(is_read);
  }

  protected onReloadNotification(): void {
    this.getNotificationRX.reload();
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  protected nextPage(): void {
    const totalPages = this.computedPaginationAndNotificationList()?.pages ?? 1

    if (this.currentPage() < totalPages){
      this.currentPage.update(e => e + 1);
    }
  }

  protected prevPage(): void {
    if (this.currentPage() > 1){
      this.currentPage.update(e => e - 1);
    }
  }

  private handleError(err: unknown): void {
    this.errorMessage.set(extractErrorMessage(err));
    this.successMessage.set(null);
  }
}
