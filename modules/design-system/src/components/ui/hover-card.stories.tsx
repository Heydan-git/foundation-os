import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card'

const meta: Meta = { title: 'UI/HoverCard' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <HoverCard openDelay={100}>
      <HoverCardTrigger className="underline cursor-pointer text-ds-blue">@foundation-os</HoverCardTrigger>
      <HoverCardContent className="w-[280px]">
        <div className="space-y-ds-2">
          <div className="h-ds-8 w-ds-8 rounded-ds-full bg-ds-blue/20 border border-ds-blue/30 flex items-center justify-center text-ds-blue text-ds-xs font-mono">FO</div>
          <h4 className="text-ds-fg text-ds-base">Foundation OS</h4>
          <p className="text-ds-xs text-ds-fg/60">OS de travail personnel IA-driven. Dark only.</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
