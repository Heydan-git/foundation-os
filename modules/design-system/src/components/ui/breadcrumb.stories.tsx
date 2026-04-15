import type { Meta, StoryObj } from '@storybook/react-vite'
import { Home } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from './breadcrumb'

const meta: Meta = { title: 'UI/Breadcrumb' }
export default meta
type Story = StoryObj

/**
 * Iso `DashboardDesignSystem.tsx` lines 888-895 :
 * Home (icon) -> Dashboard -> Analytics (page courante text-ds-fg/90).
 * Chevrons size-2.5 text-ds-fg/20.
 */
export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px]">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              <Home /> Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
}
