// src/pages/Categories.jsx
import React, { useState } from 'react';
// Importa tu archivo de productos (ajusta la ruta según tu estructura)
import { productos } from '../data/productosSonidoVivo'; 

export default function Categories() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Guitarras');

  // Extraer categorías únicas
  const categoriasUnicas = [...new Set(productos.map(p => p.categoria))];

  // Filtrar productos según la categoría seleccionada
  const productosFiltrados = productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div className="panel my-5">
      <h2 className="text-center mb-4">Categorías de Instrumentos y Audio</h2>
      
      {/* Botones de Categorías */}
      <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
        {categoriasUnicas.map((cat, index) => (
          <button 
            key={index}
            className={`btn ${categoriaSeleccionada === cat ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Listado de productos filtrados */}
      <h3 className="mb-4">Mostrando: {categoriaSeleccionada}</h3>
      <div className="product-container">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map(prod => (
            <div className="product-card" key={prod.codigo}>
              <img src={prod.imagen || 'https://via.placeholder.com/300'} alt={prod.nombre} />
              <h3>{prod.nombre}</h3>
              <p>${prod.precio.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p className="text-muted">No hay productos en esta categoría por el momento.</p>
        )}
      </div>
    </div>
  );
}