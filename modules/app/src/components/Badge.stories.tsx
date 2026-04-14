import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta = {
  title: 'App/Badge',
  component: Badge,
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: { label: 'info', color: '#60a5fa' },
}

export const Success: Story = {
  args: { label: 'success', color: '#34d399' },
}

export const Warning: Story = {
  args: { label: 'warning', color: '#f59e0b' },
}

export const Danger: Story = {
  args: { label: 'danger', color: '#f43f5e' },
}

export const AllColors: Story = {
  args: { label: 'info', color: '#60a5fa' },
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <Badge label="info" color="#60a5fa" />
      <Badge label="success" color="#34d399" />
      <Badge label="warning" color="#f59e0b" />
      <Badge label="danger" color="#f43f5e" />
    </div>
  ),
}
