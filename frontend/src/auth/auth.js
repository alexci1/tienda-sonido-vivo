// src/auth/auth.js
// Gestión segura de autenticación y sesiones basada en JWT y API REST Spring Boot

import {
  apiAuth,
  SESSION_KEY,
  obtenerToken,
  guardarToken,
  eliminarToken,
  decodificarJwt,
  tokenEsValido,
} from '../utils/api.js';

export function normalizarRol(rol) {
  if (!rol) return 'Cliente';
  const r = String(rol).toLowerCase();
  if (r.includes('admin')) return 'Administrador';
  if (r.includes('vendedor')) return 'Vendedor';
  return 'Cliente';
}

function construirSesion(data) {
  const username = data.username || data.usuario || data.sub;
  if (!username) return null;
  return {
    usuario: username,
    username,
    nombre: data.nombre || username,
    rol: normalizarRol(data.rol),
  };
}

function notificarCambioSesion() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('sonido-vivo-auth-change'));
  }
}

/**
 * Persiste el token JWT y los datos públicos de sesión (sin contraseñas).
 */
export function guardarSesionDesdeAuth(authResponse) {
  if (!authResponse?.token) {
    throw new Error('La respuesta del servidor no incluyó un token JWT válido.');
  }
  guardarToken(authResponse.token);
  const sesion = construirSesion(authResponse);
  localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
  notificarCambioSesion();
  return sesion;
}

/**
 * Inicia sesión contra el backend Spring Boot (/api/auth/login) y almacena el JWT.
 */
export async function iniciarSesion(usuario, password) {
  const username = String(usuario || '').trim();
  if (!username || !password) {
    throw new Error('Por favor completa usuario y contraseña.');
  }
  const respuesta = await apiAuth.login({ username, password });
  return guardarSesionDesdeAuth(respuesta);
}

/**
 * Registra un nuevo cliente en el backend Spring Boot (/api/auth/register) y almacena el JWT.
 */
export async function registrarUsuario(nuevoUsuario) {
  const username = String(nuevoUsuario.username || nuevoUsuario.usuario || '').trim();
  const nombre = String(nuevoUsuario.nombre || username).trim();
  const password = nuevoUsuario.password;

  if (!username || !password || !nombre) {
    return { exito: false, mensaje: 'Todos los campos son obligatorios.' };
  }

  try {
    const respuesta = await apiAuth.register({ username, password, nombre });
    const sesion = guardarSesionDesdeAuth(respuesta);
    return {
      exito: true,
      usuario: sesion,
      mensaje: 'Usuario registrado exitosamente.',
    };
  } catch (err) {
    return {
      exito: false,
      mensaje: err.message || 'No se pudo completar el registro.',
    };
  }
}

/**
 * Obtiene la sesión actual validando que exista un JWT vigente en localStorage.
 * Si el token falta o expiró, limpia el almacenamiento automáticamente.
 */
export function obtenerSesion() {
  const token = obtenerToken();
  if (!token || !tokenEsValido(token)) {
    if (token || localStorage.getItem(SESSION_KEY)) {
      eliminarToken();
    }
    return null;
  }

  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return construirSesion(parsed);
    }
    const claims = decodificarJwt(token);
    if (claims) {
      const sesion = construirSesion(claims);
      if (sesion) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
        return sesion;
      }
    }
    return null;
  } catch {
    eliminarToken();
    return null;
  }
}

export function obtenerSesionActual() {
  return obtenerSesion();
}

export function estaAutenticado() {
  return obtenerSesion() !== null;
}

/**
 * Verifica el JWT persistido contra el endpoint /api/auth/me en recargas de página.
 */
export async function verificarSesionBackend() {
  const token = obtenerToken();
  if (!token || !tokenEsValido(token)) {
    eliminarToken();
    return null;
  }

  try {
    const perfil = await apiAuth.me();
    const sesion = construirSesion(perfil);
    if (sesion) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
      return sesion;
    }
    return null;
  } catch (err) {
    // Si es error de red (backend apagado temporalmente), mantenemos la sesión JWT válida localmente;
    // si es 401, apiFetch ya limpió el token.
    if (!obtenerToken()) {
      return null;
    }
    console.warn('No se pudo revalidar sesión contra el backend:', err.message);
    return obtenerSesion();
  }
}

export function tieneRol(sesion, rolesPermitidos) {
  if (!sesion) return false;
  if (!rolesPermitidos || rolesPermitidos.length === 0) return true;
  const rolUsuario = normalizarRol(sesion.rol);
  return rolesPermitidos.some((r) => normalizarRol(r) === rolUsuario);
}

export function cerrarSesion() {
  eliminarToken();
  notificarCambioSesion();
}
