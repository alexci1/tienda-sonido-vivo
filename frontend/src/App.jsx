// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RutaProtegida from './components/RutaProtegida';

import { productosIniciales } from './data/productosSonidoVivo.js';
import { apiProductos } from './utils/api.js';

import Inicio from './pages/Index';
import Productos from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CarritoPage from './pages/Cart';
import MisPedidos from './pages/MisPedidos';
import Login from './pages/Login';
import Nosotros from './pages/About';
import Contacto from './pages/Contact';
import AdminCrud from './pages/Admin';
import Categories from './pages/Categories.jsx';

function App() {
  const [productos, setProductos] = useState(productosIniciales);

  const recargarProductos = useCallback(async () => {
    try {
      const data = await apiProductos.obtenerTodos();
      if (Array.isArray(data) && data.length > 0) {
        setProductos(data);
      }
    } catch (err) {
      console.warn('No se pudo conectar al backend de productos, usando respaldo local:', err.message);
    }
  }, []);

  useEffect(() => {
    let activo = true;
    apiProductos
      .obtenerTodos()
      .then((data) => {
        if (activo && Array.isArray(data) && data.length > 0) {
          setProductos(data);
        }
      })
      .catch((err) => {
        console.warn('No se pudo conectar al backend de productos, usando respaldo local:', err.message);
      });
    return () => {
      activo = false;
    };
  }, []);

  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('carrito_sonido_vivo');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch {
      return [];
    }
  });

  const [notificacion, setNotificacion] = useState(null);

  useEffect(() => {
    localStorage.setItem('carrito_sonido_vivo', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((actual) => {
      const idTarget = producto.codigo || producto.id;
      const existe = actual.find((item) => (item.codigo || item.id) === idTarget);
      if (existe) {
        return actual.map((item) =>
          (item.codigo || item.id) === idTarget
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...actual, { ...producto, cantidad }];
    });

    setNotificacion(`¡Se agregaron ${cantidad} unidad(es) de "${producto.nombre}" al carrito!`);
    setTimeout(() => setNotificacion(null), 3000);
  };

  const actualizarCantidadCarrito = (identificador, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(identificador);
      return;
    }
    setCarrito((actual) =>
      actual.map((item) =>
        (item.codigo || item.id) === identificador
          ? { ...item, cantidad: nuevaCantidad }
          : item
      )
    );
  };

  const eliminarDelCarrito = (identificador) => {
    setCarrito((actual) => actual.filter((item) => (item.codigo || item.id) !== identificador));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const totalCarrito = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  const agregarProductoCatalogo = async (nuevoProd) => {
    const prodBackend = await apiProductos.crear(nuevoProd);
    setProductos((actuales) => [...actuales, prodBackend]);
    return prodBackend;
  };

  const actualizarProductoCatalogo = async (codigo, datosProd) => {
    const prodActualizado = await apiProductos.actualizar(codigo, datosProd);
    setProductos((actuales) =>
      actuales.map((p) => ((p.codigo || p.id) === codigo ? prodActualizado : p))
    );
    return prodActualizado;
  };

  const eliminarProductoCatalogo = async (identificador) => {
    await apiProductos.eliminar(identificador);
    setProductos((actuales) => actuales.filter((p) => (p.codigo || p.id) !== identificador));
  };

  return (
    <div className="app-container">
      <Navbar cantidadCarrito={carrito.reduce((acc, item) => acc + item.cantidad, 0)} />

      {notificacion && (
        <div
          className="alert alert-success alert-dismissible fade show text-center m-0 border-0 rounded-0"
          style={{ position: 'sticky', top: 0, zIndex: 1050 }}
          role="alert"
        >
          <strong>✓ {notificacion}</strong>
          <button
            type="button"
            className="btn-close"
            onClick={() => setNotificacion(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      <main>
        <Routes>
          {/* === RUTAS PÚBLICAS === */}
          <Route path="/login" element={<Login />} />

          {/* === RUTAS PROTEGIDAS (cualquier usuario autenticado) === */}
          <Route path="/" element={<RutaProtegida><Inicio /></RutaProtegida>} />
          <Route
            path="/products"
            element={<RutaProtegida><Productos productos={productos} onAgregar={agregarAlCarrito} /></RutaProtegida>}
          />
          <Route
            path="/categories"
            element={<RutaProtegida><Categories productos={productos} onAgregar={agregarAlCarrito} /></RutaProtegida>}
          />
          <Route
            path="/product/:id"
            element={<RutaProtegida><ProductDetail productos={productos} onAgregar={agregarAlCarrito} /></RutaProtegida>}
          />
          <Route path="/nosotros" element={<RutaProtegida><Nosotros /></RutaProtegida>} />
          <Route path="/contacto" element={<RutaProtegida><Contacto /></RutaProtegida>} />

          {/* === CARRITO Y PEDIDOS DEL CLIENTE === */}
          <Route
            path="/carrito"
            element={
              <RutaProtegida rolesPermitidos={['Cliente']}>
                <CarritoPage
                  carrito={carrito}
                  total={totalCarrito}
                  onEliminar={eliminarDelCarrito}
                  onActualizarCantidad={actualizarCantidadCarrito}
                  onVaciar={vaciarCarrito}
                  onPedidoCreado={recargarProductos}
                />
              </RutaProtegida>
            }
          />
          <Route path="/cart" element={<Navigate to="/carrito" replace />} />
          <Route
            path="/mis-pedidos"
            element={
              <RutaProtegida rolesPermitidos={['Cliente']}>
                <MisPedidos />
              </RutaProtegida>
            }
          />

          {/* === PANEL ADMIN / STOCK: Solo Administrador y Vendedor === */}
          <Route
            path="/admin"
            element={
              <RutaProtegida rolesPermitidos={['Administrador', 'Vendedor']}>
                <AdminCrud
                  productos={productos}
                  onAgregar={agregarProductoCatalogo}
                  onActualizar={actualizarProductoCatalogo}
                  onEliminar={eliminarProductoCatalogo}
                />
              </RutaProtegida>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
