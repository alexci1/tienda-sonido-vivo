// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { obtenerSesion, cerrarSesion } from '../auth/auth.js';

export default function Navbar({ cantidadCarrito }) {
  const navigate = useNavigate();
  const sesion = obtenerSesion();

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/login');
  };

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
          {sesion ? (
            <>
              {/* Si es Admin o Vendedor, muestra acceso al Panel */}
              {(sesion.rol === 'Administrador' || sesion.rol === 'Vendedor') && (
                <>
                  <Link to="/admin" className="login-link" style={{ color: '#ffc107', fontWeight: 'bold' }}>
                    <span>PANEL ({sesion.rol.toUpperCase()})</span>
                  </Link>
                  <span className="separator">|</span>
                </>
              )}

              {/* Muestra el nombre/usuario activo */}
              <span style={{ fontSize: '0.9rem', color: '#0d6efd', fontWeight: 'bold' }}>
                👤 {sesion.nombre || sesion.usuario}
              </span>

              <span className="separator">|</span>

              {/* Botón Salir */}
              <button
                onClick={handleCerrarSesion}
                className="login-link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#dc3545',
                  fontWeight: 'bold',
                  padding: 0,
                  fontFamily: 'inherit'
                }}
              >
                SALIR
              </button>
            </>
          ) : (
            <Link to="/login" className="login-link">
              <span>INICIAR SESIÓN</span>
            </Link>
          )}

          <span className="separator">|</span>

          <Link to="/carrito" className="cart-link">
            <span>🛒 CARRITO ({cantidadCarrito})</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}