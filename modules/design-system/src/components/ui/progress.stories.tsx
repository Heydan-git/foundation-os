import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './progress'

const meta: Meta = { title: 'UI/Progress' }
export default meta
type Story = StoryObj

/**
 * Iso DashboardDesignSystem.tsx lines 527-558 "Jauges".
 * 3 progress bars avec labels + pourcentages + couleurs differentes :
 *   - API Usage   72% purple
 *   - Storage     28% emerald
 *   - Quota       94% rose
 * Chaque barre : h-ds-1_5 + track ds-surface-1 + fill gradient + white blur tip.
 */
export const Default: Story = {
  render: () => (
    <div className="p-ds-6 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-5">
      <h3 className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-2">Jauges</h3>

      <div className="space-y-ds-1_5">
        <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60">
          <span>API Usage</span>
          <span className="text-ds-purple">72%</span>
        </div>
        <Progress value={72} color="purple" />
      </div>

      <div className="space-y-ds-1_5">
        <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60">
          <span>Storage</span>
          <span className="text-ds-emerald">28%</span>
        </div>
        <Progress value={28} color="emerald" />
      </div>

      <div className="space-y-ds-1_5">
        <div className="flex justify-between text-ds-xs font-mono text-ds-fg/60">
          <span>Quota</span>
          <span className="text-ds-rose">94%</span>
        </div>
        <Progress value={94} color="rose" />
      </div>
    </div>
  ),
}
