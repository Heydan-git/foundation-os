/**
 * Foundation OS — Design System
 * Card.test — slots + variants + interactive keyboard + a11y.
 */
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Card } from './Card'

describe('Card — render & slots', () => {
  it('renders children as body', () => {
    render(<Card>Body content</Card>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('renders header slot when provided', () => {
    render(<Card header={<span>Header</span>}>Body</Card>)
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('renders footer slot when provided', () => {
    render(<Card footer={<span>Footer</span>}>Body</Card>)
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })

  it('renders all slots together', () => {
    render(
      <Card header={<span>H</span>} footer={<span>F</span>}>
        B
      </Card>
    )
    expect(screen.getByText('H')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('F')).toBeInTheDocument()
  })
})

describe('Card — element tag (as prop)', () => {
  it('defaults to <div>', () => {
    const { container } = render(<Card>x</Card>)
    expect(container.querySelector('div.card, div[class*="card"]')).toBeInTheDocument()
  })

  it('renders as <section> when as="section"', () => {
    const { container } = render(<Card as="section">x</Card>)
    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('renders as <article> when as="article"', () => {
    const { container } = render(<Card as="article">x</Card>)
    expect(container.querySelector('article')).toBeInTheDocument()
  })
})

describe('Card — variants', () => {
  it.each(['default', 'elevated', 'interactive'] as const)(
    'applies variant=%s className',
    (variant) => {
      const { container } = render(<Card variant={variant}>x</Card>)
      expect(container.firstElementChild?.className).toMatch(
        new RegExp(`variant-${variant}`)
      )
    }
  )
})

describe('Card — interactive', () => {
  it('does not set role=button when non-interactive', () => {
    const { container } = render(<Card>x</Card>)
    expect(container.firstElementChild).not.toHaveAttribute('role')
    expect(container.firstElementChild).not.toHaveAttribute('tabIndex')
  })

  it('sets role=button and tabIndex=0 when variant="interactive"', () => {
    const { container } = render(<Card variant="interactive">x</Card>)
    expect(container.firstElementChild).toHaveAttribute('role', 'button')
    expect(container.firstElementChild).toHaveAttribute('tabIndex', '0')
  })

  it('auto-enables interactive when onClick is provided', () => {
    const onClick = vi.fn()
    const { container } = render(<Card onClick={onClick}>x</Card>)
    expect(container.firstElementChild).toHaveAttribute('role', 'button')
  })

  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card onClick={onClick}>x</Card>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('fires onClick on Enter key', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card onClick={onClick}>x</Card>)
    const card = screen.getByRole('button')
    card.focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('fires onClick on Space key', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card onClick={onClick}>x</Card>)
    const card = screen.getByRole('button')
    card.focus()
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick for unrelated keys (e.g. Escape)', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Card onClick={onClick}>x</Card>)
    const card = screen.getByRole('button')
    card.focus()
    await user.keyboard('{Escape}')
    expect(onClick).not.toHaveBeenCalled()
  })
})

describe('Card — a11y (jest-axe)', () => {
  it('has no axe violations (default)', async () => {
    const { container } = render(
      <Card>
        <p>Content</p>
      </Card>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (with header and footer)', async () => {
    const { container } = render(
      <Card header={<h2>Title</h2>} footer={<p>Footer</p>}>
        <p>Body</p>
      </Card>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (interactive)', async () => {
    const { container } = render(
      <Card variant="interactive" onClick={() => undefined}>
        <p>Clickable</p>
      </Card>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
