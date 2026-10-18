// src/pages/Products.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Products({ productos, onAgregar }) {
  const [cantidades, setCantidades] = useState({});
  // Estado para controlar qué producto mostró la alerta recientemente
  const [mensajeExito, setMensajeExito] = useState(null);

  const getCantidad = (codigo) => cantidades[codigo] || 1;

  const cambiarCantidad = (codigo, cambio) => {
    const actual = getCantidad(codigo);
    const nuevaCantidad = Math.max(1, actual + cambio);
    setCantidades({ ...cantidades, [codigo]: nuevaCantidad });
  };

  const handleAgregar = (prod) => {
    const cantidad = getCantidad(prod.codigo);
    onAgregar(prod, cantidad);

    // Mostrar mensaje de confirmación
    setMensajeExito(prod.codigo);

    // Ocultar la notificación después de 2.5 segundos
    setTimeout(() => {
      setMensajeExito(null);
    }, 2500);
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center" style={{ letterSpacing: '2px' }}>CATÁLOGO DE AUDIO</h2>
      
      <div className="product-container">
        {productos.map((prod) => (
          <div className="product-card" key={prod.codigo}>
            <Link to={`/product/${prod.codigo}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={prod.imagen || "https://via.placeholder.com/300x200?text=Audio"} alt={prod.nombre} />
              <span className="badge bg-secondary mt-2 mx-3 align-self-start">{prod.marca}</span>
              <h3>{prod.nombre}</h3>
            </Link>
            
            <p className="fs-5 fw-bold">${prod.precio.toLocaleString("es-CL")}</p>

            {/* Controles de cantidad */}
            <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
              <button 
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => cambiarCantidad(prod.codigo, -1)}
              >
                -
              </button>
              <span className="fw-bold px-2">{getCantidad(prod.codigo)}</span>
              <button 
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => cambiarCantidad(prod.codigo, 1)}
              >
                +
              </button>
            </div>

            {/* Botón de agregar */}
            <button className="btn btn-primary w-100" onClick={() => handleAgregar(prod)}>
              Agregar al Carrito
            </button>

            {/* Alerta de confirmación de éxito */}
            {mensajeExito === prod.codigo && (
              <div className="alert alert-success py-1 px-2 mt-2 text-center fs-6" role="alert">
                ✓ ¡Producto agregado con éxito!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}