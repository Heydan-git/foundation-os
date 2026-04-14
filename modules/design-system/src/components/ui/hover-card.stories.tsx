import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card'

const meta: Meta = {
  title: 'UI/HoverCard',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<HoverCard><HoverCardTrigger className="underline cursor-pointer text-ds-blue text-sm">@hover</HoverCardTrigger><HoverCardContent className="w-[240px] text-xs">Hover content preview</HoverCardContent></HoverCard>),
}
