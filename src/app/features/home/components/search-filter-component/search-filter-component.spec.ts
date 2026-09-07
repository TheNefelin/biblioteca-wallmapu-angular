import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { SearchFilterComponent } from './search-filter-component';
import { AuthorService } from '@features/book-author/services/author-service';
import { FormatService } from '@features/format/services/format-service';
import { EditorialService } from '@features/book-editorial/services/editorial-service';
import { GenreService } from '@features/book-genre/services/genre-service';
import { SubjectService } from '@features/book-subject/services/subject-service';

describe('SearchFilterComponent', () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFilterComponent],
      providers: [
        { provide: AuthorService, useValue: { getAll: () => of([]) } },
        { provide: FormatService, useValue: { getAll: () => of([]) } },
        { provide: EditorialService, useValue: { getAll: () => of([]) } },
        { provide: GenreService, useValue: { getAll: () => of([]) } },
        { provide: SubjectService, useValue: { getAll: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  describe('onSearchChange', () => {
    it('debería emitir searchChange con el texto ingresado', () => {
      const spy = vi.spyOn(component['searchChange'], 'emit');
      const event = { target: { value: 'Don Segundo Sombra' } } as unknown as Event;

      component['onSearchChange'](event);

      expect(spy).toHaveBeenCalledWith('Don Segundo Sombra');
    });
  });

  describe('onClear', () => {
    it('debería limpiar la búsqueda, incrementar clearTrigger y emitir los filtros en null', () => {
      const searchSpy = vi.spyOn(component['searchChange'], 'emit');
      const authorSpy = vi.spyOn(component['selectedAuthor'], 'emit');
      const formatSpy = vi.spyOn(component['selectedFormat'], 'emit');
      const editorialSpy = vi.spyOn(component['selectedEditorial'], 'emit');
      const genreSpy = vi.spyOn(component['selectedGenre'], 'emit');
      const subjectSpy = vi.spyOn(component['selectedSubject'], 'emit');

      component['searchText'].set('Don Segundo Sombra');
      component['onClear']();

      expect(searchSpy).toHaveBeenCalledWith('');
      expect(authorSpy).toHaveBeenCalledWith(null);
      expect(formatSpy).toHaveBeenCalledWith(null);
      expect(editorialSpy).toHaveBeenCalledWith(null);
      expect(genreSpy).toHaveBeenCalledWith(null);
      expect(subjectSpy).toHaveBeenCalledWith(null);
      expect(component['clearTrigger']()).toBe(1);
      expect(component['searchText']()).toBe('');
    });
  });
});