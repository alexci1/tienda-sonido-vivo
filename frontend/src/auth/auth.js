// src/auth/auth.js
// Autenticación sincronizada con Backend Spring Boot + compatibilidad completa con tests unitarios

import { apiFetch, guardarToken, eliminarToken } from '../utils/api.js';

const SESSION_KEY = 'sonido_vivo_sesion';
const USERS_KEY = 'sonido_vivo_usuarios';

const usuariosIniciales = [
  { id: 1, usuario: 'admin', nombre: 'Administrador General', password: 'admin123', rol: 'Administrador' },
  { id: 2, usuario: 'vendedor', nombre: 'Juan Vendedor', password: 'vendedor123', rol: 'Vendedor' },
  { id: 3, usuario: 'cliente', nombre: 'Pedro Cliente', password: 'cliente123', rol: 'Cliente' }
];

export function inicializarUsuarios() {
  const usuariosExistentes = localStorage.getItem(USERS_KEY);
  if (!usuariosExistentes) {
    localStorage.setItem(USERS_KEY, JSON.stringify(usuariosIniciales));
  }
}

export function obtenerUsuarios() {
  inicializarUsuarios();
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : usuariosIniciales;
  } catch {
    return usuariosIniciales;
  }
}

function normalizarRol(rol) {
  if (!rol) return 'Cliente';
  const r = rol.toLowerCase();
  if (r.includes('admin')) return 'Administrador';
  if (r.includes('vendedor')) return 'Vendedor';
  return 'Cliente';
}

/**
 * Registro de usuario consumiendo Spring Boot /api/auth/register de forma asíncrona.
 * Si el backend responde, guarda el JWT. Si no está disponible, usa fallback local.
 */
export async function registrarUsuario(nuevoUsuario) {
  const usuarioLimpio = nuevoUsuario.usuario ? nuevoUsuario.usuario.trim() : '';
  const nombreLimpio = nuevoUsuario.nombre ? nuevoUsuario.nombre.trim() : usuarioLimpio;
  const rolSolicitado = nuevoUsuario.rol ? nuevoUsuario.rol : 'Cliente';

  // 1. Intentar registrar en Backend Spring Boot
  try {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: usuarioLimpio,
        password: nuevoUsuario.password,
        nombre: nombreLimpio,
        rol: rolSolicitado.toUpperCase()
      })
    });

    if (res && res.token) {
      guardarToken(res.token);
      const sesion = {
        usuario: res.username,
        nombre: res.nombre,
        rol: normalizarRol(res.rol)
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));

      // Sincronizar también con la lista local
      const usuarios = obtenerUsuarios();
      if (!usuarios.some((u) => u.usuario.toLowerCase() === usuarioLimpio.toLowerCase())) {
        localStorage.setItem(USERS_KEY, JSON.stringify([...usuarios, { ...sesion, password: nuevoUsuario.password }]));
      }

      return { exito: true, usuario: sesion, mensaje: 'Usuario registrado exitosamente en el servidor.' };
    }
  } catch (err) {
    console.warn('[Auth] No se pudo registrar en backend, recurriendo a validación local:', err.message);
    if (err.message && err.message.toLowerCase().includes('ya está registrado')) {
      return { exito: false, mensaje: 'El nombre de usuario ya está registrado.' };
    }
  }

  // 2. Fallback local si backend está apagado o en entorno de tests sin backend
  const usuarios = obtenerUsuarios();
  const existe = usuarios.some(
    (u) => u.usuario.toLowerCase() === usuarioLimpio.toLowerCase()
  );

  if (existe) {
    return { exito: false, mensaje: 'El nombre de usuario ya está registrado.' };
  }

  const usuarioCreado = {
    id: Date.now(),
    usuario: usuarioLimpio,
    nombre: nombreLimpio,
    password: nuevoUsuario.password,
    rol: rolSolicitado
  };

  const listaActualizada = [...usuarios, usuarioCreado];
  localStorage.setItem(USERS_KEY, JSON.stringify(listaActualizada));

  const sesion = {
    usuario: usuarioCreado.usuario,
    nombre: usuarioCreado.nombre,
    rol: usuarioCreado.rol
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));

  return { exito: true, usuario: usuarioCreado, mensaje: 'Usuario registrado exitosamente (Modo Local).' };
}

/**
 * Inicio de sesión consumiendo Spring Boot /api/auth/login de forma asíncrona.
 * Devuelve la sesión del usuario si las credenciales son válidas y almacena el JWT.
 */
export async function iniciarSesion(usuario, password) {
  const usuarioLimpio = usuario ? usuario.trim() : '';

  // 1. Intentar autenticar contra el Backend Spring Boot
  try {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: usuarioLimpio,
        password: password
      })
    });

    if (res && res.token) {
      guardarToken(res.token);
      const sesion = {
        usuario: res.username,
        nombre: res.nombre,
        rol: normalizarRol(res.rol)
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
      return sesion;
    }
  } catch (err) {
    console.warn('[Auth] Fallo en autenticación con Backend:', err.message);
    // Si el backend respondió activamente con error de credenciales, no usar fallback
    if (err.message && (err.message.includes('401') || err.message.includes('Credenciales') || err.message.includes('Bad credentials'))) {
      return null;
    }
  }

  // 2. Fallback local para entorno de tests unitarios o cuando backend no esté levantado
  const usuarios = obtenerUsuarios();
  const encontrado = usuarios.find(
    (u) => u.usuario.toLowerCase() === usuarioLimpio.toLowerCase() && u.password === password
  );

  if (encontrado) {
    const sesion = {
      usuario: encontrado.usuario,
      nombre: encontrado.nombre,
      rol: encontrado.rol
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    return sesion;
  }

  return null;
}

export function obtenerSesion() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function obtenerSesionActual() {
  return obtenerSesion();
}

export function estaAutenticado() {
  return obtenerSesion() !== null;
}

export function cerrarSesion() {
  eliminarToken();
}
