// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { iniciarSesion } from "../auth/auth.js";
 
export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
 
  function ingresar(event) {
    event.preventDefault();
    setError("");
 
    if (!usuario.trim() || !password) {
      setError("Debe completar usuario y contraseña.");
      return;
    }
 
    if (!iniciarSesion(usuario.trim(), password)) {
      setError("Credenciales incorrectas.");
      return;
    }
 
    navigate("/admin");
  }
 
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 bg-dark p-4 rounded border border-secondary shadow text-white">
          <h2 className="mb-3 text-center" style={{ letterSpacing: '2px' }}>Inicia Sesion</h2>
          <p className="text-center text-muted mb-4">
            Credenciales de prueba: <strong>admin / admin123</strong>
          </p>
 
          <form onSubmit={ingresar} noValidate>
            <div className="mb-3">
              <label htmlFor="usuario" className="form-label">Usuario</label>
              <input
                id="usuario"
                className="form-control bg-secondary text-white border-0"
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
              />
            </div>
 
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                className="form-control bg-secondary text-white border-0"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
 
            <button className="btn btn-primary w-100 fw-bold py-2 mb-3" type="submit">
              Ingresar
            </button>
 
            {error && (
              <div className="alert alert-danger py-2 text-center" role="alert">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}