import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from './slider'

const meta: Meta = { title: 'UI/Slider' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-5">
      <div>
        <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60 mb-ds-2">
          <span>Volume</span>
          <span className="text-ds-blue">40%</span>
        </div>
        <Slider defaultValue={[40]} max={100} step={1} />
      </div>
      <div>
        <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60 mb-ds-2">
          <span>Range</span>
          <span className="text-ds-purple">20 – 80</span>
        </div>
        <Slider defaultValue={[20, 80]} max={100} step={1} />
      </div>
    </div>
  ),
}
