// src/test/auth.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  iniciarSesion,
  obtenerSesion,
  cerrarSesion,
  estaAutenticado,
} from '../auth/auth.js';

function crearJwtFalso(payload) {
  const toBase64Utf8 = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  const header = toBase64Utf8({ alg: 'HS256', typ: 'JWT' });
  const body = toBase64Utf8(payload);
  return `${header}.${body}.firma-mock`;
}

describe('Servicio de Autenticación JWT (auth.js)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('debe rechazar credenciales inválidas desde el backend y mantener no autenticado', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Credenciales incorrectas' }),
      })
    );

    await expect(iniciarSesion('usuario_falso', '1234')).rejects.toThrow('Credenciales incorrectas');
    expect(estaAutenticado()).toBe(false);
    expect(obtenerSesion()).toBeNull();
  });

  it('debe almacenar el token JWT y la sesión pública con credenciales válidas', async () => {
    const token = crearJwtFalso({
      sub: 'admin',
      rol: 'ADMINISTRADOR',
      nombre: 'Administrador General',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            token,
            username: 'admin',
            nombre: 'Administrador General',
            rol: 'ADMINISTRADOR',
          }),
      })
    );

    const resultado = await iniciarSesion('admin', 'admin123');
    expect(resultado).toBeDefined();
    expect(resultado.usuario).toBe('admin');
    expect(resultado.rol).toBe('Administrador');
    expect(estaAutenticado()).toBe(true);
    expect(localStorage.getItem('sonido_vivo_token')).toBe(token);

    const sesion = obtenerSesion();
    expect(sesion.usuario).toBe('admin');
  });

  it('debe cerrar sesión y limpiar token y sesión de localStorage', async () => {
    const token = crearJwtFalso({
      sub: 'admin',
      rol: 'ADMINISTRADOR',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            token,
            username: 'admin',
            nombre: 'Administrador General',
            rol: 'ADMINISTRADOR',
          }),
      })
    );

    await iniciarSesion('admin', 'admin123');
    expect(estaAutenticado()).toBe(true);

    cerrarSesion();
    expect(estaAutenticado()).toBe(false);
    expect(obtenerSesion()).toBeNull();
    expect(localStorage.getItem('sonido_vivo_token')).toBeNull();
  });
});
