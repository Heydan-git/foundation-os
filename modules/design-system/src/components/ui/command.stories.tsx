import type { Meta, StoryObj } from '@storybook/react-vite'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from './command'

const meta: Meta = {
  title: 'UI/Command',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<Command className="rounded-md border border-ds-border/5 w-[320px]"><CommandInput placeholder="Search..." /><CommandList><CommandEmpty>No results.</CommandEmpty><CommandGroup heading="Suggestions"><CommandItem>Calendar</CommandItem><CommandItem>Search Emoji</CommandItem></CommandGroup></CommandList></Command>),
}
