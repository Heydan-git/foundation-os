import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from './separator'

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
}
export default meta
type Story = StoryObj<typeof Separator>

export const Default: Story = {
  render: () => (<div className="w-[300px]"><Separator /></div>),
}
