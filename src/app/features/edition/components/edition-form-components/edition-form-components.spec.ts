import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { EditionFormComponents } from './edition-form-components';
import { EditionModel, SaveEditionModel } from '@features/edition/models/edition-model';
import { FormatModel } from '@features/format/models/format-model';

describe('EditionFormComponents', () => {
  let component: EditionFormComponents;
  let fixture: ComponentFixture<EditionFormComponents>;

  const validData: SaveEditionModel = {
    edition: '1ra Edición',
    isbn: '978-123',
    publication_year: 2020,
    pages: 120,
    cover_image: 'https://res.cloudinary.com/x/cover.png',
    book_id: 3,
    editorial_id: 2,
    format_ids: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditionFormComponents],
      providers: [
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditionFormComponents);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('heading', 'Crear Edición');
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('formato de formats en el payload (regresión format_ids)', () => {
    it('onSubmit debería emitir data.format_ids (NO data.formats) con los ids agregados', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData });

      const hardFormat = { id_format: 1, name: 'Tapa Dura' } as FormatModel;
      const ebookFormat = { id_format: 5, name: 'Ebook' } as FormatModel;
      component['addFormat'](hardFormat);
      component['addFormat'](ebookFormat);
      component['deleteFormat'](hardFormat);
      component['onSubmit']();

      const emitted = spy.mock.calls[0][0];
      expect(emitted.data.format_ids).toEqual([5]);
      expect(emitted.data).not.toHaveProperty('formats');
    });

    it('onSubmit debería emitir format_ids vacío cuando no hay formatos', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData });
      component['onSubmit']();

      const emitted = spy.mock.calls[0][0];
      expect(emitted.data.format_ids).toEqual([]);
    });
  });

  describe('onSubmit id/img', () => {
    it('en creación debería emitir id 0 e img null', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData });
      component['onSubmit']();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ id: 0, img: null })
      );
    });

    it('en edición debería emitir el id_edition y la imagen subida', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      fixture.componentRef.setInput('editionModel', {
        id_edition: 11,
        edition: '1ra Edición',
        isbn: '978-123',
        publication_year: 2020,
        pages: 120,
        cover_image: 'https://res.cloudinary.com/x/cover.png',
        book_id: 3,
        editorial_id: 2,
        formats: [] as FormatModel[],
        created_at: '2026-01-01T00:00:00',
        updated_at: '2026-01-01T00:00:00',
      } as EditionModel);
      fixture.detectChanges();

      const file = new File(['data'], 'new.png', { type: 'image/png' });
      component['formFile'].set(file);
      component['onSubmit']();

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ id: 11, img: file })
      );
    });
  });

  describe('validación de campos requeridos', () => {
    it('debería bloquear el submit sin editorial', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, editorial_id: 0 });
      component['onSubmit']();

      expect(component['errorMessage']()).toContain('La editorial es requerida');
      expect(spy).not.toHaveBeenCalled();
    });

    it('debería bloquear el submit sin portada', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, cover_image: null });
      component['onSubmit']();

      expect(component['errorMessage']()).toBe('Debes seleccionar una imagen');
      expect(spy).not.toHaveBeenCalled();
    });

    it('debería bloquear el submit sin año', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, publication_year: 0 });
      component['onSubmit']();

      expect(component['errorMessage']()).toBe('El año es requerido');
      expect(spy).not.toHaveBeenCalled();
    });

    it('debería bloquear el submit con año inválido', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, publication_year: 1500 });
      component['onSubmit']();

      expect(component['errorMessage']()).toBe('El año debe ser valido');
      expect(spy).not.toHaveBeenCalled();
    });

    it('debería bloquear el submit sin páginas', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, pages: 0 });
      component['onSubmit']();

      expect(component['errorMessage']()).toBe('Las paginas son requerido');
      expect(spy).not.toHaveBeenCalled();
    });

    it('debería bloquear el submit con páginas fuera de rango', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, pages: 5 });
      component['onSubmit']();

      expect(component['errorMessage']()).toBe('La cantidad de paginas debe ser valida');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('sanitize', () => {
    it('debería rechazar una edición de más de 50 caracteres', () => {
      const input = { value: '' } as HTMLInputElement;
      component['updateEdition']('x'.repeat(51), input);
      expect(component['formData']().edition).toBe('');
      expect(input.value).toBe('');
    });

    it('debería rechazar ISBN de más de 20 caracteres', () => {
      const input = { value: '' } as HTMLInputElement;
      component['updateISBN']('x'.repeat(21), input);
      expect(component['formData']().isbn).toBe('');
      expect(input.value).toBe('');
    });

    it('debería rechazar año con caracteres no numéricos', () => {
      const input = { value: '' } as HTMLInputElement;
      component['updateYear']('20a0', input);
      expect(component['formData']().publication_year).toBe(2026);
    });
  });

  describe('onChangeImages', () => {
    it('debería setear formFile y el preview cover_image cuando el archivo es imagen', () => {
      const originalFileReader = globalThis.FileReader;
      (globalThis as unknown as { FileReader: unknown }).FileReader = class {
        onload: (() => void) | null = null;
        result = 'data:image/png;base64,ZGF0YQ==';
        readAsDataURL() {
          this.onload?.();
        }
      };

      try {
        const file = new File(['data'], 'cover.png', { type: 'image/png' });
        const event = { target: { files: [file] } } as unknown as Event;
        component['onChangeImages'](event);

        expect(component['formFile']()).toBe(file);
        expect(component['formData']().cover_image).toContain('data:image/png;base64,');
        expect(component['errorMessage']()).toBeNull();
      } finally {
        globalThis.FileReader = originalFileReader;
      }
    });

    it('debería setear error si el archivo no es imagen', () => {
      const file = new File(['data'], 'doc.txt', { type: 'text/plain' });
      const event = { target: { files: [file] } } as unknown as Event;
      component['onChangeImages'](event);

      expect(component['errorMessage']()).toBe('El archivo debe ser una imagen');
    });
  });

  describe('onDeleteImage', () => {
    it('debería emitir deleteImage con el id cuando hay imagen previa del backend', () => {
      fixture.componentRef.setInput('editionModel', {
        id_edition: 11,
        edition: '1ra Edición',
        isbn: '978-123',
        publication_year: 2020,
        pages: 120,
        cover_image: 'https://res.cloudinary.com/x/cover.png',
        book_id: 3,
        editorial_id: 2,
        formats: [] as FormatModel[],
        created_at: '2026-01-01T00:00:00',
        updated_at: '2026-01-01T00:00:00',
      } as EditionModel);
      fixture.detectChanges();

      const spy = vi.spyOn(component['deleteImage'], 'emit');
      component['formFile'].set(new File(['data'], 'cover.png', { type: 'image/png' }));
      component['formData'].update(d => ({ ...d, cover_image: 'https://res.cloudinary.com/x/cover.png' }));
      component['onDeleteImage'](11);

      expect(spy).toHaveBeenCalledWith(11);
      expect(component['formFile']()).toBeNull();
      expect(component['formData']().cover_image).toBeNull();
    });

    it('no debería emitir deleteImage en creación (id 0, sin imagen previa)', () => {
      const spy = vi.spyOn(component['deleteImage'], 'emit');
      component['onDeleteImage'](0);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
