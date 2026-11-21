// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  iniciarSesion,
  registrarUsuario,
  inicializarUsuarios,
  obtenerSesion
} from "../auth/auth.js";

export default function Login() {
  const [modo, setModo] = useState("login"); // 'login' | 'registro'
  const navigate = useNavigate();

  // Estados para Login
  const [usuarioLogin, setUsuarioLogin] = useState("");
  const [passLogin, setPassLogin] = useState("");

  // Estados para Registro
  const [nombreReg, setNombreReg] = useState("");
  const [usuarioReg, setUsuarioReg] = useState("");
  const [passReg, setPassReg] = useState("");
  const [confirmPassReg, setConfirmPassReg] = useState("");

  // Feedback
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    // 1. Inicializar los datos por defecto al montar
    inicializarUsuarios();

    // 2. Redirigir automáticamente si ya existe una sesión activa
    const sesionActual = obtenerSesion();
    if (sesionActual) {
      if (sesionActual.rol === "Administrador" || sesionActual.rol === "Vendedor") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!usuarioLogin.trim() || !passLogin) {
      setError("Por favor completa todos los campos.");
      return;
    }

    const usuarioLogueado = iniciarSesion(usuarioLogin.trim(), passLogin);

    if (!usuarioLogueado) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }

    // Redirección según el rol del usuario logueado
    if (usuarioLogueado.rol === "Administrador" || usuarioLogueado.rol === "Vendedor") {
      navigate("/admin");
    } else {
      navigate("/products");
    }
  };

  const handleRegistro = (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!nombreReg.trim() || !usuarioReg.trim() || !passReg) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (passReg !== confirmPassReg) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const resultado = registrarUsuario({
      nombre: nombreReg,
      usuario: usuarioReg,
      password: passReg,
      rol: "Cliente",
    });

    if (!resultado.exito) {
      setError(resultado.mensaje);
      return;
    }

    setExito("¡Registro exitoso! Redirigiendo a la tienda...");

    // Redirección usando la sesión creada automáticamente
    setTimeout(() => {
      navigate("/products");
    }, 1000);
  };

  return (
    <div className="container py-5 text-light">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5 bg-dark p-4 rounded border border-secondary shadow">
          {/* Selector de pestañas Login / Registro */}
          <div className="d-flex mb-4 border-bottom border-secondary">
            <button
              className={`btn flex-fill py-2 fw-bold rounded-0 ${
                modo === "login" ? "btn-primary" : "btn-dark text-secondary"
              }`}
              onClick={() => {
                setModo("login");
                setError("");
                setExito("");
              }}
            >
              Iniciar Sesión
            </button>
            <button
              className={`btn flex-fill py-2 fw-bold rounded-0 ${
                modo === "registro" ? "btn-primary" : "btn-dark text-secondary"
              }`}
              onClick={() => {
                setModo("registro");
                setError("");
                setExito("");
              }}
            >
              Registrarse
            </button>
          </div>

          {/* MENSAJES DE ALERTA */}
          {error && <div className="alert alert-danger py-2 text-center mb-3">{error}</div>}
          {exito && <div className="alert alert-success py-2 text-center mb-3">{exito}</div>}

          {/* FORMULARIO LOGIN */}
          {modo === "login" ? (
            <form onSubmit={handleLogin} noValidate>
              <h3 className="mb-3 text-center fw-bold text-white">BIENVENIDO</h3>

              <div className="mb-3">
                <label className="form-label text-light">Usuario</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Ej: admin, vendedor, cliente"
                  value={usuarioLogin}
                  onChange={(e) => setUsuarioLogin(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-light">Contraseña</label>
                <input
                  type="password"
                  className="form-control bg-dark text-light border-secondary"
                  value={passLogin}
                  onChange={(e) => setPassLogin(e.target.value)}
                />
              </div>

              <button className="btn btn-primary w-100 fw-bold py-2 mb-3" type="submit">
                Ingresar a Sonido Vivo
              </button>

              {/* Muestra de credenciales para el evaluador */}
              <div className="bg-secondary bg-opacity-25 p-3 rounded text-secondary fs-6 border border-secondary mt-3">
                <p className="mb-1 text-white fw-semibold">🔑 Cuentas de prueba disponibles:</p>
                <ul className="mb-0 ps-3">
                  <li><strong>admin</strong> / admin123 (Administrador)</li>
                  <li><strong>vendedor</strong> / vendedor123 (Vendedor)</li>
                  <li><strong>cliente</strong> / cliente123 (Cliente)</li>
                </ul>
              </div>
            </form>
          ) : (
            /* FORMULARIO REGISTRO */
            <form onSubmit={handleRegistro} noValidate>
              <h3 className="mb-3 text-center fw-bold text-white">CREAR CUENTA</h3>

              <div className="mb-3">
                <label className="form-label text-light">Nombre Completo</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Ej: María González"
                  value={nombreReg}
                  onChange={(e) => setNombreReg(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Nombre de Usuario</label>
                <input
                  type="text"
                  className="form-control bg-dark text-light border-secondary"
                  placeholder="Ej: mariag"
                  value={usuarioReg}
                  onChange={(e) => setUsuarioReg(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-light">Contraseña</label>
                <input
                  type="password"
                  className="form-control bg-dark text-light border-secondary"
                  value={passReg}
                  onChange={(e) => setPassReg(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-light">Confirmar Contraseña</label>
                <input
                  type="password"
                  className="form-control bg-dark text-light border-secondary"
                  value={confirmPassReg}
                  onChange={(e) => setConfirmPassReg(e.target.value)}
                />
              </div>

              <button className="btn btn-success w-100 fw-bold py-2" type="submit">
                Registrarse como Cliente
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}