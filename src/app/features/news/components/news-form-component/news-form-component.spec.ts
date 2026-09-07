import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsFormComponent } from './news-form-component';
import { NewsModel } from '@features/news/models/news-model';
import { Preview } from '@features/news-gallery/models/news-gallery-model';

describe('NewsFormComponent', () => {
  let component: NewsFormComponent;
  let fixture: ComponentFixture<NewsFormComponent>;

  const validData = { title: 'Nueva noticia', subtitle: 'Subtítulo', body: 'Cuerpo de la noticia' };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('actionText', 'Crear Noticia');
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('formData (hidratación desde news input)', () => {
    it('debería inicializar vacío cuando no hay noticia', () => {
      expect(component['formData']()).toEqual({ title: '', subtitle: '', body: '' });
    });

    it('debería hidratar los campos desde la noticia en edición', () => {
      fixture.componentRef.setInput('news', {
        id_news: 4,
        title: 'Título existente',
        subtitle: 'Subtítulo existente',
        body: 'Cuerpo existente',
        created_at: '2026-01-01',
        updated_at: '2026-01-02',
        images: [],
      } as NewsModel);
      fixture.detectChanges();

      expect(component['formData']()).toEqual({
        title: 'Título existente',
        subtitle: 'Subtítulo existente',
        body: 'Cuerpo existente',
      });
    });
  });

  describe('onSubmit', () => {
    it('debería emitir formSubmit con id 0 y los datos en creación', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData });
      component['onSubmit']();

      expect(spy).toHaveBeenCalledWith({ id: 0, data: validData });
    });

    it('debería emitir formSubmit con el id de la noticia en edición', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      fixture.componentRef.setInput('news', {
        id_news: 7,
        ...validData,
        created_at: '2026-01-01',
        updated_at: '2026-01-02',
        images: [],
      } as NewsModel);
      fixture.detectChanges();
      component['formData'].set({ ...validData });
      component['onSubmit']();

      expect(spy).toHaveBeenCalledWith({ id: 7, data: validData });
    });

    it('no debería emitir formSubmit con título vacío', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, title: ' ' });
      component['onSubmit']();

      expect(spy).not.toHaveBeenCalled();
    });

    it('no debería emitir formSubmit con subtítulo vacío', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, subtitle: '' });
      component['onSubmit']();

      expect(spy).not.toHaveBeenCalled();
    });

    it('no debería emitir formSubmit si el subtítulo supera los 256 caracteres', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, subtitle: 'x'.repeat(257) });
      component['onSubmit']();

      expect(spy).not.toHaveBeenCalled();
    });

    it('no debería emitir formSubmit con body vacío', () => {
      const spy = vi.spyOn(component['formSubmit'], 'emit');
      component['formData'].set({ ...validData, body: '' });
      component['onSubmit']();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('sanitize', () => {
    it('no debería aplicar título de más de 100 caracteres', () => {
      const input = { value: '' } as HTMLInputElement;
      component['updateTitle']('x'.repeat(101), input);
      expect(component['formData']().title).toBe('');
      expect(input.value).toBe('');
    });

    it('no debería aplicar subtítulo de más de 256 caracteres', () => {
      const input = { value: '' } as HTMLInputElement;
      component['updateSubtitle']('x'.repeat(257), input);
      expect(component['formData']().subtitle).toBe('');
      expect(input.value).toBe('');
    });
  });

  describe('onAddImages', () => {
    const originalCreateObjectURL = URL.createObjectURL;

    beforeEach(() => {
      URL.createObjectURL = vi.fn(() => 'blob:mock-preview');
      URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      URL.createObjectURL = originalCreateObjectURL;
    });

    it('debería emitir addImage con los Preview de los archivos seleccionados', () => {
      const spy = vi.spyOn(component['addImage'], 'emit');
      const file = new File(['foto'], 'foto.png', { type: 'image/png' });
      const event = { target: { files: [file] } } as unknown as Event;

      component['onAddImages'](event);

      const emitted = spy.mock.calls[0][0] as Preview[];
      expect(emitted).toHaveLength(1);
      expect(emitted[0]).toMatchObject({ id: 0, file, alt: 'Imagen sin nombre' });
      expect(emitted[0].url).toBe('blob:mock-preview');
    });

    it('no debería emitir addImage cuando el archivo no es imagen', () => {
      const spy = vi.spyOn(component['addImage'], 'emit');
      const file = new File(['texto'], 'doc.txt', { type: 'text/plain' });
      const event = { target: { files: [file] } } as unknown as Event;

      component['onAddImages'](event);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});