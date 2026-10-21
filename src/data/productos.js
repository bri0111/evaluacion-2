const STORAGE_KEY = 'nostalgia_productos';

export const productosIniciales = [
  { id: 1, nombre: 'Abrigo Otoño', categoria: 'Abrigos', precio: 35000, emoji: '♠', color: 'product-wine', detalle: 'ESSENTIALS / 01', imagen: '/ropa/image1.png' },
  { id: 2, nombre: 'Corset Bonnie', categoria: 'Poleras', precio: 18990, emoji: '♜', color: 'product-stone', detalle: 'DENIM / 02', imagen: '/ropa/image2.png' },
  { id: 3, nombre: 'Blusa Primaveral', categoria: 'Poleras', precio: 18990, emoji: '✦', color: 'product-black', detalle: 'AFTER DARK / 03', imagen: '/ropa/image3.png' },
  { id: 4, nombre: 'Blusa Occidental', categoria: 'Poleras', precio: 15990, emoji: '♛', color: 'product-rose', detalle: 'ROMANTIC / 04', imagen: '/ropa/image4.png' },
  { id: 5, nombre: 'Chaqueta de cuero Rose', categoria: 'Chaquetas', precio: 38990, emoji: '☾', color: 'product-wine', detalle: 'JEWELLERY / 05', imagen: '/ropa/image5.png' },
  { id: 6, nombre: 'Pantalon Secret', categoria: 'Pantalones', precio: 27990, emoji: '✧', color: 'product-black', detalle: 'SHOES / 06', imagen: '/ropa/image7.png' },
  { id: 7, nombre: 'Falda Cat', categoria: 'Chaquetas', precio: 12990, emoji: '❋', color: 'product-rose', detalle: 'STATEMENT / 07', imagen: '/ropa/image8.png' },
  { id: 8, nombre: 'Botas Cat', categoria: 'Zapatos', precio: 32990, emoji: '♡', color: 'product-stone', detalle: 'ACCESSORIES / 08', imagen: '/ropa/image9.png' },
];

function cargar() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    return guardado ? JSON.parse(guardado) : [...productosIniciales];
  } catch {
    return [...productosIniciales];
  }
}

function guardar(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

export function obtenerProductos() {
  return cargar();
}

export function obtenerProductoPorId(id) {
  return cargar().find((p) => p.id === Number(id));
}

export function crearProducto(producto) {
  const lista = cargar();
  const nuevo = { ...producto, id: Date.now() };
  guardar([...lista, nuevo]);
  return nuevo;
}

export function actualizarProducto(id, cambios) {
  const lista = cargar();
  const index = lista.findIndex((p) => p.id === Number(id));
  if (index === -1) return null;
  lista[index] = { ...lista[index], ...cambios };
  guardar(lista);
  return lista[index];
}

export function eliminarProducto(id) {
  const lista = cargar();
  const nueva = lista.filter((p) => p.id !== Number(id));
  guardar(nueva);
  return nueva.length < lista.length;
}