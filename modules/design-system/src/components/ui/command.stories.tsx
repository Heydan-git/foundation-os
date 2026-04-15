import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from './command'
import { Calendar, Smile, User, CreditCard, Settings } from 'lucide-react'

const meta: Meta = { title: 'UI/Command' }
export default meta
type Story = StoryObj

/**
 * Iso base DS : palette `bg-ds-surface-2 border ds-border/8 rounded-ds-lg`
 * avec input `placeholder:ds-fg/30`, items avec icon + label + shortcut mono.
 */
export const Default: Story = {
  render: () => (
    <Command className="rounded-ds-lg border border-ds-border/8 w-[420px] shadow-[var(--ds-shadow-dropdown)]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Search emoji</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User />
            <span>Profile</span>
            <CommandShortcut>Cmd+P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCard />
            <span>Billing</span>
            <CommandShortcut>Cmd+B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <Settings />
            <span>Settings</span>
            <CommandShortcut>Cmd+S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}
