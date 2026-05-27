import { DatePipe } from '@angular/common';
import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormatModel } from '@features/format/models/format-model';
import { ButtonClearComponent } from "@shared/components/button-clear-component/button-clear-component";
import { ButtonCreateComponent } from "@shared/components/button-create-component/button-create-component";
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-format-form-component',
  imports: [
    DatePipe,
    ButtonClearComponent,
    ButtonCreateComponent,
    LoadingComponent,
  ],
  templateUrl: './format-form-component.html',
})
export class FormatFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly format = input<FormatModel | null>(null);
  protected readonly onFormSubmit = output<FormatModel>();
  protected readonly onClear = output<void>();

  protected readonly errorMessage = signal<string | null>(null); 
  protected readonly actionText = computed<string>(() => this.format() ? 'Modificar Formato' : 'Crear Formato');
  protected readonly formData = signal<Partial<FormatModel>>({});

  private readonly updateFormEffect = effect(() => {
    const item = this.format();
    
    if (!item) {
      this.formData.set({ name: '' });
      return;
    }

    this.formData.set({ ...item });
  });

  protected updateName(value: string, input: HTMLInputElement) {
    this.updateField('name', value, input);
  }

  private updateField<K extends keyof FormatModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; 
      return;
    } 

    this.formData.update(data => ({ ...data, [key]: sanitized }));
  }

  private sanitize(key: keyof FormatModel, value: string): string | null {
    switch (key){
      case 'name':
        if (value.length > 100) return null;
        return value;       
      default:
        return value;
    }
  }

  protected submitForm(event: Event): void {
    event.preventDefault();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    const submitData: FormatModel = {
      ...data
    } as FormatModel;

    this.errorMessage.set(null);
    this.onFormSubmit.emit(submitData);

    this.clear();
  }

  private validateFormOnSubmit(data: Partial<FormatModel>): string | null {
    if (data.name == null)
      return 'El nombre es requerido';

    if (data.name.length > 100)
      return 'El nombre tiene mas de 100 caracteres';
    
    return null;
  }

  protected clear(): void {
    this.formData.set({ name: '' });
    this.errorMessage.set(null);
    this.onClear.emit()
  }
}
