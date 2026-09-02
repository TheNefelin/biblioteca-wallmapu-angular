import { Component, input, linkedSignal, output, signal } from '@angular/core';
import { ButtonComponent } from "@shared/components/button-component/button-component";
import { CopyStatusSelectComponents } from "@features/copy-status/components/copy-status-select-components/copy-status-select-components";
import { SignatureManualComponents } from "@features/copy/components/signature-manual-components/signature-manual-components";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { CopyModel, SaveCopyModel } from '@features/copy/models/copy-model';
import { DatePipe } from '@angular/common';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-copy-form-components',
  imports: [
    DatePipe,
    ButtonComponent,
    CopyStatusSelectComponents,
    SignatureManualComponents,
    LoadingComponent,
    MessageErrorComponent
  ],
  templateUrl: './copy-form-components.html',
})
export class CopyFormComponents {
  readonly isSaving = input<boolean>(false);
  readonly copy = input<CopyModel | null>(null);
  protected readonly submitForm = output<SaveCopyModel>();
  protected readonly cancelForm = output<void>();

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly showHelpModal = signal<boolean>(false);

  protected openHelpModal(): void {
    this.showHelpModal.set(true);
  }

  protected closeHelpModal(): void {
    this.showHelpModal.set(false);
  }

  protected readonly formData = linkedSignal<SaveCopyModel>(() => {
    const payload = this.copy();

    return {
      signature_topography: payload?.signature_topography ?? '',
      edition_id: payload?.edition_id ?? 0,
      copy_number: payload?.copy_number ?? 0,
      status_id: payload?.status_id ?? 1,
    }
  });

  protected updateTopography(value: string, input: HTMLInputElement) {
    this.updateField('signature_topography', value, input);
    this.errorMessage.set(null);
  }

  protected updateCopyNumber(value: string, input: HTMLInputElement) {
    this.updateField('copy_number', value, input);
    this.errorMessage.set(null);
  }

  protected updateStatus(value: number) {
    this.formData.update(data => ({ ...data, status_id: value }));
    this.errorMessage.set(null);
  }

  private updateField<K extends keyof SaveCopyModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    }

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof SaveCopyModel, value: string): string | number | null {
    switch (key){
      case 'signature_topography':
        if (value.length > 50) return null;
        return value;
      case 'copy_number':
        if (!/^[0-9]*$/.test(value)) return null;
        if (value.length > 2) return null;
        return Number(value);
      default:
        return value;
    }
  }

  protected onSubmit(): void {
    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    this.errorMessage.set(null);
    this.submitForm.emit(data);
  }

  private validateFormOnSubmit(data: SaveCopyModel): string | null {
    if (data.copy_number == null)
      return 'El número de copia es requerido';

    if (data.copy_number <= 0)
      return 'El número de copia debe ser mayor a 0';

    return null;
  }
}
