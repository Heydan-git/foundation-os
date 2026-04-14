import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertTitle, AlertDescription } from './alert'
import { CheckCircle2, Info, AlertTriangle, XCircle } from 'lucide-react'

const meta: Meta = { title: 'UI/Alert' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="space-y-ds-3 w-[480px]">
      <Alert className="bg-ds-blue/10 border-ds-blue/20 text-ds-blue">
        <Info size={14} />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>Informational message about system status.</AlertDescription>
      </Alert>
      <Alert className="bg-ds-emerald/10 border-ds-emerald/20 text-ds-emerald">
        <CheckCircle2 size={14} />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </Alert>
      <Alert className="bg-ds-amber/10 border-ds-amber/20 text-ds-amber">
        <AlertTriangle size={14} />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Check your configuration before proceeding.</AlertDescription>
      </Alert>
      <Alert className="bg-ds-rose/10 border-ds-rose/20 text-ds-rose">
        <XCircle size={14} />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Something went wrong. Please try again.</AlertDescription>
      </Alert>
    </div>
  ),
}
