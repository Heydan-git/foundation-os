import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './skeleton'

const meta: Meta = { title: 'UI/Skeleton' }
export default meta
type Story = StoryObj

/**
 * Skeleton loading placeholders iso Void Glass :
 *   - avatar circle + 2 text lines (220px + 180px)
 *   - card block h-[120px]
 *   - 3 text lines (100%, 85%, 70%)
 * Wrapped in a GlassCard surface (ds-surface-2/80 + border ds-border/5 + rounded-xl).
 */
export const Default: Story = {
  render: () => (
    <div className="p-ds-6 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[520px] space-y-ds-5">
      <h3 className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-2">
        Skeleton States
      </h3>

      {/* Avatar + 2 text lines */}
      <div className="flex items-center gap-ds-3">
        <Skeleton className="w-ds-10 h-ds-10 rounded-ds-full" />
        <div className="space-y-ds-1_5">
          <Skeleton className="h-2.5 w-[220px] rounded-ds-sm" />
          <Skeleton className="h-2 w-[180px] rounded-ds-sm" />
        </div>
      </div>

      {/* Card block */}
      <Skeleton className="w-full h-[120px] rounded-ds-lg" />

      {/* 3 text lines */}
      <div className="space-y-ds-1_5">
        <Skeleton className="h-2.5 w-full rounded-ds-sm" />
        <Skeleton className="h-2.5 w-[85%] rounded-ds-sm" />
        <Skeleton className="h-2.5 w-[70%] rounded-ds-sm" />
      </div>
    </div>
  ),
}
