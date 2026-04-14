import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from './sheet'
import { Button } from './button'

const meta: Meta = { title: 'UI/Sheet' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="outline">Open sheet</Button></SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile. Click save when done.</SheetDescription>
        </SheetHeader>
        <div className="space-y-ds-3 py-ds-4">
          <div className="h-ds-8 rounded-ds-md bg-ds-surface-1 border border-ds-border/5" />
          <div className="h-ds-8 rounded-ds-md bg-ds-surface-1 border border-ds-border/5" />
        </div>
        <SheetFooter>
          <Button>Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
