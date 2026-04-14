import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const meta: Meta = { title: 'UI/Avatar' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[480px] space-y-ds-4">
      <div>
        <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">Sizes & fallbacks</span>
        <div className="flex items-center gap-ds-3">
          <Avatar className="h-6 w-6"><AvatarFallback>SM</AvatarFallback></Avatar>
          <Avatar><AvatarImage src="https://github.com/shadcn.png" alt="@user" /><AvatarFallback>CN</AvatarFallback></Avatar>
          <Avatar className="h-12 w-12"><AvatarFallback className="bg-ds-blue/20 text-ds-blue">KL</AvatarFallback></Avatar>
          <Avatar className="h-14 w-14"><AvatarFallback className="bg-ds-purple/20 text-ds-purple">MT</AvatarFallback></Avatar>
          <Avatar className="h-16 w-16"><AvatarFallback className="bg-ds-emerald/20 text-ds-emerald">YZ</AvatarFallback></Avatar>
        </div>
      </div>
    </div>
  ),
}
