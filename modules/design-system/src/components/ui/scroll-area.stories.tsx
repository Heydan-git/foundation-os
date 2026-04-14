import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from './scroll-area'

const meta: Meta = { title: 'UI/ScrollArea' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-[240px] w-[360px] rounded-ds-md border border-ds-border/8 p-ds-4 bg-ds-surface-2/80">
      <h4 className="text-ds-fg text-ds-base mb-ds-3">Activity log</h4>
      <div className="space-y-ds-2 text-ds-xs text-ds-fg/80 font-mono">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="flex justify-between gap-ds-3 pb-ds-1 border-b border-ds-border/5">
            <span className="text-ds-fg/50">#{String(i + 1).padStart(3, '0')}</span>
            <span className="flex-1 truncate">Entry line number {i + 1} — scroll to see more</span>
            <span className="text-ds-blue">OK</span>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
