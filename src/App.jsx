// src/App.jsx
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RutaProtegida from './components/RutaProtegida';

import { productosIniciales } from './data/productosSonidoVivo.js';

import Inicio from './pages/Index';
import Productos from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CarritoPage from './pages/Cart';
import Login from './pages/Login';
import Nosotros from './pages/About';
import Contacto from './pages/Contact';
import AdminCrud from './pages/Admin';
import Categories from './pages/Categories.jsx';

function App() {
  const [productos, setProductos] = useState(productosIniciales);

  // 1. Cargar el carrito desde localStorage al iniciar la app
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito_sonido_vivo');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  const [notificacion, setNotificacion] = useState(null);

  // 2. Guardar automáticamente en localStorage cada vez que cambie el carrito
  useEffect(() => {
    localStorage.setItem('carrito_sonido_vivo', JSON.stringify(carrito));
  }, [carrito]);

  // Agregar al carrito con mensaje de éxito temporal
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((actual) => {
      const existe = actual.find((item) => (item.codigo || item.id) === (producto.codigo || producto.id));
      if (existe) {
        return actual.map((item) =>
          (item.codigo || item.id) === (producto.codigo || producto.id)
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      return [...actual, { ...producto, cantidad }];
    });

    setNotificacion(`¡Se agregaron ${cantidad} unidad(es) de "${producto.nombre}" al carrito!`);

    setTimeout(() => {
      setNotificacion(null);
    }, 3000);
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

  const agregarProductoCatalogo = (nuevoProd) => {
    setProductos([...productos, { ...nuevoProd, id: Date.now() }]);
  };

  const eliminarProductoCatalogo = (identificador) => {
    setProductos(productos.filter((p) => (p.codigo || p.id) !== identificador));
  };

  return (
    <div className="app-container">
      <Navbar cantidadCarrito={carrito.reduce((acc, item) => acc + item.cantidad, 0)} />

      {/* Banner flotante de notificación */}
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
          <Route path="/" element={<Inicio />} />
          <Route
            path="/products"
            element={<Productos productos={productos} onAgregar={agregarAlCarrito} />}
          />
          <Route
            path="/categories"
            element={<Categories productos={productos} onAgregar={agregarAlCarrito} />}
          />
          <Route
            path="/product/:id"
            element={<ProductDetail productos={productos} onAgregar={agregarAlCarrito} />}
          />
          <Route
            path="/nosotros"
            element={<Nosotros />}
          />
          <Route
            path="/contacto"
            element={<Contacto />}
          />
          <Route
            path="/carrito"
            element={
              <CarritoPage
                carrito={carrito}
                total={totalCarrito}
                onEliminar={eliminarDelCarrito}
                onActualizarCantidad={actualizarCantidadCarrito}
                onVaciar={vaciarCarrito}
              />
            }
          />
          <Route
            path="/cart"
            element={<Navigate to="/carrito" replace />}
          />
          <Route
            path="/login"
            element={<Login />}
          />
          <Route
            path="/admin"
            element={
              <RutaProtegida>
                <AdminCrud
                  productos={productos}
                  onAgregar={agregarProductoCatalogo}
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