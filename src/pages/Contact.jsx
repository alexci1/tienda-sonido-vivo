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
        {/* Información de contacto */}
        <div className="col-md-5">
          <h3 className="text-white mb-3">¿Tienes alguna duda?</h3>
          <p className="text-light opacity-75 mb-4">
            Escríbenos o visítanos. Estamos para ayudarte a configurar el mejor sistema de sonido.
          </p>

          <div className="mb-3">
            <h6 className="text-primary fw-bold mb-1">📍 Dirección</h6>
            <p className="text-light opacity-75">Av. Providencia 1234, Santiago, Chile</p>
          </div>

          <div className="mb-3">
            <h6 className="text-primary fw-bold mb-1">📧 Email</h6>
            <p className="text-light opacity-75">contacto@sonidovivo.cl</p>
          </div>

          <div className="mb-3">
            <h6 className="text-primary fw-bold mb-1">📞 Teléfono</h6>
            <p className="text-light opacity-75">+56 9 1234 5678</p>
          </div>
        </div>

        {/* Formulario */}
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