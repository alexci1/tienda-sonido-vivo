// src/test/ruta-protegida.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import RutaProtegida from '../components/RutaProtegida.jsx';

function crearJwtValido(payload) {
  const toBase64Utf8 = (obj) => btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  const header = toBase64Utf8({ alg: 'HS256', typ: 'JWT' });
  const body = toBase64Utf8({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  return `${header}.${body}.firma-mock`;
}

function renderConRuta(rolesPermitidos) {
  return render(
    <MemoryRouter initialEntries={['/protegida']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<div>Página Login</div>} />
          <Route
            path="/protegida"
            element={
              <RutaProtegida rolesPermitidos={rolesPermitidos}>
                <div>Contenido Autorizado</div>
              </RutaProtegida>
            }
          />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('Control de Acceso en Frontend (RutaProtegida + AuthProvider)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('redirige a /login cuando no hay sesión ni token JWT', async () => {
    renderConRuta(['Administrador']);
    expect(await screen.findByText('Página Login')).toBeInTheDocument();
  });

  it('muestra Acceso Restringido cuando el rol no tiene permiso', async () => {
    const token = crearJwtValido({ sub: 'pedro', rol: 'CLIENTE', nombre: 'Pedro Cliente' });
    localStorage.setItem('sonido_vivo_token', token);
    localStorage.setItem(
      'sonido_vivo_sesion',
      JSON.stringify({ usuario: 'pedro', username: 'pedro', nombre: 'Pedro Cliente', rol: 'Cliente' })
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ username: 'pedro', nombre: 'Pedro Cliente', rol: 'CLIENTE' }),
      })
    );

    renderConRuta(['Administrador', 'Vendedor']);
    await waitFor(() => {
      expect(screen.getByText(/Acceso Restringido/i)).toBeInTheDocument();
    });
  });

  it('mantiene la sesión tras recarga y renderiza el contenido si el rol está autorizado', async () => {
    const token = crearJwtValido({ sub: 'admin', rol: 'ADMINISTRADOR', nombre: 'Administrador General' });
    localStorage.setItem('sonido_vivo_token', token);
    localStorage.setItem(
      'sonido_vivo_sesion',
      JSON.stringify({
        usuario: 'admin',
        username: 'admin',
        nombre: 'Administrador General',
        rol: 'Administrador',
      })
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({ username: 'admin', nombre: 'Administrador General', rol: 'ADMINISTRADOR' }),
      })
    );

    renderConRuta(['Administrador']);
    expect(await screen.findByText('Contenido Autorizado')).toBeInTheDocument();
  });
});
