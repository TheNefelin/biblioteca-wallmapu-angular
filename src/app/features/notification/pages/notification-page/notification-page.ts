import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';
import { PaginationRequestModel } from '@shared/models/pagination-request-model';
import { CreateNotificationByEmailModel, NotificationFilterModel, NotificationModel } from '@features/notification/models/notification-model';
import { NotificationService } from '@features/notification/services/notification-service';
import { MutationService } from '@core/services/mutation-service';
import { CrudPage } from '@shared/base/crud-page';
import { SectionHeaderComponent } from '@shared/components/section-header-component/section-header-component';
import { NotificationListComponent } from '@features/notification/components/notification-list-component/notification-list-component';
import { NotificationFormComponent } from '@features/notification/components/notification-form-component/notification-form-component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-notification-page',
  imports: [
    SectionHeaderComponent,
    NotificationListComponent,
    NotificationFormComponent,
  ],
  templateUrl: './notification-page.html',
})
export class NotificationPage extends CrudPage<NotificationModel> {
  private readonly notificationService = inject(NotificationService);
  private readonly mutation = inject(MutationService);

  // NOTIFICATION STATE -------------------------------------------------------------
  protected readonly notification = {
    dataList: computed<NotificationModel[]>(() => this.getAllNotificationRX.value() ?? []),
    isLoading: computed<boolean>(() => this.getAllNotificationRX.isLoading() && !this.getAllNotificationRX.hasValue()),
    isSaving: signal<boolean>(false),
    showModal: signal<boolean>(false),
  };
  protected readonly showOnlyUnread = signal<boolean>(false);

  // FETCHS ------------------------------------------------------------------------
  private readonly getNotificationPayload = computed<PaginationRequestModel<NotificationFilterModel>>(() => {
    return {
      page: this.currentPage(),
      limit: this.limit(),
      search: this.search(),
      filter: {
        is_read: this.showOnlyUnread(),
      }
    }
  });

  private readonly getAllNotificationRX = rxResource({
    params: () => this.getNotificationPayload(),
    stream: ({ params }) => {
      if (!params) return of(null);

      return this.notificationService.getAllPagination(params).pipe(
        map(response => this.mapPaginated(response)),
        catchError(err => {
          console.error('[NotificationService::NotificationPage] getAllPagination:', err);
          return of(this.emptyPaginated());
        })
      );
    },
  });

  // CRUD-PAGE INHERITANCE METHODS -------------------------------------------------
  protected override reload(): void {
    this.getAllNotificationRX.reload();
  }

  // NOTIFICATION ACTIONS ----------------------------------------------------------
  protected onFilterNotRead(showOnlyUnread: boolean): void {
    this.showOnlyUnread.set(showOnlyUnread);
    this.currentPage.set(1);
  }

  protected onCreateNotification(): void {
    this.notification.showModal.set(true);
  }

  protected onClearNotificationForm(): void {
    this.notification.showModal.set(false);
  }

  protected onSubmitNotificationForm(item: CreateNotificationByEmailModel): void {
    this.mutation.run(
      this.notificationService.create(item),
      { isSaving: this.notification.isSaving },
      {
        successMsg: 'Notificación enviada correctamente',
        errorMsg: 'Error al enviar la notificación',
        onSuccess: () => {
          this.onClearNotificationForm();
          this.reload();
        },
      }
    );
  }
}