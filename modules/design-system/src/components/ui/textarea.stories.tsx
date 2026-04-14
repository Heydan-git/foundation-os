import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
}
export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
  render: () => (<Textarea placeholder="Your message..." rows={4} />),
}
