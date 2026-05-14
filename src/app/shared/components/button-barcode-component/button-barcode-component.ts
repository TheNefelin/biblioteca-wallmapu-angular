import { Component, output } from '@angular/core';

@Component({
  selector: 'app-button-barcode-component',
  imports: [],
  templateUrl: './button-barcode-component.html',
})
export class ButtonBarcodeComponent {
  protected readonly onClick = output<void>();
}
