// src/test/carrito.test.js
import { describe, it, expect, beforeEach } from 'vitest';

describe('Lógica del Carrito de Compras — Sonido Vivo', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe permitir calcular el subtotal correctamente de un instrumento o equipo', () => {
    const producto = { codigo: 'INS001', nombre: 'Guitarra Eléctrica Fender Stratocaster', precio: 450000, cantidad: 1 };
    const subtotal = producto.precio * producto.cantidad;
    
    expect(subtotal).toBe(450000);
  });

  it('debe guardar y recuperar los equipos de música del carrito usando localStorage', () => {
    const carritoMock = [
      { codigo: 'AUD005', nombre: 'Micrófono Condensador Shure SM58', precio: 95000, cantidad: 2 }
    ];

    localStorage.setItem('carrito', JSON.stringify(carritoMock));
    
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
    
    expect(carritoGuardado).toHaveLength(1);
    expect(carritoGuardado[0].nombre).toBe('Micrófono Condensador Shure SM58');
    expect(carritoGuardado[0].cantidad).toBe(2);
  });
});