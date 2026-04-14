import type { Meta, StoryObj } from '@storybook/react-vite'
import { AspectRatio } from './aspect-ratio'

const meta: Meta = {
  title: 'UI/AspectRatio',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<div className="w-[300px]"><AspectRatio ratio={16 / 9} className="bg-ds-surface-2 rounded-md flex items-center justify-center text-ds-fg/60">16:9</AspectRatio></div>),
}
