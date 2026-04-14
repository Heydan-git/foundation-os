import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toaster } from './sonner'
import { Button } from './button'
import { toast } from 'sonner'

const meta: Meta = {
  title: 'UI/Toaster',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<><Button onClick={() => toast("Toast fired")}>Show toast</Button><Toaster /></>),
}
