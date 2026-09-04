import { DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { EditorialModel, SaveEditorialModel } from '@features/book-editorial/models/editorial-model';
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
  protected readonly submitForm = output<{ id: number, data: SaveEditorialModel }>();
  protected readonly cancelForm = output<void>();

  protected readonly actionText = computed<string>(() => this.editorial() ? 'Modificar Editorial' : 'Crear Editorial');

  protected readonly formData = linkedSignal<SaveEditorialModel | null, SaveEditorialModel>({
    source: this.editorial,
    computation: (item) => item ?? { name: '' },
  });

  // FORM INPUTS -------------------------------------------------------------------
  protected updateName(value: string, input: HTMLInputElement) {
    this.updateField('name', value, input);
  }

  private updateField<K extends keyof SaveEditorialModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    }

    this.formData.update(data => ({ ...data, [key]: sanitized }));
  }

  private sanitize(key: keyof SaveEditorialModel, value: string): string | null {
    switch (key){
      case 'name':
        if (value.length > 100) return null;
        return value;
      default:
        return value;
    }
  }

  // SUBMIT ------------------------------------------------------------------------
  protected onSaveClick(): void {
    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      return;
    }

    this.submitForm.emit({
      id: this.editorial()?.id_editorial ?? 0,
      data: data,
    });
  }

  private validateFormOnSubmit(data: SaveEditorialModel): string | null {
    if (data.name == null)
      return 'El nombre es requerido';

    if (data.name.length > 100)
      return 'El nombre tiene mas de 100 caracteres';

    return null;
  }
}
