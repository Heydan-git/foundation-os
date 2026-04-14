import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './breadcrumb'

const meta: Meta = {
  title: 'UI/Breadcrumb',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Current</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>),
}
