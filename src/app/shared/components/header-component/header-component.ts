import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
