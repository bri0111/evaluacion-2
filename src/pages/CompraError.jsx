import { Link } from 'react-router-dom';

export default function CompraError() {
  return (
    <div className="container py-5 text-center">
      <h1 className="text-danger">✗ No se pudo realizar el pago</h1>
      <p>Por favor, intenta nuevamente.</p>
      <Link to="/checkout" className="btn btn-success mt-3">Volver a realizar el pago</Link>
    </div>
  );
}