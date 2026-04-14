import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToggleGroup, ToggleGroupItem } from './toggle-group'
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react'

const meta: Meta = { title: 'UI/ToggleGroup' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[360px] space-y-ds-4">
      <div>
        <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">Align</span>
        <ToggleGroup type="single" defaultValue="center">
          <ToggleGroupItem value="left"><AlignLeft size={14} /></ToggleGroupItem>
          <ToggleGroupItem value="center"><AlignCenter size={14} /></ToggleGroupItem>
          <ToggleGroupItem value="right"><AlignRight size={14} /></ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  ),
}
