import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './progress'

const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
}
export default meta
type Story = StoryObj<typeof Progress>

export const Default: Story = {
  render: () => (<Progress value={60} className="w-[300px]" />),
}
