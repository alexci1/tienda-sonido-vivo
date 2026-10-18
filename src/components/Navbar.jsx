// src/components/Navbar.jsx
import { Link, NavLink } from 'react-router-dom';

export default function Navbar({ cantidadCarrito }) {
  return (
    <header>
      <nav className="nav-bar">
        <div className="logo">
          <Link to="/">
            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🎧 SONIDO VIVO</span>
          </Link>
        </div>

        <ul className="nav-links">
          <li>
            <NavLink to="/" end>INICIO</NavLink>
          </li>
          <li>
            <NavLink to="/products">PRODUCTOS</NavLink>
          </li>
          <li>
            <NavLink to="/nosotros">NOSOTROS</NavLink>
          </li>
          <li>
            <NavLink to="/contacto">CONTACTO</NavLink>
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