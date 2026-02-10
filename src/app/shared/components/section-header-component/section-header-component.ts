import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-section-header-component',
  imports: [
    RouterLink
  ],
  templateUrl: './section-header-component.html',
})
export class SectionHeaderComponent {
  // Inputs obligatorios
  readonly title = input.required<string>();
  readonly description = input<string>('');

  // Inputs opcionales
  readonly route = input<string | null>(); // Para el caso 2 (botón "Ver todas")
  readonly routeText = input<string | null>("Ver Mas")
  readonly searchPlaceholder = input<string | null>(); // Texto del placeholder
  //readonly searchPlaceholder = input<string | null>('Buscar');

  // Output para emitir el valor de búsqueda
  readonly searchChange = output<string>();

  private searchSubject = new Subject<string>();
  constructor() {
    // Emitir solo después de 300ms sin cambios
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchChange.emit(value);
    });
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);  // ← Enviar al subject en lugar de emit directo
  }
}
