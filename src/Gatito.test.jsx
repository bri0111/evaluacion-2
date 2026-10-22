import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Gatito from './Gatito' 

describe('Componente Gatito', () => {
  it('Debe renderizarse correctamente en el DOM', () => {
    const { container } = render(<Gatito />)
    expect(container).not.toBeEmptyDOMElement()
  })
})