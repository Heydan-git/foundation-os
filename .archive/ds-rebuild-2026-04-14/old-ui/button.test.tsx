import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Button } from './button'

describe('Button (smoke)', () => {
  it('renders children', () => {
    const { getByRole } = render(<Button>click me</Button>)
    expect(getByRole('button')).toHaveTextContent('click me')
  })

  it('is accessible', async () => {
    const { container } = render(<Button>click me</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
