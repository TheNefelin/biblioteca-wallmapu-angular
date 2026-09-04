import { DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, output } from '@angular/core';
import { GenreModel } from '@features/book-genre/models/genre-model';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-genre-form-components',
  imports: [
    DatePipe,
    ButtonComponent,
    LoadingComponent,
  ],
  templateUrl: './genre-form-components.html',
})
export class GenreFormComponents {
  readonly isLoading = input<boolean>(false);
  readonly genre = input<GenreModel | null>(null);
  protected readonly submitForm = output<GenreModel>();
  protected readonly cancelForm = output<void>();

  protected readonly actionText = computed<string>(() => this.genre() ? 'Modificar Género' : 'Crear Género');

  protected readonly formData = linkedSignal<GenreModel | null, GenreModel>({
    source: this.genre,
    computation: (item) => item ?? {
      id_genre: 0,
      name: '',
      created_at: '',
      updated_at: '',
    },
  });

  protected updateName(value: string, input: HTMLInputElement) {
    this.updateField('name', value, input);
  }

  private updateField<K extends keyof GenreModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    }

    this.formData.update(data => ({ ...data, [key]: sanitized }));
  }

  private sanitize(key: keyof GenreModel, value: string): string | null {
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

  private validateFormOnSubmit(data: GenreModel): string | null {
    if (data.name == null)
      return 'El nombre es requerido';

    if (data.name.length > 100)
      return 'El nombre tiene mas de 100 caracteres';

    return null;
  }
}