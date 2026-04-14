import type { Meta, StoryObj } from '@storybook/react-vite'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './sheet'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Sheet',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Sheet><SheetTrigger asChild><Button variant="outline">Open sheet</Button></SheetTrigger><SheetContent><SheetHeader><SheetTitle>Sheet title</SheetTitle><SheetDescription>Sheet description.</SheetDescription></SheetHeader></SheetContent></Sheet>),
}
