import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from './sheet'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta = { title: 'UI/Sheet' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild><Button variant="glass">Open sheet</Button></SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>Make changes to your profile. Click save when done.</SheetDescription>
        </SheetHeader>
        <div className="px-ds-5 space-y-ds-3">
          <div className="space-y-ds-1_5">
            <Label htmlFor="sheet-name" className="text-ds-xs text-ds-fg/60">Name</Label>
            <Input id="sheet-name" defaultValue="Kevin Noel" />
          </div>
          <div className="space-y-ds-1_5">
            <Label htmlFor="sheet-handle" className="text-ds-xs text-ds-fg/60">Handle</Label>
            <Input id="sheet-handle" defaultValue="@foundation-os" />
          </div>
        </div>
        <SheetFooter>
          <div className="flex gap-ds-2 justify-end">
            <SheetClose asChild><Button variant="outline">Cancel</Button></SheetClose>
            <Button variant="gradient">Save</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
