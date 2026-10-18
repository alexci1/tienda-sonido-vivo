// src/pages/Index.jsx
import { useNavigate } from 'react-router-dom';
import { productosIniciales } from '../data/productosSonidoVivo.js';

export default function Index() {
  const navigate = useNavigate();

  // Buscamos productos específicos de tus datos para usarlos de referencia visual
  const guitarraRef = productosIniciales.find(p => p.categoria === 'Guitarras Eléctricas') || productosIniciales[0];
  const microfonoRef = productosIniciales.find(p => p.categoria === 'Micrófonos') || productosIniciales[0];
  const tecladoRef = productosIniciales.find(p => p.categoria === 'Teclados y Pianos') || productosIniciales[0];

  return (
    <div className="inicio-container">
      {/* Banner Principal con la imagen oficial */}
      <div className="banner-wrapper mb-4">
        <img 
          src="/images/banner-sonido-vivo.png" 
          alt="Banner Sonido Vivo" 
          className="img-fluid w-100 banner-img" 
        />
      </div>

      {/* Contenido de bienvenida */}
      <div className="container py-4 text-center">
        <h1 className="display-4 fw-bold text-white mb-3" style={{ letterSpacing: '2px' }}>
          Bienvenidos a Sonido Vivo
        </h1>
        <p className="lead text-light opacity-75">
          Especialistas en audio de alta fidelidad, equipos profesionales y accesorios de estudio.
        </p>
      </div>

      {/* Carrusel de Categorías con Botones Interactivos */}
      <div className="container my-4">
        <h2 className="text-center text-white mb-4">Explora Nuestras Categorías</h2>
        <div id="categoriasCarousel" className="carousel slide mb-5 shadow-lg rounded" data-bs-ride="carousel">
          <div className="carousel-inner rounded">
            
            {/* Categoría 1: Guitarras y Bajos */}
            <div className="carousel-item active">
              <div className="row g-0 align-items-center p-4 rounded" style={{ backgroundColor: '#15151c', border: '1px solid #25252d' }}>
                <div className="col-md-6 text-center mb-3 mb-md-0">
                  <img 
                    src={guitarraRef.imagen} 
                    alt={guitarraRef.nombre} 
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '220px', objectFit: 'contain', width: '100%', backgroundColor: '#0b0b0f', padding: '10px' }}
                  />
                </div>
                <div className="col-md-6 text-center text-md-start px-md-4">
                  <h3 className="text-primary fw-bold">Guitarras y Bajos Profesionales</h3>
                  <p className="text-light lead fs-6 mb-3">Explora cuerdas, amplificadores y accesorios de alta gama para dominar el escenario.</p>
                  <button 
                    className="btn btn-primary fw-bold px-4 py-2"
                    onClick={() => navigate('/categories')}
                  >
                    Ver Catálogo
                  </button>
                </div>
              </div>
            </div>

            {/* Categoría 2: Audio en Vivo y Micrófonos */}
            <div className="carousel-item">
              <div className="row g-0 align-items-center p-4 rounded" style={{ backgroundColor: '#15151c', border: '1px solid #25252d' }}>
                <div className="col-md-6 text-center mb-3 mb-md-0">
                  <img 
                    src={microfonoRef.imagen} 
                    alt={microfonoRef.nombre} 
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '220px', objectFit: 'contain', width: '100%', backgroundColor: '#0b0b0f', padding: '10px' }}
                  />
                </div>
                <div className="col-md-6 text-center text-md-start px-md-4">
                  <h3 className="text-primary fw-bold">Audio en Vivo y Micrófonos</h3>
                  <p className="text-light lead fs-6 mb-3">Todo lo necesario para estudios de grabación profesionales y presentaciones en directo.</p>
                  <button 
                    className="btn btn-primary fw-bold px-4 py-2"
                    onClick={() => navigate('/categories')}
                  >
                    Ver Catálogo
                  </button>
                </div>
              </div>
            </div>

            {/* Categoría 3: Teclados, Pianos y Baterías */}
            <div className="carousel-item">
              <div className="row g-0 align-items-center p-4 rounded" style={{ backgroundColor: '#15151c', border: '1px solid #25252d' }}>
                <div className="col-md-6 text-center mb-3 mb-md-0">
                  <img 
                    src={tecladoRef.imagen} 
                    alt={tecladoRef.nombre} 
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '220px', objectFit: 'contain', width: '100%', backgroundColor: '#0b0b0f', padding: '10px' }}
                  />
                </div>
                <div className="col-md-6 text-center text-md-start px-md-4">
                  <h3 className="text-primary fw-bold">Teclados, Pianos y Baterías</h3>
                  <p className="text-light lead fs-6 mb-3">Instrumentos de percusión y controladores digitales de máxima precisión para cada músico.</p>
                  <button 
                    className="btn btn-primary fw-bold px-4 py-2"
                    onClick={() => navigate('/categories')}
                  >
                    Ver Catálogo
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Controles de navegación del carrusel */}
          <button className="carousel-control-prev" type="button" data-bs-target="#categoriasCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#categoriasCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>
  );
}