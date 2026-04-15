import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './switch'

const meta: Meta = { title: 'UI/Switch' }
export default meta
type Story = StoryObj

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">{children}</span>
)

type ToggleItem = { key: string; label: string; desc: string; on: boolean; disabled?: boolean }

const items: ToggleItem[] = [
  { key: 'auto', label: 'Auto-Scaling', desc: 'Ajustement dynamique', on: false },
  { key: 'perf', label: 'Mode Haute Perf.', desc: 'Performances max', on: true },
  { key: 'notif', label: 'Notifications', desc: 'Push & in-app', on: true },
  { key: 'dark', label: 'Mode Sombre', desc: 'Theme UI', on: true },
  { key: 'disabled', label: 'Option verrouillee', desc: 'Indisponible', on: false, disabled: true },
]

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[420px] space-y-ds-4">
      <SubLabel>Toggles & Sliders</SubLabel>
      <div className="space-y-ds-5">
        {items.map((item) => (
          <div key={item.key} className={`flex items-center justify-between ${item.disabled ? 'opacity-50' : ''}`}>
            <div>
              <p className="text-ds-base text-ds-fg/90">{item.label}</p>
              <p className={`text-ds-xs font-mono mt-0.5 transition-colors ${item.on ? 'text-ds-emerald drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-ds-fg/40'}`}>
                {item.on ? 'Actif' : 'Inactif'}
              </p>
            </div>
            <Switch id={item.key} defaultChecked={item.on} disabled={item.disabled} />
          </div>
        ))}
      </div>
    </div>
  ),
}
