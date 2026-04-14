import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './checkbox'
import { Label } from './label'

const meta: Meta = { title: 'UI/Checkbox' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[360px] space-y-ds-4">
      <div>
        <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">States</span>
        <div className="flex flex-col gap-ds-3">
          <div className="flex items-center gap-ds-2">
            <Checkbox id="c1" />
            <Label htmlFor="c1">Unchecked</Label>
          </div>
          <div className="flex items-center gap-ds-2">
            <Checkbox id="c2" defaultChecked />
            <Label htmlFor="c2" className="text-ds-blue">Checked (blue fill)</Label>
          </div>
          <div className="flex items-center gap-ds-2">
            <Checkbox id="c3" disabled />
            <Label htmlFor="c3" className="text-ds-fg/40">Disabled</Label>
          </div>
          <div className="flex items-center gap-ds-2">
            <Checkbox id="c4" defaultChecked disabled />
            <Label htmlFor="c4" className="text-ds-fg/40">Disabled + checked</Label>
          </div>
        </div>
      </div>
    </div>
  ),
}
