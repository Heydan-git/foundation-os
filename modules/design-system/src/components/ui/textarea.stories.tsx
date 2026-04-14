import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './textarea'
import { Label } from './label'

const meta: Meta = { title: 'UI/Textarea' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-4">
      <div className="space-y-ds-1_5">
        <Label htmlFor="msg">Message</Label>
        <Textarea id="msg" placeholder="Your message..." rows={4} />
      </div>
      <div className="space-y-ds-1_5">
        <Label htmlFor="filled">Pre-filled</Label>
        <Textarea id="filled" defaultValue="Hello world,\n\nThis is a prefilled textarea." rows={4} />
      </div>
    </div>
  ),
}
