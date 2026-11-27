
import { describe, it, expect, beforeEach } from 'vitest';
import {
  inicializarUsuarios,
  obtenerUsuarios,
  registrarUsuario,
  iniciarSesion,
  estaAutenticado
} from '../auth/auth.js';

describe('Usuarios predeterminados', () => {
  beforeEach(() => localStorage.clear());

  it('inicializa tres usuarios', () => {
    inicializarUsuarios();
    expect(
      JSON.parse(localStorage.getItem('sonido_vivo_usuarios'))
    ).toHaveLength(3);
  });

  it('conserva usuarios existentes', () => {
    const usuarios = [{ usuario: 'custom' }];
    localStorage.setItem(
      'sonido_vivo_usuarios',
      JSON.stringify(usuarios)
    );

    inicializarUsuarios();
    expect(obtenerUsuarios()).toEqual(usuarios);
  });

  it('incluye al administrador', () => {
    expect(
      obtenerUsuarios().some(
        u => u.usuario === 'admin' && u.rol === 'Administrador'
      )
    ).toBe(true);
  });

  it('incluye al vendedor', () => {
    expect(
      obtenerUsuarios().some(
        u => u.usuario === 'vendedor' && u.rol === 'Vendedor'
      )
    ).toBe(true);
  });

  it('incluye al cliente', () => {
    expect(
      obtenerUsuarios().some(
        u => u.usuario === 'cliente' && u.rol === 'Cliente'
      )
    ).toBe(true);
  });

  it('devuelve una lista de usuarios', () => {
    expect(Array.isArray(obtenerUsuarios())).toBe(true);
  });
});

describe('Registro e inicio de sesión', () => {
  beforeEach(() => localStorage.clear());

  it('registra un usuario nuevo', async () => {
    const res = await registrarUsuario({
      usuario: 'maria',
      password: 'abc123'
    });
    expect(res.exito).toBe(true);
  });

  it('elimina espacios externos del usuario', async () => {
    const resultado = await registrarUsuario({
      usuario: '  maria  ',
      password: 'abc123'
    });

    expect(resultado.usuario.usuario).toBe('maria');
  });

  it('rechaza usuarios duplicados ignorando mayúsculas', async () => {
    await registrarUsuario({ usuario: 'maria', password: 'abc123' });

    const res = await registrarUsuario({
      usuario: 'MARIA',
      password: 'xyz789'
    });
    expect(res.exito).toBe(false);
  });

  it('asigna el rol Cliente por defecto', async () => {
    const res = await registrarUsuario({
      usuario: 'ana',
      password: 'pass'
    });
    expect(res.usuario.rol).toBe('Cliente');
  });

  it('inicia sesión después de registrar', async () => {
    await registrarUsuario({ usuario: 'ana', password: 'pass' });
    expect(estaAutenticado()).toBe(true);
  });

  it('rechaza una contraseña incorrecta', async () => {
    const res = await iniciarSesion('admin', 'incorrecta');
    expect(res).toBeNull();
  });
});
