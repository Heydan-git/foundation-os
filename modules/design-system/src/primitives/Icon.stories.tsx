/**
 * Foundation OS — Design System
 * Icon.stories — curated icon set + decorative vs semantic usage.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Icon, ICON_NAMES, type IconName } from './Icon'

const meta = {
  title: 'Primitives/Icon',
  component: Icon,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: ICON_NAMES as unknown as IconName[]
    },
    size: { control: { type: 'number', min: 8, max: 64, step: 2 } },
    strokeWidth: { control: { type: 'number', min: 1, max: 4, step: 0.5 } }
  },
  args: {
    name: 'Check',
    size: 24,
    strokeWidth: 2
  }
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Semantic: Story = {
  args: {
    name: 'Trash2',
    'aria-label': 'Delete item'
  },
  parameters: {
    docs: {
      description: {
        story:
          'Semantic icon with explicit aria-label — becomes role="img" for screen readers.'
      }
    }
  }
}

export const Decorative: Story = {
  args: {
    name: 'Check',
    size: 32
  },
  parameters: {
    docs: {
      description: {
        story:
          'Decorative icon — defaults to aria-hidden=true, invisible to screen readers.'
      }
    }
  }
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {[12, 16, 20, 24, 32, 48].map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: 'var(--fos-color-text-primary)'
          }}
        >
          <Icon {...args} size={size} />
          <span>{size}</span>
        </div>
      ))}
    </div>
  ),
  args: { name: 'Settings' }
}

export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: 12,
        padding: 16
      }}
    >
      {ICON_NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: 12,
            borderRadius: 8,
            background: 'var(--fos-color-bg-surface)',
            border: '1px solid var(--fos-color-border-default)',
            color: 'var(--fos-color-text-primary)'
          }}
        >
          <Icon name={name} size={24} />
          <span
            style={{
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--fos-color-text-primary)'
            }}
          >
            {name}
          </span>
        </div>
      ))}
    </div>
  )
}
