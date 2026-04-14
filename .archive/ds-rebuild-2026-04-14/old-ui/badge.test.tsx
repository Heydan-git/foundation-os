import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import { Badge } from './badge'

describe('Badge (smoke)', () => {
  it('renders children', () => {
    const { getByText } = render(<Badge>Active</Badge>)
    expect(getByText('Active')).toBeInTheDocument()
  })

  it('renders variant', () => {
    const { getByText } = render(<Badge variant="secondary">Draft</Badge>)
    expect(getByText('Draft')).toBeInTheDocument()
  })

  it('is accessible', async () => {
    const { container } = render(<Badge>Active</Badge>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
