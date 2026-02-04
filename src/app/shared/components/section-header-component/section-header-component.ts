import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  readonly description = input.required<string>();

  // Inputs opcionales
  readonly route = input<string | null>();          // Para el caso 2 (botón "Ver todas")
  readonly searchPlaceholder = input<string | null>(); // Texto del placeholder
  //readonly searchPlaceholder = input<string | null>('Buscar');

  // Output para emitir el valor de búsqueda
  readonly searchChange = output<string>();

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }
}
