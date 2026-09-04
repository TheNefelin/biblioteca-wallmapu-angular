import { DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { AuthorModel } from '@features/book-author/models/author-model';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-author-form-components',
  imports: [
    DatePipe,
    ButtonComponent,
    LoadingComponent,
  ],
  templateUrl: './author-form-components.html',
})
export class AuthorFormComponents {
  readonly isLoading = input<boolean>(false);
  readonly author = input<AuthorModel | null>(null);
  protected readonly submitForm = output<AuthorModel>();
  protected readonly cancelForm = output<void>();

  protected readonly actionText = computed<string>(() => this.author() ? 'Modificar Autor' : 'Crear Autor');

  protected readonly formData = linkedSignal<AuthorModel | null, AuthorModel>({
    source: this.author,
    computation: (item) => item ?? {
      id_author: 0,
      name: '',
      created_at: '',
      updated_at: '',
    },
  });

  protected updateName(value: string, input: HTMLInputElement) {
    this.updateField('name', value, input);
  }

  private updateField<K extends keyof AuthorModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    }

    this.formData.update(data => ({ ...data, [key]: sanitized }));
  }

  private sanitize(key: keyof AuthorModel, value: string): string | null {
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

  private validateFormOnSubmit(data: AuthorModel): string | null {
    if (data.name == null)
      return 'El nombre es requerido';

    if (data.name.length > 100)
      return 'El nombre tiene mas de 100 caracteres';

    return null;
  }
}