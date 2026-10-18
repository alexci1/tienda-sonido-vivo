// src/auth/auth.js

const SESSION_KEY = 'sonido_vivo_sesion';
const USERS_KEY = 'sonido_vivo_usuarios';

const usuariosIniciales = [
  {
    id: 1,
    usuario: 'admin',
    nombre: 'Administrador General',
    password: 'admin123',
    rol: 'Administrador'
  },
  {
    id: 2,
    usuario: 'vendedor',
    nombre: 'Juan Vendedor',
    password: 'vendedor123',
    rol: 'Vendedor'
  },
  {
    id: 3,
    usuario: 'cliente',
    nombre: 'Pedro Cliente',
    password: 'cliente123',
    rol: 'Cliente'
  }
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

/**
 * Registra un nuevo usuario e inicia sesión automáticamente.
 */
export function registrarUsuario(nuevoUsuario) {
  const usuarios = obtenerUsuarios();

  const existe = usuarios.some(
    (u) => u.usuario.toLowerCase() === nuevoUsuario.usuario.trim().toLowerCase()
  );

  if (existe) {
    return { exito: false, mensaje: 'El nombre de usuario ya está registrado.' };
  }

  const usuarioCreado = {
    id: Date.now(),
    usuario: nuevoUsuario.usuario.trim(),
    nombre: nuevoUsuario.nombre ? nuevoUsuario.nombre.trim() : nuevoUsuario.usuario.trim(),
    password: nuevoUsuario.password,
    rol: nuevoUsuario.rol || 'Cliente'
  };

  const listaActualizada = [...usuarios, usuarioCreado];
  localStorage.setItem(USERS_KEY, JSON.stringify(listaActualizada));

  // 🔑 SE CREA LA SESIÓN AUTOMÁTICAMENTE
  const sesion = {
    usuario: usuarioCreado.usuario,
    nombre: usuarioCreado.nombre,
    rol: usuarioCreado.rol
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));

  return { exito: true, usuario: usuarioCreado, mensaje: 'Usuario registrado exitosamente.' };
}

export function iniciarSesion(usuario, password) {
  const usuarios = obtenerUsuarios();
  const encontrado = usuarios.find(
    (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.password === password
  );

  if (encontrado) {
    const sesion = {
      usuario: encontrado.usuario,
      nombre: encontrado.nombre,
      rol: encontrado.rol
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
    return encontrado;
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
  localStorage.removeItem(SESSION_KEY);
}