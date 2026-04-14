import type { Meta, StoryObj } from '@storybook/react-vite'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './dropdown-menu'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/DropdownMenu',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline">Menu</Button></DropdownMenuTrigger><DropdownMenuContent><DropdownMenuLabel>Section</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem>Item A</DropdownMenuItem><DropdownMenuItem>Item B</DropdownMenuItem></DropdownMenuContent></DropdownMenu>),
}
