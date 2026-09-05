import { Component, effect, input, output, signal } from '@angular/core';
import { MessageErrorComponent } from "../message-error-component/message-error-component";
import { LoadingComponent } from "../loading-component/loading-component";
import { MessageSuccessComponent } from "../message-success-component/message-success-component";
import { ButtonComponent } from "../button-component/button-component";

@Component({
  selector: 'app-search-codbar-component',
  imports: [
    MessageErrorComponent, 
    LoadingComponent, 
    MessageSuccessComponent, 
    ButtonComponent
  ],
  templateUrl: './search-codbar-component.html',
})
export class SearchCodbarComponent {
  readonly disabled = input<boolean>(false);
  readonly textTitle = input<string>('sin titulo')
  readonly errorMessage = input<string | null>(null);
  readonly successMessage = input<string | null>(null);
  readonly isLoading = input<boolean>(false);
  readonly clearTrigger = input<number>(0);
  readonly onSubmit = output<string | null>();

  protected errorMsge = signal<string | null>(this.errorMessage());
  protected successMsge = signal<string | null>(this.successMessage());
  protected readonly formData = signal<string | null>(null);

  protected clearEffect = effect(() => {
    this.clearTrigger();

    this.formData.set(null);
    this.errorMsge.set(null);
    this.successMsge.set(null);  
  });

  protected updateCode(value: string, input: HTMLInputElement) {
    this.formData.set(value);
  }

  protected submit(event: Event): void {
    event.preventDefault();
    
    const data = this.formData();
    const error = this.validateFormOnSubmit(data);
    
    if (error) {
      this.errorMsge.set(error);
      return;
    }

    this.errorMsge.set(null);
    this.successMsge.set(null);
    this.onSubmit.emit(data);
  }

  private validateFormOnSubmit(data: string | null): string | null {
    if (data === null) return 'El código es requerido';  
    if (data.toString().length > 20) return 'El código debe tener entre 5 y 20 dígitos';
    return null;
  }
}
