import type { Meta, StoryObj } from '@storybook/react-vite'
import { RadioGroup, RadioGroupItem } from './radio-group'
import { Label } from './label'

const meta: Meta = { title: 'UI/RadioGroup' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[360px]">
      <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">Plan</span>
      <RadioGroup defaultValue="pro" className="space-y-ds-3">
        <div className="flex items-center gap-ds-2">
          <RadioGroupItem id="r1" value="free" />
          <Label htmlFor="r1">Free</Label>
        </div>
        <div className="flex items-center gap-ds-2">
          <RadioGroupItem id="r2" value="pro" />
          <Label htmlFor="r2" className="text-ds-blue">Pro (selected)</Label>
        </div>
        <div className="flex items-center gap-ds-2">
          <RadioGroupItem id="r3" value="enterprise" />
          <Label htmlFor="r3">Enterprise</Label>
        </div>
      </RadioGroup>
    </div>
  ),
}
