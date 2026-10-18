// src/components/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <ul className="social-icon">
        <li className="icon-elem">
          <a href="https://instagram.com" className="icon" target="_blank" rel="noreferrer">
            <ion-icon name="logo-instagram"></ion-icon>
          </a>
        </li>
        <li className="icon-elem">
          <a href="https://whatsapp.com" className="icon" target="_blank" rel="noreferrer">
            <ion-icon name="logo-whatsapp"></ion-icon>
          </a>
        </li>
        <li className="icon-elem">
          <a href="https://facebook.com" className="icon" target="_blank" rel="noreferrer">
            <ion-icon name="logo-facebook"></ion-icon>
          </a>
        </li>
        <li className="icon-elem">
          <a href="mailto:contacto@sonidovivo.cl" className="icon">
            <ion-icon name="mail-outline"></ion-icon>
          </a>
        </li>
      </ul>
      
      <ul className="menu">
        <li className="menu-elem">
          <Link to="/" className="menu-icon">Inicio</Link>
        </li>
        <li className="menu-elem">
          <Link to="/products" className="menu-icon">Productos</Link>
        </li>
        <li className="menu-elem">
          <Link to="/nosotros" className="menu-icon">Nosotros</Link>
        </li>
        <li className="menu-elem">
          <Link to="/contacto" className="menu-icon">Contacto</Link>
        </li>
      </ul>
      
      <p className="text">© 2026 Sonido Vivo | Todos los derechos reservados | Santiago de Chile</p>
    </footer>
  );
}