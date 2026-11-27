// src/pages/Categories.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export default function Categories({ productos = [], onAgregar }) {
  const { sesion } = useAuth();
  const esCliente = sesion?.rol === 'Cliente';
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const categoriasUnicas = ['Todas', ...new Set(productos.map((p) => p.categoria).filter(Boolean))];

  const productosFiltrados =
    categoriaSeleccionada === 'Todas'
      ? productos
      : productos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <div className="categories-view my-4">
      <h2 className="text-center mb-4 text-white" style={{ letterSpacing: '2px' }}>
        Catálogo de Productos - Sonido Vivo
      </h2>

      {/* Botones de Filtro por Categoría */}
      <div className="categories-buttons">
        {categoriasUnicas.map((cat, index) => (
          <button
            key={index}
            className={`category-btn ${categoriaSeleccionada === cat ? 'active' : ''}`}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <h3 className="mb-4 text-primary text-center">
        {categoriaSeleccionada === 'Todas'
          ? 'Mostrando todo el catálogo'
          : `Categoría: ${categoriaSeleccionada}`}
      </h3>

      {/* Listado de productos */}
      <div className="product-container">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => {
            const idProducto = prod.codigo || prod.id;
            const stock = prod.stock ?? 0;
            const sinStock = stock <= 0;

            return (
              <div className="product-card" key={idProducto}>
                <Link to={`/product/${idProducto}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img
                    src={prod.imagen || 'https://via.placeholder.com/300x200?text=Audio'}
                    alt={prod.nombre}
                  />
                  <div className="d-flex justify-content-between align-items-center px-3 mt-2">
                    <span className="badge bg-secondary">{prod.marca || 'Sonido Vivo'}</span>
                    {sinStock ? (
                      <span className="badge bg-danger">Agotado</span>
                    ) : (
                      <span className={`badge ${stock <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
                        Stock: {stock}
                      </span>
                    )}
                  </div>
                  <h3>{prod.nombre}</h3>
                </Link>

                <p className="fs-5 fw-bold text-primary my-2">${prod.precio?.toLocaleString('es-CL')}</p>

                {esCliente && onAgregar ? (
                  <button
                    className={`btn w-100 fw-bold ${sinStock ? 'btn-secondary' : 'btn-primary'}`}
                    disabled={sinStock}
                    onClick={() => onAgregar(prod, 1)}
                  >
                    {sinStock ? 'Sin Stock' : 'Agregar al Carrito'}
                  </button>
                ) : (
                  <Link to="/admin" className="btn btn-outline-info btn-sm w-100 fw-semibold">
                    ⚙️ Gestionar en Panel
                  </Link>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-secondary text-center w-100">
            No hay productos disponibles en esta categoría.
          </p>
        )}
      </div>
    </div>
  );
}
