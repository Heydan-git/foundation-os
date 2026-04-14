import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './dialog'
import { Button } from './button'

const meta: Meta = { title: 'UI/Dialog' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Make changes to your profile. Click save when you are done.</DialogDescription>
        </DialogHeader>
        <div className="space-y-ds-3 py-ds-2">
          <div className="h-ds-8 rounded-ds-md bg-ds-surface-1 border border-ds-border/5" />
          <div className="h-ds-8 rounded-ds-md bg-ds-surface-1 border border-ds-border/5" />
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
