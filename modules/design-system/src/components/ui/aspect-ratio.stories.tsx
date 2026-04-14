import type { Meta, StoryObj } from '@storybook/react'
import { AspectRatio } from './aspect-ratio'

const meta = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-72">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md">
        <img
          src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80"
          alt="Landscape placeholder"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  ),
}
