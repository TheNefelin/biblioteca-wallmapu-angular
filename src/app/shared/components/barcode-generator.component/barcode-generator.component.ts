import { effect, Component, ElementRef, input, viewChild, ChangeDetectionStrategy } from '@angular/core';
import BwipJs from 'bwip-js/browser';

export type BarcodeFormat = 'qrcode' | 'code128' | 'ean13' | 'isbn';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-barcode-generator',
  imports: [],
  templateUrl: './barcode-generator.component.html',
})
export class BarcodeGeneratorComponent {
  readonly value = input.required<string>();
  readonly format = input<BarcodeFormat>('code128');
  readonly altText = input<string>('');

  private readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly renderEffect = effect(() => {
    const val = this.value();
    if (val) {
      this.render();
    }
  });

  private render(): void {
    const canvas = this.canvasRef()?.nativeElement;
    if (!canvas || !this.value()) return;

    try {
      BwipJs.toCanvas(canvas, {
        bcid: this.format(),
        text: this.value(),
        scale: 2,
        textxalign: 'center',
        textfont: 'helvetica',
        textsize: 10,
        height: 15,
        backgroundcolor: '#FFFFFF',
        barcolor: '#000000',
        alttext: this.altText() || this.value(),
      });
    } catch (error) {
      console.error('Error generating barcode:', error);
    }
  }
}