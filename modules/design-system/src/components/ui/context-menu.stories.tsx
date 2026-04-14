import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from './context-menu'

const meta = {
  title: 'Navigation/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
} satisfies Meta<typeof ContextMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex h-[150px] w-[200px] items-center justify-center rounded-md border border-dashed text-sm">
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Settings</ContextMenuItem>
        <ContextMenuItem>Log out</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}
