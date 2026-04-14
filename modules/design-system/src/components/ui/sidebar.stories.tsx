import type { Meta, StoryObj } from '@storybook/react-vite'
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from './sidebar'

const meta: Meta = {
  title: 'UI/Sidebar',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<SidebarProvider><div className="flex w-[480px] h-[280px] rounded-md border border-ds-border/5"><Sidebar><SidebarContent><SidebarGroup><SidebarGroupLabel>Nav</SidebarGroupLabel><SidebarMenu><SidebarMenuItem><SidebarMenuButton>Home</SidebarMenuButton></SidebarMenuItem><SidebarMenuItem><SidebarMenuButton>Settings</SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarGroup></SidebarContent></Sidebar><div className="flex-1 p-4 flex items-center justify-center text-xs"><SidebarTrigger /></div></div></SidebarProvider>),
}
