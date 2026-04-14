import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from './toggle'

const meta: Meta<typeof Toggle> = {
  title: 'UI/Toggle',
  component: Toggle,
}
export default meta
type Story = StoryObj<typeof Toggle>

export const Default: Story = {
  render: () => (<Toggle>Toggle</Toggle>),
}
