import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const meta: Meta = {
  title: 'UI/Avatar',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Avatar><AvatarImage src="https://github.com/shadcn.png" alt="@user" /><AvatarFallback>CN</AvatarFallback></Avatar>),
}
