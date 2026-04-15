import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from './separator'

const meta: Meta = { title: 'UI/Separator' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-3">
      <div className="text-ds-base text-ds-fg/90">Section A</div>
      <Separator />
      <div className="text-ds-base text-ds-fg/90">Section B</div>
      <Separator />
      <div className="flex items-center gap-ds-4 h-ds-6">
        <span className="text-ds-base text-ds-fg/90">Inline</span>
        <Separator orientation="vertical" />
        <span className="text-ds-base text-ds-blue">Separator</span>
        <Separator orientation="vertical" />
        <span className="text-ds-base text-ds-purple">Vertical</span>
      </div>
    </div>
  ),
}
