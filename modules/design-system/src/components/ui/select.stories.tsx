import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select'

const meta: Meta = {
  title: 'UI/Select',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Select><SelectTrigger className="w-[240px]"><SelectValue placeholder="Pick one" /></SelectTrigger><SelectContent><SelectItem value="a">Option A</SelectItem><SelectItem value="b">Option B</SelectItem></SelectContent></Select>),
}
