import type { Meta, StoryObj } from '@storybook/react'
import { AlertCircle } from 'lucide-react'
import { Input } from './input'
import { Label } from './label'

const meta = {
  title: 'Form/Input',
  component: Input,
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
}

export const WithValue: Story = {
  args: { defaultValue: 'kevin@foundation-os.dev' },
}

export const File: Story = {
  args: { type: 'file' },
}

export const Error: Story = {
  render: () => (
    <div className="grid w-full max-w-sm gap-1.5">
      <Input aria-invalid className="border-destructive focus-visible:ring-destructive" defaultValue="invalid@" />
      <p className="text-sm text-destructive mt-1">Email invalide</p>
    </div>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <div className="relative w-full max-w-sm">
      <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input className="pl-10" placeholder="Search..." />
    </div>
  ),
}
