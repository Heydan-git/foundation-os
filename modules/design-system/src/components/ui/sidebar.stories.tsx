import type { Meta, StoryObj } from '@storybook/react-vite'
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger, SidebarInset } from './sidebar'
import { LayoutDashboard, Sword, BookOpen } from 'lucide-react'

const meta: Meta = { title: 'UI/Sidebar' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <div className="flex w-[720px] h-[320px] rounded-ds-md border border-ds-border/8 overflow-hidden">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-ds-3">
            <div className="flex items-center gap-ds-2">
              <div className="h-ds-6 w-ds-6 rounded-ds-sm bg-gradient-to-br from-ds-blue/30 to-ds-purple/30 border border-ds-blue/30" />
              <span className="text-ds-fg text-ds-base">Foundation</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem><SidebarMenuButton tooltip="Overview"><LayoutDashboard size={14} /><span>Overview</span></SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton tooltip="Commander" isActive><Sword size={14} /><span>Commander</span></SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton tooltip="Knowledge"><BookOpen size={14} /><span>Knowledge</span></SidebarMenuButton></SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-ds-3 text-ds-xs font-mono text-ds-fg/40">v0.1</SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="flex items-center gap-ds-2 p-ds-3 border-b border-ds-border/5">
            <SidebarTrigger />
            <span className="text-ds-sm text-ds-fg/60">Workspace</span>
          </div>
          <div className="p-ds-4 flex-1 bg-ds-surface-0 text-ds-fg/80">Main content area.</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
}
