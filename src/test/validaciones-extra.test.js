
import { describe, it, expect } from 'vitest';
import {
  validarTexto,
  validarCorreo
} from '../utils/validations.js';

describe('Validación de texto', () => {
  it('acepta texto de tres caracteres', () => {
    expect(validarTexto('abc')).toBe(true);
  });

  it('rechaza texto demasiado corto', () => {
    expect(validarTexto('ab')).toBe(false);
  });

  it('acepta texto con espacios externos', () => {
    expect(validarTexto('  hola  ')).toBe(true);
  });

  it('rechaza texto compuesto solo por espacios', () => {
    expect(validarTexto('   ', 3)).toBe(false);
  });

  it('respeta el mínimo personalizado', () => {
    expect(validarTexto('hola', 5)).toBe(false);
  });
});

describe('Validación de correo', () => {
  it('acepta un correo con subdominio', () => {
    expect(validarCorreo('persona@mail.sonidovivo.cl')).toBe(true);
  });

  it('acepta espacios externos', () => {
    expect(validarCorreo(' admin@sonidovivo.cl ')).toBe(true);
  });

  it('rechaza un correo sin arroba', () => {
    expect(validarCorreo('admin.sonidovivo.cl')).toBe(false);
  });
});
