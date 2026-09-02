import { DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output, signal } from '@angular/core';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-editorial-form-component',
  imports: [
    DatePipe,
    ButtonComponent,
    LoadingComponent,
  ],
  templateUrl: './editorial-form-component.html',
})
export class EditorialFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly editorial = input<EditorialModel | null>(null);
  protected readonly submitForm = output<EditorialModel>();
  protected readonly cancelForm = output<void>();

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly actionText = computed<string>(() => this.editorial() ? 'Modificar Editorial' : 'Crear Editorial');

  protected readonly formData = linkedSignal<EditorialModel | null, EditorialModel>({
    source: this.editorial,
    computation: (item) => item ?? {
      id_editorial: 0,
      name: '',
      created_at: '',
      updated_at: '',
    },
  });

  protected updateName(value: string, input: HTMLInputElement) {
    this.updateField('name', value, input);
  }

  private updateField<K extends keyof EditorialModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    }

    this.formData.update(data => ({ ...data, [key]: sanitized }));
  }

  private sanitize(key: keyof EditorialModel, value: string): string | null {
    switch (key){
      case 'name':
        if (value.length > 100) return null;
        return value;
      default:
        return value;
    }
  }

  protected onSaveClick(): void {
    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    this.errorMessage.set(null);
    this.submitForm.emit(data);
  }

  private validateFormOnSubmit(data: EditorialModel): string | null {
    if (data.name == null)
      return 'El nombre es requerido';

    if (data.name.length > 100)
      return 'El nombre tiene mas de 100 caracteres';

    return null;
  }
}