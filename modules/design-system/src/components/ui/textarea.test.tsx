import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Textarea } from './textarea'

describe('Textarea (smoke)', () => {
  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(<Textarea placeholder="Message" />)
    expect(getByPlaceholderText('Message')).toBeInTheDocument()
  })

  it('renders disabled state', () => {
    const { getByPlaceholderText } = render(<Textarea placeholder="Message" disabled />)
    expect(getByPlaceholderText('Message')).toBeDisabled()
  })

  it('is accessible', async () => {
    const { container } = render(
      <label>
        Message
        <Textarea placeholder="Message" />
      </label>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
