import { Component, input, output, signal } from '@angular/core';
import { LoadingComponent } from '@shared/components/loading-component/loading-component';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { CreateNotificationByEmailModel } from '@features/notification/models/notification-model';
import { MessageErrorComponent } from '@shared/components/message-error-component/message-error-component';

@Component({
  selector: 'app-notification-form-component',
  imports: [
    LoadingComponent,
    ButtonComponent,
    MessageErrorComponent,
  ],
  templateUrl: './notification-form-component.html',
})
export class NotificationFormComponent {
  readonly isLoading = input<boolean>(false);
  protected readonly cancelForm = output<void>();
  protected readonly submitForm = output<CreateNotificationByEmailModel>();

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly formData = signal<CreateNotificationByEmailModel>({ email: '', title: '', message: '', is_priority: false });

  protected updatePriority(value: boolean): void {
    this.formData.update(data => ({ ...data, is_priority: value }));
  }

  protected updateEmail(value: string, input: HTMLInputElement): void {
    this.updateField('email', value, input);
  }

  protected updateTitle(value: string, input: HTMLInputElement): void {
    this.updateField('title', value, input);
  }

  protected updateMessage(value: string, input: HTMLTextAreaElement): void {
    this.updateField('message', value, input);
  }

  private updateField<K extends keyof CreateNotificationByEmailModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement): void {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string;
      return;
    }

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof CreateNotificationByEmailModel, value: string): string | null {
    switch (key) {
      case 'email':
        if (value.length > 50) return null;
        return value;
      case 'title':
        if (value.length > 50) return null;
        return value;
      case 'message':
        if (value.length > 256) return null;
        return value;
      default:
        return value;
    }
  }

  protected onSendClick(): void {
    const data = this.formData();

    this.errorMessage.set(null);
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    this.submitForm.emit(data);
  }

  private validateFormOnSubmit(data: CreateNotificationByEmailModel): string | null {
    if (!data.email)
      return 'El Email es obligatorio';

    if (!this.isValidEmail(data.email))
      return 'El formato del email no es válido';

    if (!data.title)
      return 'El titulo es obligatorio';

    if (!data.message)
      return 'El mensaje es obligatorio';

    return null;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}