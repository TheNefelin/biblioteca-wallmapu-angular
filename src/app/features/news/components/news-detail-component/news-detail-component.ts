import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NewsModel } from '@features/news/models/news-model';

@Component({
  selector: 'app-news-detail-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    NgOptimizedImage,
  ],
  templateUrl: './news-detail-component.html',
})
export class NewsDetailComponent {
  readonly news = input<NewsModel | null>(null)
  readonly shareMessage = signal<string | null>(null)

  async share(): Promise<void> {
    const news = this.news()
    if (!news) return

    const url = window.location.href
    const title = news.title
    const text = news.subtitle

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(url)
        this.shareMessage.set('¡Enlace copiado al portapapeles!')
        setTimeout(() => this.shareMessage.set(null), 3000)
      }
    } catch {
      if (!navigator.share) {
        this.shareMessage.set('No se pudo copiar el enlace')
        setTimeout(() => this.shareMessage.set(null), 3000)
      }
    }
  }
}
