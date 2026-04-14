import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta = {
  title: 'App/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, margin: '0 0 4px' }}>Card title</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0 }}>Some card content here.</p>
      </>
    ),
  },
}

export const Selected: Story = {
  args: {
    selected: true,
    children: (
      <>
        <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, margin: '0 0 4px' }}>Selected card</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0 }}>This card is in selected state.</p>
      </>
    ),
  },
}

export const Clickable: Story = {
  args: {
    onClick: () => alert('clicked'),
    children: (
      <>
        <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 12, margin: '0 0 4px' }}>Clickable card</h3>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, margin: 0 }}>Click me to trigger an action.</p>
      </>
    ),
  },
}
