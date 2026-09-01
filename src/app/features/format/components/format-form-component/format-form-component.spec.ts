import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatFormComponent } from './format-form-component';
import { FormatModel } from '@features/format/models/format-model';

describe('FormatFormComponent', () => {
  let component: FormatFormComponent;
  let fixture: ComponentFixture<FormatFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormatFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('computed actionText', () => {
    it('debería mostrar "Crear Formato" cuando no hay formato seleccionado', () => {
      fixture.componentRef.setInput('format', null);
      fixture.detectChanges();
      expect(component['actionText']()).toBe('Crear Formato');
    });

    it('debería mostrar "Modificar Formato" cuando hay formato seleccionado', () => {
      fixture.componentRef.setInput('format', { id_format: 1, name: 'Tapa Dura' } as FormatModel);
      fixture.detectChanges();
      expect(component['actionText']()).toBe('Modificar Formato');
    });
  });

  describe('onSaveClick', () => {
    it('debería emitir submitForm con el nombre válido', () => {
      const spy = vi.spyOn(component['submitForm'], 'emit');
      component['updateName']('Tapa Dura', {} as HTMLInputElement);
      component['onSaveClick']();
      expect(spy).toHaveBeenCalledWith({ name: 'Tapa Dura' } as FormatModel);
    });

    it('debería setear errorMessage cuando el nombre es null', () => {
      const spy = vi.spyOn(component['submitForm'], 'emit');
      component['formData'].set({});
      component['onSaveClick']();
      expect(component['errorMessage']()).toBe('El nombre es requerido');
      expect(spy).not.toHaveBeenCalled();
    });

    it('debería setear errorMessage cuando el nombre supera los 100 caracteres', () => {
      const spy = vi.spyOn(component['submitForm'], 'emit');
      component['formData'].set({ name: 'x'.repeat(101) });
      component['onSaveClick']();
      expect(component['errorMessage']()).toBe('El nombre tiene mas de 100 caracteres');
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
