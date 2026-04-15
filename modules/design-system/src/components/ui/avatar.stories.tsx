import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const meta: Meta = { title: 'UI/Avatar' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="rounded-ds-xl bg-ds-surface-2/80 backdrop-blur-2xl border border-ds-border/5 p-ds-5 w-[480px] space-y-ds-4">
      <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono block">Sizes & fallbacks</span>
      <div className="flex items-end gap-ds-4">
        <Avatar className="w-ds-6 h-ds-6">
          <AvatarFallback className="text-ds-2xs">SM</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-ds-blue/20 text-ds-blue border-ds-blue/20">KL</AvatarFallback>
        </Avatar>
        <Avatar className="w-14 h-14">
          <AvatarFallback className="bg-ds-purple/20 text-ds-purple border-ds-purple/20">MT</AvatarFallback>
        </Avatar>
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-ds-emerald/20 text-ds-emerald border-ds-emerald/20">YZ</AvatarFallback>
        </Avatar>
      </div>
    </div>
  ),
}
