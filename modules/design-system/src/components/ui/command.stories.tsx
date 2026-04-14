import type { Meta, StoryObj } from '@storybook/react-vite'
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut } from './command'
import { Calendar, Smile, User, CreditCard, Settings } from 'lucide-react'

const meta: Meta = { title: 'UI/Command' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Command className="rounded-ds-lg border border-ds-border/8 w-[420px] shadow-[var(--ds-shadow-card)]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem><Calendar size={14} /><span>Calendar</span></CommandItem>
          <CommandItem><Smile size={14} /><span>Search emoji</span></CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem><User size={14} /><span>Profile</span><CommandShortcut>⌘P</CommandShortcut></CommandItem>
          <CommandItem><CreditCard size={14} /><span>Billing</span><CommandShortcut>⌘B</CommandShortcut></CommandItem>
          <CommandItem><Settings size={14} /><span>Settings</span><CommandShortcut>⌘S</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}
