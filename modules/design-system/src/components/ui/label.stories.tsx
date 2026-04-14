import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './label'
import { Input } from './input'
import { Checkbox } from './checkbox'

const meta: Meta = { title: 'UI/Label' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-4">
      <div className="space-y-ds-1_5">
        <Label htmlFor="field">Field label</Label>
        <Input id="field" placeholder="Input..." />
      </div>
      <div className="flex items-center gap-ds-2">
        <Checkbox id="agree" defaultChecked />
        <Label htmlFor="agree">Accept terms and conditions</Label>
      </div>
    </div>
  ),
}
