import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, input, signal } from '@angular/core';
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
export class NewsDetailComponent implements OnDestroy {
  readonly news = input<NewsModel | null>(null)
  readonly shareMessage = signal<string | null>(null)

  private shareTimer?: ReturnType<typeof setTimeout>

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
        this.setShareMessage('¡Enlace copiado al portapapeles!')
      }
    } catch {
      if (!navigator.share) {
        this.setShareMessage('No se pudo copiar el enlace')
      }
    }
  }

  ngOnDestroy(): void {
    this.clearShareTimer()
  }

  private setShareMessage(message: string): void {
    this.shareMessage.set(message)
    this.clearShareTimer()
    this.shareTimer = setTimeout(() => this.shareMessage.set(null), 3000)
  }

  private clearShareTimer(): void {
    if (this.shareTimer) clearTimeout(this.shareTimer)
  }
}