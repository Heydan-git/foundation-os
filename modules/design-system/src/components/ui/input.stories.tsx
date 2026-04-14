import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
}
export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  render: () => (<Input placeholder="Type here..." />),
}
