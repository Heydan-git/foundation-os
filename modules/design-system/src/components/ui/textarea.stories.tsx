import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './textarea'
import { Label } from './label'

const meta = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { placeholder: 'Type your message...' },
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Type your message..." />
    </div>
  ),
}

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
}

export const WithValue: Story = {
  args: { defaultValue: 'Foundation OS is an AI-driven personal operating system.' },
}

export const Error: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Textarea aria-invalid className="border-destructive focus-visible:ring-destructive" placeholder="Type your message..." />
      <p className="text-sm text-destructive mt-1">Ce champ est requis</p>
    </div>
  ),
}

export const WithCounter: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Textarea defaultValue="Foundation OS" placeholder="Type your message..." />
      <div className="text-xs text-muted-foreground text-right">42/200 caracteres</div>
    </div>
  ),
}
