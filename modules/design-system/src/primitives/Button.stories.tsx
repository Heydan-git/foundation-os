/**
 * Foundation OS — Design System
 * Button.stories — visual matrix of variants × sizes × states.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Button } from './Button'
import { Icon } from './Icon'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger']
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg']
    },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' }
  },
  args: {
    children: 'Button'
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary' }
}

export const Secondary: Story = {
  args: { variant: 'secondary' }
}

export const Ghost: Story = {
  args: { variant: 'ghost' }
}

export const Danger: Story = {
  args: { variant: 'danger' }
}

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  )
}

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true }
}

export const Loading: Story = {
  args: { variant: 'primary', isLoading: true }
}

export const WithLeadingIcon: Story = {
  args: {
    variant: 'primary',
    leadingIcon: <Icon name="Plus" size={16} />,
    children: 'Add item'
  }
}

export const WithTrailingIcon: Story = {
  args: {
    variant: 'secondary',
    trailingIcon: <Icon name="ArrowRight" size={16} />,
    children: 'Continue'
  }
}

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, auto)',
        gap: 12,
        padding: 16
      }}
    >
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
      <Button variant="ghost" disabled>
        Ghost
      </Button>
      <Button variant="danger" disabled>
        Danger
      </Button>
      <Button variant="primary" isLoading>
        Primary
      </Button>
      <Button variant="secondary" isLoading>
        Secondary
      </Button>
      <Button variant="ghost" isLoading>
        Ghost
      </Button>
      <Button variant="danger" isLoading>
        Danger
      </Button>
    </div>
  )
}
