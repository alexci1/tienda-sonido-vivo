// src/pages/ProductDetail.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail({ productos, onAgregar }) {
  const { id } = useParams();
  const producto = productos.find((p) => (p.codigo || String(p.id)) === id);

  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return (
      <div className="product-detail-container text-center py-5">
        <Link to="/categories" className="back-catalog-btn mb-4">
          ← Volver al Catálogo
        </Link>
        <h2 className="text-white mt-3">Producto no encontrado 🔍</h2>
        <p className="text-secondary mb-4">El producto que buscas no existe o fue retirado del catálogo.</p>
      </div>
    );
  }

  const stock = producto.stock ?? 10;
  const sinStock = stock <= 0;

  const handleCantidad = (cambio) => {
    setCantidad((actual) => Math.min(Math.max(1, actual + cambio), stock));
  };

  return (
    <div className="product-detail-container">
      {/* Botón Volver estilizado fuera de la tarjeta principal */}
      <Link to="/categories" className="back-catalog-btn">
        ← Volver al Catálogo
      </Link>

      <div className="product-detail-card">
        {/* Imagen del Producto */}
        <div className="product-detail-image-wrapper">
          <img
            src={producto.imagen || "https://via.placeholder.com/400x300?text=Audio"}
            alt={producto.nombre}
          />
        </div>

        {/* Detalles e Información */}
        <div className="product-detail-info">
          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
            <span className="product-detail-category">{producto.categoria}</span>
            <span className="badge bg-secondary">{producto.marca}</span>
            {sinStock ? (
              <span className="badge bg-danger">Agotado</span>
            ) : (
              <span className={`badge ${stock <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
                {stock} disponibles
              </span>
            )}
          </div>

          <h1>{producto.nombre}</h1>

          <div className="product-detail-price">
            ${producto.precio?.toLocaleString("es-CL")}
          </div>

          <p className="product-detail-description">
            {producto.descripcion || "Equipo de audio profesional de alta calidad, diseñado para un rendimiento óptimo en estudio y presentaciones en vivo."}
          </p>

          {!sinStock && (
            <div className="d-flex align-items-center gap-3 my-2">
              <span className="fw-semibold text-light">Cantidad:</span>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-light btn-sm px-3"
                  disabled={cantidad <= 1}
                  onClick={() => handleCantidad(-1)}
                >
                  -
                </button>
                <span className="fw-bold px-3 py-1 bg-dark text-light rounded border border-secondary">
                  {cantidad}
                </span>
                <button
                  className="btn btn-outline-light btn-sm px-3"
                  disabled={cantidad >= stock}
                  onClick={() => handleCantidad(1)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="product-detail-actions mt-3">
            <button
              className={sinStock ? 'btn btn-secondary w-100 py-3 fw-bold' : ''}
              disabled={sinStock}
              onClick={() => onAgregar(producto, cantidad)}
            >
              {sinStock ? 'Producto Agotado' : '🛒 Agregar al Carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}