import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'

const meta: Meta = { title: 'UI/Dialog' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button variant="glass">Open dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile. Click save when you are done.</DialogDescription>
        </DialogHeader>
        <div className="space-y-ds-3 py-ds-2">
          <div className="space-y-ds-1_5">
            <Label htmlFor="dialog-name" className="text-ds-xs text-ds-fg/60">Name</Label>
            <Input id="dialog-name" defaultValue="Kevin Noel" />
          </div>
          <div className="space-y-ds-1_5">
            <Label htmlFor="dialog-handle" className="text-ds-xs text-ds-fg/60">Handle</Label>
            <Input id="dialog-handle" defaultValue="@foundation-os" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="gradient">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
