// src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export default function Navbar({ cantidadCarrito }) {
  const navigate = useNavigate();
  const { sesion, logout } = useAuth();

  const handleCerrarSesion = () => {
    logout();
    navigate('/login');
  };

  const esCliente = sesion?.rol === 'Cliente';

  return (
    <header className="navbar-modern-header">
      <nav className="nav-bar-modern">
        <div className="logo">
          <Link to="/" className="logo-brand">
            <img
              src="/images/icon/icon-sonido-vivo.png"
              alt="Sonido Vivo Logo"
              className="navbar-logo-img"
            />
            <span>
              <span style={{ color: '#ffffff' }}>SONIDO</span>{' '}
              <span style={{ color: '#0099ff' }}>VIVO</span>
            </span>
          </Link>
        </div>

        <ul className="nav-links-modern">
          <li><NavLink to="/" end>INICIO</NavLink></li>
          <li><NavLink to="/categories">CATÁLOGO</NavLink></li>
          {esCliente && (
            <li><NavLink to="/mis-pedidos">MIS PEDIDOS</NavLink></li>
          )}
          <li><NavLink to="/nosotros">NOSOTROS</NavLink></li>
          <li><NavLink to="/contacto">CONTACTO</NavLink></li>
        </ul>

        <div className="nav-actions-modern">
          {sesion ? (
            <>
              {/* Panel Admin: solo visible para Administrador */}
              {sesion.rol === 'Administrador' && (
                <Link to="/admin" className="badge-admin">
                  ⚙️ PANEL ADMIN
                </Link>
              )}

              {/* Gestión Stock: solo visible para Vendedor */}
              {sesion.rol === 'Vendedor' && (
                <Link to="/admin" className="badge-admin">
                  📦 GESTIÓN STOCK
                </Link>
              )}

              {/* Saludo y rol del usuario */}
              <div className="user-badge-container">
                <span className="user-name">👤 {sesion.nombre || sesion.usuario}</span>
                <span className="user-role-tag">{sesion.rol}</span>
              </div>

              <button onClick={handleCerrarSesion} className="btn-logout-tech">
                SALIR
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-login">
              INICIAR SESIÓN
            </Link>
          )}

          {/* El carrito es accesible únicamente para el rol Cliente */}
          {esCliente && (
            <Link to="/carrito" className="cart-pill">
              <span>🛒</span>
              <span className="cart-text">CARRITO</span>
              <span className="cart-badge">{cantidadCarrito}</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
