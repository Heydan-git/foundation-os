import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Input } from './input'

describe('Input (smoke)', () => {
  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Email" />)
    expect(getByPlaceholderText('Email')).toBeInTheDocument()
  })

  it('renders disabled state', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Email" disabled />)
    expect(getByPlaceholderText('Email')).toBeDisabled()
  })

  it('is accessible', async () => {
    const { container } = render(
      <label>
        Email
        <Input placeholder="Email" />
      </label>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
