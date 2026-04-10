/**
 * Foundation OS — Design System
 * Text.test — render + as mapping + variants + weight/color overrides + a11y.
 */
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Text } from './Text'

describe('Text — variant to HTML element mapping', () => {
  it('renders h1 variant as <h1>', () => {
    render(<Text variant="h1">Title</Text>)
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeInTheDocument()
  })

  it('renders h2 variant as <h2>', () => {
    render(<Text variant="h2">Title</Text>)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders h3 variant as <h3>', () => {
    render(<Text variant="h3">Title</Text>)
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
  })

  it('renders body variant as <p>', () => {
    const { container } = render(<Text variant="body">para</Text>)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('renders body-small variant as <p>', () => {
    const { container } = render(<Text variant="body-small">small</Text>)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('renders label variant as <span>', () => {
    const { container } = render(<Text variant="label">label</Text>)
    expect(container.querySelector('span')).toBeInTheDocument()
  })

  it('renders code variant as <code>', () => {
    const { container } = render(<Text variant="code">x=1</Text>)
    expect(container.querySelector('code')).toBeInTheDocument()
  })
})

describe('Text — as prop override', () => {
  it('renders h1 variant inside a <div> when as="div"', () => {
    const { container } = render(
      <Text variant="h1" as="div">
        NotAHeading
      </Text>
    )
    expect(container.querySelector('div')).toBeInTheDocument()
    expect(container.querySelector('h1')).not.toBeInTheDocument()
  })

  it('renders body variant as <span> when as="span"', () => {
    const { container } = render(
      <Text variant="body" as="span">
        inline
      </Text>
    )
    expect(container.querySelector('span')).toBeInTheDocument()
  })
})

describe('Text — className composition', () => {
  it('applies variant className', () => {
    const { container } = render(<Text variant="h1">x</Text>)
    expect(container.firstElementChild?.className).toMatch(/variant-h1/)
  })

  it('applies color className', () => {
    const { container } = render(<Text color="muted" variant="h1">x</Text>)
    expect(container.firstElementChild?.className).toMatch(/color-muted/)
  })

  it('applies weight override', () => {
    const { container } = render(
      <Text variant="body" weight="bold">
        x
      </Text>
    )
    expect(container.firstElementChild?.className).toMatch(/weight-bold/)
  })

  it('merges user-provided className', () => {
    const { container } = render(
      <Text variant="body" className="custom-class">
        x
      </Text>
    )
    expect(container.firstElementChild?.className).toMatch(/custom-class/)
  })
})

describe('Text — a11y (jest-axe)', () => {
  it('has no axe violations (h1 primary)', async () => {
    const { container } = render(<Text variant="h1">Title</Text>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (body primary)', async () => {
    const { container } = render(<Text variant="body">Body copy</Text>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (h2 muted — AA large eligible)', async () => {
    const { container } = render(
      <Text variant="h2" color="muted">
        Muted heading
      </Text>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
