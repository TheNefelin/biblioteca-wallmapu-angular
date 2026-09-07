import { Component, input, linkedSignal, output, signal } from '@angular/core';
import { MessageErrorComponent } from "@shared/components/message-error-component/message-error-component";
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { UserStatusSelectComponent } from "@features/user-status/components/user-status-select-component/user-status-select-component";
import { UserRoleSelectComponent } from "@features/user-role/components/user-role-select-component/user-role-select-component";
import { UserRoleModel } from '@features/user-role/models/user-role-model';
import { UserStatusModel } from '@features/user-status/models/user-status-model';
import { UserModel } from '@features/user/models/user-model';
import { CommuneSelectComponent } from '@features/division-commune/components/commune-select-component/commune-select-component';
import { CommuneModel } from '@features/division-commune/models/commune-model';
import { LoadingComponent } from "@shared/components/loading-component/loading-component";

@Component({
  selector: 'app-user-form-component',
  imports: [
    DatePipe,
    NgOptimizedImage,
    MessageErrorComponent,
    CommuneSelectComponent,
    UserStatusSelectComponent,
    UserRoleSelectComponent,
    LoadingComponent
],
  templateUrl: './user-form-component.html',
})
export class UserFormComponent {
  readonly isLoading = input<boolean>(false);
  readonly isUser = input<boolean>(true);
  readonly userPicture = input<string | null>(null);
  readonly userModel = input<UserModel | null>(null);
  protected readonly formSubmit = output<UserModel>();

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly formData = linkedSignal<UserModel>(() => {
    const user = this.userModel();

    return {
      id_user: user?.id_user ?? '',
      email: user?.email ?? '',
      name: user?.name ?? '',
      lastname: user?.lastname ?? '',
      rut: user?.rut ?? '',
      address: user?.address ?? '',
      phone: user?.phone ?? '',
      created_at: user?.created_at ?? '',
      updated_at: user?.updated_at ?? '',
      commune_id: user?.commune_id ?? 0,
      user_role_id: user?.user_role_id ?? 0,
      user_status_id: user?.user_status_id ?? 0,
    }
  });

  /* -- Form Updates -------------------------------------- */
  protected updatePhone(value: string, input: HTMLInputElement) { 
    this.updateField('phone', value, input);
  }
  protected updateName(value: string, input: HTMLInputElement) { 
    this.updateField('name', value, input); 
  }
  protected updateLastname(value: string, input: HTMLInputElement) {
    this.updateField('lastname', value, input); 
  }
  protected updateRut(value: string, input: HTMLInputElement) { 
    this.updateField('rut', value, input); 
  }
  protected updateAddress(value: string, input: HTMLInputElement) { 
    this.updateField('address', value, input); 
  }
  protected updateCommune(commune: CommuneModel | null) {
    this.formData.update(data => ({ ...data, commune_id: commune?.id_commune ?? 0 }));
  }

  private updateField<K extends keyof UserModel>(key: K, value: string, input?: HTMLInputElement) {
    const sanitized = this.sanitize(key, value);

    if (sanitized === null) {
      if (input) input.value = this.formData()[key] as string ?? ''; // ✅ Forzar el valor anterior de vuelta en el DOM
      return; // valor inválido, no actualiza
    } 

    this.formData.update(data => ({ ...data, [key]: value }));
    this.errorMessage.set(null);
  }

  private sanitize(key: keyof UserModel, value: string): string | null {
    switch (key){
      case 'phone':
        if (!/^\d*$/.test(value)) return null; // solo números
        if (value.length > 9) return null; // máximo 9
        return value;
      case 'name':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return null; // solo texto
        if (value.length > 45) return null;
        return value;
      case 'lastname':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return null;
        if (value.length > 45) return null;
        return value;
      case 'rut':
        if (!/^[\d\-kK]*$/.test(value)) return null; // solo números, guión y K k
        if (value.length > 10) return null;
        return value;   
      case 'address':
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s0-9,°#.]+$/.test(value)) return null; // solo texto, números y caracteres
        if (value.length > 256) return null;
        return value;       
      default:
        return value;
    }
  }

  /* -- Submit -------------------------------------------- */
  onSubmit(event: Event) {
    event.preventDefault();

    const data = this.formData();
    const error = this.validateFormOnSubmit(data);

    if (error) {
      this.errorMessage.set(error);
      return;
    }

    if (data.commune_id == 0) {
      this.errorMessage.set('La comuna es requerida');
      return;
    }

    this.errorMessage.set(null)
    this.formSubmit.emit(data); // ✅ emite al padre
  }
  
  private validateFormOnSubmit(data: UserModel): string | null {
    if (!data.name?.trim())           return 'El nombre es requerido';
    if (data.name.length < 2)         return 'El nombre debe tener al menos 2 caracteres';
  
    if (!data.lastname?.trim())       return 'El apellido es requerido';
    if (data.lastname.length < 2)     return 'El apellido debe tener al menos 2 caracteres';
  
    if (!data.rut?.trim())            return 'El RUT es requerido';
    if (!this.validateRut(data.rut))  return 'El Formato del rut no válido';
  
    if (!data.phone?.trim())          return 'El teléfono es requerido';
    if (data.phone.length < 9)        return 'El teléfono debe tener 9 dígitos';
  
    if (!data.address?.trim())        return 'La dirección es requerida';
    if (data.address.length < 5)      return 'La dirección es muy corta';
  
    return null; // ✅ sin errores
  }

  private validateRut(rut: string): boolean {
    // Formato esperado: 12345678-9 o 12345678-K
    if (!/^\d{7,8}-[\dkK]$/.test(rut)) return false;
  
    const [body, dv] = rut.split('-');
    
    let sum = 0;
    let multiplier = 2;
  
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
  
    const remainder = 11 - (sum % 11);
    const expected = remainder === 11 ? '0' : remainder === 10 ? 'k' : String(remainder);
  
    return dv.toLowerCase() === expected;
  }

  protected onRoleChange(role: UserRoleModel | null) {
    if (role) {
      this.formData.update(data => ({ ...data, user_role_id: role.id_user_role }));
    }
  }

  protected onStatusChange(status: UserStatusModel | null) {
    if (status) {
      this.formData.update(data => ({ ...data, user_status_id: status.id_user_status }));
    }
  }
}
