import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Popover',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Popover><PopoverTrigger asChild><Button variant="outline">Open</Button></PopoverTrigger><PopoverContent className="w-[240px] text-xs">Popover content</PopoverContent></Popover>),
}
