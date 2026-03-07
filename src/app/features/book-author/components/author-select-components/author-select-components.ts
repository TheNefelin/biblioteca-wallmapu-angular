import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthorModel } from '@features/book-author/models/author-model';
import { AuthorService } from '@features/book-author/services/author-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-author-select-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './author-select-components.html',
})
export class AuthorSelectComponents {
  // ─── Inputs/Outputs ─────────────────────────────
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly onNewSelectedAuthor = output<AuthorModel>();  

  // ─── Estado interno ─────────────────────────────
  protected readonly isOpen = signal(false);
  protected readonly searchText = signal('');
  protected readonly selectedAuthor = signal<AuthorModel | null>(null);

  readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  // ─── Servicio ───────────────────────────────────
  private readonly authorService = inject(AuthorService);

  private readonly authorRX = rxResource({
    stream: () => {
      return this.authorService.getAll().pipe(
        map((res) => {
          if (!res.isSuccess) throw new Error(res.message);
          return res.result;
        }),
        catchError(err => {
          return of(null);
        }),
      );
    },
  });

  protected readonly isLoading = computed(() => this.authorRX.isLoading());
  protected readonly authorComputedList = computed<AuthorModel[]>(() => this.authorRX.value() ?? []);

  // ─── Sincronización inicial ─────────────────────
  private readonly syncInitial = effect(() => {
    const id = this.selectedId();
    const list = this.authorComputedList();
    if (id && list?.length) {
      const found = list.find((a) => a.id_author === id);
      if (found) this.selectedAuthor.set(found);
    }
  });

  // ─── Computeds ──────────────────────────────────
  protected readonly selectedAuthorName = computed(() => {
    const sel = this.selectedAuthor();
    return sel?.name ?? null;
  });

  protected readonly filteredAuthors = computed(() => {
    const term = this.searchText().toLowerCase().trim();
    const list = this.authorComputedList();
    if (!term) return list;
    return list.filter((a) => a.name.toLowerCase().includes(term));
  });

  // ─── Handlers ──────────────────────────────────
  protected onSearch(value: string) {
    this.searchText.set(value);
    this.isOpen.set(true);
    if (this.selectedAuthor() && value !== this.selectedAuthor()!.name) {
      this.selectedAuthor.set(null);
    }
  }

  protected select(author: AuthorModel, event: MouseEvent) {
    event.preventDefault();
    this.selectedAuthor.set(author);
    this.searchText.set('');
    this.isOpen.set(false);
    this.inputRef()?.nativeElement.blur();
    this.onNewSelectedAuthor.emit(author);
  }

  protected clearSelection(event: MouseEvent) {
    event.preventDefault();
    this.selectedAuthor.set(null);
    this.searchText.set('');
  }

  protected onBlur() {
    setTimeout(() => {
      this.isOpen.set(false);
      if (!this.selectedAuthor()) this.searchText.set('');
    }, 150);
  }

  protected highlight(text: string): string {
    const term = this.searchText().trim();
    if (!term) return text;
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(
      regex,
      '<mark class="bg-primary/20 text-primary font-semibold rounded">$1</mark>'
    );
  }
}
