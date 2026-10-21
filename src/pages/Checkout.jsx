import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const precioCLP = (precio) =>
  precio.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export default function Checkout() {
  const navigate = useNavigate();
  
  const [carrito] = useState(() => {
    try { return JSON.parse(localStorage.getItem('carrito') || '[]'); }
    catch { return []; }
  });

  const totalCarrito = carrito.reduce((t, i) => t + i.precio * i.cantidad, 0);

  const [datos, setDatos] = useState({
    nombre: '', apellido: '', correo: '',
    calle: '', departamento: '', region: '', comuna: '', indicaciones: '',
  });

  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  }

  function manejarEnvio(e) {
    e.preventDefault();
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }
    const exito = Math.random() > 0.2;
    if (exito) {
      localStorage.setItem('carrito', '[]');
      navigate('/compra-exitosa');
    } else {
      navigate('/compra-error');
    }
  }

  if (carrito.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Tu carrito está vacío</h2>
        <Link to="/" className="btn btn-dark mt-3">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      
      <Link 
        to="/" 
        className="d-inline-block mb-4 text-decoration-none" 
        style={{ color: '#d88a9d', fontWeight: 'bold' }}
      >
        ← Volver a la tienda
      </Link>

      <h1>Carrito de compra</h1>
      <p>Completa la siguiente información</p>

      <table className="table">
        <thead>
          <tr>
            <th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {carrito.map((item) => (
            <tr key={item.id}>
              <td>
                {item.imagen && (
                  <img src={item.imagen} alt={item.nombre} style={{ width: 50, height: 50, objectFit: 'cover' }} />
                )}
              </td>
              <td>{item.nombre}</td>
              <td>{precioCLP(item.precio)}</td>
              <td>{item.cantidad}</td>
              <td>{precioCLP(item.precio * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-4">Información del cliente</h3>
      <form onSubmit={manejarEnvio}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nombre*</label>
            <input className="form-control" name="nombre" value={datos.nombre} onChange={manejarCambio} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Apellidos*</label>
            <input className="form-control" name="apellido" value={datos.apellido} onChange={manejarCambio} required />
          </div>
          <div className="col-12">
            <label className="form-label">Correo*</label>
            <input type="email" className="form-control" name="correo" value={datos.correo} onChange={manejarCambio} required />
          </div>
        </div>

        <h3 className="mt-4">Dirección de entrega</h3>
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label">Calle*</label>
            <input className="form-control" name="calle" value={datos.calle} onChange={manejarCambio} required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Departamento</label>
            <input className="form-control" name="departamento" value={datos.departamento} onChange={manejarCambio} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Región*</label>
            <input className="form-control" name="region" value={datos.region} onChange={manejarCambio} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Comuna*</label>
            <input className="form-control" name="comuna" value={datos.comuna} onChange={manejarCambio} required />
          </div>
          <div className="col-12">
            <label className="form-label">Indicaciones para la entrega</label>
            <textarea className="form-control" name="indicaciones" rows="3" value={datos.indicaciones} onChange={manejarCambio} />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <strong className="fs-4">Total a pagar: {precioCLP(totalCarrito)}</strong>
          
          <button 
            type="submit" 
            className="btn btn-lg"
            style={{ 
              backgroundColor: '#d88a9d', 
              color: '#ffffff', 
              border: 'none', 
              fontWeight: 'bold' 
            }}
          >
            Pagar ahora
          </button>
          
        </div>
      </form>
    </div>
  );
}