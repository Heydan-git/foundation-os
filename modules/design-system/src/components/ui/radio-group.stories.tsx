import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from './radio-group'

const meta: Meta = { title: 'UI/RadioGroup' }
export default meta
type Story = StoryObj

/**
 * Iso `DashboardDesignSystem.tsx` lines 649-677 "Radio Buttons".
 * Wrapped in a GlassCard-like container iso template. Labels use
 * ds-fg/90 (selected) / ds-fg/70 (unselected) — NO accent color override.
 * Sublabel : ds-fg/30 font-mono.
 */
export const Default: Story = {
  render: () => {
    const OPTIONS = [
      { value: 'alpha', label: 'Reseau Alpha', sublabel: 'Low latency' },
      { value: 'beta', label: 'Reseau Beta', sublabel: 'High throughput' },
      { value: 'gamma', label: 'Reseau Gamma', sublabel: 'Balanced' },
    ]
    const [selected, setSelected] = useState<string>('beta')
    return (
      <div className="p-ds-6 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[360px]">
        <h3 className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-4">
          Selection (interactif)
        </h3>
        <div className="space-y-ds-3">
          <span className="text-ds-sm text-ds-fg/40 font-mono block">Radio Buttons</span>
          <RadioGroup value={selected} onValueChange={setSelected} className="space-y-ds-3">
            {OPTIONS.map((o) => (
              <label
                key={o.value}
                htmlFor={`r-${o.value}`}
                className="flex items-center gap-ds-3 cursor-pointer group/rad"
              >
                <RadioGroupItem id={`r-${o.value}`} value={o.value} />
                <div>
                  <span
                    className={`text-ds-base transition-colors block ${
                      selected === o.value ? 'text-ds-fg/90' : 'text-ds-fg/70'
                    }`}
                  >
                    {o.label}
                  </span>
                  <span className="text-ds-xs text-ds-fg/30 font-mono">{o.sublabel}</span>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
    )
  },
}
