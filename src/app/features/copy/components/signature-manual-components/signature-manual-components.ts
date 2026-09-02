import { Component, output } from '@angular/core';
import { ButtonComponent } from "@shared/components/button-component/button-component";

@Component({
  selector: 'app-signature-manual-components',
  imports: [ButtonComponent],
  templateUrl: './signature-manual-components.html',
})
export class SignatureManualComponents {
  protected readonly closeHelpModal = output<void>();
}
