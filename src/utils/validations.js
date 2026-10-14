// src/utils/validaciones.js
export function validarTexto(texto, minimo = 3) {
  return texto.trim().length >= minimo;
}
 
export function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());
}