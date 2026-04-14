import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './checkbox'

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
}
export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  render: () => (<Checkbox />),
}
