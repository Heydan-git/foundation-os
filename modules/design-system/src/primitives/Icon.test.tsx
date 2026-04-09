/**
 * Foundation OS — Design System
 * Icon.test — name lookup + a11y (decorative vs semantic) + jest-axe.
 */
import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Icon, ICON_NAMES } from './Icon'

describe('Icon — rendering & name lookup', () => {
  it('renders the named SVG from the curated iconMap', () => {
    const { container } = render(<Icon name="Check" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('applies default size=16', () => {
    const { container } = render(<Icon name="Check" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
  })

  it('accepts custom size as number', () => {
    const { container } = render(<Icon name="Check" size={32} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '32')
    expect(svg).toHaveAttribute('height', '32')
  })

  it('applies custom strokeWidth', () => {
    const { container } = render(<Icon name="Check" strokeWidth={3} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('stroke-width', '3')
  })

  it('ICON_NAMES contains expected canonical icons', () => {
    expect(ICON_NAMES).toContain('Check')
    expect(ICON_NAMES).toContain('Plus')
    expect(ICON_NAMES).toContain('X')
    expect(ICON_NAMES).toContain('ChevronRight')
    expect(ICON_NAMES).toContain('Trash2')
    expect(ICON_NAMES.length).toBeGreaterThanOrEqual(20)
  })
})

describe('Icon — a11y: decorative by default', () => {
  it('defaults to aria-hidden="true" when no aria-label', () => {
    const { container } = render(<Icon name="Check" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).not.toHaveAttribute('aria-label')
    expect(svg).not.toHaveAttribute('role')
  })

  it('is focusable="false" (SVG should not be in tab order)', () => {
    const { container } = render(<Icon name="Check" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('focusable', 'false')
  })
})

describe('Icon — a11y: semantic with aria-label', () => {
  it('exposes role="img" and aria-label when aria-label provided', () => {
    const { container } = render(<Icon name="Trash2" aria-label="Delete item" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('role', 'img')
    expect(svg).toHaveAttribute('aria-label', 'Delete item')
  })

  it('removes aria-hidden when aria-label provided (semantic icon)', () => {
    const { container } = render(<Icon name="Trash2" aria-label="Delete item" />)
    const svg = container.querySelector('svg')
    expect(svg).not.toHaveAttribute('aria-hidden')
  })
})

describe('Icon — a11y (jest-axe)', () => {
  it('has no axe violations (decorative)', async () => {
    const { container } = render(<Icon name="Check" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('has no axe violations (semantic with aria-label)', async () => {
    const { container } = render(
      <button>
        <Icon name="Trash2" aria-label="Delete" />
      </button>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
