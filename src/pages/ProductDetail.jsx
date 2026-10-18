// src/pages/ProductDetail.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail({ productos, onAgregar }) {
  const { id } = useParams();
  const [cantidad, setCantidad] = useState(1);

  // Buscar el producto por código o id
  const producto = productos.find(
    (p) => String(p.codigo || p.id) === String(id)
  );

  if (!producto) {
    return (
      <div className="container py-5 text-center text-light">
        <h2>Producto no encontrado 🔍</h2>
        <p className="text-secondary">El producto que buscas no existe o fue eliminado.</p>
        <Link to="/products" className="btn btn-primary mt-3">
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const cambiarCantidad = (cambio) => {
    setCantidad((prev) => Math.max(1, prev + cambio));
  };

  const handleAgregar = () => {
    onAgregar(producto, cantidad);
    setCantidad(1); // Reiniciar a 1 tras agregar
  };

  return (
    <div className="container py-5 text-light">
      <Link to="/products" className="btn btn-outline-light mb-4">
        ← Volver al Catálogo
      </Link>

      <div className="row g-4 align-items-center">
        <div className="col-md-6 text-center">
          <img
            src={producto.imagen || "https://via.placeholder.com/500x400?text=Audio"}
            alt={producto.nombre}
            className="img-fluid rounded shadow"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-6">
          <span className="badge bg-secondary mb-2 px-3 py-2 fs-6">{producto.marca}</span>
          
          {/* Título blanco brillante */}
          <h1 className="mb-3 text-white fw-bold">{producto.nombre}</h1>
          
          {/* Precio destacado */}
          <p className="fs-3 fw-bold text-primary mb-3">
            ${producto.precio?.toLocaleString("es-CL")}
          </p>

          {/* Descripción en gris claro readable */}
          {producto.descripcion && (
            <p className="mb-4 text-light opacity-75 fs-5" style={{ lineHeight: '1.6' }}>
              {producto.descripcion}
            </p>
          )}

          {/* Selector de cantidad ajustado a tema oscuro */}
          <div className="mb-4">
            <label className="form-label d-block fw-bold text-light fs-6">Cantidad:</label>
            <div className="d-flex align-items-center gap-2" style={{ maxWidth: '160px' }}>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => cambiarCantidad(-1)}
              >
                -
              </button>
              <span className="form-control text-center fw-bold bg-dark text-light border-secondary fs-5">
                {cantidad}
              </span>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => cambiarCantidad(1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Botón de agregar */}
          <button className="btn btn-primary btn-lg w-100 fw-bold" onClick={handleAgregar}>
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}