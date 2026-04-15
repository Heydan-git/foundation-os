import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge'

const meta: Meta = { title: 'UI/Badge' }
export default meta
type Story = StoryObj

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">{children}</span>
)

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[560px] space-y-ds-4">
      <div>
        <SubLabel>Variants</SubLabel>
        <div className="flex flex-wrap items-center gap-ds-2">
          <Badge>Info</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="purple">Purple</Badge>
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="secondary">Secondary</Badge>
        </div>
      </div>

      <div>
        <SubLabel>Live (pulse dot)</SubLabel>
        <div className="flex flex-wrap items-center gap-ds-2">
          <Badge live variant="success">Live</Badge>
          <Badge live variant="warning">Pending</Badge>
          <Badge live variant="destructive">Error</Badge>
          <Badge live>Sync</Badge>
          <Badge live variant="purple">Processing</Badge>
        </div>
      </div>
    </div>
  ),
}
