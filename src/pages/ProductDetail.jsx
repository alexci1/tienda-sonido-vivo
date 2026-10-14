import { useParams, Link, useNavigate } from 'react-router-dom';

export default function ProductDetail({ productos, onAgregar }) {
  const { id } = useParams(); // Aquí 'id' en realidad contendrá el código (ej: AC009)
  const navigate = useNavigate();

  // Buscamos el producto donde el código coincida exactamente con el parámetro de la URL
  const producto = productos.find((p) => p.codigo === id);

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger mb-4">Producto no encontrado</h3>
        <Link to="/products" className="btn btn-primary">Volver al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="row g-5 align-items-center bg-dark p-4 rounded border border-secondary shadow">
        <div className="col-md-6 text-center">
          <img 
            src={producto.imagen || "https://via.placeholder.com/300x200?text=Audio"} 
            alt={producto.nombre} 
            className="img-fluid rounded shadow" 
            style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
          />
        </div>
        <div className="col-md-6 text-white">
          <span className="badge bg-primary mb-2">{producto.categoria}</span>
          <h2 className="fw-bold mb-2">{producto.nombre}</h2>
          <p className="text-muted mb-3">Marca: <strong>{producto.marca}</strong> | Modelo: <strong>{producto.modelo}</strong></p>
          <p className="fs-4 text-info fw-bold mb-3">${producto.precio.toLocaleString("es-CL")}</p>
          
          <p className="mb-3 text-light">{producto.descripcion}</p>
          <p className="text-secondary small mb-4">Código SKU: {producto.codigo} | Stock disponible: {producto.stock} unidades</p>

          <button 
            className="btn btn-primary btn-lg w-100 fw-bold"
            onClick={() => onAgregar(producto)}
          >
            🛒 Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}