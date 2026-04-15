import type { Meta, StoryObj } from '@storybook/react-vite'
import { Check, AlertCircle } from 'lucide-react'
import { Input } from './input'
import { Label } from './label'

const meta: Meta = { title: 'UI/Input' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-4">
      <div className="space-y-ds-1_5">
        <Label htmlFor="default">Defaut</Label>
        <Input id="default" placeholder="Entrez une valeur..." />
      </div>

      <div className="space-y-ds-1_5">
        <Label htmlFor="success">
          <Check size={10} className="text-ds-emerald" /> Succes
        </Label>
        <Input id="success" success defaultValue="Valeur validee" />
      </div>

      <div className="space-y-ds-1_5">
        <Label htmlFor="error" className="text-ds-rose">
          <AlertCircle size={10} /> Erreur
        </Label>
        <Input id="error" aria-invalid defaultValue="Valeur incorrecte" />
        <p className="text-ds-xs text-ds-rose/70 font-mono">Ce champ est requis</p>
      </div>

      <div className="space-y-ds-1_5">
        <Label htmlFor="disabled" className="text-ds-fg/40">Disabled</Label>
        <Input id="disabled" disabled placeholder="Non editable" />
      </div>
    </div>
  ),
}
