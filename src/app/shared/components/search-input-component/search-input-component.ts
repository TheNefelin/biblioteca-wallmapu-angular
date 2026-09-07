import { Component, effect, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search-input-component',
  imports: [],
  templateUrl: './search-input-component.html',
})
export class SearchInputComponent {
  readonly textTitle = input<string>("");
  readonly textPlaceholder = input<string>('Buscar...');
  readonly debounceMs = input<number>(300);
  readonly onInputTextChange = output<string>();

  protected readonly inputText = signal<string>('');

  protected inputTextChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputText.set(value);
  }

  private readonly emitInputText = effect(() => {
    const value = this.searchDebounced();
    this.onInputTextChange.emit(value);
  });

  private readonly searchDebounced = toSignal(
    toObservable(this.inputText).pipe(
      debounceTime(this.debounceMs()),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );
}
