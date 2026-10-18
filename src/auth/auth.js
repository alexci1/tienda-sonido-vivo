// src/auth/auth.js

const SESSION_KEY = 'sonido_vivo_sesion';

/**
 * Inicia sesión verificando las credenciales.
 * Credenciales por defecto: admin / admin123
 */
export function iniciarSesion(usuario, password) {
  if (usuario === 'admin' && password === 'admin123') {
    const sesion = {
      usuario: 'admin',
      rol: 'Administrador'
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    return true;
  }
  return false;
}

/**
 * Retorna la sesión actual almacenada o null si no existe.
 */
export function obtenerSesion() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Verifica si el usuario cuenta con una sesión activa.
 */
export function estaAutenticado() {
  return obtenerSesion() !== null;
}

/**
 * Cierra la sesión activa removiendo los datos del almacenamiento.
 */
export function cerrarSesion() {
  localStorage.removeItem(SESSION_KEY);
}
