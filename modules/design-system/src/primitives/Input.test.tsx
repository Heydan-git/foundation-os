/**
 * Foundation OS — Design System
 * Input.test — render + label association + state + a11y + axe.
 */
import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import { Input } from './Input'

describe('Input — render', () => {
  it('renders an <input> with default type="text"', () => {
    render(<Input label="Name" />)
    const input = screen.getByLabelText('Name') as HTMLInputElement
    expect(input.type).toBe('text')
  })

  it.each(['email', 'password', 'number', 'search', 'tel', 'url'] as const)(
    'respects type=%s',
    (type) => {
      render(<Input label="x" type={type} />)
      const input = screen.getByLabelText('x') as HTMLInputElement
      expect(input.type).toBe(type)
    }
  )

  it('forwards placeholder', () => {
    render(<Input label="Name" placeholder="Ton nom" />)
    expect(screen.getByPlaceholderText('Ton nom')).toBeInTheDocument()
  })

  it('forwards HTML attributes (name, autoComplete)', () => {
    render(<Input label="x" name="email-field" autoComplete="email" />)
    const input = screen.getByLabelText('x')
    expect(input).toHaveAttribute('name', 'email-field')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })
})

describe('Input — label association', () => {
  it('associates label with input via htmlFor/id', () => {
    render(<Input label="Email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toBeInTheDocument()
  })

  it('uses user-provided id when given', () => {
    render(<Input label="x" id="custom-id" />)
    const input = screen.getByLabelText('x')
    expect(input).toHaveAttribute('id', 'custom-id')
  })

  it('auto-generates id when not provided', () => {
    render(<Input label="x" />)
    const input = screen.getByLabelText('x')
    expect(input.id).toMatch(/^fos-input-/)
  })
})

describe('Input — helper / error / success text', () => {
  it('shows helperText with aria-describedby linkage', () => {
    render(<Input label="x" helperText="Optional hint" />)
    const input = screen.getByLabelText('x')
    const helperId = input.getAttribute('aria-describedby')
    expect(helperId).toBeTruthy()
    expect(screen.getByText('Optional hint')).toHaveAttribute('id', helperId!)
  })

  it('shows errorText and marks aria-invalid="true"', () => {
    render(<Input label="x" errorText="Bad value" />)
    const input = screen.getByLabelText('x')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Bad value')
  })

  it('prefers errorText over helperText when both present', () => {
    render(<Input label="x" helperText="help" errorText="boom" />)
    expect(screen.queryByText('help')).not.toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()
  })

  it('shows successText without aria-invalid', () => {
    render(<Input label="x" successText="Valid!" />)
    const input = screen.getByLabelText('x')
    expect(input).not.toHaveAttribute('aria-invalid')
    expect(screen.getByText('Valid!')).toBeInTheDocument()
  })
})

describe('Input — disabled', () => {
  it('is disabled when disabled=true', () => {
    render(<Input label="x" disabled />)
    expect(screen.getByLabelText('x')).toBeDisabled()
  })

  it('does not fire onChange when disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="x" disabled onChange={onChange} />)
    await user.type(screen.getByLabelText('x'), 'abc')
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('Input — interactions', () => {
  it('fires onChange as the user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="x" onChange={onChange} />)
    await user.type(screen.getByLabelText('x'), 'hello')
    expect(onChange).toHaveBeenCalled()
    expect((screen.getByLabelText('x') as HTMLInputElement).value).toBe('hello')
  })
})

describe('Input — forwardRef', () => {
  it('forwards ref to the underlying input', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input label="x" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})

describe('Input — a11y (jest-axe)', () => {
  it('has no axe violations (default)', async () => {
    const { container } = render(<Input label="Email" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (with helper text)', async () => {
    const { container } = render(<Input label="Email" helperText="Hint" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (with error text)', async () => {
    const { container } = render(<Input label="Email" errorText="Bad" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (disabled)', async () => {
    const { container } = render(<Input label="Email" disabled />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
