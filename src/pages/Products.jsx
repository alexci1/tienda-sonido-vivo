import { Link } from 'react-router-dom';

export default function Products({ productos, onAgregar }) {
  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center" style={{ letterSpacing: '2px' }}>CATÁLOGO DE AUDIO</h2>
      
      <div className="product-container">
        {productos.map((prod) => (
          <div className="product-card" key={prod.codigo}>
            {/* Usamos prod.codigo en la ruta */}
            <Link to={`/product/${prod.codigo}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={prod.imagen || "https://via.placeholder.com/300x200?text=Audio"} alt={prod.nombre} />
              <span className="badge bg-secondary mt-2 mx-3 align-self-start">{prod.marca}</span>
              <h3>{prod.nombre}</h3>
            </Link>
            
            <p className="fs-5 fw-bold">${prod.precio.toLocaleString("es-CL")}</p>
            <button onClick={() => onAgregar(prod)}>
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}