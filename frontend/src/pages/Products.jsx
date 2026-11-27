// src/pages/Products.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export default function Products({ productos, onAgregar }) {
  const { sesion } = useAuth();
  const esCliente = sesion?.rol === 'Cliente';
  const [cantidades, setCantidades] = useState({});

  const getCantidad = (codigo) => cantidades[codigo] || 1;

  const cambiarCantidad = (codigo, cambio, stockDisponible) => {
    const actual = getCantidad(codigo);
    const nuevaCantidad = Math.min(Math.max(1, actual + cambio), stockDisponible);
    setCantidades({ ...cantidades, [codigo]: nuevaCantidad });
  };

  const handleAgregar = (prod) => {
    const stock = prod.stock ?? 0;
    if (stock <= 0) return;

    const cantidad = getCantidad(prod.codigo || prod.id);
    onAgregar(prod, cantidad);

    setCantidades((prev) => ({
      ...prev,
      [prod.codigo || prod.id]: 1,
    }));
  };

  return (
    <div className="container py-5 text-light">
      <h2 className="mb-4 text-center text-white fw-bold" style={{ letterSpacing: '2px' }}>
        CATÁLOGO DE AUDIO
      </h2>

      <div className="product-container">
        {productos.map((prod) => {
          const keyProd = prod.codigo || prod.id;
          const stock = prod.stock ?? 0;
          const sinStock = stock <= 0;
          const cantidadActual = getCantidad(keyProd);

          return (
            <div className="product-card" key={keyProd}>
              <Link to={`/product/${keyProd}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <img
                  src={prod.imagen || 'https://via.placeholder.com/300x200?text=Audio'}
                  alt={prod.nombre}
                />

                <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                  <span className="badge bg-secondary">{prod.marca}</span>
                  {sinStock ? (
                    <span className="badge bg-danger">Agotado</span>
                  ) : (
                    <span className={`badge ${stock <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
                      Stock: {stock}
                    </span>
                  )}
                </div>

                <h3 className="text-white mt-2 px-3">{prod.nombre}</h3>
              </Link>

              <p className="fs-5 fw-bold text-primary my-2">
                ${prod.precio?.toLocaleString('es-CL')}
              </p>

              {esCliente ? (
                <>
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                    <button
                      type="button"
                      className="btn btn-outline-light btn-sm"
                      disabled={sinStock || cantidadActual <= 1}
                      onClick={() => cambiarCantidad(keyProd, -1, stock)}
                    >
                      -
                    </button>
                    <span className="fw-bold px-3 py-1 bg-dark text-light rounded border border-secondary">
                      {sinStock ? 0 : cantidadActual}
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline-light btn-sm"
                      disabled={sinStock || cantidadActual >= stock}
                      onClick={() => cambiarCantidad(keyProd, 1, stock)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className={`btn w-100 fw-bold ${sinStock ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={sinStock}
                    onClick={() => handleAgregar(prod)}
                  >
                    {sinStock ? 'Sin Stock' : 'Agregar al Carrito'}
                  </button>
                </>
              ) : (
                <Link to="/admin" className="btn btn-outline-info btn-sm w-100 fw-semibold mt-2">
                  ⚙️ Gestionar Stock en Panel
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
