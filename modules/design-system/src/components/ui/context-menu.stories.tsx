import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from './context-menu'

const meta: Meta = { title: 'UI/ContextMenu' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-[160px] w-[360px] items-center justify-center rounded-ds-md border border-dashed border-ds-border/15 bg-ds-surface-2 text-ds-sm text-ds-fg/60">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-ds-rose">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}
