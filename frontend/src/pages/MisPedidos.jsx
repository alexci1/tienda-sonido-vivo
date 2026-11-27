// src/pages/MisPedidos.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiPedidos } from '../utils/api.js';

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiPedidos
      .obtenerMisPedidos()
      .then((data) => {
        setPedidos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message || 'No se pudieron cargar tus pedidos.');
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="container py-5 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="text-white fw-bold m-0" style={{ letterSpacing: '1.5px' }}>
          📦 MIS PEDIDOS
        </h2>
        <Link to="/categories" className="btn btn-outline-primary btn-sm fw-bold">
          ← Seguir Comprando
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {cargando ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="text-secondary mt-2">Cargando historial de pedidos...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-dark p-5 rounded border border-secondary text-center">
          <h4 className="text-white mb-2">Aún no tienes pedidos registrados</h4>
          <p className="text-secondary mb-4">Explora nuestro catálogo y realiza tu primera compra.</p>
          <Link to="/categories" className="btn btn-primary fw-bold">
            Ir al Catálogo
          </Link>
        </div>
      ) : (
        <div className="table-responsive bg-dark p-3 rounded border border-secondary">
          <table className="table table-dark table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>N° Pedido</th>
                <th>Fecha</th>
                <th>Seguimiento</th>
                <th>Entrega</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td className="fw-bold text-primary">{p.id}</td>
                  <td>{p.fecha}</td>
                  <td><span className="text-warning fw-semibold">{p.seguimiento}</span></td>
                  <td>{p.metodoEntrega === 'despacho' ? '🚚 Despacho' : '🏪 Retiro en Tienda'}</td>
                  <td className="fw-bold">${p.total?.toLocaleString('es-CL')}</td>
                  <td>
                    <span
                      className={`badge ${
                        p.estado === 'Entregado'
                          ? 'bg-success'
                          : p.estado === 'Despachado'
                          ? 'bg-info text-dark'
                          : p.estado === 'Cancelado'
                          ? 'bg-danger'
                          : 'bg-warning text-dark'
                      }`}
                    >
                      {p.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
