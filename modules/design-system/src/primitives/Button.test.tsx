/**
 * Foundation OS — Design System
 * Button.test — render + props + interactions + a11y (jest-axe).
 */
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Button } from './Button'

describe('Button — render & props', () => {
  it('renders children as label', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies default variant=primary + size=md', () => {
    render(<Button>Default</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/variant-primary/)
    expect(btn.className).toMatch(/size-md/)
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'applies variant=%s',
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>)
      expect(screen.getByRole('button').className).toMatch(
        new RegExp(`variant-${variant}`)
      )
    }
  )

  it.each(['sm', 'md', 'lg'] as const)('applies size=%s', (size) => {
    render(<Button size={size}>{size}</Button>)
    expect(screen.getByRole('button').className).toMatch(new RegExp(`size-${size}`))
  })

  it('forwards HTML button attributes (name, data-testid)', () => {
    render(
      <Button name="confirm" data-testid="btn">
        OK
      </Button>
    )
    const btn = screen.getByTestId('btn')
    expect(btn).toHaveAttribute('name', 'confirm')
  })

  it('defaults type attribute to "button" (not form submit)', () => {
    render(<Button>NoSubmit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('accepts explicit type="submit"', () => {
    render(<Button type="submit">Go</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})

describe('Button — disabled & loading', () => {
  it('is disabled when disabled=true', () => {
    render(<Button disabled>Off</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when isLoading=true (prevents double-submit)', () => {
    render(<Button isLoading>Wait</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('sets aria-busy="true" when isLoading', () => {
    render(<Button isLoading>Wait</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })

  it('does not set aria-busy when not loading', () => {
    render(<Button>Idle</Button>)
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy')
  })
})

describe('Button — interactions', () => {
  it('fires onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Go</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Off
      </Button>
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('does not fire onClick when isLoading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button isLoading onClick={onClick}>
        Wait
      </Button>
    )
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('is focusable via keyboard tab', async () => {
    const user = userEvent.setup()
    render(<Button>Focus</Button>)
    await user.tab()
    expect(screen.getByRole('button')).toHaveFocus()
  })

  it('activates on Enter key', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Enter</Button>)
    await user.tab()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe('Button — forwardRef', () => {
  it('forwards ref to the underlying button element', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})

describe('Button — a11y (jest-axe)', () => {
  it('has no axe violations (primary)', async () => {
    const { container } = render(<Button>Primary</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations (disabled)', async () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('has no axe violations (loading with aria-busy)', async () => {
    const { container } = render(<Button isLoading>Loading</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it.each(['primary', 'secondary', 'ghost', 'danger'] as const)(
    'has no axe violations (variant=%s)',
    async (variant) => {
      const { container } = render(<Button variant={variant}>{variant}</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    }
  )
})
