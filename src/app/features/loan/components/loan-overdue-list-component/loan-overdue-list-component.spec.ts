import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanOverdueListComponent } from './loan-overdue-list-component';

describe('LoanOverdueListComponent', () => {
  let component: LoanOverdueListComponent;
  let fixture: ComponentFixture<LoanOverdueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanOverdueListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanOverdueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('getDaysDiff', () => {
    it('debería devolver los días restantes hacia una fecha futura', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const future = new Date(today);
      future.setDate(future.getDate() + 3);

      expect(component['getDaysDiff'](future)).toBe(3);
    });

    it('debería devolver un número negativo para una fecha ya vencida', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const overdue = new Date(today);
      overdue.setDate(overdue.getDate() - 2);

      expect(component['getDaysDiff'](overdue)).toBe(-2);
    });

    it('debería devolver 0 para la fecha de hoy', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      expect(component['getDaysDiff'](today)).toBe(0);
    });
  });
});