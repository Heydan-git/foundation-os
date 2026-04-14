import type { Meta, StoryObj } from '@storybook/react-vite'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from './drawer'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Drawer',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Drawer><DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>Drawer title</DrawerTitle><DrawerDescription>Drawer description.</DrawerDescription></DrawerHeader></DrawerContent></Drawer>),
}
