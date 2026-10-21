import { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Gatito from "./Gatito";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from './data/productos';

import DetalleProducto from './pages/DetalleProducto';
import Checkout from './pages/Checkout';
import CompraExitosa from './pages/CompraExitosa';
import CompraError from './pages/CompraError';
import Admin from './pages/Admin';

const categorias = [
  'Todas',
  'Poleras',
  'Pantalones',
  'Chaquetas',
  'Zapatos',
  'Calzado',
];

const precioCLP = (precio) =>
  precio.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  });

function ProductCard({ producto, favorito, onFavorito, onAgregar }) {
  return (
    <article className="col-6 col-md-4 col-xl-3">
      <div className="product-card h-100">
        <div className={`product-visual ${producto.color}`}>
          <Link to={`/producto/${producto.id}`}>
            {producto.imagen && (
              <img
                className="product-photo"
                src={producto.imagen}
                alt={producto.nombre}
                loading="lazy"
              />
            )}
          </Link>
          
          <span className="product-edition">{producto.detalle}</span>

          <button
            className={`favorite-button ${favorito ? 'is-favorite' : ''}`}
            onClick={() => onFavorito(producto.id)}
            aria-label={favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            aria-pressed={favorito}
          >
            {favorito ? '♥' : '♡'}
          </button>

          <span className="product-symbol" aria-hidden="true">
            {producto.emoji}
          </span>

          <span className="product-image-caption">NOSTALGIE ARCHIVE</span>
        </div>

        <div className="product-info">
          <p className="product-category">{producto.categoria}</p>
          <h3>{producto.nombre}</h3>
          <p className="product-price">{precioCLP(producto.precio)}</p>
          <button className="add-button" onClick={() => onAgregar(producto)}>
            <span>＋</span> AÑADIR AL CARRITO
          </button>
        </div>
      </div>
    </article>
  );
}

function Tienda() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [productos, setProductos] = useState(() => obtenerProductos());
  const [categoria, setCategoria] = useState('Todas');
  const [carrito, setCarrito] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    try {
      const c = localStorage.getItem('carrito');
      const f = localStorage.getItem('favoritos');
      if (c) setCarrito(JSON.parse(c));
      if (f) setFavoritos(JSON.parse(f));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  }, [favoritos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase().trim());

      const coincideCategoria =
        categoria === 'Todas' || producto.categoria === categoria;

      return coincideNombre && coincideCategoria;
    });
  }, [productos, busqueda, categoria]);

  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  const cantidadCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  function agregarAlCarrito(producto) {
    setCarrito((actual) => {
      const existe = actual.find((item) => item.id === producto.id);

      if (existe) {
        return actual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...actual, { ...producto, cantidad: 1 }];
    });

    setCarritoAbierto(true);
  }

  function cambiarCantidad(id, cambio) {
    setCarrito((actual) =>
      actual
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: item.cantidad + cambio }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function quitarDelCarrito(id) {
    setCarrito((actual) => actual.filter((item) => item.id !== id));
  }

  function alternarFavorito(id) {
    setFavoritos((actual) =>
      actual.includes(id)
        ? actual.filter((favorito) => favorito !== id)
        : [...actual, id]
    );
  }

  return (
    <>
      <nav className="topbar">
        <div className="container-fluid shop-nav">
          <button
            className="mobile-menu"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
          >
            ☰
          </button>

          <a href="#inicio" className="brand" aria-label="Nostalgia, inicio">
            <span className="brand-japanese">ノスタルジー</span>
            <span className="brand-roman">N O S T A L G I A</span>
          </a>

          <div className={`nav-links ${menuAbierto ? 'nav-open' : ''}`}>
            <a href="#inicio" onClick={() => setMenuAbierto(false)}>Inicio</a>
            <a href="#catalogo" onClick={() => setMenuAbierto(false)}>Tienda</a>
            <a href="#catalogo" onClick={() => setMenuAbierto(false)}>Categorías</a>
            <a href="#nosotros" onClick={() => setMenuAbierto(false)}>Nosotros</a>
          </div>

          <div className="nav-actions">
            <button
              onClick={() => {
                document.getElementById('busqueda')?.focus();
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }}
              aria-label="Buscar productos"
            >
              ⌕
            </button>

            <button
              onClick={() => {
                setCarritoAbierto(true);
              }}
              aria-label={`Abrir carrito con ${cantidadCarrito} productos`}
              className="nav-cart"
            >
              ♧ <span className="cart-count">{cantidadCarrito}</span>
            </button>
          </div>
        </div>
      </nav>

      <main>
        <header className="hero" id="inicio">
          <div className="hero-image" role="img" aria-label="Ilustración editorial de moda alternativa estilo manga" />
          <div className="hero-shade" />

          <div className="hero-copy">
            <p className="eyebrow">
              MODA ALTERNATIVA <span>·</span> COLECCIÓN 01
            </p>

            <h1 className="hero-japanese">ノスタルジー</h1>
            <p className="hero-english">N O S T A L G I A</p>

            <p className="hero-description">
              Prendas que evocan recuerdos,
              <br />
              pero viven en el presente.
            </p>

            <a href="#catalogo" className="hero-cta">
              EXPLORAR COLECCIÓN <span>→</span>
            </a>
          </div>

          <div className="hero-vertical-note">STYLE IS A MEMORY IN MOTION</div>
          <span className="hero-rose rose-one" aria-hidden="true">✿</span>

          <div className="hero-bottom-line">
            <span>ESTILO　×　MÚSICA　×　LIBERTAD</span>
            <span className="hero-bottom-quote">La nostalgia también es una forma de avanzar.</span>
          </div>
        </header>

        <section className="collection-section" id="catalogo">
          <div className="container-fluid collection-layout">
            <div className="collection-main">
              <div className="collection-heading">
                <div>
                  <p className="eyebrow">SELECCIÓN EDITORIAL</p>
                  <h2>Nuestra Colección<span>.</span></h2>
                  <p className="collection-subtitle">
                    Descubre prendas únicas, inspiradas en la rebeldía, el arte y la nostalgia.
                  </p>
                </div>
                <p className="product-count">{productosFiltrados.length} productos</p>
              </div>

              <div className="catalog-controls">
                <div className="search-field">
                  <label className="visually-hidden" htmlFor="busqueda">Buscar prendas</label>
                  <input
                    id="busqueda"
                    type="search"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="⌕  Buscar prendas..."
                  />
                </div>

                <div className="category-field">
                  <label className="visually-hidden" htmlFor="categoria">Categoría</label>
                  <select
                    id="categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    {categorias.map((nombre) => (
                      <option key={nombre} value={nombre}>
                        {nombre === 'Todas' ? 'Todas las categorías' : nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="row g-3 g-lg-4">
                {productosFiltrados.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    favorito={favoritos.includes(producto.id)}
                    onFavorito={alternarFavorito}
                    onAgregar={agregarAlCarrito}
                  />
                ))}
              </div>

              {productosFiltrados.length === 0 && (
                <div className="no-results">
                  <span>✿</span>
                  <h3>No encontramos esa prenda.</h3>
                  <p>Prueba con otro nombre o categoría.</p>
                  <button
                    className="add-button reset-button"
                    onClick={() => {
                      setBusqueda('');
                      setCategoria('Todas');
                    }}
                  >
                    VER TODA LA COLECCIÓN
                  </button>
                </div>
              )}
            </div>

            <aside className="cart-preview">
              <h2>♧ Tu carrito<span className="cart-count">{cantidadCarrito}</span></h2>

              {carrito.length === 0 ? (
                <div className="preview-empty">
                  <span>♡</span>
                  <p>Tu próxima pieza favorita te está esperando.</p>
                  <button onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })}>
                    EXPLORAR TIENDA →
                  </button>
                </div>
              ) : (
                <>
                  <div className="preview-items">
                    {carrito.slice(0, 3).map((item) => (
                      <div className="preview-item" key={item.id}>
                        <div className={`preview-thumb ${item.color}`}>
                          {item.imagen ? (
                            <img
                              className="cart-thumb-photo"
                              src={item.imagen}
                              alt={item.nombre}
                              loading="lazy"
                            />
                          ) : (
                            <span aria-hidden="true">{item.emoji}</span>
                          )}
                        </div>
                        <div className="preview-item-info">
                          <strong>{item.nombre}</strong>
                          <span>{precioCLP(item.precio)}</span>
                          <div className="quantity-controls">
                            <button onClick={() => cambiarCantidad(item.id, -1)} aria-label={`Reducir ${item.nombre}`}>−</button>
                            <span>{item.cantidad}</span>
                            <button onClick={() => cambiarCantidad(item.id, 1)} aria-label={`Aumentar ${item.nombre}`}>＋</button>
                            <button className="remove-item" onClick={() => quitarDelCarrito(item.id)} aria-label={`Eliminar ${item.nombre}`}>♲</button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {carrito.length > 3 && (
                      <p className="more-items">Y {carrito.length - 3} artículos más...</p>
                    )}
                  </div>

                  <div className="preview-total">
                    <span>Total:</span>
                    <strong>{precioCLP(totalCarrito)}</strong>
                  </div>

                  <button className="checkout-button" onClick={() => setCarritoAbierto(true)}>
                    REVISAR CARRITO →
                  </button>
                  <button className="clear-cart" onClick={() => setCarrito([])}>
                    ♲ Vaciar carrito
                  </button>
                </>
              )}
            </aside>
          </div>
        </section>

        <section className="service-strip">
          <div className="container-fluid service-grid">
            <div className="service-item">
              <span className="service-icon">♧</span>
              <div><strong>Envíos a todo Chile</strong><p>Información de envío por confirmar</p></div>
            </div>
            <div className="service-item">
              <span className="service-icon">♢</span>
              <div><strong>Compra protegida</strong><p>Pagos reales aún no habilitados</p></div>
            </div>
            <div className="service-item">
              <span className="service-icon">☆</span>
              <div><strong>Estilo original</strong><p>Encuentra tu identidad</p></div>
            </div>
            <div className="service-item">
              <span className="service-icon">☏</span>
              <div><strong>Atención personal</strong><p>Próximamente</p></div>
            </div>
          </div>
        </section>

        <section className="about-section" id="nosotros">
          <div className="container">
            <p className="eyebrow">NUESTRA FILOSOFÍA</p>
            <h2>El pasado también<br /><em>se viste.</em></h2>
            <p>
              ノスタルジー nace de la mezcla entre la moda alternativa,
              las historias dibujadas y la libertad de construir un estilo propio.
            </p>
            <a href="#catalogo">ENCUENTRA TU ESTILO ↗</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container-fluid footer-main">
          <a href="#inicio" className="footer-brand">
            <span>ノスタルジー</span>
            <small>N O S T A L G I A</small>
          </a>

          <div className="footer-links">
            <a href="#nosotros">Nosotros</a>
            <a href="#catalogo">Tienda</a>
            <a href="#inicio">Volver arriba ↑</a>
          </div>

          <div className="footer-social">
            <span>✧</span><span>♡</span><span>✿</span>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} ノスタルジー — NOSTALGIA
          <span>MODA · IDENTIDAD · LIBERTAD</span>
        </div>
      </footer>

      {carritoAbierto && (
        <div className="drawer-backdrop" onClick={() => setCarritoAbierto(false)}>
          <aside
            className="cart-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Tu carrito"
          >
            <div className="drawer-header">
              <div>
                <p className="eyebrow">TU SELECCIÓN</p>
                <h2>Tu carrito<span>.</span></h2>
              </div>
              <button onClick={() => setCarritoAbierto(false)} aria-label="Cerrar carrito">×</button>
            </div>

            {carrito.length === 0 ? (
              <div className="drawer-empty">
                <span>♡</span>
                <p>Tu carrito está vacío.</p>
                <button className="checkout-button" onClick={() => setCarritoAbierto(false)}>
                  VOLVER A LA TIENDA
                </button>
              </div>
            ) : (
              <>
                <div className="drawer-items">
                  {carrito.map((item) => (
                    <div className="drawer-item" key={item.id}>
                      <div className={`drawer-thumb ${item.color}`}>
                        {item.imagen ? (
                          <img
                            className="cart-thumb-photo"
                            src={item.imagen}
                            alt={item.nombre}
                            loading="lazy"
                          />
                        ) : (
                          <span aria-hidden="true">{item.emoji}</span>
                        )}
                      </div>
                      <div className="drawer-item-content">
                        <strong>{item.nombre}</strong>
                        <span>{precioCLP(item.precio)}</span>
                        <div className="quantity-controls">
                          <button onClick={() => cambiarCantidad(item.id, -1)} aria-label="Reducir cantidad">−</button>
                          <span>{item.cantidad}</span>
                          <button onClick={() => cambiarCantidad(item.id, 1)} aria-label="Aumentar cantidad">＋</button>
                          <button className="remove-item" onClick={() => quitarDelCarrito(item.id)}>Eliminar</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="drawer-footer">
                  <div className="preview-total">
                    <span>Total</span>
                    <strong>{precioCLP(totalCarrito)}</strong>
                  </div>
                  <p>Demostración académica. No se realizará ningún cobro.</p>
                  <button
                    className="checkout-button"
                    onClick={() => {
                      setCarritoAbierto(false);
                      navigate('/checkout');
                    }}
                  >
                    CONTINUAR →
                  </button>
                  <button className="clear-cart" onClick={() => setCarrito([])}>
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
     <Gatito />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Tienda />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/compra-exitosa" element={<CompraExitosa />} />
        <Route path="/compra-error" element={<CompraError />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}