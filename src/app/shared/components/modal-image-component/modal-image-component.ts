import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-modal-image-component',
  imports: [],
  templateUrl: './modal-image-component.html',
})
export class ModalImageComponent {
  // Estado del modal
  readonly isOpen = input.required<boolean>();

  // URL de la imagen y texto alternativo
  readonly imageUrl = input.required<string>();
  readonly altText = input<string>('Imagen sin Nombre');

  // Evento de cerrar
  readonly closeModal = output<void>();
}
