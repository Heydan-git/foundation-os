import type { Meta, StoryObj } from '@storybook/react-vite'
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from './menubar'

const meta: Meta = {
  title: 'UI/Menubar',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Menubar><MenubarMenu><MenubarTrigger>File</MenubarTrigger><MenubarContent><MenubarItem>New</MenubarItem><MenubarItem>Open</MenubarItem></MenubarContent></MenubarMenu><MenubarMenu><MenubarTrigger>Edit</MenubarTrigger><MenubarContent><MenubarItem>Undo</MenubarItem><MenubarItem>Redo</MenubarItem></MenubarContent></MenubarMenu></Menubar>),
}
