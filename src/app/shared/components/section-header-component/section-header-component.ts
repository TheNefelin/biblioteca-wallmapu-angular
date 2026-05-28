import { Component, input, output, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ButtonGobackComponent } from "../button-goback-component/button-goback-component";

@Component({
  selector: 'app-section-header-component',
  imports: [ButtonGobackComponent],
  templateUrl: './section-header-component.html',
})
export class SectionHeaderComponent {
  // INPUTS
  readonly title = input.required<string>();
  readonly description = input<string>('');

  // ACTION BUTON OPTIONAL
  readonly actionText = input<string | null>(null);  
  readonly actionClicked = output<void>();

  // SEARCH
  readonly searchPlaceholder = input<string | null>(); // Texto del placeholder
  readonly searchChange = output<string>();

  private searchValue = signal<string>('');

  private searchValue$ = toObservable(this.searchValue).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    takeUntilDestroyed(),
  );

  constructor() {
    this.searchValue$.subscribe(value => this.searchChange.emit(value));
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchValue.set(value);
  }
}
