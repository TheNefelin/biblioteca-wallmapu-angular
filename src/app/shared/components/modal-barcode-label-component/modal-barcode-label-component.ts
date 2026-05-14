import { Component, effect, input, output, signal } from '@angular/core';
import BwipJs from 'bwip-js/browser';

@Component({
  selector: 'app-modal-barcode-label-component',
  imports: [],
  templateUrl: './modal-barcode-label-component.html',
})
export class ModalBarcodeLabelComponent {
  private readonly SITE_PREFIX = 'Biblioteca';
  private readonly SITE_NAME = 'Wallmapu de Mesana';
  private readonly SITE_URL = 'https://wallmapumesana.cl';

  readonly isOpen = input.required<boolean>();
  readonly barcode = input<string | null>(null);
  readonly onModalClose = output<void>();

  protected readonly labelUrl = signal<string | null>(null);
  protected readonly combinedUrl = signal<string | null>(null);
  protected readonly combinedSideUrlMyVersion = signal<string | null>(null);
  protected readonly rowUrl = signal<string | null>(null);

  private readonly renderEffect = effect(() => {
    if (this.barcode()) {
      this.labelUrl.set(this.buildLabel(2));
      this.combinedUrl.set(this.buildCombined(2));
      this.combinedSideUrlMyVersion.set(this.buildCombinedSideMyVersion(2));
      this.rowUrl.set(this.buildRow(2));
    }
  });

  private barcodeCanvas(barcode: string, scale: number): HTMLCanvasElement {
    const c = document.createElement('canvas');
    BwipJs.toCanvas(c, {
      bcid: 'code128', text: barcode, scale, height: 15,
      includetext: true, textxalign: 'center', textfont: 'helvetica',
      textsize: 10, backgroundcolor: '#FFFFFF', barcolor: '#000000',
    });
    return c;
  }

  private qrCanvas(text: string, scale: number): HTMLCanvasElement {
    const c = document.createElement('canvas');
    BwipJs.toCanvas(c, {
      bcid: 'qrcode', text, scale,
      backgroundcolor: '#FFFFFF', barcolor: '#000000',
    });
    return c;
  }

  private newCanvas(w: number, h: number, bgColor: string = '#FFFFFF'): CanvasRenderingContext2D | null {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);
    }
    return ctx;
  }

  private buildLabel(scale: number): string {
    const barcode = this.barcode();
    if (!barcode) return '';

    const bc = this.barcodeCanvas(barcode, scale);
    const pad = 6 * scale;
    const gap = 6 * scale;
    const ts = 10 * scale;
    const w = bc.width + pad * 2;
    const h = bc.height + ts + ts + pad * 2 + gap * 2;

    const ctx = this.newCanvas(w, h);
    if (!ctx) return '';

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = `bold ${ts}px sans-serif`;
    ctx.fillText(this.SITE_PREFIX + ' ' + this.SITE_NAME, w / 2, pad);
    ctx.font = `${ts}px sans-serif`;
    ctx.fillText(this.SITE_URL, w / 2, h - pad - ts);
    ctx.drawImage(bc, (w - bc.width) / 2, pad + ts + gap);

    return ctx.canvas.toDataURL('image/png');
  }

  private buildCombined(scale: number): string {
    const barcode = this.barcode();
    if (!barcode) return '';

    const bc = this.barcodeCanvas(barcode, scale);
    const qr = this.qrCanvas(this.SITE_URL, scale);

    const pad = 10;
    const gap = 6;
    const ts = 14;
    const w = Math.max(bc.width, qr.width) + pad * 2;
    const h = pad + ts + gap + bc.height + gap + ts + gap + qr.height + pad;

    const ctx = this.newCanvas(w, h);
    if (!ctx) return '';
    const cx = w / 2;

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = `bold ${ts}px sans-serif`;
    ctx.fillText(this.SITE_PREFIX + ' ' + this.SITE_NAME, cx, pad);
    ctx.drawImage(bc, cx - bc.width / 2, pad + ts + gap);

    ctx.font = `${ts}px sans-serif`;
    const urlY = pad + ts + gap + bc.height + gap;
    ctx.fillText(this.SITE_URL, cx, urlY);
    ctx.drawImage(qr, cx - qr.width / 2, urlY + ts + gap);

    return ctx.canvas.toDataURL('image/png');
  }

  private buildCombinedSideMyVersion(scale: number): string {
    const barcode = this.barcode();
    if (!barcode) return '';

    const bc = this.barcodeCanvas(barcode, scale);
    const qr = this.qrCanvas(this.SITE_URL, scale);
    
    const pad = 6 * scale;
    const ts = 7 * scale;
    const w_canvas = bc.width + (pad * 2);
    const h_canvas = bc.height + qr.height + (pad * 3);
    
    const ctx = this.newCanvas(w_canvas, h_canvas, '#FFF');
    if (!ctx) return '';
    
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'top';

    ctx.drawImage(bc, pad, pad);
    ctx.drawImage(qr, bc.width - qr.width + pad, bc.height + (pad * 2));

    ctx.textBaseline = 'top';
    ctx.font = `bold ${ts}px sans-serif`;
    ctx.fillText(this.SITE_PREFIX, pad, bc.height + qr.height/2);
    ctx.fillText(this.SITE_NAME, pad, bc.height + qr.height/2 + (ts + pad / 2));
    ctx.font = `${ts}px sans-serif`;
    ctx.fillText(this.SITE_URL, pad, bc.height + qr.height/2 + (ts + pad * 2));

    return ctx.canvas.toDataURL('image/png');
  }

  private buildRow(scale: number): string {
    const barcode = this.barcode();
    if (!barcode) return '';

    const bc = this.barcodeCanvas(barcode, scale);
    const qr = this.qrCanvas(this.SITE_URL, scale);

    const pad = 8 * scale;
    const gap = 6 * scale;
    const ts = 10 * scale;
    const rowH = Math.max(bc.height, qr.height);
    const contentW = bc.width + gap + qr.width;

    const w = contentW + pad * 2;
    const h = pad + ts + gap + rowH + pad;

    const ctx = this.newCanvas(w, h, '#FFF');
    if (!ctx) return '';

    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = `bold ${ts}px sans-serif`;
    ctx.fillText(this.SITE_PREFIX + ' ' + this.SITE_NAME, w / 2, pad);

    const rowY = pad + ts + gap;
    ctx.drawImage(bc, pad, rowY + (rowH - bc.height) / 2);
    ctx.drawImage(qr, pad + bc.width + gap, rowY + (rowH - qr.height) / 2);

    return ctx.canvas.toDataURL('image/png');
  }

  private doDownload(dataUrl: string, suffix: string): void {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `etiqueta-${this.barcode() || 'ejemplar'}-${suffix}.png`;
    link.href = dataUrl;
    link.click();
  }

  protected downloadLabel(): void { this.doDownload(this.buildLabel(5), '1'); }
  protected downloadCombined(): void { this.doDownload(this.buildCombined(5), '2'); }
  protected downloadMyVersion(): void { this.doDownload(this.buildCombinedSideMyVersion(5), '3'); }
  protected downloadRow(): void { this.doDownload(this.buildRow(5), '4'); }
}
