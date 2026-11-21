// src/pages/Categories.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { productosIniciales } from '../data/productosSonidoVivo.js';

export default function Categories({ onAgregar }) {
  // Estado para la categoría seleccionada ('Todas' por defecto para mostrar el catálogo completo)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  // Extraer categorías únicas del catálogo
  const categoriasUnicas = ['Todas', ...new Set(productosIniciales.map(p => p.categoria))];

  // Filtrar productos según la selección
  const productosFiltrados = categoriaSeleccionada === 'Todas' 
    ? productosIniciales 
    : productosIniciales.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div className="categories-view my-4">
      <h2 className="text-center mb-4 text-white" style={{ letterSpacing: '2px' }}>Catálogo de Productos - Sonido Vivo</h2>
      
      {/* Botones de Filtro por Categoría */}
      <div className="categories-buttons">
        {categoriasUnicas.map((cat, index) => (
          <button 
            key={index}
            className={`category-btn ${categoriaSeleccionada === cat ? 'active' : ''}`}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <h3 className="mb-4 text-primary text-center">
        {categoriaSeleccionada === 'Todas' ? 'Mostrando todo el catálogo' : `Categoría: ${categoriaSeleccionada}`}
      </h3>

      {/* Listado de productos */}
      <div className="product-container">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(prod => {
            const idProducto = prod.codigo || prod.id;
            return (
              <div className="product-card" key={idProducto}>
                <Link to={`/product/${idProducto}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <img src={prod.imagen} alt={prod.nombre} />
                  <h3>{prod.nombre}</h3>
                </Link>
                
                <p>${prod.precio.toLocaleString()}</p>
                
                {onAgregar && (
                  <button 
                    className="btn-custom" 
                    onClick={() => onAgregar(prod)}
                  >
                    Agregar al Carrito
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-muted text-center w-100">No hay productos disponibles en esta categoría.</p>
        )}
      </div>
    </div>
  );
}