import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-loading-component',
  imports: [],
  templateUrl: './loading-component.html',
})
export class LoadingComponent {

}
