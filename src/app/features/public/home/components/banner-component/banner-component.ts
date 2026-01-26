import { Component } from '@angular/core';
import { AuthButtonComponent } from "@features/auth/components/auth-button-component/auth-button-component";

@Component({
  selector: 'app-banner-component',
  imports: [AuthButtonComponent],
  templateUrl: './banner-component.html',
})
export class BannerComponent {

}
