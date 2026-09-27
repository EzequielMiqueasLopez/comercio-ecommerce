import { useEffect, useState } from 'react';
import { productoService } from '../api/productoService';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const FORM_VACIO = { nombre: '', descripcion: '', precio: '', stock: '' };

export function ProductosPage() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const data = await productoService.listar();
      setProductos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const actualizarCampo = (campo) => (e) => setForm({ ...form, [campo]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    const datos = { ...form, precio: Number(form.precio), stock: Number(form.stock) };
    try {
      if (editandoId) {
        await productoService.actualizar(editandoId, datos);
      } else {
        await productoService.crear(datos);
      }
      setForm(FORM_VACIO);
      setEditandoId(null);
      cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  };

  const editar = (producto) => {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio,
      stock: producto.stock
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(FORM_VACIO);
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este producto del catálogo?')) return;
    try {
      await productoService.eliminar(id);
      cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="contenido">
        <div className="encabezado-pagina">
          <h1>Catálogo</h1>
          <p>Gestiona los productos disponibles: nombre, precio e inventario.</p>
        </div>

        {error && <div className="mensaje-error">{error}</div>}

        {!esAdmin && (
          <p className="vacio" style={{ padding: '0 0 20px' }}>
            Tu rol solo tiene permiso para consultar el catálogo, no para modificarlo.
          </p>
        )}

        {esAdmin && (
        <>
        <h2 style={{ marginBottom: 14 }}>{editandoId ? 'Editar producto' : 'Agregar producto'}</h2>
        <form onSubmit={enviar} className="form-panel">
          <div className="campo">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" required value={form.nombre} onChange={actualizarCampo('nombre')} />
          </div>
          <div className="campo">
            <label htmlFor="descripcion">Descripción</label>
            <textarea id="descripcion" rows={2} value={form.descripcion} onChange={actualizarCampo('descripcion')} />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="campo" style={{ flex: 1 }}>
              <label htmlFor="precio">Precio</label>
              <input id="precio" type="number" min="0.01" step="0.01" required value={form.precio} onChange={actualizarCampo('precio')} />
            </div>
            <div className="campo" style={{ flex: 1 }}>
              <label htmlFor="stock">Stock</label>
              <input id="stock" type="number" min="0" required value={form.stock} onChange={actualizarCampo('stock')} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primario" type="submit">
              {editandoId ? 'Guardar cambios' : 'Agregar al catálogo'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-secundario" onClick={cancelarEdicion}>
                Cancelar
              </button>
            )}
          </div>
        </form>
        </>
        )}

        <h2 style={{ margin: '32px 0 4px' }}>Productos ({productos.length})</h2>
        {cargando ? (
          <p className="vacio">Cargando catálogo…</p>
        ) : productos.length === 0 ? (
          <p className="vacio">Aún no hay productos. Agrega el primero arriba.</p>
        ) : (
          <div className="lista-filas">
            {productos.map((p) => (
              <div className="fila" key={p.id}>
                <div className="fila-principal">
                  <span className="fila-titulo">{p.nombre}</span>
                  <span className="fila-detalle">
                    {p.descripcion ? `${p.descripcion} · ` : ''}stock: {p.stock}
                  </span>
                </div>
                <span className="fila-precio">${Number(p.precio).toFixed(2)}</span>
                {esAdmin && (
                  <div className="fila-acciones">
                    <button className="btn btn-secundario" onClick={() => editar(p)}>Editar</button>
                    <button className="btn btn-peligro" onClick={() => eliminar(p.id)}>Eliminar</button>
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
