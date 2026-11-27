// src/pages/Admin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { normalizarRol } from "../auth/auth.js";
import { apiPedidos, apiUsuarios } from "../utils/api.js";

const PRODUCTO_VACIO = {
  codigo: "",
  nombre: "",
  marca: "",
  modelo: "",
  precio: "",
  stock: "",
  categoria: "Guitarras Eléctricas",
  imagen: "",
  descripcion: "",
};

const CATEGORIAS_PRODUCTO = [
  "Guitarras Acústicas",
  "Guitarras Eléctricas",
  "Bajos Eléctricos",
  "Baterías",
  "Teclados y Pianos",
  "Amplificadores",
  "Micrófonos",
  "Pedales de Efectos",
  "Accesorios",
  "Estudio y Grabación",
];

export default function Admin({ productos, onAgregar, onActualizar, onEliminar }) {
  const navigate = useNavigate();
  const { sesion, logout } = useAuth();

  const [pestaña, setPestaña] = useState("pedidos"); // 'pedidos' | 'productos' | 'usuarios'
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [mensajeApi, setMensajeApi] = useState(null);
  const [errorApi, setErrorApi] = useState("");

  const [formProd, setFormProd] = useState(PRODUCTO_VACIO);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [guardandoProd, setGuardandoProd] = useState(false);

  const esAdmin = sesion?.rol === "Administrador";

  useEffect(() => {
    let activo = true;

    apiPedidos
      .obtenerTodos()
      .then((data) => {
        if (!activo) return;
        const pedidosNormalizados = (Array.isArray(data) ? data : []).map((p) => ({
          ...p,
          cliente: p.cliente || {
            nombre: p.clienteNombre,
            email: p.clienteEmail,
            telefono: p.clienteTelefono,
          },
        }));
        setPedidos(pedidosNormalizados);
      })
      .catch((err) => {
        if (activo) setErrorApi("Error cargando pedidos: " + err.message);
      });

    if (esAdmin) {
      apiUsuarios
        .obtenerTodos()
        .then((users) => {
          if (activo && Array.isArray(users)) {
            setUsuarios(users);
          }
        })
        .catch((err) => {
          if (activo) setErrorApi("Error cargando usuarios: " + err.message);
        });
    }

    return () => {
      activo = false;
    };
  }, [esAdmin]);

  function salir() {
    logout();
    navigate("/login");
  }

  function mostrarExito(msg) {
    setErrorApi("");
    setMensajeApi(msg);
    setTimeout(() => setMensajeApi(null), 3500);
  }

  const handleCambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      const actualizado = await apiPedidos.actualizarEstado(pedidoId, nuevoEstado);
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoId ? { ...p, estado: actualizado.estado || nuevoEstado } : p))
      );
      mostrarExito(`Pedido ${pedidoId} actualizado a "${nuevoEstado}".`);
    } catch (err) {
      setErrorApi(err.message || "No se pudo actualizar el estado del pedido.");
    }
  };

  const handleEliminarPedido = async (pedidoId) => {
    if (!esAdmin) return;
    try {
      await apiPedidos.eliminar(pedidoId);
      setPedidos((prev) => prev.filter((p) => p.id !== pedidoId));
      mostrarExito(`Pedido ${pedidoId} eliminado.`);
    } catch (err) {
      setErrorApi(err.message || "No se pudo eliminar el pedido.");
    }
  };

  const handleSeleccionarEditar = (prod) => {
    setFormProd({
      codigo: prod.codigo || "",
      nombre: prod.nombre || "",
      marca: prod.marca || "",
      modelo: prod.modelo || "",
      precio: prod.precio ?? "",
      stock: prod.stock ?? 0,
      categoria: prod.categoria || "Guitarras Eléctricas",
      imagen: prod.imagen || "",
      descripcion: prod.descripcion || "",
    });
    setModoEdicion(true);
    setErrorApi("");
  };

  const handleCancelarEdicion = () => {
    setFormProd(PRODUCTO_VACIO);
    setModoEdicion(false);
  };

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    if (!formProd.nombre || !formProd.precio || !formProd.codigo) return;

    setGuardandoProd(true);
    setErrorApi("");

    const payload = {
      ...formProd,
      codigo: formProd.codigo.trim(),
      precio: Number(formProd.precio),
      stock: Number(formProd.stock) || 0,
    };

    try {
      if (modoEdicion) {
        await onActualizar(payload.codigo, payload);
        mostrarExito(`Producto ${payload.codigo} actualizado correctamente.`);
      } else {
        await onAgregar(payload);
        mostrarExito(`Producto ${payload.codigo} creado en el catálogo.`);
      }
      setFormProd(PRODUCTO_VACIO);
      setModoEdicion(false);
    } catch (err) {
      setErrorApi(err.message || "No se pudo guardar el producto.");
    } finally {
      setGuardandoProd(false);
    }
  };

  const handleEliminarProducto = async (codigo) => {
    try {
      await onEliminar(codigo);
      if (modoEdicion && formProd.codigo === codigo) {
        handleCancelarEdicion();
      }
      mostrarExito(`Producto ${codigo} eliminado del catálogo.`);
    } catch (err) {
      setErrorApi(err.message || "No se pudo eliminar el producto.");
    }
  };

  const handleCambiarRolUsuario = async (idUsuario, nuevoRol) => {
    if (!esAdmin) return;
    try {
      const actualizado = await apiUsuarios.actualizarRol(idUsuario, nuevoRol);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === idUsuario ? { ...u, rol: actualizado.rol || nuevoRol } : u))
      );
      mostrarExito("Rol de usuario actualizado.");
    } catch (err) {
      setErrorApi(err.message || "No se pudo actualizar el rol del usuario.");
    }
  };

  const handleEliminarUsuario = async (idUsuario) => {
    if (!esAdmin) return;
    try {
      await apiUsuarios.eliminar(idUsuario);
      setUsuarios((prev) => prev.filter((u) => u.id !== idUsuario));
      mostrarExito("Usuario eliminado.");
    } catch (err) {
      setErrorApi(err.message || "No se pudo eliminar el usuario.");
    }
  };

  const pedidosPendientes = pedidos.filter((p) => p.estado === "En preparación").length;

  return (
    <div className="admin-dashboard-container">
      {/* Cabecera */}
      <div className="admin-header-section">
        <div>
          <h1>{esAdmin ? "PANEL ADMINISTRATIVO" : "GESTIÓN DE STOCK Y PEDIDOS"}</h1>
          <p className="m-0">
            Bienvenido, <strong className="text-white">{sesion?.nombre || sesion?.usuario}</strong> | Rol:{" "}
            <span className="badge bg-info text-dark">{sesion?.rol}</span>
          </p>
        </div>
        <button className="btn btn-outline-danger fw-bold btn-sm px-3 py-2" onClick={salir}>
          🚪 Cerrar sesión
        </button>
      </div>

      {mensajeApi && <div className="alert alert-success py-2">{mensajeApi}</div>}
      {errorApi && <div className="alert alert-danger py-2">{errorApi}</div>}

      {/* Tarjetas KPI de Resumen */}
      <div className="admin-kpi-grid">
        <div className="admin-kpi-card" onClick={() => setPestaña("productos")} style={{ cursor: "pointer" }}>
          <span className="kpi-label">Productos en Catálogo</span>
          <span className="kpi-number">{productos.length}</span>
        </div>
        <div className="admin-kpi-card" onClick={() => setPestaña("pedidos")} style={{ cursor: "pointer" }}>
          <span className="kpi-label">Pedidos Pendientes</span>
          <span className="kpi-number" style={{ color: pedidosPendientes > 0 ? "#ffc107" : "#0099ff" }}>
            {pedidosPendientes}
          </span>
        </div>
        {esAdmin && (
          <div className="admin-kpi-card" onClick={() => setPestaña("usuarios")} style={{ cursor: "pointer" }}>
            <span className="kpi-label">Usuarios Registrados</span>
            <span className="kpi-number" style={{ color: "#22c55e" }}>{usuarios.length}</span>
          </div>
        )}
      </div>

      {/* Navegación por pestañas */}
      <div className="btn-group mb-4 w-100 flex-wrap shadow-sm" role="group">
        <button
          className={`btn py-2.5 fw-bold ${
            pestaña === "pedidos" ? "btn-primary shadow" : "btn-dark text-light border-secondary"
          }`}
          onClick={() => setPestaña("pedidos")}
        >
          📦 Gestión de Pedidos ({pedidos.length})
        </button>

        <button
          className={`btn py-2.5 fw-bold ${
            pestaña === "productos" ? "btn-primary shadow" : "btn-dark text-light border-secondary"
          }`}
          onClick={() => setPestaña("productos")}
        >
          🎛️ Productos y Stock ({productos.length})
        </button>

        {esAdmin && (
          <button
            className={`btn py-2.5 fw-bold ${
              pestaña === "usuarios" ? "btn-primary shadow" : "btn-dark text-light border-secondary"
            }`}
            onClick={() => setPestaña("usuarios")}
          >
            👥 Usuarios y Roles ({usuarios.length})
          </button>
        )}
      </div>

      {/* PESTAÑA 1: GESTIÓN DE PEDIDOS */}
      {pestaña === "pedidos" && (
        <div className="admin-section-card">
          <h3 className="mb-3">Órdenes de Compra y Seguimiento</h3>
          {pedidos.length === 0 ? (
            <p className="text-secondary mb-0">No hay pedidos registrados en la base de datos actualmente.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle border-secondary mb-0">
                <thead>
                  <tr>
                    <th>N° Pedido</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Tipo Entrega</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Actualizar Estado</th>
                    {esAdmin && <th>Acción</th>}
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id}>
                      <td className="fw-bold text-primary">{p.id}</td>
                      <td>
                        <div><strong>{p.cliente?.nombre || p.clienteNombre}</strong></div>
                        <small className="text-secondary">{p.cliente?.email || p.clienteEmail}</small>
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
                              : p.estado === "Cancelado"
                              ? "bg-danger"
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
                          onChange={(e) => handleCambiarEstadoPedido(p.id, e.target.value)}
                        >
                          <option value="En preparación">En preparación</option>
                          <option value="Despachado">Despachado</option>
                          <option value="Entregado">Entregado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </td>
                      {esAdmin && (
                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleEliminarPedido(p.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: PRODUCTOS Y STOCK (CRUD COMPLETO) */}
      {pestaña === "productos" && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="admin-section-card h-100">
              <h3 className="mb-3">{modoEdicion ? `✏️ Editar ${formProd.codigo}` : "+ Nuevo Producto"}</h3>
              <form onSubmit={handleGuardarProducto}>
                <div className="mb-2">
                  <label className="form-label text-light fs-6">Código *</label>
                  <input
                    type="text"
                    required
                    disabled={modoEdicion}
                    placeholder="Ej: GA006"
                    className="form-control bg-dark text-light border-secondary"
                    value={formProd.codigo}
                    onChange={(e) => setFormProd({ ...formProd, codigo: e.target.value })}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label text-light fs-6">Nombre *</label>
                  <input
                    type="text"
                    required
                    className="form-control bg-dark text-light border-secondary"
                    value={formProd.nombre}
                    onChange={(e) => setFormProd({ ...formProd, nombre: e.target.value })}
                  />
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label text-light fs-6">Marca</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      value={formProd.marca}
                      onChange={(e) => setFormProd({ ...formProd, marca: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-light fs-6">Modelo</label>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      value={formProd.modelo}
                      onChange={(e) => setFormProd({ ...formProd, modelo: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label text-light fs-6">Categoría</label>
                  <select
                    className="form-select bg-dark text-light border-secondary"
                    value={formProd.categoria}
                    onChange={(e) => setFormProd({ ...formProd, categoria: e.target.value })}
                  >
                    {CATEGORIAS_PRODUCTO.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <label className="form-label text-light fs-6">Precio (CLP) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      className="form-control bg-dark text-light border-secondary"
                      value={formProd.precio}
                      onChange={(e) => setFormProd({ ...formProd, precio: e.target.value })}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label text-light fs-6">Stock *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      className="form-control bg-dark text-light border-secondary"
                      value={formProd.stock}
                      onChange={(e) => setFormProd({ ...formProd, stock: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label text-light fs-6">URL Imagen</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    className="form-control bg-dark text-light border-secondary"
                    value={formProd.imagen}
                    onChange={(e) => setFormProd({ ...formProd, imagen: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-light fs-6">Descripción</label>
                  <textarea
                    rows="2"
                    className="form-control bg-dark text-light border-secondary"
                    value={formProd.descripcion}
                    onChange={(e) => setFormProd({ ...formProd, descripcion: e.target.value })}
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="admin-btn-primary w-100 fw-bold py-2"
                    disabled={guardandoProd}
                  >
                    {guardandoProd
                      ? "Guardando..."
                      : modoEdicion
                      ? "Actualizar Producto"
                      : "Crear Producto"}
                  </button>
                  {modoEdicion && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary fw-bold"
                      onClick={handleCancelarEdicion}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="admin-section-card h-100">
              <h3 className="mb-3">Inventario en Bodega</h3>
              <div className="table-responsive" style={{ maxHeight: "520px", overflowY: "auto" }}>
                <table className="table table-dark table-striped align-middle border-secondary mb-0">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((prod) => {
                      const keyProd = prod.codigo || prod.id;
                      return (
                        <tr key={keyProd}>
                          <td className="fw-bold text-primary">{prod.codigo}</td>
                          <td>
                            <div className="text-white fw-bold">{prod.nombre}</div>
                            <small className="text-secondary">{prod.marca} · {prod.categoria}</small>
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
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-info"
                                onClick={() => handleSeleccionarEditar(prod)}
                              >
                                Editar
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEliminarProducto(keyProd)}
                              >
                                Eliminar
                              </button>
                            </div>
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

      {/* PESTAÑA 3: USUARIOS (SOLO ADMINISTRADOR) */}
      {pestaña === "usuarios" && esAdmin && (
        <div className="admin-section-card">
          <h3 className="mb-3">Usuarios Registrados en el Sistema (RBAC)</h3>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle border-secondary mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Usuario</th>
                  <th>Rol Actual</th>
                  <th>Cambiar Rol</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => {
                  const username = u.username || u.usuario;
                  const rolLegible = normalizarRol(u.rol);
                  const esMismoUsuario = username === sesion?.username;
                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td className="fw-bold text-white">{u.nombre}</td>
                      <td>{username}</td>
                      <td>
                        <span
                          className={`badge ${
                            rolLegible === "Administrador"
                              ? "bg-danger"
                              : rolLegible === "Vendedor"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {rolLegible}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm bg-dark text-light border-secondary"
                          value={String(u.rol).toUpperCase()}
                          disabled={esMismoUsuario}
                          onChange={(e) => handleCambiarRolUsuario(u.id, e.target.value)}
                        >
                          <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                          <option value="VENDEDOR">VENDEDOR</option>
                          <option value="CLIENTE">CLIENTE</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={esMismoUsuario}
                          onClick={() => handleEliminarUsuario(u.id)}
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
      )}
    </div>
  );
}
