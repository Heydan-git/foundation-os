import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Slider } from './slider'

const meta: Meta = { title: 'UI/Slider' }
export default meta
type Story = StoryObj

/**
 * Iso `DashboardDesignSystem.tsx` lines 718-732 "Toggles & Sliders".
 * Label : text-ds-sm font-mono text-ds-fg/40. Value : text-ds-blue.
 * Track : gradient blue -> #050505. Thumb : bg-ds-fg + border ds-blue.
 */
export const Default: Story = {
  render: () => {
    const [gpu, setGpu] = useState<number>(65)
    const [volume, setVolume] = useState<number>(20)
    return (
      <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-5">
        <div className="space-y-ds-2">
          <div className="flex justify-between items-center text-ds-sm font-mono text-ds-fg/40">
            <span>Limite GPU</span>
            <span className="text-ds-blue">{gpu}%</span>
          </div>
          <Slider value={gpu} onValueChange={setGpu} max={100} step={1} />
        </div>
        <div className="space-y-ds-2">
          <div className="flex justify-between items-center text-ds-sm font-mono text-ds-fg/40">
            <span>Volume</span>
            <span className="text-ds-blue">{volume}%</span>
          </div>
          <Slider value={volume} onValueChange={setVolume} max={100} step={1} />
        </div>
        <div className="space-y-ds-2">
          <div className="flex justify-between items-center text-ds-sm font-mono text-ds-fg/40">
            <span>Disabled</span>
            <span className="text-ds-fg/40">40%</span>
          </div>
          <Slider defaultValue={40} max={100} step={1} disabled />
        </div>
      </div>
    )
  },
}
