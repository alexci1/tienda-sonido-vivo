// src/pages/ProductDetail.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail({ productos, onAgregar }) {
  const { id } = useParams();
  const producto = productos.find((p) => (p.codigo || String(p.id)) === id);

  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return (
      <div className="container py-5 text-center text-light">
        <h2>Producto no encontrado 🔍</h2>
        <p className="text-secondary mb-4">El producto que buscas no existe o fue retirado del catálogo.</p>
        <Link to="/products" className="btn btn-primary">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const stock = producto.stock ?? 10;
  const sinStock = stock <= 0;

  const handleCantidad = (cambio) => {
    setCantidad((actual) => Math.min(Math.max(1, actual + cambio), stock));
  };

  return (
    <div className="container py-5 text-light">
      <Link to="/products" className="btn btn-outline-secondary btn-sm mb-4">
        ← Volver al Catálogo
      </Link>

      <div className="row g-5 bg-dark p-4 rounded border border-secondary">
        {/* Imagen */}
        <div className="col-md-6 text-center">
          <img
            src={producto.imagen || "https://via.placeholder.com/400x300?text=Audio"}
            alt={producto.nombre}
            className="img-fluid rounded border border-secondary"
            style={{ maxHeight: '380px', objectFit: 'contain' }}
          />
        </div>

        {/* Detalles */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <div className="mb-2">
            <span className="badge bg-secondary me-2">{producto.marca}</span>
            {sinStock ? (
              <span className="badge bg-danger">Agotado</span>
            ) : (
              <span className={`badge ${stock <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
                {stock} unidades disponibles
              </span>
            )}
          </div>

          <h1 className="text-white fw-bold mb-3">{producto.nombre}</h1>
          <p className="fs-3 fw-bold text-primary mb-3">
            ${producto.precio?.toLocaleString("es-CL")}
          </p>

          <p className="text-light opacity-75 mb-4">
            {producto.descripcion || "Equipo de audio profesional de alta calidad, diseñado para un rendimiento óptimo en estudio y presentaciones en vivo."}
          </p>

          {!sinStock && (
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fw-semibold">Cantidad:</span>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-light btn-sm"
                  disabled={cantidad <= 1}
                  onClick={() => handleCantidad(-1)}
                >
                  -
                </button>
                <span className="fw-bold px-3 py-1 bg-dark text-light rounded border border-secondary">
                  {cantidad}
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  disabled={cantidad >= stock}
                  onClick={() => handleCantidad(1)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            className={`btn btn-lg fw-bold ${sinStock ? 'btn-secondary' : 'btn-primary'}`}
            disabled={sinStock}
            onClick={() => onAgregar(producto, cantidad)}
          >
            {sinStock ? 'Producto Agotado' : 'Agregar al Carrito'}
          </button>
        </div>
      </div>
    </div>
  );
}