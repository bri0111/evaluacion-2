import { useState } from 'react';
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from '../data/productos';

const precioCLP = (precio) =>
  precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export default function Admin() {
  const [productos, setProductos] = useState(() => obtenerProductos());
  const [form, setForm] = useState({ nombre: '', categoria: '', precio: '', imagen: '' });
  const [editandoId, setEditandoId] = useState(null);

  function refrescar() {
    setProductos(obtenerProductos());
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function guardar(e) {
    e.preventDefault();
    const datos = { ...form, precio: Number(form.precio), emoji: '✦', color: 'product-stone', detalle: 'ADMIN / NUEVO' };
    if (editandoId) {
      actualizarProducto(editandoId, datos);
    } else {
      crearProducto(datos);
    }
    setForm({ nombre: '', categoria: '', precio: '', imagen: '' });
    setEditandoId(null);
    refrescar();
  }

  function editar(p) {
    setForm({ nombre: p.nombre, categoria: p.categoria, precio: String(p.precio), imagen: p.imagen || '' });
    setEditandoId(p.id);
  }

  function eliminar(id) {
    if (!confirm('¿Eliminar este producto?')) return;
    eliminarProducto(id);
    refrescar();
  }

  return (
    <div className="container py-5">
      <h1>Panel Administrador</h1>
      <p>Gestión de productos</p>

      <form onSubmit={guardar} className="row g-2 mb-4">
        <div className="col-md-3">
          <input className="form-control" name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambio} required />
        </div>
        <div className="col-md-3">
          <input className="form-control" name="categoria" placeholder="Categoría" value={form.categoria} onChange={manejarCambio} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" name="precio" type="number" placeholder="Precio" value={form.precio} onChange={manejarCambio} required />
        </div>
        <div className="col-md-2">
          <input className="form-control" name="imagen" placeholder="/ropa/imageX.png" value={form.imagen} onChange={manejarCambio} />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">{editandoId ? 'Actualizar' : 'Crear'}</button>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr><th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.imagen && <img src={p.imagen} alt={p.nombre} style={{ width: 50, height: 50, objectFit: 'cover' }} />}</td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>{precioCLP(p.precio)}</td>
              <td>
                <button className="btn btn-sm btn-primary me-2" onClick={() => editar(p)}>Editar</button>
                <button className="btn btn-sm btn-danger" onClick={() => eliminar(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}