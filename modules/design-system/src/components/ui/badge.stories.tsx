import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta: Meta = { title: 'UI/Badge' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-4">
      <div>
        <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">Variants</span>
        <div className="flex flex-wrap items-center gap-ds-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>
      <div>
        <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">Status pills</span>
        <div className="flex flex-wrap items-center gap-ds-2">
          <span className="inline-flex items-center gap-ds-1_5 text-ds-2xs font-mono text-ds-emerald bg-ds-emerald/10 border border-ds-emerald/20 px-ds-2 py-0.5 rounded-ds-sm">
            <span className="w-1 h-1 rounded-ds-full bg-ds-emerald animate-pulse" /> LIVE
          </span>
          <span className="inline-flex items-center gap-ds-1_5 text-ds-2xs font-mono text-ds-blue bg-ds-blue/10 border border-ds-blue/20 px-ds-2 py-0.5 rounded-ds-sm">INFO</span>
          <span className="inline-flex items-center gap-ds-1_5 text-ds-2xs font-mono text-ds-amber bg-ds-amber/10 border border-ds-amber/20 px-ds-2 py-0.5 rounded-ds-sm">WARN</span>
          <span className="inline-flex items-center gap-ds-1_5 text-ds-2xs font-mono text-ds-rose bg-ds-rose/10 border border-ds-rose/20 px-ds-2 py-0.5 rounded-ds-sm">ERROR</span>
        </div>
      </div>
    </div>
  ),
}
