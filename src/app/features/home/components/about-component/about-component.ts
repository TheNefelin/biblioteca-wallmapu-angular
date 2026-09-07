import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './about-component.html',
})
export class AboutComponent {

}
