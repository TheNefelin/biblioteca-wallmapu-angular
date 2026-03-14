import { DatePipe, JsonPipe } from '@angular/common';
import { Component, effect, input, output, signal } from '@angular/core';
import { EditionCopyDetailModel } from '@features/edition-copy/models/edition-copy-detail-model';
import { EditionCopyFormModel } from '@features/edition-copy/models/edition-copy-form-model';
import { UserStatusSelectComponents } from "@features/user-status/components/user-status-select-components/user-status-select-components";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";

@Component({
  selector: 'app-edition-copy-form-components',
  imports: [
    JsonPipe,
    DatePipe,
    UserStatusSelectComponents,
    LoadingComponent,
    MessageErrorComponent
],
  templateUrl: './edition-copy-form-components.html',
})
export class EditionCopyFormComponents {
  readonly isLoading = input<boolean>(false);
  readonly editionCopyDetail = input<EditionCopyDetailModel | null>(null);
  readonly onFormSubmit = output<EditionCopyFormModel>();  
    
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly formData = signal<Partial<EditionCopyFormModel>>({});  
  
  private readonly updateEffect = effect(() => {
    const copy = this.editionCopyDetail();
    if (!copy) return;

    this.formData.set({
      id_copy: copy.id_copy,
      signature_topography: copy.signature_topography,
      copy_number: copy.copy_number,
      edition_id: copy.edition_id,
      status_id: copy.status?.id_status ?? 1,
    });
  });


  protected updateTopography(value: string, input: HTMLInputElement) {
    this.updateField('signature_topography', value, input);
  }

  protected updateCopyNumber(value: string, input: HTMLInputElement) {
    this.updateField('copy_number', value, input);
  }

  private updateField<K extends keyof EditionCopyFormModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof EditionCopyFormModel, value: string): string | number  | null {
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

  protected formSubmit(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const submitData: EditionCopyFormModel = {
      id_copy: data.id_copy!,
      signature_topography: data.signature_topography!,
      copy_number: data.copy_number!,
      edition_id: data.edition_id!,
      status_id: data.status_id!
    };

    this.errorMessage.set(null);
    this.onFormSubmit.emit(submitData);
  }

  private validateFormOnSubmit(data: Partial<EditionCopyFormModel>): string | null {
    if (!data.signature_topography?.trim())
      return 'La firma topográfica es requerida';

    if (data.signature_topography.length > 50)
      return 'La firma topográfica no debe superar los 50 caracteres';

    if (data.copy_number == null)
      return 'El número de copia es requerido';

    if (data.copy_number <= 0)
      return 'El número de copia debe ser mayor a 0';
    
    return null;
  }
}
