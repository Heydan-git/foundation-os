import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './tooltip'
import { HelpCircle, Info } from 'lucide-react'

const meta: Meta = { title: 'UI/Tooltip' }
export default meta
type Story = StoryObj

/**
 * Iso DashboardDesignSystem.tsx lines 988-997 "Tooltip".
 * Icon button trigger -> hover reveals Content
 * (bg ds-surface-2 + border ds-border/10 + shadow 0 10 20 rgba(0,0,0,0.5)
 * + text ds-fg/90 font-mono).
 * Also shows a second trigger with blue-accented tooltip text.
 */
export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <div className="p-ds-6 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px]">
        <h3 className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-4">Tooltip</h3>
        <div className="flex justify-center gap-ds-4 py-ds-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Aide"
                className="p-ds-2 rounded-ds-full bg-ds-fg/[0.03] border border-ds-border/5 text-ds-fg/60 hover:text-ds-fg/90 hover:bg-ds-fg/[0.06] transition-all"
              >
                <HelpCircle size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Short tooltip</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Info"
                className="p-ds-2 rounded-ds-full bg-ds-blue/10 border border-ds-blue/20 text-ds-blue hover:bg-ds-blue/15 transition-all"
              >
                <Info size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-ds-blue">Details API</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  ),
}
