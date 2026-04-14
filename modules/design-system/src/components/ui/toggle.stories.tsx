import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from './toggle'
import { Bold, Italic, Underline } from 'lucide-react'

const meta: Meta = { title: 'UI/Toggle' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[360px] space-y-ds-4">
      <div>
        <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">Toggle states</span>
        <div className="flex items-center gap-ds-2">
          <Toggle aria-label="Bold"><Bold size={14} /></Toggle>
          <Toggle aria-label="Italic" defaultPressed><Italic size={14} /></Toggle>
          <Toggle aria-label="Underline"><Underline size={14} /></Toggle>
        </div>
        <p className="text-ds-xs text-ds-fg/40 font-mono mt-ds-3">The middle toggle is active (defaultPressed).</p>
      </div>
    </div>
  ),
}
