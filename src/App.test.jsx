import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('Componente Principal App', () => {
  it('Debe renderizarse sin errores', () => {
    const { container } = render(<App />)
    expect(container).toBeDefined()
  })
})