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
        <div className="flex items-start gap-ds-3">
          <div className="h-10 w-10 rounded-ds-full bg-ds-blue/20 border border-ds-blue/30 flex items-center justify-center text-ds-blue text-ds-xs font-mono shrink-0">
            FO
          </div>
          <div className="space-y-ds-1">
            <h4 className="text-ds-fg/90 text-ds-base">Foundation OS</h4>
            <p className="text-ds-xs text-ds-fg/60 leading-relaxed">OS de travail personnel IA-driven. Dark only. Void Glass tokens.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}
