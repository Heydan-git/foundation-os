import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './tooltip'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Tooltip',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="outline">Hover</Button></TooltipTrigger><TooltipContent>Tooltip text</TooltipContent></Tooltip></TooltipProvider>),
}
