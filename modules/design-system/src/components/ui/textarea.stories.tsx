import type { Meta, StoryObj } from '@storybook/react-vite'
import { Check, AlertCircle } from 'lucide-react'
import { Textarea } from './textarea'
import { Label } from './label'

const meta: Meta = { title: 'UI/Textarea' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-4">
      <div className="space-y-ds-1_5">
        <Label htmlFor="ta-default">Defaut</Label>
        <Textarea id="ta-default" placeholder="Description..." rows={3} />
      </div>

      <div className="space-y-ds-1_5">
        <Label htmlFor="ta-success">
          <Check size={10} className="text-ds-emerald" /> Succes
        </Label>
        <Textarea id="ta-success" success defaultValue="Texte valide" rows={3} />
      </div>

      <div className="space-y-ds-1_5">
        <Label htmlFor="ta-error" className="text-ds-rose">
          <AlertCircle size={10} /> Erreur
        </Label>
        <Textarea id="ta-error" aria-invalid defaultValue="Contenu incorrect" rows={3} />
      </div>

      <div className="space-y-ds-1_5">
        <Label htmlFor="ta-disabled" className="text-ds-fg/40">Disabled</Label>
        <Textarea id="ta-disabled" disabled placeholder="Non editable" rows={3} />
      </div>
    </div>
  ),
}
