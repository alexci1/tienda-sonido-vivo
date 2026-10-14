export default function Cart({ carrito, total, onEliminar }) {
  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center" style={{ letterSpacing: '2px' }}>CARRITO DE COMPRAS</h2>

      {carrito.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted fs-5">Tu carrito está vacío.</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <ul className="list-group mb-4">
              {carrito.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-secondary mb-2 rounded">
                  <div>
                    <h5 className="mb-1">{item.nombre}</h5>
                    <small className="text-muted">Cantidad: {item.cantidad} | Precio unitario: ${item.precio.toLocaleString("es-CL")}</small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="fw-bold text-info">${(item.precio * item.cantidad).toLocaleString("es-CL")}</span>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => onEliminar(item.id)}>
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="card p-4 bg-dark text-white border-secondary">
              <h3 className="d-flex justify-content-between align-items-center m-0">
                <span>Total a Pagar:</span>
                <span className="text-info">${total.toLocaleString("es-CL")}</span>
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}