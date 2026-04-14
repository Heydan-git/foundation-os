import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Collapsible',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Collapsible className="w-[300px]"><CollapsibleTrigger asChild><Button variant="outline" size="sm">Toggle</Button></CollapsibleTrigger><CollapsibleContent className="mt-2 p-3 rounded-md bg-ds-surface-2 text-xs">Content revealed.</CollapsibleContent></Collapsible>),
}
