import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from './context-menu'

const meta: Meta = {
  title: 'UI/ContextMenu',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<ContextMenu><ContextMenuTrigger className="flex h-[120px] w-[260px] items-center justify-center rounded-md border border-ds-border/5 bg-ds-surface-2 text-xs">Right-click here</ContextMenuTrigger><ContextMenuContent><ContextMenuItem>Copy</ContextMenuItem><ContextMenuItem>Paste</ContextMenuItem></ContextMenuContent></ContextMenu>),
}
