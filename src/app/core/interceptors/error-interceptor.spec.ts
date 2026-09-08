import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { AuthStore } from '@features/auth/services/auth-store';
import { ModalErrorService } from '@core/services/modal-error-service';
import { errorInterceptor } from './error-interceptor';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let modalErrorService: { openError: ReturnType<typeof vi.fn>; isOpen: ReturnType<typeof vi.fn> };
  let authStore: { logout: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    modalErrorService = {
      openError: vi.fn(),
      isOpen: vi.fn(() => false),
    };
    authStore = {
      logout: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ModalErrorService, useValue: modalErrorService },
        { provide: AuthStore, useValue: authStore },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería reenviar la petición y la respuesta cuando no hay error', () => {
    httpClient.get('/test').subscribe(response => {
      expect(response).toEqual({ ok: true });
    });

    const req = httpMock.expectOne('/test');
    req.flush({ ok: true });

    expect(modalErrorService.openError).not.toHaveBeenCalled();
  });

  it('debería abrir el modal de error con el estado y mensaje ante 404', () => {
    httpClient.get('/test').subscribe({ error: vi.fn() });

    const req = httpMock.expectOne('/test');
    req.flush({ detail: 'Recurso no encontrado' }, { status: 404, statusText: 'Not Found' });

    expect(modalErrorService.openError).toHaveBeenCalledTimes(1);
    expect(modalErrorService.openError).toHaveBeenCalledWith(404, 'Recurso no encontrado');
    expect(authStore.logout).not.toHaveBeenCalled();
  });

  it('debería abrir el modal de sesión expirada y ejecutar logout ante 401', () => {
    httpClient.get('/test').subscribe({ error: vi.fn() });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'Token inválido' }, { status: 401, statusText: 'Unauthorized' });

    expect(modalErrorService.openError).toHaveBeenCalledTimes(1);

    const [status, message, action] = modalErrorService.openError.mock.calls[0] as [
      number,
      string,
      () => void,
    ];
    expect(status).toBe(401);
    expect(message).toBe('Tu sesión ha expirado.');
    expect(typeof action).toBe('function');

    action();

    expect(authStore.logout).toHaveBeenCalled();
  });

  it('no debería abrir el modal si ya está abierto', () => {
    modalErrorService.isOpen = vi.fn(() => true);

    httpClient.get('/test').subscribe({ error: vi.fn() });

    const req = httpMock.expectOne('/test');
    req.flush({ detail: 'Error' }, { status: 500, statusText: 'Server Error' });

    expect(modalErrorService.openError).not.toHaveBeenCalled();
  });
});