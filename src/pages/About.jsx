// src/pages/About.jsx
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="container py-5 text-light">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-white mb-3" style={{ letterSpacing: '2px' }}>
          SOBRE NOSOTROS
        </h1>
        <p className="text-light opacity-75 fs-5 mx-auto" style={{ maxWidth: '700px' }}>
          Apasionados por el sonido de alta fidelidad. Proveemos el mejor equipamiento de audio profesional para músicos, estudios y eventos en vivo.
        </p>
      </div>

      <div className="row g-4 my-4">
        <div className="col-md-4">
          <div className="p-4 bg-dark rounded border border-secondary text-center h-100">
            <div className="fs-1 text-primary mb-3">🎧</div>
            <h4 className="text-white">Calidad Garantizada</h4>
            <p className="text-light opacity-75 mb-0">
              Trabajamos únicamente con las marcas líderes del mercado internacional.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 bg-dark rounded border border-secondary text-center h-100">
            <div className="fs-1 text-primary mb-3">🚚</div>
            <h4 className="text-white">Envíos a todo Chile</h4>
            <p className="text-light opacity-75 mb-0">
              Despachamos tu equipamiento de forma rápida y segura a cualquier región.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-4 bg-dark rounded border border-secondary text-center h-100">
            <div className="fs-1 text-primary mb-3">🎛️</div>
            <h4 className="text-white">Asesoría Técnica</h4>
            <p className="text-light opacity-75 mb-0">
              Nuestro equipo te orienta para elegir el equipo perfecto según tus necesidades.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center mt-5 pt-3">
        <Link to="/products" className="btn btn-primary btn-lg fw-bold px-4">
          Explorar Catálogo
        </Link>
      </div>
    </div>
  );
}

export default About; // Exportación explícita al final