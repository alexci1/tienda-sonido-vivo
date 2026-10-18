// src/utils/validaciones.test.js
import { describe, it, expect } from 'vitest';
import { validarTexto, validarCorreo } from "../utils/validations.js";

describe('Funciones de Validación (Validaciones.js)', () => {
  it('validarTexto debe retornar true si el texto supera o iguala el mínimo', () => {
    expect(validarTexto('Administrador', 3)).toBe(true);
    expect(validarTexto('AB', 3)).toBe(false);
  });

  it('validarCorreo debe verificar formatos de correo válidos', () => {
    expect(validarCorreo('admin@sonidovivo.cl')).toBe(true);
    expect(validarCorreo('correo-invalido')).toBe(false);
  });
});