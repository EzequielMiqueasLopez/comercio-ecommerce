import { useEffect, useState } from 'react';
import { pedidoService } from '../api/pedidoService';
import { productoService } from '../api/productoService';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { EstadoPedido } from '../components/EstadoPedido';

const ESTADOS = ['pendiente', 'pagado', 'enviado', 'cancelado'];

export function PedidosPage() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [itemsNuevoPedido, setItemsNuevoPedido] = useState([]);

  const cargarTodo = async () => {
    setCargando(true);
    try {
      // El rol "pedidos" no tiene permiso para ver /productos, así que
      // solo se pide el catálogo cuando quien mira la pantalla es admin
      // (el único que puede armar un pedido nuevo).
      const [listaPedidos, listaProductos] = await Promise.all([
        pedidoService.listar(),
        esAdmin ? productoService.listar() : Promise.resolve([])
      ]);
      setPedidos(listaPedidos);
      setProductos(listaProductos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const agregarItem = () => {
    if (!productoSeleccionado || cantidad < 1) return;
    setItemsNuevoPedido([...itemsNuevoPedido, { productoId: productoSeleccionado, cantidad: Number(cantidad) }]);
    setProductoSeleccionado('');
    setCantidad(1);
  };

  const quitarItem = (index) => {
    setItemsNuevoPedido(itemsNuevoPedido.filter((_, i) => i !== index));
  };

  const nombreProducto = (id) => productos.find((p) => p.id === id)?.nombre || id;

  const crearPedido = async () => {
    setError('');
    setMensajeExito('');
    if (itemsNuevoPedido.length === 0) {
      setError('Agrega al menos un producto al pedido.');
      return;
    }
    try {
      await pedidoService.crear({ usuarioId: usuario.id, items: itemsNuevoPedido });
      setItemsNuevoPedido([]);
      setMensajeExito(
        'Pedido registrado como "Pendiente de pago". Te enviamos un correo con el desglose de tu compra y las instrucciones de pago.'
      );
      cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  };

  const cambiarEstado = async (id, estado) => {
    try {
      await pedidoService.actualizarEstado(id, estado);
      cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este pedido?')) return;
    try {
      await pedidoService.eliminar(id);
      cargarTodo();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="contenido">
        <div className="encabezado-pagina">
          <h1>Pedidos</h1>
          <p>Arma un pedido nuevo eligiendo productos del catálogo, y consulta los ya registrados.</p>
        </div>

        {error && <div className="mensaje-error">{error}</div>}
        {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}

        {!esAdmin && (
          <p className="vacio" style={{ padding: '0 0 20px' }}>
            Tu rol solo tiene permiso para consultar el historial de pedidos.
          </p>
        )}

        {esAdmin && (
        <>
        <h2 style={{ marginBottom: 14 }}>Nuevo pedido</h2>
        <div className="form-panel" style={{ maxWidth: 520 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div className="campo" style={{ flex: 1, marginBottom: 0 }}>
              <label htmlFor="producto">Producto</label>
              <select id="producto" value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)}>
                <option value="">Selecciona…</option>
                {productos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} — ${Number(p.precio).toFixed(2)} (stock: {p.stock})
                  </option>
                ))}
              </select>
            </div>
            <div className="campo" style={{ width: 90, marginBottom: 0 }}>
              <label htmlFor="cantidad">Cant.</label>
              <input id="cantidad" type="number" min="1" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
            </div>
            <button type="button" className="btn btn-secundario" onClick={agregarItem}>
              Agregar
            </button>
          </div>

          {itemsNuevoPedido.length > 0 && (
            <div className="lista-filas" style={{ marginTop: 18 }}>
              {itemsNuevoPedido.map((item, i) => (
                <div className="fila" key={i}>
                  <span className="fila-titulo">{nombreProducto(item.productoId)}</span>
                  <span className="fila-detalle">x{item.cantidad}</span>
                  <button className="btn btn-peligro" onClick={() => quitarItem(i)}>Quitar</button>
                </div>
              ))}
            </div>
          )}

          <button
            className="btn btn-primario"
            style={{ marginTop: 16 }}
            onClick={crearPedido}
            disabled={itemsNuevoPedido.length === 0}
          >
            Confirmar pedido
          </button>
        </div>
        </>
        )}

        <h2 style={{ margin: '32px 0 4px' }}>Historial ({pedidos.length})</h2>
        {cargando ? (
          <p className="vacio">Cargando pedidos…</p>
        ) : pedidos.length === 0 ? (
          <p className="vacio">Aún no hay pedidos registrados.</p>
        ) : (
          <div className="lista-filas">
            {pedidos.map((pedido) => (
              <div className="fila" key={pedido.id}>
                <div className="fila-principal">
                  <span className="fila-titulo dato">#{pedido.id.slice(0, 8)}</span>
                  <span className="fila-detalle">
                    {pedido.items.length} producto(s) · <EstadoPedido estado={pedido.estado} />
                  </span>
                </div>
                <span className="fila-precio">${Number(pedido.total).toFixed(2)}</span>
                {esAdmin && (
                  <div className="fila-acciones">
                    <select
                      value={pedido.estado}
                      onChange={(e) => cambiarEstado(pedido.id, e.target.value)}
                    >
                      {ESTADOS.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                    <button className="btn btn-peligro" onClick={() => eliminar(pedido.id)}>Eliminar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
