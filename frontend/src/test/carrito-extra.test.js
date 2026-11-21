
import { describe, it, expect, beforeEach } from 'vitest';
import {
  CLAVE_CARRITO,
  CLAVE_PRODUCTOS,
  idProducto,
  stockDe,
  leerCarrito,
  guardarCarrito,
  leerProductos,
  guardarProductos,
  leerPedidos,
  guardarPedido,
  agregarItem,
  actualizarCantidadItem
} from '../utils/carrito.js';

const producto = (extra = {}) => ({
  codigo: 'GTR1',
  nombre: 'Guitarra',
  precio: 100,
  stock: 5,
  ...extra
});

const item = (extra = {}) => ({
  codigo: 'GTR1',
  nombre: 'Guitarra',
  precio: 100,
  cantidad: 2,
  ...extra
});

describe('Identificación y stock', () => {
  it('prefiere el código del producto', () =>
    expect(idProducto(producto({ id: 9 }))).toBe('GTR1'));

  it('usa el id si no hay código', () =>
    expect(idProducto({ id: 9 })).toBe(9));

  it('obtiene el stock indicado', () =>
    expect(stockDe(producto({ stock: 3 }))).toBe(3));

  it('usa stock 10 si es null', () =>
    expect(stockDe({ codigo: 'X', stock: null })).toBe(10));
});

describe('Persistencia del carrito', () => {
  beforeEach(() => localStorage.clear());

  it('devuelve carrito vacío inicialmente', () =>
    expect(leerCarrito()).toEqual([]));

  it('guarda y recupera el carrito', () => {
    guardarCarrito([item()]);
    expect(leerCarrito()).toEqual([item()]);
  });

  it('ignora cantidades cero', () => {
    localStorage.setItem(
      CLAVE_CARRITO,
      JSON.stringify([item({ cantidad: 0 })])
    );
    expect(leerCarrito()).toEqual([]);
  });

  it('ignora artículos sin identificador', () => {
    localStorage.setItem(
      CLAVE_CARRITO,
      JSON.stringify([{ precio: 10, cantidad: 1 }])
    );
    expect(leerCarrito()).toEqual([]);
  });

  it('ignora precios no numéricos', () => {
    localStorage.setItem(
      CLAVE_CARRITO,
      JSON.stringify([item({ precio: '100' })])
    );
    expect(leerCarrito()).toEqual([]);
  });

  it('maneja JSON corrupto', () => {
    localStorage.setItem(CLAVE_CARRITO, '{mal json');
    expect(leerCarrito()).toEqual([]);
  });

  it('usa productos iniciales si no hay guardados', () => {
    expect(leerProductos([producto()])).toEqual([producto()]);
  });

  it('guarda y recupera productos', () => {
    guardarProductos([producto()]);
    expect(leerProductos([])).toEqual([producto()]);
  });

  it('usa catálogo inicial si el guardado está vacío', () => {
    localStorage.setItem(CLAVE_PRODUCTOS, '[]');
    expect(leerProductos([producto()])).toEqual([producto()]);
  });

  it('devuelve pedidos vacíos inicialmente', () => {
    expect(leerPedidos()).toEqual([]);
  });

  it('agrega pedidos al inicio del historial', () => {
    guardarPedido({ id: 1 });
    guardarPedido({ id: 2 });
    expect(leerPedidos().map(p => p.id)).toEqual([2, 1]);
  });
});

describe('Operaciones del carrito', () => {
  it('agrega un producto con cantidad uno', () => {
    expect(agregarItem([], producto())).toEqual([
      { ...producto(), cantidad: 1 }
    ]);
  });

  it('agrega una cantidad solicitada', () => {
    expect(agregarItem([], producto(), 3)[0].cantidad).toBe(3);
  });

  it('no supera el stock al agregar', () => {
    expect(agregarItem([], producto(), 9)[0].cantidad).toBe(5);
  });

  it('incrementa un producto existente', () => {
    expect(
      agregarItem([item({ cantidad: 1 })], producto(), 2)[0].cantidad
    ).toBe(3);
  });

  it('limita el incremento al stock', () => {
    expect(
      agregarItem([item({ cantidad: 4 })], producto(), 4)[0].cantidad
    ).toBe(5);
  });

  it('ignora cantidad cero', () => {
    const original = [];
    expect(agregarItem(original, producto(), 0)).toBe(original);
  });

  it('ignora cantidad negativa', () => {
    expect(agregarItem([], producto(), -2)).toEqual([]);
  });

  it('ignora cantidad no numérica', () => {
    expect(agregarItem([], producto(), 'abc')).toEqual([]);
  });

  it('no agrega productos sin stock', () => {
    expect(agregarItem([], producto({ stock: 0 }))).toEqual([]);
  });

  it('actualiza la cantidad de un producto', () => {
    expect(
      actualizarCantidadItem([item()], 'GTR1', 4)[0].cantidad
    ).toBe(4);
  });
});
