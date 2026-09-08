import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@environments/environment', () => ({
  environment: { production: false },
}));

import { LoggerService } from './logger-service';

describe('LoggerService', () => {
  let service: LoggerService;
  let consoleErrorSpy: ReturnType<typeof vi.fn>;
  let consoleWarnSpy: ReturnType<typeof vi.fn>;
  let consoleInfoSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    service = new LoggerService();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  describe('error', () => {
    it('debería loguear en consola con formato [contexto]', () => {
      const error = new Error('boom');
      service.error('HomePage', 'fallo al cargar', error);

      expect(consoleErrorSpy).toHaveBeenCalledWith('[HomePage] fallo al cargar', error);
    });
  });

  describe('warn', () => {
    it('debería loguear un warning en consola', () => {
      service.warn('Auth', 'credenciales vencidas');

      expect(consoleWarnSpy).toHaveBeenCalledWith('[Auth] credenciales vencidas', undefined);
    });
  });

  describe('info', () => {
    it('debería loguear info en consola', () => {
      service.info('App', 'boot completado');

      expect(consoleInfoSpy).toHaveBeenCalledWith('[App] boot completado');
    });
  });
});