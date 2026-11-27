// src/components/RutaProtegida.jsx
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";

/**
 * Protege una ruta verificando autenticación JWT y autorización por rol.
 * - Sin sesión válida -> redirige a /login.
 * - Con sesión pero rol no permitido -> muestra vista de acceso denegado (403).
 */
export default function RutaProtegida({ children, rolesPermitidos }) {
  const { sesion, cargandoSesion, tieneRol } = useAuth();
  const location = useLocation();

  if (cargandoSesion) {
    return (
      <div className="container py-5 text-center text-light">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Verificando sesión...</span>
        </div>
        <p className="text-secondary">Verificando credenciales de sesión...</p>
      </div>
    );
  }

  if (!sesion) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (rolesPermitidos && !tieneRol(rolesPermitidos)) {
    return (
      <div className="container py-5 text-center text-light" style={{ maxWidth: "600px" }}>
        <div className="bg-dark p-5 rounded border border-danger shadow">
          <h2 className="text-danger fw-bold mb-3">⛔ Acceso Restringido</h2>
          <p className="text-light mb-2">
            Tu rol actual (<span className="badge bg-info text-dark">{sesion.rol}</span>) no tiene permisos para acceder a esta sección.
          </p>
          <p className="text-secondary small mb-4">
            Roles autorizados: {rolesPermitidos.join(", ")}
          </p>
          <Link to="/products" className="btn btn-primary fw-bold px-4">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
