// src/utils/api.js
// Cliente HTTP centralizado para consumir el backend Spring Boot con soporte de Token JWT

const API_BASE_URL = 'http://localhost:8080/api';

export function obtenerToken() {
  return localStorage.getItem('sonido_vivo_token');
}

export function guardarToken(token) {
  if (token) {
    localStorage.setItem('sonido_vivo_token', token);
  } else {
    localStorage.removeItem('sonido_vivo_token');
  }
}

export function eliminarToken() {
  localStorage.removeItem('sonido_vivo_token');
  localStorage.removeItem('sonido_vivo_sesion');
}

/**
 * Función fetch envuelta con inyección de cabecera Authorization Bearer y control de errores 401/403.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = obtenerToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const respuesta = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Control de sesión vencida o no autorizada
    if (respuesta.status === 401) {
      eliminarToken();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?sesionExpirada=true';
      }
      return null;
    }

    if (!respuesta.ok) {
      const errorJson = await respuesta.json().catch(() => null);
      throw new Error(errorJson?.error || errorJson?.mensaje || `Error HTTP ${respuesta.status}`);
    }

    // Retorna JSON o true para respuestas sin contenido (204)
    if (respuesta.status === 204) return true;
    return await respuesta.json();
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err.message);
    throw err;
  }
}

// ==========================================
// 1. ENDPOINTS DE PRODUCTOS
// ==========================================
export const apiProductos = {
  obtenerTodos: () => apiFetch('/productos'),
  obtenerPorCodigo: (codigo) => apiFetch(`/productos/${codigo}`),
  obtenerPorCategoria: (cat) => apiFetch(`/productos?categoria=${encodeURIComponent(cat)}`),
  crearOActualizar: (producto) =>
    apiFetch('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    }),
  eliminar: (codigo) =>
    apiFetch(`/productos/${codigo}`, {
      method: 'DELETE',
    }),
};

// ==========================================
// 2. ENDPOINTS DE PEDIDOS (CHECKOUT)
// ==========================================
export const apiPedidos = {
  obtenerTodos: () => apiFetch('/pedidos'),
  obtenerPorId: (id) => apiFetch(`/pedidos/${id}`),
  crearPedido: (pedido) =>
    apiFetch('/pedidos', {
      method: 'POST',
      body: JSON.stringify(pedido),
    }),
  actualizarEstado: (id, nuevoEstado) =>
    apiFetch(`/pedidos/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado: nuevoEstado }),
    }),
};

// ==========================================
// 3. ENDPOINTS DE USUARIOS (ADMIN)
// ==========================================
export const apiUsuarios = {
  obtenerTodos: () => apiFetch('/usuarios'),
};
