import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './switch'

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
}
export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
  render: () => (<Switch />),
}
