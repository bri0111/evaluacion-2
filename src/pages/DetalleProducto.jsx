import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { obtenerProductoPorId } from '../data/productos';

const precioCLP = (precio) =>
  precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export default function DetalleProducto() {
  const { id } = useParams();
  const producto = obtenerProductoPorId(id);

  const [favoritos, setFavoritos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('favoritos') || '[]'); }
    catch { return []; }
  });

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <h2>Producto no encontrado</h2>
        <Link to="/" className="btn btn-dark mt-3">Volver al inicio</Link>
      </div>
    );
  }

  const esFavorito = favoritos.includes(producto.id);

  function onAgregar(p) {
    const actual = JSON.parse(localStorage.getItem('carrito') || '[]');
    const existe = actual.find((i) => i.id === p.id);
    const nuevo = existe
      ? actual.map((i) => (i.id === p.id ? { ...i, cantidad: i.cantidad + 1 } : i))
      : [...actual, { ...p, cantidad: 1 }];
    localStorage.setItem('carrito', JSON.stringify(nuevo));
    alert('Producto agregado al carrito');
  }

  function onFavorito(pid) {
    const actual = favoritos.includes(pid)
      ? favoritos.filter((f) => f !== pid)
      : [...favoritos, pid];
    setFavoritos(actual);
    localStorage.setItem('favoritos', JSON.stringify(actual));
  }

  return (
    <div className="container py-5">
      <Link to="/" className="d-inline-block mb-4">← Volver</Link>
      <div className="row g-4">
        <div className="col-md-6">
          <div className={`product-visual ${producto.color}`} style={{ aspectRatio: '1 / 1' }}>
            {producto.imagen && (
              <img className="product-photo" src={producto.imagen} alt={producto.nombre} />
            )}
          </div>
        </div>
        <div className="col-md-6">
          <p className="product-category">{producto.categoria}</p>
          <h1>{producto.nombre}</h1>
          <p className="product-edition">{producto.detalle}</p>
          <p className="product-price fs-3">{precioCLP(producto.precio)}</p>
          <button className="add-button me-2" onClick={() => onAgregar(producto)}>
            <span>＋</span> AÑADIR AL CARRITO
          </button>
          <button
            className={`favorite-button ${esFavorito ? 'is-favorite' : ''}`}
            onClick={() => onFavorito(producto.id)}
            aria-pressed={esFavorito}
          >
            {esFavorito ? '♥' : '♡'}
          </button>
        </div>
      </div>
    </div>
  );
}