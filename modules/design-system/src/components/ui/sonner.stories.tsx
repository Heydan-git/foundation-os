import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toaster } from './sonner'
import { Button } from './button'
import { toast } from 'sonner'

const meta: Meta = { title: 'UI/Toaster' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-ds-2">
      <Button onClick={() => toast('Event created', { description: 'Tuesday, May 9 at 5:00 PM' })}>Default</Button>
      <Button variant="outline" onClick={() => toast.success('Changes saved')}>Success</Button>
      <Button variant="outline" onClick={() => toast.error('Something went wrong')}>Error</Button>
      <Button variant="outline" onClick={() => toast.warning('Careful with that')}>Warning</Button>
      <Toaster />
    </div>
  ),
}
