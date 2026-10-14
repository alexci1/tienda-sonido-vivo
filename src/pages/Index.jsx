export default function Index() {
  return (
    <div className="inicio-container">
      {/* Banner Principal con la imagen oficial */}
      <div className="banner-wrapper">
        <img 
          src="/images/banner-sonido-vivo.png" 
          alt="Banner Sonido Vivo" 
          className="img-fluid w-100 banner-img" 
        />
      </div>

      {/* Contenido de bienvenida */}
      <div className="container py-5 text-center">
        <h1 className="display-4 fw-bold text-white mb-3" style={{ letterSpacing: '2px' }}>
          Bienvenidos a Sonido Vivo
        </h1>
        <p className="lead text-light opacity-75">
          Especialistas en audio de alta fidelidad, equipos profesionales y accesorios de estudio.
        </p>
      </div>
    </div>
  );
}