// src/App.jsx
import { useState } from 'react';
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
import AdminCrud from './pages/Admin';

function App() {
  const [productos, setProductos] = useState(productosIniciales);
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito((actual) => {
      const existe = actual.find((item) => item.codigo === producto.codigo);
      if (existe) {
        return actual.map((item) =>
          item.codigo === producto.codigo ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...actual, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (identificador) => {
    setCarrito((actual) => actual.filter((item) => (item.codigo || item.id) !== identificador));
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

      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route 
            path="/products" 
            element={<Productos productos={productos} onAgregar={agregarAlCarrito} />} 
          />
          <Route 
            path="/product/:id" 
            element={<ProductDetail productos={productos} onAgregar={agregarAlCarrito} />} 
          />
          <Route 
            path="/carrito" 
            element={<CarritoPage carrito={carrito} total={totalCarrito} onEliminar={eliminarDelCarrito} />} 
          />
          <Route 
            path="/cart" 
            element={<Navigate to="/carrito" replace />} 
          />
          <Route 
            path="/login" 
            element={<Login />} 
          />
          {/* Ruta protegida que exige inicio de sesión */}
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