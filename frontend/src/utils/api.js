// src/utils/api.js
// Cliente HTTP centralizado para consumir el backend Spring Boot con soporte de Token JWT

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const TOKEN_KEY = 'sonido_vivo_token';
export const SESSION_KEY = 'sonido_vivo_sesion';

export function obtenerToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function guardarToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function eliminarToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Decodifica el payload de un JWT sin verificar firma (para leer claims y expiración en frontend).
 */
export function decodificarJwt(token) {
  if (!token || typeof token !== 'string') return null;
  const partes = token.split('.');
  if (partes.length !== 3) return null;
  try {
    const base64 = partes[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Verifica si un JWT es estructuralmente válido y no ha expirado.
 */
export function tokenEsValido(token) {
  const payload = decodificarJwt(token);
  if (!payload) return false;
  if (typeof payload.exp === 'number') {
    return payload.exp * 1000 > Date.now();
  }
  return true;
}

/**
 * Función fetch envuelta con inyección de cabecera Authorization Bearer y control de errores 401/403.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = obtenerToken();
  const esRutaAuthPublica = endpoint === '/auth/login' || endpoint === '/auth/register';

  const headers = {
    'Content-Type': 'application/json',
    ...(!esRutaAuthPublica && token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Control de sesión vencida o no autorizada en rutas protegidas
    if (respuesta.status === 401 && !esRutaAuthPublica) {
      eliminarToken();
      window.dispatchEvent(new Event('sonido-vivo-auth-change'));
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login?sesionExpirada=true';
      }
      throw new Error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
    }

    if (!respuesta.ok) {
      const errorJson = await respuesta.json().catch(() => null);
      throw new Error(
        errorJson?.error || errorJson?.mensaje || errorJson?.detalle || `Error HTTP ${respuesta.status}`
      );
    }

    if (respuesta.status === 204) return true;
    const text = await respuesta.text();
    return text ? JSON.parse(text) : true;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err.message);
    throw err;
  }
}

// ==========================================
// 0. ENDPOINTS DE AUTENTICACIÓN
// ==========================================
export const apiAuth = {
  login: (credenciales) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credenciales),
    }),
  register: (datos) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(datos),
    }),
  me: () => apiFetch('/auth/me'),
};

// ==========================================
// 1. ENDPOINTS DE PRODUCTOS
// ==========================================
export const apiProductos = {
  obtenerTodos: () => apiFetch('/productos'),
  obtenerPorCodigo: (codigo) => apiFetch(`/productos/${encodeURIComponent(codigo)}`),
  obtenerPorCategoria: (cat) => apiFetch(`/productos?categoria=${encodeURIComponent(cat)}`),
  crear: (producto) =>
    apiFetch('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    }),
  actualizar: (codigo, producto) =>
    apiFetch(`/productos/${encodeURIComponent(codigo)}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    }),
  crearOActualizar: (producto) =>
    apiFetch('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    }),
  eliminar: (codigo) =>
    apiFetch(`/productos/${encodeURIComponent(codigo)}`, {
      method: 'DELETE',
    }),
};

// ==========================================
// 2. ENDPOINTS DE PEDIDOS (CHECKOUT)
// ==========================================
export const apiPedidos = {
  obtenerTodos: () => apiFetch('/pedidos'),
  obtenerMisPedidos: () => apiFetch('/pedidos/mis-pedidos'),
  obtenerPorId: (id) => apiFetch(`/pedidos/${encodeURIComponent(id)}`),
  crearPedido: (pedido) =>
    apiFetch('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido),
    }),
  actualizarEstado: (id, nuevoEstado) =>
    apiFetch(`/pedidos/${encodeURIComponent(id)}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado: nuevoEstado }),
    }),
  eliminar: (id) =>
    apiFetch(`/pedidos/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),
};

// ==========================================
// 3. ENDPOINTS DE USUARIOS (ADMIN)
// ==========================================
export const apiUsuarios = {
  obtenerTodos: () => apiFetch('/usuarios'),
  actualizarRol: (id, rol) =>
    apiFetch(`/usuarios/${id}/rol`, {
      method: 'PUT',
      body: JSON.stringify({ rol }),
    }),
  eliminar: (id) =>
    apiFetch(`/usuarios/${id}`, {
      method: 'DELETE',
    }),
};
