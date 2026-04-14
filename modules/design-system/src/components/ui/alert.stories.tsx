import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, AlertTitle, AlertDescription } from './alert'

const meta: Meta = {
  title: 'UI/Alert',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Alert className="w-[360px]"><AlertTitle>Heads up</AlertTitle><AlertDescription>This is an alert message.</AlertDescription></Alert>),
}
