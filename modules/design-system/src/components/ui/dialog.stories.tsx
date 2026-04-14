import type { Meta, StoryObj } from '@storybook/react-vite'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog'
import { Button } from './button'

const meta: Meta = {
  title: 'UI/Dialog',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Dialog><DialogTrigger asChild><Button>Open dialog</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Dialog title</DialogTitle><DialogDescription>Dialog description.</DialogDescription></DialogHeader></DialogContent></Dialog>),
}
