import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toaster } from './sonner'
import { toast } from 'sonner'

const meta: Meta = { title: 'UI/Toaster' }
export default meta
type Story = StoryObj

/**
 * Iso DashboardDesignSystem.tsx lines 1108-1129 "Toasts (Variantes)".
 * 4 buttons pour declencher chaque variante sonner, + Toaster mount avec
 * toastOptions iso (bg ds-surface-2/95 + border ds-border/8 + accents per kind).
 */
export const Default: Story = {
  render: () => (
    <div className="p-ds-6 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[520px] space-y-ds-3">
      <h3 className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-2">Toasts (Variantes)</h3>
      <div className="flex flex-wrap items-center gap-ds-2">
        <button
          onClick={() => toast('Evenement cree', { description: 'Mardi 9 mai a 17:00' })}
          className="px-ds-3 py-ds-1_5 rounded-ds-md bg-ds-fg/5 border border-ds-border/8 text-ds-sm text-ds-fg/80 hover:bg-ds-fg/10 hover:border-ds-border/15 transition-all"
        >
          Default
        </button>
        <button
          onClick={() => toast.success('Deploiement reussi', { description: 'Agent Llama-3 deploye.' })}
          className="px-ds-3 py-ds-1_5 rounded-ds-md bg-ds-emerald/10 border border-ds-emerald/20 text-ds-sm text-ds-emerald hover:bg-ds-emerald/15 transition-all"
        >
          Success
        </button>
        <button
          onClick={() => toast.error('Erreur reseau', { description: 'Impossible de se connecter au RPC.' })}
          className="px-ds-3 py-ds-1_5 rounded-ds-md bg-ds-rose/10 border border-ds-rose/20 text-ds-sm text-ds-rose hover:bg-ds-rose/15 transition-all"
        >
          Error
        </button>
        <button
          onClick={() => toast.warning('Gas eleve', { description: 'Attendez un moment pour economiser.' })}
          className="px-ds-3 py-ds-1_5 rounded-ds-md bg-ds-amber/10 border border-ds-amber/20 text-ds-sm text-ds-amber hover:bg-ds-amber/15 transition-all"
        >
          Warning
        </button>
      </div>
      <Toaster />
    </div>
  ),
}
