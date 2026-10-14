// src/pages/Admin.jsx
import { useNavigate } from "react-router-dom";
import { cerrarSesion, obtenerSesion } from "../auth/auth.js";
 
export default function Admin({ productos, onAgregar, onEliminar }) {
  const navigate = useNavigate();
  const sesion = obtenerSesion();
 
  function salir() {
    cerrarSesion();
    navigate("/login");
  }
 
  return (
    <div className="container py-5 text-white">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Panel Administrador</h2>
          <p className="text-muted m-0">
            Bienvenido, <strong>{sesion?.usuario}</strong> | Rol: <span className="text-info">{sesion?.rol}</span>
          </p>
        </div>
        <button className="btn btn-outline-danger" onClick={salir}>
          Cerrar sesión
        </button>
      </div>

      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card p-3 text-center bg-dark border-secondary">
            <h3 className="text-info">{productos.length}</h3>
            <span className="text-muted">Productos en Catálogo</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center bg-dark border-secondary">
            <h3 className="text-success">1</h3>
            <span className="text-muted">Administrador Activo</span>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-3 text-center bg-dark border-secondary">
            <h3 className="text-warning">0</h3>
            <span className="text-muted">Pedidos Pendientes</span>
          </div>
        </div>
      </div>

      {/* Aquí puedes mantener tu formulario CRUD existente si lo deseas */}
    </div>
  );
}