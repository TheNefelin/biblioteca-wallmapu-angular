import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { of } from 'rxjs';
import { ReservationPage } from './reservation-page';
import { CopyDetailModel } from '@features/copy/models/copy-model';
import { EditionModel } from '@features/edition/models/edition-model';
import { AuthStore } from '@features/auth/services/auth-store';
import { BookService } from '@features/book/services/book-service';
import { EditionService } from '@features/edition/services/edition-service';
import { CopyService } from '@features/copy/services/copy-service';
import { ReservationService } from '@features/reservation/services/reservation-service';

describe('ReservationPage autoSelectEffect', () => {
  let fixture: ComponentFixture<ReservationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ bookId: '1', editionId: '12' })) },
        },
        { provide: ViewportScroller, useValue: { scrollToPosition: () => void 0 } },
        { provide: AuthStore, useValue: { isAuthenticated: () => false } },
        { provide: BookService, useValue: { getById: () => of(null) } },
        {
          provide: EditionService,
          useValue: {
            getAllByBook: () => of([{ id_edition: 12, edition: '1ra Edición' }] as EditionModel[]),
          },
        },
        {
          provide: CopyService,
          useValue: {
            getAllByBookId: () =>
              of([
                { id_copy: 1, edition_id: 12, is_availability: false, availability_status: 'No Disponible' },
                { id_copy: 2, edition_id: 12, is_availability: true, availability_status: 'Disponible' },
              ] as CopyDetailModel[]),
          },
        },
        { provide: ReservationService, useValue: { create: () => of(null) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationPage);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('debería setear copy.selectedItem y edition.selectedItem al cargar los datos', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.componentInstance as unknown as {
      copy: { selectedItem: () => CopyDetailModel | null };
      edition: { selectedItem: () => EditionModel | null };
    };

    expect(page.copy.selectedItem()?.id_copy).toBe(2);
    expect(page.edition.selectedItem()?.id_edition).toBe(12);
  });

  it('debería setear edition.selectedItem aunque la edición no tenga copias', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ReservationPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ bookId: '1', editionId: '12' })) },
        },
        { provide: ViewportScroller, useValue: { scrollToPosition: () => void 0 } },
        { provide: AuthStore, useValue: { isAuthenticated: () => false } },
        { provide: BookService, useValue: { getById: () => of(null) } },
        {
          provide: EditionService,
          useValue: {
            getAllByBook: () => of([{ id_edition: 12, edition: '1ra Edición' }] as EditionModel[]),
          },
        },
        {
          provide: CopyService,
          useValue: {
            getAllByBookId: () => of([] as CopyDetailModel[]),
          },
        },
        { provide: ReservationService, useValue: { create: () => of(null) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const page = fixture.componentInstance as unknown as {
      copy: { selectedItem: () => CopyDetailModel | null };
      edition: { selectedItem: () => EditionModel | null };
    };

    expect(page.edition.selectedItem()?.id_edition).toBe(12);
    expect(page.copy.selectedItem()).toBeNull();
  });
});