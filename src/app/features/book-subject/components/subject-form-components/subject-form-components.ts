import { DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { SubjectModel } from '@features/book-subject/models/subject-model';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-subject-form-components',
  imports: [
    DatePipe,
    ButtonComponent,
    LoadingComponent,
  ],
  templateUrl: './subject-form-components.html',
})
export class SubjectFormComponents {
  readonly isLoading = input<boolean>(false);
  readonly subject = input<SubjectModel | null>(null);
  protected readonly submitForm = output<SubjectModel>();
  protected readonly cancelForm = output<void>();

  protected readonly actionText = computed<string>(() => this.subject() ? 'Modificar Descriptor' : 'Crear Descriptor');

  protected readonly formData = linkedSignal<SubjectModel | null, SubjectModel>({
    source: this.subject,
    computation: (item) => item ?? {
      id_subject: 0,
      name: '',
      created_at: '',
      updated_at: '',
    },
  });

  protected updateName(value: string, input: HTMLInputElement) {
    this.updateField('name', value, input);
  }

  private updateField<K extends keyof SubjectModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    }

    this.formData.update(data => ({ ...data, [key]: sanitized }));
  }

  private sanitize(key: keyof SubjectModel, value: string): string | null {
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
      return;
    }

    this.submitForm.emit(data);
  }

  private validateFormOnSubmit(data: SubjectModel): string | null {
    if (data.name == null)
      return 'El nombre es requerido';

    if (data.name.length > 100)
      return 'El nombre tiene mas de 100 caracteres';

    return null;
  }
}