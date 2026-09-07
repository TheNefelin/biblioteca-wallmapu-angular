import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationListComponent } from './notification-list-component';

describe('NotificationListComponent', () => {
  let component: NotificationListComponent;
  let fixture: ComponentFixture<NotificationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('handleFilterNotReadChange', () => {
    it('debería emitir filterNotRead con true cuando el checkbox está marcado', () => {
      const spy = vi.spyOn(component['filterNotRead'], 'emit');
      const event = { target: { checked: true } } as unknown as Event;

      component['handleFilterNotReadChange'](event);

      expect(spy).toHaveBeenCalledWith(true);
    });

    it('debería emitir filterNotRead con false cuando el checkbox está desmarcado', () => {
      const spy = vi.spyOn(component['filterNotRead'], 'emit');
      const event = { target: { checked: false } } as unknown as Event;

      component['handleFilterNotReadChange'](event);

      expect(spy).toHaveBeenCalledWith(false);
    });
  });
});