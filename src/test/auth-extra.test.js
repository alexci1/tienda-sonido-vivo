
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

  it('registra un usuario nuevo', () => {
    expect(
      registrarUsuario({
        usuario: 'maria',
        password: 'abc123'
      }).exito
    ).toBe(true);
  });

  it('elimina espacios externos del usuario', () => {
    const resultado = registrarUsuario({
      usuario: '  maria  ',
      password: 'abc123'
    });

    expect(resultado.usuario.usuario).toBe('maria');
  });

  it('rechaza usuarios duplicados ignorando mayúsculas', () => {
    registrarUsuario({ usuario: 'maria', password: 'abc123' });

    expect(
      registrarUsuario({
        usuario: 'MARIA',
        password: 'xyz789'
      }).exito
    ).toBe(false);
  });

  it('asigna el rol Cliente por defecto', () => {
    expect(
      registrarUsuario({
        usuario: 'ana',
        password: 'pass'
      }).usuario.rol
    ).toBe('Cliente');
  });

  it('inicia sesión después de registrar', () => {
    registrarUsuario({ usuario: 'ana', password: 'pass' });
    expect(estaAutenticado()).toBe(true);
  });

  it('rechaza una contraseña incorrecta', () => {
    expect(iniciarSesion('admin', 'incorrecta')).toBeNull();
  });
});
