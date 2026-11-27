// src/test/auth-extra.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  registrarUsuario,
  obtenerSesion,
  estaAutenticado,
  tieneRol,
  normalizarRol,
} from '../auth/auth.js';

function crearJwtFalso(payload) {
  const toBase64Utf8 = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  const header = toBase64Utf8({ alg: 'HS256', typ: 'JWT' });
  const body = toBase64Utf8(payload);
  return `${header}.${body}.firma-mock`;
}

describe('Gestión Segura de Sesión JWT y Roles (RBAC Frontend)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('normaliza roles provenientes del backend', () => {
    expect(normalizarRol('ADMINISTRADOR')).toBe('Administrador');
    expect(normalizarRol('VENDEDOR')).toBe('Vendedor');
    expect(normalizarRol('CLIENTE')).toBe('Cliente');
  });

  it('registra un nuevo cliente vía API REST y persiste sesión JWT', async () => {
    const token = crearJwtFalso({
      sub: 'maria',
      rol: 'CLIENTE',
      nombre: 'María González',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 201,
        text: async () =>
          JSON.stringify({
            token,
            username: 'maria',
            nombre: 'María González',
            rol: 'CLIENTE',
          }),
      })
    );

    const res = await registrarUsuario({
      usuario: '  maria  ',
      nombre: 'María González',
      password: 'Password123',
    });

    expect(res.exito).toBe(true);
    expect(res.usuario.usuario).toBe('maria');
    expect(res.usuario.rol).toBe('Cliente');
    expect(estaAutenticado()).toBe(true);
  });

  it('invalida automáticamente tokens JWT expirados al recargar', () => {
    const tokenExpirado = crearJwtFalso({
      sub: 'cliente',
      rol: 'CLIENTE',
      exp: Math.floor(Date.now() / 1000) - 60, // expirado hace 1 minuto
    });

    localStorage.setItem('sonido_vivo_token', tokenExpirado);
    localStorage.setItem(
      'sonido_vivo_sesion',
      JSON.stringify({ usuario: 'cliente', rol: 'Cliente' })
    );

    expect(obtenerSesion()).toBeNull();
    expect(estaAutenticado()).toBe(false);
    expect(localStorage.getItem('sonido_vivo_token')).toBeNull();
  });

  it('rechaza sesiones manipuladas en localStorage si no existe un JWT válido', () => {
    localStorage.setItem(
      'sonido_vivo_sesion',
      JSON.stringify({ usuario: 'hacker', rol: 'Administrador' })
    );

    expect(obtenerSesion()).toBeNull();
    expect(estaAutenticado()).toBe(false);
  });

  it('valida correctamente restricciones por rol con tieneRol', () => {
    const sesionCliente = { usuario: 'pedro', rol: 'Cliente' };
    const sesionVendedor = { usuario: 'juan', rol: 'Vendedor' };
    const sesionAdmin = { usuario: 'admin', rol: 'Administrador' };

    expect(tieneRol(sesionCliente, ['Cliente'])).toBe(true);
    expect(tieneRol(sesionCliente, ['Administrador', 'Vendedor'])).toBe(false);
    expect(tieneRol(sesionVendedor, ['Administrador', 'Vendedor'])).toBe(true);
    expect(tieneRol(sesionVendedor, ['Administrador'])).toBe(false);
    expect(tieneRol(sesionAdmin, ['Administrador'])).toBe(true);
  });
});
