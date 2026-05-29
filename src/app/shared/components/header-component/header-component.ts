import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-header-component',
  imports: [],
  templateUrl: './header-component.html',
})
export class HeaderComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly image = input('/images/header.webp');

  backgroundImage = computed(() => `url(${this.image()})`);
}
