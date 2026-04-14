import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './skeleton'

const meta: Meta = { title: 'UI/Skeleton' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-4">
      <div className="flex items-center gap-ds-3">
        <Skeleton className="h-10 w-10 rounded-ds-full" />
        <div className="space-y-ds-2">
          <Skeleton className="h-3 w-[220px]" />
          <Skeleton className="h-3 w-[180px]" />
        </div>
      </div>
      <Skeleton className="h-[120px] w-full" />
      <div className="space-y-ds-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[85%]" />
        <Skeleton className="h-3 w-[70%]" />
      </div>
    </div>
  ),
}
