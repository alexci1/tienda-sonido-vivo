// src/context/AuthContext.jsx
import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './useAuth.js';
import {
  obtenerSesion,
  iniciarSesion as authLogin,
  registrarUsuario as authRegister,
  cerrarSesion as authLogout,
  verificarSesionBackend,
  tieneRol as checkRol,
} from '../auth/auth.js';

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(() => obtenerSesion());
  const [cargandoSesion, setCargandoSesion] = useState(() => obtenerSesion() !== null);

  const sincronizarSesionLocal = useCallback(() => {
    setSesion(obtenerSesion());
  }, []);

  useEffect(() => {
    let activo = true;

    const revalidarAlRecargar = async () => {
      if (obtenerSesion()) {
        const sesionValidada = await verificarSesionBackend();
        if (activo) {
          setSesion(sesionValidada);
          setCargandoSesion(false);
        }
      } else if (activo) {
        setCargandoSesion(false);
      }
    };

    revalidarAlRecargar();

    window.addEventListener('sonido-vivo-auth-change', sincronizarSesionLocal);
    window.addEventListener('storage', sincronizarSesionLocal);

    return () => {
      activo = false;
      window.removeEventListener('sonido-vivo-auth-change', sincronizarSesionLocal);
      window.removeEventListener('storage', sincronizarSesionLocal);
    };
  }, [sincronizarSesionLocal]);

  const login = async (username, password) => {
    const nuevaSesion = await authLogin(username, password);
    setSesion(nuevaSesion);
    return nuevaSesion;
  };

  const register = async (datos) => {
    const resultado = await authRegister(datos);
    if (resultado.exito) {
      setSesion(resultado.usuario);
    }
    return resultado;
  };

  const logout = () => {
    authLogout();
    setSesion(null);
  };

  const tieneRol = (rolesPermitidos) => checkRol(sesion, rolesPermitidos);

  return (
    <AuthContext.Provider
      value={{
        sesion,
        estaAutenticado: sesion !== null,
        cargandoSesion,
        login,
        register,
        logout,
        tieneRol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
