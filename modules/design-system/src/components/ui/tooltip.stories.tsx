import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './tooltip'
import { Button } from './button'
import { Info } from 'lucide-react'

const meta: Meta = { title: 'UI/Tooltip' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex items-center gap-ds-4">
        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="sm">Hover me</Button></TooltipTrigger><TooltipContent>Short tooltip</TooltipContent></Tooltip>
        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon"><Info size={14} /></Button></TooltipTrigger><TooltipContent className="bg-ds-blue text-ds-surface-0">Info tooltip (blue)</TooltipContent></Tooltip>
      </div>
    </TooltipProvider>
  ),
}
