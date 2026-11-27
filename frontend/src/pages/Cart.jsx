// src/pages/Cart.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiPedidos } from '../utils/api.js';
import { useAuth } from '../context/useAuth.js';

export default function Cart({
  carrito,
  total,
  onEliminar,
  onActualizarCantidad,
  onVaciar,
  onPedidoCreado,
}) {
  const { sesion } = useAuth();
  const [paso, setPaso] = useState('carrito'); // 'carrito' | 'checkout' | 'confirmacion'

  const [metodoEntrega, setMetodoEntrega] = useState('despacho'); // 'despacho' | 'retiro'
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: sesion?.nombre || '',
    rut: '',
    email: '',
    telefono: '',
    region: 'Valparaíso',
    ciudad: 'Viña del Mar',
    direccion: '',
    notas: '',
  });

  const [metodoPago, setMetodoPago] = useState('webpay'); // 'webpay' | 'transferencia'
  const [pedidoRealizado, setPedidoRealizado] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [errorCheckout, setErrorCheckout] = useState('');

  const handleInputChange = (e) => {
    setDatosEnvio({ ...datosEnvio, [e.target.name]: e.target.value });
  };

  const costoEnvio = metodoEntrega === 'despacho' ? 4990 : 0;
  const totalFinal = total + costoEnvio;

  const handleFinalizarCompra = async (e) => {
    e.preventDefault();
    setErrorCheckout('');
    setProcesando(true);

    const nuevoPedido = {
      fecha: new Date().toLocaleDateString('es-CL'),
      clienteNombre: datosEnvio.nombre,
      clienteEmail: datosEnvio.email,
      clienteRut: datosEnvio.rut,
      clienteTelefono: datosEnvio.telefono,
      clienteCiudad: datosEnvio.ciudad,
      clienteRegion: datosEnvio.region,
      clienteDireccion: datosEnvio.direccion,
      itemsJson: JSON.stringify(
        carrito.map((item) => ({
          codigo: item.codigo || item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
        }))
      ),
      metodoEntrega,
      metodoPago,
      total: totalFinal,
      estado: 'En preparación',
    };

    try {
      const pedidoCreado = await apiPedidos.crearPedido(nuevoPedido);
      setPedidoRealizado({ ...pedidoCreado, cliente: datosEnvio });
      onVaciar();
      if (onPedidoCreado) {
        await onPedidoCreado();
      }
      setPaso('confirmacion');
    } catch (err) {
      setErrorCheckout(err.message || 'No se pudo procesar el pedido en el servidor.');
    } finally {
      setProcesando(false);
    }
  };

  if (paso === 'confirmacion' && pedidoRealizado) {
    return (
      <div className="container py-5 text-light text-center" style={{ maxWidth: '700px' }}>
        <div className="bg-dark p-5 rounded border border-success shadow-lg">
          <div className="fs-1 text-success mb-3">🎉 ¡Pedido Confirmado!</div>
          <h2 className="text-white mb-2">Gracias por tu compra, {pedidoRealizado.cliente?.nombre || pedidoRealizado.clienteNombre}</h2>
          <p className="text-secondary">Tu orden ha sido registrada exitosamente en la base de datos.</p>

          <div className="bg-secondary bg-opacity-25 p-3 rounded text-start my-4 border border-secondary">
            <p className="mb-1"><strong>N° de Pedido:</strong> <span className="text-primary fw-bold">{pedidoRealizado.id}</span></p>
            <p className="mb-1"><strong>N° Seguimiento:</strong> <span className="text-warning fw-bold">{pedidoRealizado.seguimiento}</span></p>
            <p className="mb-1"><strong>Tipo de Entrega:</strong> {pedidoRealizado.metodoEntrega === 'despacho' ? '🚚 Despacho a Domicilio' : '🏪 Retiro en Tienda (Viña del Mar)'}</p>
            <p className="mb-1"><strong>Estado Actual:</strong> <span className="badge bg-info text-dark">{pedidoRealizado.estado}</span></p>
            <p className="mb-0"><strong>Total Pagado:</strong> ${pedidoRealizado.total?.toLocaleString('es-CL')}</p>
          </div>

          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Link to="/mis-pedidos" className="btn btn-outline-info btn-lg fw-bold">
              Ver Mis Pedidos
            </Link>
            <Link to="/products" className="btn btn-primary btn-lg fw-bold">
              Volver al Catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (carrito.length === 0 && paso !== 'confirmacion') {
    return (
      <div className="container py-5 text-center text-light">
        <h2 className="mb-3">Tu carrito está vacío 🛒</h2>
        <p className="text-secondary mb-4">Aún no has agregado equipos de audio a tu orden.</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5 text-light">
      <h2 className="text-white fw-bold mb-4 text-center" style={{ letterSpacing: '2px' }}>
        {paso === 'carrito' ? 'CARRITO DE COMPRAS' : 'FINALIZAR PEDIDO'}
      </h2>

      {errorCheckout && (
        <div className="alert alert-danger text-center mb-4">
          <strong>Error al procesar el pedido:</strong> {errorCheckout}
        </div>
      )}

      {paso === 'carrito' ? (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="bg-dark p-4 rounded border border-secondary">
              {carrito.map((item) => {
                const keyItem = item.codigo || item.id;
                return (
                  <div key={keyItem} className="d-flex align-items-center justify-content-between py-3 border-bottom border-secondary gap-3 flex-wrap">
                    <img
                      src={item.imagen || 'https://via.placeholder.com/80?text=Audio'}
                      alt={item.nombre}
                      className="rounded"
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                    />

                    <div className="flex-grow-1">
                      <h5 className="text-white mb-1">{item.nombre}</h5>
                      <span className="badge bg-secondary mb-1">{item.marca}</span>
                      <p className="text-primary fw-bold mb-0">${item.precio.toLocaleString('es-CL')}</p>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => onActualizarCantidad(keyItem, item.cantidad - 1)}
                      >
                        -
                      </button>
                      <span className="fw-bold px-2">{item.cantidad}</span>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={() => onActualizarCantidad(keyItem, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>

                    <div className="text-end">
                      <p className="fw-bold mb-1">${(item.precio * item.cantidad).toLocaleString('es-CL')}</p>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onEliminar(keyItem)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-outline-secondary btn-sm" onClick={onVaciar}>
                  Vaciar Carrito
                </button>
                <Link to="/products" className="btn btn-outline-light btn-sm">
                  + Agregar más productos
                </Link>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="bg-dark p-4 rounded border border-secondary sticky-top" style={{ top: '100px' }}>
              <h4 className="text-white mb-3">Resumen de Compra</h4>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal:</span>
                <span className="fw-bold">${total.toLocaleString('es-CL')}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-secondary">Despacho:</span>
                <span className="text-success">Por calcular</span>
              </div>
              <hr className="border-secondary" />
              <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                <span>Total Estimado:</span>
                <span className="text-primary">${total.toLocaleString('es-CL')}</span>
              </div>

              <button
                className="btn btn-primary w-100 btn-lg fw-bold"
                onClick={() => setPaso('checkout')}
              >
                Ir a Pagar →
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFinalizarCompra} className="row g-4">
          <div className="col-lg-7">
            <div className="bg-dark p-4 rounded border border-secondary mb-4">
              <h4 className="text-white mb-3">1. Método de Entrega</h4>
              <div className="d-flex gap-3 mb-3">
                <button
                  type="button"
                  className={`btn flex-fill py-3 fw-bold ${metodoEntrega === 'despacho' ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
                  onClick={() => setMetodoEntrega('despacho')}
                >
                  🚚 Despacho a Domicilio (+$4.990)
                </button>
                <button
                  type="button"
                  className={`btn flex-fill py-3 fw-bold ${metodoEntrega === 'retiro' ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
                  onClick={() => setMetodoEntrega('retiro')}
                >
                  🏪 Retiro en Tienda (Gratis - Viña del Mar)
                </button>
              </div>

              {metodoEntrega === 'retiro' && (
                <div className="alert alert-info border-0 mb-0">
                  📍 <strong>Punto de retiro:</strong> Av. Libertad 456, Viña del Mar, Región de Valparaíso. Horario: Lunes a Sábado de 10:00 a 19:00 hrs.
                </div>
              )}
            </div>

            <div className="bg-dark p-4 rounded border border-secondary mb-4">
              <h4 className="text-white mb-3">2. Datos de Contacto y Envíos</h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-light">Nombre Completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    className="form-control bg-dark text-light border-secondary"
                    value={datosEnvio.nombre}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-light">RUT *</label>
                  <input
                    type="text"
                    name="rut"
                    required
                    placeholder="12.345.678-9"
                    className="form-control bg-dark text-light border-secondary"
                    value={datosEnvio.rut}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-light">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="form-control bg-dark text-light border-secondary"
                    value={datosEnvio.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label text-light">Teléfono *</label>
                  <input
                    type="tel"
                    name="telefono"
                    required
                    placeholder="+56 9..."
                    className="form-control bg-dark text-light border-secondary"
                    value={datosEnvio.telefono}
                    onChange={handleInputChange}
                  />
                </div>

                {metodoEntrega === 'despacho' && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label text-light">Región</label>
                      <input
                        type="text"
                        name="region"
                        className="form-control bg-dark text-light border-secondary"
                        value={datosEnvio.region}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-light">Ciudad / Comuna</label>
                      <input
                        type="text"
                        name="ciudad"
                        className="form-control bg-dark text-light border-secondary"
                        value={datosEnvio.ciudad}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label text-light">Dirección de Entrega *</label>
                      <input
                        type="text"
                        name="direccion"
                        required
                        placeholder="Calle, número, dpto/casa"
                        className="form-control bg-dark text-light border-secondary"
                        value={datosEnvio.direccion}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-dark p-4 rounded border border-secondary">
              <h4 className="text-white mb-3">3. Medio de Pago</h4>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="metodoPago"
                  id="webpay"
                  value="webpay"
                  checked={metodoPago === 'webpay'}
                  onChange={() => setMetodoPago('webpay')}
                />
                <label className="form-check-label text-light fw-bold" htmlFor="webpay">
                  💳 Webpay Plus (Tarjetas de Débito / Crédito)
                </label>
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="metodoPago"
                  id="transferencia"
                  value="transferencia"
                  checked={metodoPago === 'transferencia'}
                  onChange={() => setMetodoPago('transferencia')}
                />
                <label className="form-check-label text-light fw-bold" htmlFor="transferencia">
                  🏦 Transferencia Bancaria Directa
                </label>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="bg-dark p-4 rounded border border-secondary sticky-top" style={{ top: '100px' }}>
              <h4 className="text-white mb-3">Resumen del Pedido</h4>

              <div className="mb-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {carrito.map((item) => (
                  <div key={item.codigo || item.id} className="d-flex justify-content-between mb-2 fs-6">
                    <span className="text-secondary">{item.cantidad}x {item.nombre}</span>
                    <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                  </div>
                ))}
              </div>

              <hr className="border-secondary" />

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal Productos:</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Costo de Envío:</span>
                <span>{metodoEntrega === 'despacho' ? '$4.990' : 'GRATIS'}</span>
              </div>

              <hr className="border-secondary" />

              <div className="d-flex justify-content-between mb-4 fs-4 fw-bold">
                <span>Total Final:</span>
                <span className="text-primary">${totalFinal.toLocaleString('es-CL')}</span>
              </div>

              <button type="submit" className="btn btn-success w-100 btn-lg fw-bold mb-2" disabled={procesando}>
                {procesando ? 'Procesando pedido...' : 'Confirmar y Pagar'}
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                onClick={() => setPaso('carrito')}
                disabled={procesando}
              >
                ← Volver al Carrito
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
