import type { Meta, StoryObj } from '@storybook/react'
import { toast } from 'sonner'
import { Toaster } from './sonner'
import { Button } from './button'

const meta = {
  title: 'Feedback/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast('Event has been created')}>
      Show Toast
    </Button>
  ),
}

export const Success: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.success('Successfully saved!')}>
      Success Toast
    </Button>
  ),
}

export const Error: Story = {
  render: () => (
    <Button variant="outline" onClick={() => toast.error('Something went wrong')}>
      Error Toast
    </Button>
  ),
}

export const WithDescription: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() => toast('Event created', { description: 'Monday, January 3rd at 6:00 PM' })}
    >
      With Description
    </Button>
  ),
}
