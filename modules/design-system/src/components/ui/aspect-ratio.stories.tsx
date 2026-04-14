import type { Meta, StoryObj } from '@storybook/react-vite'
import { AspectRatio } from './aspect-ratio'

const meta: Meta = { title: 'UI/AspectRatio' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[420px]">
      <AspectRatio ratio={16 / 9} className="bg-gradient-to-br from-ds-blue/20 to-ds-purple/20 rounded-ds-md flex items-center justify-center text-ds-fg/80 font-mono text-ds-sm border border-ds-blue/20">
        16 : 9
      </AspectRatio>
    </div>
  ),
}
