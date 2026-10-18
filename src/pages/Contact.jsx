// src/pages/Contact.jsx
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  });

  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
    setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });

    setTimeout(() => {
      setEnviado(false);
    }, 4000);
  };

  return (
    <div className="container py-5 text-light">
      <h1 className="text-center fw-bold text-white mb-4" style={{ letterSpacing: '2px' }}>
        CONTÁCTANOS
      </h1>

      {enviado && (
        <div className="alert alert-success text-center mb-4 border-0" role="alert">
          ✓ ¡Gracias por comunicarte! Te responderemos a la brevedad.
        </div>
      )}

      <div className="row g-5">
        {/* Información de contacto + Mapa */}
        <div className="col-md-5">
          <h3 className="text-white mb-3">¿Tienes alguna duda?</h3>
          <p className="text-light opacity-75 mb-4">
            Escríbenos o visítanos en nuestro showroom. Estamos para ayudarte a configurar el mejor sistema de sonido.
          </p>

          <div className="mb-3">
            <h6 className="text-primary fw-bold mb-1">📍 Dirección</h6>
            <p className="text-light opacity-75 mb-0">Av. Providencia 1234, Santiago, Chile</p>
          </div>

          <div className="mb-3">
            <h6 className="text-primary fw-bold mb-1">📧 Email</h6>
            <p className="text-light opacity-75 mb-0">contacto@sonidovivo.cl</p>
          </div>

          <div className="mb-4">
            <h6 className="text-primary fw-bold mb-1">📞 Teléfono</h6>
            <p className="text-light opacity-75 mb-0">+56 9 1234 5678</p>
          </div>

          {/* Mapa Interactivo */}
          <div className="rounded overflow-hidden border border-secondary shadow-sm">
            <iframe
              title="Ubicación Sonido Vivo"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.8327914833215!2d-70.6128!3d-33.4255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c59a35e80d4f%3A0x6b3017a5894f2858!2sAv.%20Providencia%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1700000000000!5m2!1ses!2scl"
              width="100%"
              height="220"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Formulario de contacto */}
        <div className="col-md-7">
          <form onSubmit={handleSubmit} className="p-4 bg-dark rounded border border-secondary">
            <div className="mb-3">
              <label className="form-label text-light fw-semibold">Nombre Completo</label>
              <input
                type="text"
                name="nombre"
                className="form-control bg-dark text-light border-secondary"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-light fw-semibold">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                className="form-control bg-dark text-light border-secondary"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-light fw-semibold">Asunto</label>
              <input
                type="text"
                name="asunto"
                className="form-control bg-dark text-light border-secondary"
                value={formData.asunto}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-light fw-semibold">Mensaje</label>
              <textarea
                name="mensaje"
                rows="4"
                className="form-control bg-dark text-light border-secondary"
                value={formData.mensaje}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary w-100 fw-bold py-2">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}