import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import IndexPage from '@/pages/IndexPage'

describe('IndexPage', () => {
  it('renders the page title', () => {
    render(
      <BrowserRouter>
        <IndexPage />
      </BrowserRouter>
    )
    expect(screen.getByText(/Vue d.ensemble/)).toBeInTheDocument()
  })
})
