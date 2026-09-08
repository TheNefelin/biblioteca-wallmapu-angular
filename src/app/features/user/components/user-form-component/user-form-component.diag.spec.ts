import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { UserFormComponent } from './user-form-component';
import { SearchSelectComponent } from '@shared/components/search-select-component/search-select-component';
import { UserModel } from '@features/user/models/user-model';
import { CommuneService } from '@features/division-commune/services/commune-service';
import { CommuneModel } from '@features/division-commune/models/commune-model';
import { UserStatusService } from '@features/user-status/services/user-status-service';
import { UserStatusModel } from '@features/user-status/models/user-status-model';
import { UserRoleService } from '@features/user-role/services/user-role-service';
import { UserRoleModel } from '@features/user-role/models/user-role-model';

const COMMUNES: CommuneModel[] = [
  { id_commune: 1, name: 'Temuco', created_at: '', updated_at: '', province_id: 1 },
  { id_commune: 2, name: 'Padre Las Casas', created_at: '', updated_at: '', province_id: 1 },
];

const STATUSES: UserStatusModel[] = [{ id_user_status: 1, name: 'Activo', created_at: '', updated_at: '' }];
const ROLES: UserRoleModel[] = [{ id_user_role: 2, name: 'Lector', created_at: '', updated_at: '' }];

const USER: UserModel = {
  id_user: '1',
  email: 'a@a.cl',
  name: 'Ana',
  lastname: 'Perez',
  rut: '11111111-1',
  address: 'Calle 1',
  phone: '987654321',
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
  commune_id: 1,
  user_role_id: 2,
  user_status_id: 1,
};

@Component({
  standalone: true,
  imports: [UserFormComponent],
  template: `<app-user-form-component [userModel]="user" />`,
})
class HostComponent {
  user: UserModel | null = null;
}

describe('UserFormComponent diag - comuna', () => {
  let host: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        { provide: CommuneService, useValue: { getAll: () => of(COMMUNES) } },
        { provide: UserStatusService, useValue: { getAll: () => of(STATUSES) } },
        { provide: UserRoleService, useValue: { getAll: () => of(ROLES) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
  });

  it('muestra el nombre de la comuna del usuario en el search-select', async () => {
    host.user = USER;
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    const inputs = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="text"]') as NodeListOf<HTMLInputElement>
    );
    const values = inputs.map((i) => i.value.trim());

    const selects = fixture.debugElement
      .queryAll(By.directive(SearchSelectComponent))
      .map((d) => d.componentInstance);
    const state = selects.map((s) => ({
      selectedId: s.selectedId(),
      items: s.items(),
      searchText: (s as unknown as { searchText: () => string }).searchText(),
      selectedItem: (s as unknown as { selectedItem: () => unknown }).selectedItem(),
    }));
    console.log('DIAG input values:', JSON.stringify(values));
    console.log('DIAG select states:', JSON.stringify(state));
    expect(values).toContain('Temuco');
  });
});