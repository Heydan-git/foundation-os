import type { Meta, StoryObj } from '@storybook/react-vite'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from './drawer'
import { Button } from './button'

const meta: Meta = { title: 'UI/Drawer' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild><Button variant="outline">Open drawer</Button></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move funds</DrawerTitle>
          <DrawerDescription>Review the transaction before confirming.</DrawerDescription>
        </DrawerHeader>
        <div className="p-ds-4 space-y-ds-3">
          <div className="h-ds-8 rounded-ds-md bg-ds-surface-2 border border-ds-border/5" />
        </div>
        <DrawerFooter>
          <Button>Confirm</Button>
          <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
}
