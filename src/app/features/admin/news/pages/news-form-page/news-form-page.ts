import { CommonModule } from '@angular/common';
import { Component, signal,  } from '@angular/core';
import { NewsModel } from '@core/models/news-model';
import { SectionHeaderComponent } from "@shared/components/section-header-component/section-header-component";
import { ROUTES } from '@shared/constants/routes';

@Component({
  selector: 'app-news-form-page',
  imports: [
    CommonModule,
    SectionHeaderComponent
],
  templateUrl: './news-form-page.html',
})
export class NewsFormPage {
  private readonly initialUrl: NewsModel | null = history.state.url;

  readonly news = signal<NewsModel | null>(this.initialUrl);
  readonly ROUTES = ROUTES;
  readonly imageError = signal<string | null>(null);
  readonly selectedImages = signal<File[]>([]);

  onChangeImages(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];

    // requerido
    if (files.length === 0) {
      this.imageError.set('Debes seleccionar al menos una imagen');
      input.value = '';
      return;
    }

    // máximo 3
    if (files.length > 3) {
      this.imageError.set('Máximo 3 imágenes permitidas');
      input.value = '';
      return;
    }

    // solo imágenes
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        this.imageError.set('Solo se permiten imágenes');
        input.value = '';
        return;
      }
    }

    this.imageError.set(null);
    this.selectedImages.set(files);
  }

  createPreview(file: File): string {
    return URL.createObjectURL(file);
  }
}
