import { DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { FormatModel, SaveFormatModel } from '@features/format/models/format-model';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-format-form-component',
  imports: [
    DatePipe,
    ButtonComponent,
    LoadingComponent,
  ],
  templateUrl: './format-form-component.html',
})
export class FormatFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly format = input<FormatModel | null>(null);
  protected readonly submitForm = output<{ id: number, data: SaveFormatModel }>();
  protected readonly cancelForm = output<void>();

  protected readonly actionText = computed<string>(() => this.format() ? 'Modificar Formato' : 'Crear Formato');
  protected readonly formData = linkedSignal<SaveFormatModel | null, SaveFormatModel>({
    source: this.format,
    computation: (item) => item ?? { name: '' },
  });

  // FORM INPUTS -------------------------------------------------------------------
  protected updateName(value: string, input: HTMLInputElement) {
    this.updateField('name', value, input);
  }

  private updateField<K extends keyof SaveFormatModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    }

    this.formData.update(data => ({ ...data, [key]: sanitized }));
  }

  private sanitize(key: keyof SaveFormatModel, value: string): string | null {
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
      id: this.format()?.id_format ?? 0,
      data: data,
    });
  }

  private validateFormOnSubmit(data: SaveFormatModel): string | null {
    if (data.name == null)
      return 'El nombre es requerido';

    if (data.name.length > 100)
      return 'El nombre tiene mas de 100 caracteres';

    return null;
  }
}
