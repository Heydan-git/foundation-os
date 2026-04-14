import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './switch'
import { Label } from './label'

const meta: Meta = { title: 'UI/Switch' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[360px] space-y-ds-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="s1">Notifications</Label>
        <Switch id="s1" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="s2" className="text-ds-blue">Active option</Label>
        <Switch id="s2" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="s3" className="text-ds-fg/40">Disabled</Label>
        <Switch id="s3" disabled />
      </div>
    </div>
  ),
}
