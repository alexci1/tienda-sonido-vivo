// src/utils/carrito.js
// Lógica pura del carrito, el stock y la persistencia del catálogo.
// Se separa de App.jsx para poder probarla con pruebas unitarias.

export const CLAVE_CARRITO = 'carrito_sonido_vivo';
export const CLAVE_PRODUCTOS = 'productos_sonido_vivo';
export const CLAVE_PEDIDOS = 'pedidos_sonido_vivo';
const STOCK_POR_DEFECTO = 10;

export const idProducto = (producto) => producto.codigo || producto.id;

export const stockDe = (producto) => producto.stock ?? STOCK_POR_DEFECTO;

function itemValido(item) {
  return (
    item &&
    typeof item === 'object' &&
    idProducto(item) !== undefined &&
    Number.isFinite(item.precio) &&
    Number.isInteger(item.cantidad) &&
    item.cantidad > 0
  );
}

// Lee una lista desde localStorage; si el JSON está corrupto devuelve el valor de respaldo.
function leerLista(clave, respaldo, storage) {
  try {
    const raw = storage.getItem(clave);
    if (!raw) return respaldo;
    const datos = JSON.parse(raw);
    return Array.isArray(datos) ? datos : respaldo;
  } catch {
    return respaldo;
  }
}

export function leerCarrito(storage = localStorage) {
  return leerLista(CLAVE_CARRITO, [], storage).filter(itemValido);
}

export function guardarCarrito(carrito, storage = localStorage) {
  storage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

export function leerProductos(iniciales, storage = localStorage) {
  const guardados = leerLista(CLAVE_PRODUCTOS, null, storage);
  return guardados && guardados.length > 0 ? guardados : iniciales;
}

export function guardarProductos(productos, storage = localStorage) {
  storage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

export function leerPedidos(storage = localStorage) {
  return leerLista(CLAVE_PEDIDOS, [], storage);
}

export function guardarPedido(pedido, storage = localStorage) {
  storage.setItem(CLAVE_PEDIDOS, JSON.stringify([pedido, ...leerPedidos(storage)]));
}

// Agrega un producto sin superar el stock disponible. Cantidades inválidas se ignoran.
export function agregarItem(carrito, producto, cantidad = 1) {
  const cantidadNum = Math.floor(Number(cantidad));
  if (!Number.isFinite(cantidadNum) || cantidadNum <= 0) return carrito;

  const stock = stockDe(producto);
  const id = idProducto(producto);
  const existe = carrito.find((item) => idProducto(item) === id);

  if (existe) {
    const nueva = Math.min(existe.cantidad + cantidadNum, stock);
    return carrito.map((item) => (idProducto(item) === id ? { ...item, cantidad: nueva } : item));
  }
  if (stock <= 0) return carrito;
  return [...carrito, { ...producto, cantidad: Math.min(cantidadNum, stock) }];
}

// Cambia la cantidad (0 o menos elimina el item) respetando un límite máximo.
export function actualizarCantidadItem(carrito, id, nuevaCantidad, limite = Infinity) {
  if (nuevaCantidad <= 0) return eliminarItem(carrito, id);
  const cantidad = Math.min(Math.floor(nuevaCantidad), limite);
  return carrito.map((item) => (idProducto(item) === id ? { ...item, cantidad } : item));
}

export function eliminarItem(carrito, id) {
  return carrito.filter((item) => idProducto(item) !== id);
}

export function calcularTotal(carrito) {
  return carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

export function contarUnidades(carrito) {
  return carrito.reduce((suma, item) => suma + item.cantidad, 0);
}

// Devuelve los problemas de stock del carrito frente al catálogo actual (lista vacía = todo OK).
export function problemasDeStock(productos, carrito) {
  return carrito
    .map((item) => {
      const prod = productos.find((p) => idProducto(p) === idProducto(item));
      const disponible = prod ? stockDe(prod) : 0;
      return item.cantidad > disponible
        ? { id: idProducto(item), nombre: item.nombre, disponible, solicitado: item.cantidad }
        : null;
    })
    .filter(Boolean);
}

// Descuenta del catálogo las unidades compradas (nunca deja stock negativo).
export function descontarStock(productos, carrito) {
  return productos.map((prod) => {
    const comprado = carrito.find((item) => idProducto(item) === idProducto(prod));
    if (!comprado) return prod;
    return { ...prod, stock: Math.max(0, stockDe(prod) - comprado.cantidad) };
  });
}
