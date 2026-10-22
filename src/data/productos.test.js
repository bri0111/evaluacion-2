import { describe, it, expect } from 'vitest'
import { productosIniciales, obtenerProductos } from './productos'

describe('Pruebas sobre los datos de productos', () => {
  it('Debe existir un arreglo de productos iniciales', () => {
    expect(Array.isArray(productosIniciales)).toBe(true)
    expect(productosIniciales.length).toBeGreaterThan(0)
  })

  it('Cada producto debe tener las propiedades correctas', () => {
    const primerProducto = productosIniciales[0]
    expect(primerProducto).toHaveProperty('id')
    expect(primerProducto).toHaveProperty('nombre')
    expect(primerProducto).toHaveProperty('precio')
  })

  it('La función obtenerProductos debe devolver una lista', () => {
    const lista = obtenerProductos()
    expect(Array.isArray(lista)).toBe(true)
  })
})