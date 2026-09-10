import { Component, effect, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import { MessageErrorComponent } from "../message-error-component/message-error-component";
import { MessageSuccessComponent } from "../message-success-component/message-success-component";
import { ButtonComponent } from "../button-component/button-component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-search-codbar-component',
  imports: [
    MessageErrorComponent, 
    MessageSuccessComponent, 
    ButtonComponent
  ],
  templateUrl: './search-codbar-component.html',
})
export class SearchCodbarComponent {
  readonly disabled = input<boolean>(false);
  readonly textTitle = input<string>('sin titulo');
  readonly isLoading = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  protected readonly submitted = output<string | null>();

  protected errorMsge = signal<string | null>(null);
  protected successMsge = signal<string | null>(null);
  protected readonly formData = signal<string | null>(null);

  protected clearEffect = effect(() => {
    this.clearTrigger();

    this.formData.set(null);
    this.errorMsge.set(null);
    this.successMsge.set(null);
  });

  protected updateCode(value: string) {
    this.formData.set(value);
    this.errorMsge.set(null);
    this.successMsge.set(null);
  }

  protected submit(): void {
    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMsge.set(error);
      return;
    }

    this.errorMsge.set(null);
    this.successMsge.set(null);
    this.submitted.emit(data);
  }

  private validateFormOnSubmit(data: string | null): string | null {
    if (data === null) return 'El código es requerido';  
    if (data.toString().length > 20) return 'El código debe tener entre 5 y 20 dígitos';
    return null;
  }
}