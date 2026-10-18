// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cerrarSesion, obtenerSesion, obtenerUsuarios } from "../auth/auth.js";

export default function Admin({ productos, onAgregar, onEliminar }) {
  const navigate = useNavigate();
  const sesion = obtenerSesion();

  // Estados locales
  const [pestaña, setPestaña] = useState("resumen"); // 'resumen' | 'pedidos' | 'productos' | 'usuarios'
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Formulario nuevo producto
  const [nuevoProd, setNuevoProd] = useState({
    codigo: "",
    nombre: "",
    marca: "",
    modelo: "",
    precio: "",
    stock: "",
    categoria: "Guitarras Eléctricas",
    imagen: "",
    descripcion: ""
  });

  useEffect(() => {
    // Cargar órdenes registradas en localStorage por el Checkout
    const pedidosGuardados = JSON.parse(
      localStorage.getItem("pedidos_sonido_vivo") || "[]"
    );
    setPedidos(pedidosGuardados);

    // Cargar usuarios
    setUsuarios(obtenerUsuarios());
  }, []);

  function salir() {
    cerrarSesion();
    navigate("/login");
  }

  const handleCambiarEstadoPedido = (pedidoId, nuevoEstado) => {
    const pedidosActualizados = pedidos.map((p) =>
      p.id === pedidoId ? { ...p, estado: nuevoEstado } : p
    );
    setPedidos(pedidosActualizados);
    localStorage.setItem(
      "pedidos_sonido_vivo",
      JSON.stringify(pedidosActualizados)
    );
  };

  const handleCrearProducto = (e) => {
    e.preventDefault();
    if (!nuevoProd.nombre || !nuevoProd.precio || !nuevoProd.codigo) return;

    onAgregar({
      ...nuevoProd,
      precio: Number(nuevoProd.precio),
      stock: Number(nuevoProd.stock) || 0
    });

    // Limpiar formulario
    setNuevoProd({
      codigo: "",
      nombre: "",
      marca: "",
      modelo: "",
      precio: "",
      stock: "",
      categoria: "Guitarras Eléctricas",
      imagen: "",
      descripcion: ""
    });
  };

  const esAdmin = sesion?.rol === "Administrador";
  const pedidosPendientes = pedidos.filter(
    (p) => p.estado === "En preparación"
  ).length;

  return (
    <div className="container py-5 text-white">
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary flex-wrap gap-2">
        <div>
          <h2 className="fw-bold m-0" style={{ letterSpacing: "1px" }}>
            PANEL ADMINISTRATIVO
          </h2>
          <p className="text-secondary m-0">
            Bienvenido, <strong className="text-white">{sesion?.usuario}</strong> | Rol:{" "}
            <span className="badge bg-info text-dark">{sesion?.rol}</span>
          </p>
        </div>
        <button className="btn btn-outline-danger fw-bold" onClick={salir}>
          🚪 Cerrar sesión
        </button>
      </div>

      {/* Tarjetas KPI de Resumen */}
      <div className="row g-3 mb-4">
        <div className="col-md-4" onClick={() => setPestaña("productos")} style={{ cursor: "pointer" }}>
          <div className="card p-3 text-center bg-dark border-secondary h-100 shadow-sm">
            <h3 className="text-info fw-bold">{productos.length}</h3>
            <span className="text-secondary">Productos en Catálogo</span>
          </div>
        </div>
        <div className="col-md-4" onClick={() => setPestaña("pedidos")} style={{ cursor: "pointer" }}>
          <div className="card p-3 text-center bg-dark border-secondary h-100 shadow-sm">
            <h3 className="text-warning fw-bold">{pedidosPendientes}</h3>
            <span className="text-secondary">Pedidos Pendientes</span>
          </div>
        </div>
        <div className="col-md-4" onClick={() => esAdmin && setPestaña("usuarios")} style={{ cursor: esAdmin ? "pointer" : "default" }}>
          <div className="card p-3 text-center bg-dark border-secondary h-100 shadow-sm">
            <h3 className="text-success fw-bold">{usuarios.length}</h3>
            <span className="text-secondary">Usuarios Registrados</span>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="btn-group mb-4 w-100 flex-wrap" role="group">
        <button
          className={`btn py-2 fw-bold ${
            pestaña === "pedidos"
              ? "btn-primary"
              : "btn-dark text-light border-secondary"
          }`}
          onClick={() => setPestaña("pedidos")}
        >
          📦 Gestión de Pedidos ({pedidos.length})
        </button>

        <button
          className={`btn py-2 fw-bold ${
            pestaña === "productos"
              ? "btn-primary"
              : "btn-dark text-light border-secondary"
          }`}
          onClick={() => setPestaña("productos")}
        >
          🎛️ Productos y Stock ({productos.length})
        </button>

        {esAdmin && (
          <button
            className={`btn py-2 fw-bold ${
              pestaña === "usuarios"
                ? "btn-primary"
                : "btn-dark text-light border-secondary"
            }`}
            onClick={() => setPestaña("usuarios")}
          >
            👥 Usuarios y Roles ({usuarios.length})
          </button>
        )}
      </div>

      {/* PESTAÑA 1: GESTIÓN DE PEDIDOS */}
      {pestaña === "pedidos" && (
        <div className="bg-dark p-4 rounded border border-secondary shadow-sm">
          <h4 className="text-white mb-3">Órdenes de Compra y Seguimiento</h4>
          {pedidos.length === 0 ? (
            <p className="text-secondary mb-0">No hay pedidos registrados en el sistema actualmente.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle border-secondary">
                <thead>
                  <tr>
                    <th>N° Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Tipo Entrega</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Actualizar Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-bold text-primary">{p.id}</td>
                      <td>
                        <div><strong>{p.cliente?.nombre}</strong></div>
                        <small className="text-secondary">{p.cliente?.email}</small>
                      </td>
                      <td>{p.fecha}</td>
                      <td>{p.metodoEntrega === "despacho" ? "🚚 Despacho" : "🏪 Retiro"}</td>
                      <td className="fw-bold">${p.total?.toLocaleString("es-CL")}</td>
                      <td>
                        <span
                          className={`badge ${
                            p.estado === "Entregado"
                              ? "bg-success"
                              : p.estado === "Despachado"
                              ? "bg-info text-dark"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {p.estado}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm bg-dark text-light border-secondary"
                          value={p.estado}
                          onChange={(e) =>
                            handleCambiarEstadoPedido(p.id, e.target.value)
                          }
                        >
                          <option value="En preparación">En preparación</option>
                          <option value="Despachado">Despachado</option>
                          <option value="Entregado">Entregado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: PRODUCTOS Y STOCK */}
      {pestaña === "productos" && (
        <div className="row g-4">
          {/* Formulario Agregar Producto */}
          <div className="col-lg-4">
            <div className="bg-dark p-4 rounded border border-secondary shadow-sm">
              <h4 className="text-white mb-3">+ Nuevo Producto</h4>
              <form onSubmit={handleCrearProducto}>
                <div className="mb-2">
                  <label className="form-label text-light">Código *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: GA006"
                    className="form-control bg-dark text-light border-secondary"
                    value={nuevoProd.codigo}
                    onChange={(e) =>
                      setNuevoProd({ ...nuevoProd, codigo: e.target.value })
                    }
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label text-light">Nombre *</label>
                  <input
                    type="text"
                    required
                    className="form-control bg-dark text-light border-secondary"
                    value={nuevoProd.nombre}
                    onChange={(e) =>
                      setNuevoProd({ ...nuevoProd, nombre: e.target.value })
                    }
                  />
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label text-light">Marca</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      value={nuevoProd.marca}
                      onChange={(e) =>
                        setNuevoProd({ ...nuevoProd, marca: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-light">Precio (CLP) *</label>
                    <input
                      type="number"
                      required
                      className="form-control bg-dark text-light border-secondary"
                      value={nuevoProd.precio}
                      onChange={(e) =>
                        setNuevoProd({ ...nuevoProd, precio: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label text-light">Stock Inicial</label>
                  <input
                    type="number"
                    className="form-control bg-dark text-light border-secondary"
                    value={nuevoProd.stock}
                    onChange={(e) =>
                      setNuevoProd({ ...nuevoProd, stock: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light">URL Imagen</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="form-control bg-dark text-light border-secondary"
                    value={nuevoProd.imagen}
                    onChange={(e) =>
                      setNuevoProd({ ...nuevoProd, imagen: e.target.value })
                    }
                  />
                </div>
                <button type="submit" className="btn btn-success w-100 fw-bold">
                  Guardar Producto
                </button>
              </form>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="col-lg-8">
            <div className="bg-dark p-4 rounded border border-secondary shadow-sm">
              <h4 className="text-white mb-3">Inventario en Bodega</h4>
              <div className="table-responsive" style={{ maxHeight: "450px", overflowY: "auto" }}>
                <table className="table table-dark table-striped align-middle border-secondary">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((prod) => {
                      const keyProd = prod.codigo || prod.id;
                      return (
                        <tr key={keyProd}>
                          <td className="fw-bold text-primary">{prod.codigo}</td>
                          <td>
                            <div>{prod.nombre}</div>
                            <small className="text-secondary">{prod.marca}</small>
                          </td>
                          <td>${prod.precio?.toLocaleString("es-CL")}</td>
                          <td>
                            <span
                              className={`badge ${
                                (prod.stock || 0) > 0 ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {prod.stock || 0} un.
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onEliminar(keyProd)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 3: USUARIOS (RBAC) */}
      {pestaña === "usuarios" && esAdmin && (
        <div className="bg-dark p-4 rounded border border-secondary shadow-sm">
          <h4 className="text-white mb-3">Usuarios Registrados en el Sistema (RBAC)</h4>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle border-secondary">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td className="fw-bold text-white">{u.nombre}</td>
                    <td>{u.usuario}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.rol === "Administrador"
                            ? "bg-danger"
                            : u.rol === "Vendedor"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {u.rol}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}