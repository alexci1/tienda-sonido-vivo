// src/components/RutaProtegida.jsx
import { Navigate } from "react-router-dom";
import { obtenerSesion } from "../auth/auth.js";

/**
 * Protege una ruta.
 * - Sin sesión -> redirige a /login (autenticación).
 * - Con sesión pero rol no permitido -> redirige al catálogo (autorización).
 * Si no se indican rolesPermitidos, basta con estar autenticado.
 * Nota: es una simulación académica en el frontend, no seguridad real.
 */
export default function RutaProtegida({ children, rolesPermitidos }) {
  const sesion = obtenerSesion();

  if (!sesion) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(sesion.rol)) {
    return <Navigate to="/products" replace />;
  }

  return children;
}
