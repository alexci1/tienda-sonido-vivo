// src/pages/Cart.jsx
import { Link } from 'react-router-dom';

export default function CarritoPage({ carrito, total, onEliminar, onActualizarCantidad, onVaciar }) {
  if (carrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Tu carrito está vacío 🛒</h2>
        <p className="text-muted">Explora nuestro catálogo para añadir productos.</p>
        <Link to="/products" className="btn btn-primary mt-3">
          Ver Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Carrito de Compras</h2>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th className="text-center">Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => {
              const id = item.codigo || item.id;
              return (
                <tr key={id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img 
                        src={item.imagen || "https://via.placeholder.com/60"} 
                        alt={item.nombre} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div>
                        <strong>{item.nombre}</strong>
                        <br />
                        <small className="text-muted">{item.marca}</small>
                      </div>
                    </div>
                  </td>
                  <td>${item.precio.toLocaleString("es-CL")}</td>
                  <td>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onActualizarCantidad(id, item.cantidad - 1)}
                      >
                        -
                      </button>
                      <span className="fw-bold px-2">{item.cantidad}</span>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => onActualizarCantidad(id, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                  <td>
                    <button 
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => onEliminar(id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded">
        <button className="btn btn-outline-secondary" onClick={onVaciar}>
          Vaciar Carrito
        </button>
        <div className="text-end">
          <h4 className="mb-1">Total: ${total.toLocaleString("es-CL")}</h4>
          <button className="btn btn-success mt-2">Proceder al Pago</button>
        </div>
      </div>
    </div>
  );
}