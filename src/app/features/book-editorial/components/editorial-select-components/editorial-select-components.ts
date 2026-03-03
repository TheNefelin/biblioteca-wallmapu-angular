import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { EditorialModel } from '@features/book-editorial/models/editorial-model';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
import { catchError, map, of } from 'rxjs';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-editorial-select-components',
  imports: [
    LoadingComponent
  ],
  templateUrl: './editorial-select-components.html',
})
export class EditorialSelectComponents {
  // ─── Inputs/Outputs ─────────────────────────────
  readonly disabled = input<boolean>(false);
  readonly selectedId = input<number>(0);
  readonly newSelectedId = output<number>();  

  // ─── Estado interno ─────────────────────────────
  protected readonly isOpen = signal(false);
  protected readonly searchText = signal('');
  protected readonly selectedEditorial = signal<EditorialModel | null>(null);

  readonly inputRef = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  
  // ─── Servicio ───────────────────────────────────
  private readonly editorialService = inject(EditorialService);

  private readonly editorialRX = rxResource({
    stream: () => {
      return this.editorialService.getAll().pipe(
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

  protected readonly isLoading = computed(() => this.editorialRX.isLoading());
  protected readonly editorialComputedList = computed<EditorialModel[]>(() => this.editorialRX.value() ?? []);
  
  // ─── Sincronización inicial ─────────────────────
  private readonly syncInitial = effect(() => {
    const id = this.selectedId();
    const list = this.editorialComputedList();
    if (id && list?.length) {
      const found = list.find((a) => a.id_editorial === id);
      if (found) this.selectedEditorial.set(found);
    }
  });
  
  // ─── Computeds ──────────────────────────────────
  protected readonly selectedEditorialName = computed(() => {
    const sel = this.selectedEditorial();
    return sel?.name ?? null;
  });

  protected readonly filteredEditorial = computed(() => {
    const term = this.searchText().toLowerCase().trim();
    const list = this.editorialComputedList();
    if (!term) return list;
    return list.filter((a) => a.name.toLowerCase().includes(term));
  });

  // ─── Handlers ──────────────────────────────────
  protected onSearch(value: string) {
    this.searchText.set(value);
    this.isOpen.set(true);
    if (this.selectedEditorial() && value !== this.selectedEditorial()!.name) {
      this.selectedEditorial.set(null);
    }
  }

  protected select(author: EditorialModel, event: MouseEvent) {
    event.preventDefault();
    this.selectedEditorial.set(author);
    this.searchText.set('');
    this.isOpen.set(false);
    this.inputRef()?.nativeElement.blur();
    this.newSelectedId.emit(author.id_editorial);
  }

  protected clearSelection(event: MouseEvent) {
    event.preventDefault();
    this.selectedEditorial.set(null);
    this.searchText.set('');
    this.newSelectedId.emit(0);
  }

  protected onBlur() {
    setTimeout(() => {
      this.isOpen.set(false);
      if (!this.selectedEditorial()) this.searchText.set('');
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
