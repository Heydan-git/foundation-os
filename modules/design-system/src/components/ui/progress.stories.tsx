import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './progress'

const meta: Meta = { title: 'UI/Progress' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-5">
      <div>
        <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60 mb-ds-2">
          <span>API Usage</span>
          <span className="text-ds-purple">72%</span>
        </div>
        <Progress value={72} />
      </div>
      <div>
        <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60 mb-ds-2">
          <span>Storage</span>
          <span className="text-ds-emerald">28%</span>
        </div>
        <Progress value={28} />
      </div>
      <div>
        <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60 mb-ds-2">
          <span>Quota</span>
          <span className="text-ds-rose">94%</span>
        </div>
        <Progress value={94} />
      </div>
    </div>
  ),
}
