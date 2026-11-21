// src/test/auth.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { iniciarSesion, obtenerSesion, cerrarSesion, estaAutenticado } from '../auth/auth.js';

describe('Servicio de Autenticación (auth.js)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe retornar null o falsy con credenciales incorrectas', () => {
    const resultado = iniciarSesion('usuario_falso', '1234');
    expect(resultado).toBeFalsy(); // Acepta null, false o undefined
    expect(estaAutenticado()).toBe(false);
  });

  it('debe retornar el objeto de usuario y guardar en localStorage con credenciales válidas', () => {
    const resultado = iniciarSesion('admin', 'admin123');
    expect(resultado).toBeDefined(); // Devuelve el objeto del usuario
    expect(resultado.usuario).toBe('admin');
    expect(estaAutenticado()).toBe(true);
    
    const sesion = obtenerSesion();
    expect(sesion.usuario).toBe('admin');
  });

  it('debe cerrar sesión y limpiar el localStorage', () => {
    iniciarSesion('admin', 'admin123');
    expect(estaAutenticado()).toBe(true);

    cerrarSesion();
    expect(estaAutenticado()).toBe(false);
    expect(obtenerSesion()).toBeNull();
  });
});