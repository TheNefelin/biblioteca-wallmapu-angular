import { Component, input, linkedSignal, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button-component/button-component';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";
import { NewsModel, SaveNewsModel } from '@features/news/models/news-model';
import { Preview } from '@features/news-gallery/models/news-gallery-model';

@Component({
  selector: 'app-news-form-component',
  imports: [
    FormsModule,
    ButtonComponent,
    LoadingComponent,
],
  templateUrl: './news-form-component.html',
})
export class NewsFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly actionText = input.required<string>()
  readonly news = input<NewsModel | null>(null);
  protected readonly formSubmit = output<{ id: number, data: SaveNewsModel }>();
  protected readonly addImage = output<Preview[]>();

  protected readonly formData = linkedSignal<SaveNewsModel>(() => {
    const payload = this.news();

    return { 
      title: payload?.title ?? '', 
      subtitle: payload?.subtitle ?? '',
      body: payload?.body ?? '' 
    }
  });

  protected updateTitle(value: string, input: HTMLInputElement) {
    this.updateField('title', value, input);
  }
  protected updateSubtitle(value: string, input: HTMLInputElement) {
    this.updateField('subtitle', value, input);
  }
  protected updateBody(value: string, input: HTMLTextAreaElement) {
    this.updateField('body', value, input);
  }

  private updateField<K extends keyof SaveNewsModel>(key: K, value: string, input?: HTMLInputElement | HTMLTextAreaElement) {
    const sanitized = this.sanitize(key, value);
    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? '';
      return;
    }
    this.formData.update(data => ({ ...data, [key]: value }));
  }

  private sanitize(key: keyof SaveNewsModel, value: string): string | null {
    switch (key){
      case 'title':
        if (value.length > 100) return null;
        return value;
      case 'subtitle':
        if (value.length > 256) return null;
        return value;
      default:
        return value;
    }
  }

  protected onSubmit(): void {
    const data = this.formData();
    const error = this.validateFormOnSubmit(data);
    
    if (error) return;

    this.formSubmit.emit({
      id: this.news()?.id_news ?? 0,
      data: data,
    });
  }

  private validateFormOnSubmit(data: Partial<SaveNewsModel>): string | null {
    if (!data.title?.trim())        return 'El título es requerido';
    if (data.title.length < 2)      return 'El título debe tener al menos 2 caracteres';
    if (data.title.length > 100)    return 'El título no debe superar los 100 caracteres';

    if (!data.subtitle?.trim())     return 'El subtítulo es requerido';
    if (data.subtitle.length < 2)   return 'El subtítulo debe tener al menos 2 caracteres';
    if (data.subtitle.length > 256) return 'El subtítulo no debe superar los 256 caracteres';

    if (!data.body?.trim())         return 'La descripción es requerida';
    if (data.body.length < 2)       return 'La descripción debe tener al menos 2 caracteres';

    return null;
  }

  protected onAddImages(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (!files.length) return;

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        input.value = '';
        return;
      }
    }

    const newImages: Preview[] = files.map(file => ({
      id: 0,
      file,
      alt: 'Imagen sin nombre',
      url: URL.createObjectURL(file),
    }));

    this.addImage.emit(newImages);
  }
}
