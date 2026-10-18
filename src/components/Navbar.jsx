import { Link } from 'react-router-dom';

export default function Navbar({ cantidadCarrito }) {
  return (
    <header>
      <nav className="nav-bar">
        <div className="logo">
          <Link to="/">
            {/* Si tienes una imagen para Sonido Vivo, cámbiala aquí, o usa texto/icono */}
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🎧 SONIDO VIVO</span>
          </Link>
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/">INICIO</Link>
          </li>
          <li>
            <Link to="/products">PRODUCTOS</Link>
          </li>
          <li>
            <Link to="/contacto">CONTACTO</Link>
          </li>
          <li>
            <Link to="/about">NOSOTROS</Link>
          </li>
          <li>
            <Link to="/admin">ADMIN CRUD</Link>
          </li>
        </ul>

        <div className="nav-actions">
          <Link to="/login" className="login-link">
            <span>INICIAR SESIÓN</span>
          </Link>
          <span className="separator">|</span>
          <Link to="/carrito" className="cart-link">
            <span>🛒 CARRITO ({cantidadCarrito})</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}