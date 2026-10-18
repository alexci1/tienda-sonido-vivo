// src/pages/Products.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Products({ productos, onAgregar }) {
  const [cantidades, setCantidades] = useState({});

  const getCantidad = (codigo) => cantidades[codigo] || 1;

  const cambiarCantidad = (codigo, cambio) => {
    const actual = getCantidad(codigo);
    const nuevaCantidad = Math.max(1, actual + cambio);
    setCantidades({ ...cantidades, [codigo]: nuevaCantidad });
  };

  const handleAgregar = (prod) => {
    const cantidad = getCantidad(prod.codigo);
    onAgregar(prod, cantidad);

    // Reinicia la cantidad seleccionada a 1
    setCantidades((prev) => ({
      ...prev,
      [prod.codigo]: 1,
    }));
  };

  return (
    <div className="container py-5 text-light">
      <h2 className="mb-4 text-center text-white fw-bold" style={{ letterSpacing: '2px' }}>
        CATÁLOGO DE AUDIO
      </h2>

      <div className="product-container">
        {productos.map((prod) => (
          <div className="product-card" key={prod.codigo}>
            <Link to={`/product/${prod.codigo}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img
                src={prod.imagen || "https://via.placeholder.com/300x200?text=Audio"}
                alt={prod.nombre}
              />
              <span className="badge bg-secondary mt-2 mx-3 align-self-start">
                {prod.marca}
              </span>
              {/* Título en texto blanco legible */}
              <h3 className="text-white mt-2 px-3">{prod.nombre}</h3>
            </Link>

            {/* Precio destacado */}
            <p className="fs-5 fw-bold text-primary my-2">
              ${prod.precio.toLocaleString("es-CL")}
            </p>

            {/* Selector de cantidad en Dark Mode */}
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={() => cambiarCantidad(prod.codigo, -1)}
              >
                -
              </button>
              <span className="fw-bold px-3 py-1 bg-dark text-light rounded border border-secondary">
                {getCantidad(prod.codigo)}
              </span>
              <button
                type="button"
                className="btn btn-outline-light btn-sm"
                onClick={() => cambiarCantidad(prod.codigo, 1)}
              >
                +
              </button>
            </div>

            {/* Botón principal */}
            <button
              className="btn btn-primary w-100 fw-bold"
              onClick={() => handleAgregar(prod)}
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}