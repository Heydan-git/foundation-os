import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertContent, AlertTitle, AlertDescription } from './alert'
import { Info, CheckCircle2, AlertTriangle, ShieldAlert, X } from 'lucide-react'

const meta: Meta = { title: 'UI/Alert' }
export default meta
type Story = StoryObj

/**
 * Iso DashboardDesignSystem.tsx lines 1085-1103 "Bannieres".
 * Structure : left absolute bar (color matches variant) + icon + content (title + description) + close button.
 */
export const Default: Story = {
  render: () => (
    <div className="p-ds-6 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 space-y-ds-3 w-[520px]">
      <h3 className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-2">Bannieres</h3>

      <Alert variant="info">
        <Info />
        <AlertContent>
          <AlertTitle>Mise a jour disponible</AlertTitle>
          <AlertDescription>Nouvelle version du client Nexus Node prete.</AlertDescription>
        </AlertContent>
        <button className="text-ds-fg/20 hover:text-ds-fg/60 transition-colors shrink-0 mt-0.5"><X size={12} /></button>
      </Alert>

      <Alert variant="success">
        <CheckCircle2 />
        <AlertContent>
          <AlertTitle>Transaction Confirmee</AlertTitle>
          <AlertDescription>0.05 ETH envoyes avec succes vers 0x8A9F...2F9C.</AlertDescription>
        </AlertContent>
        <button className="text-ds-fg/20 hover:text-ds-fg/60 transition-colors shrink-0 mt-0.5"><X size={12} /></button>
      </Alert>

      <Alert variant="warning">
        <AlertTriangle />
        <AlertContent>
          <AlertTitle>Charge Reseau Elevee</AlertTitle>
          <AlertDescription>Latence augmentee de 12ms sur les requetes.</AlertDescription>
        </AlertContent>
        <button className="text-ds-fg/20 hover:text-ds-fg/60 transition-colors shrink-0 mt-0.5"><X size={12} /></button>
      </Alert>

      <Alert variant="destructive">
        <ShieldAlert />
        <AlertContent>
          <AlertTitle>Echec de Synchronisation</AlertTitle>
          <AlertDescription>Noeud Gamma deconnecte. Reconnexion...</AlertDescription>
        </AlertContent>
        <button className="text-ds-fg/20 hover:text-ds-fg/60 transition-colors shrink-0 mt-0.5"><X size={12} /></button>
      </Alert>
    </div>
  ),
}
