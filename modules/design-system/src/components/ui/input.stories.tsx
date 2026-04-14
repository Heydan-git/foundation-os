import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'
import { Label } from './label'

const meta: Meta = { title: 'UI/Input' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-4">
      <div className="space-y-ds-1_5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="space-y-ds-1_5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" />
      </div>
      <div className="space-y-ds-1_5">
        <Label htmlFor="disabled">Disabled</Label>
        <Input id="disabled" disabled defaultValue="Cannot edit" />
      </div>
      <div className="space-y-ds-1_5">
        <Label htmlFor="invalid">Invalid</Label>
        <Input id="invalid" aria-invalid defaultValue="wrong@" />
      </div>
    </div>
  ),
}
