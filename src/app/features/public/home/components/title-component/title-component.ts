import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-title-component',
  imports: [
    RouterLink
  ],
  templateUrl: './title-component.html',
})
export class TitleComponent {
  @Input() title: string = 'Sin Titulo';
  @Input() description: string = 'Sin Sescripción';
  @Input() route: string= '/'
}
