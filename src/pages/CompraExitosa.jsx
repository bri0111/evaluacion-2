import { Link } from 'react-router-dom';

export default function CompraExitosa() {
  const codigo = `ORDEN-${Math.floor(Math.random() * 999999)}`;
  return (
    <div className="container py-5 text-center">
      <h1 className="text-success">✓ Se ha realizado la compra</h1>
      <p>Código de orden: <strong>{codigo}</strong></p>
      <Link to="/" className="btn btn-dark mt-3">Volver a la tienda</Link>
    </div>
  );
}