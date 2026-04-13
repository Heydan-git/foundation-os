import type { Meta, StoryObj } from '@storybook/react'
import { Bold, Italic, Underline } from 'lucide-react'
import { Toggle } from './toggle'

const meta = {
  title: 'Form/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
  },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Toggle', 'aria-label': 'Toggle' },
}

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline', 'aria-label': 'Toggle outline' },
}

export const WithIcon: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <Bold className="size-4" />
    </Toggle>
  ),
}

export const Small: Story = {
  args: { children: 'Small', size: 'sm', 'aria-label': 'Toggle small' },
}

export const Large: Story = {
  args: { children: 'Large', size: 'lg', 'aria-label': 'Toggle large' },
}

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true, 'aria-label': 'Toggle disabled' },
}

export const TextFormatting: Story = {
  render: () => (
    <div className="flex gap-1">
      <Toggle aria-label="Toggle bold" size="sm">
        <Bold className="size-4" />
      </Toggle>
      <Toggle aria-label="Toggle italic" size="sm">
        <Italic className="size-4" />
      </Toggle>
      <Toggle aria-label="Toggle underline" size="sm">
        <Underline className="size-4" />
      </Toggle>
    </div>
  ),
}
