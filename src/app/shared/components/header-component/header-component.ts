import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-component',
  imports: [],
  templateUrl: './header-component.html',
})
export class HeaderComponent {
  @Input() title: string = 'Sin Titulo';
  @Input() description: string = 'Sin Sescripción';
  @Input() image: string= '/images/header.webp'

  getBackgroundImage() {
    return `url(${this.image})`;
  }
}
