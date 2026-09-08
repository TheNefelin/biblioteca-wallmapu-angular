import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchSelectComponent } from '@shared/components/search-select-component/search-select-component';
import { SelectItem } from '@shared/components/search-select-component/search-select-component';

const ITEMS: SelectItem[] = [
  { id: 1, name: 'Temuco' },
  { id: 2, name: 'Padre Las Casas' },
];

describe('SearchSelectComponent diag - selectedId + items', () => {
  let fixture: ComponentFixture<SearchSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchSelectComponent);
  });

  it('muestra el nombre del item seleccionado (items seteados)', async () => {
    fixture.componentRef.setInput('items', ITEMS);
    fixture.componentRef.setInput('selectedId', 1);
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    expect(input.value.trim()).toBe('Temuco');
  });

  it('muestra el nombre cuando los items llegan DESPUÉS del selectedId', async () => {
    fixture.componentRef.setInput('selectedId', 1);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentRef.setInput('items', ITEMS);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    expect(input.value.trim()).toBe('Temuco');
  });
});