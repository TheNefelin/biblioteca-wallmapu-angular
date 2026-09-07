import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageListComponent } from './image-list-component';
import { Preview } from '@features/news-gallery/models/news-gallery-model';

describe('ImageListComponent', () => {
  let component: ImageListComponent;
  let fixture: ComponentFixture<ImageListComponent>;

  const existingImage: Preview = { id: 3, alt: 'Imagen de backend', url: '/img/backend.png', file: null };
  const newImage: Preview = { id: 0, alt: 'Imagen sin nombre', url: 'blob:nueva', file: new File(['d'], 'nueva.png', { type: 'image/png' }) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageListComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('previewList', [existingImage, newImage]);
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('onUpdateImageAlt', () => {
    it('debería emitir updateAlt con el item y el alt crudo', () => {
      const spy = vi.spyOn(component['updateAlt'], 'emit');
      component['onUpdateImageAlt'](newImage, 'Foto nueva');

      expect(spy).toHaveBeenCalledWith({ item: newImage, alt: 'Foto nueva' });
    });

    it('debería emitir updateAlt sin alterar el valor cuando el alt queda vacío (la normalización vive en el Page)', () => {
      const spy = vi.spyOn(component['updateAlt'], 'emit');
      component['onUpdateImageAlt'](newImage, '   ');

      expect(spy).toHaveBeenCalledWith({ item: newImage, alt: '   ' });
    });
  });

  describe('deleteImage', () => {
    it('debería emitir deleteImage con el item al hacer click en el botón eliminar', () => {
      const spy = vi.spyOn(component['deleteImage'], 'emit');

      const buttons = fixture.nativeElement.querySelectorAll('app-button-component button');
      (buttons[0] as HTMLButtonElement).click();

      expect(spy).toHaveBeenCalledWith(existingImage);
    });
  });
});