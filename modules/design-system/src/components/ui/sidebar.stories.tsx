import type { Meta, StoryObj } from '@storybook/react-vite'
import { LayoutDashboard, Settings, Users } from 'lucide-react'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from './sidebar'

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="h-screen w-64">
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Users />
                    <span>Team</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  ),
}

export const Empty: Story = {
  render: () => (
    <div className="h-screen w-64">
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <span>Aucun projet</span>
            </div>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  ),
}
