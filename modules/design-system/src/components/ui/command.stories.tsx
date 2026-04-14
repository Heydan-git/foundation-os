import type { Meta, StoryObj } from '@storybook/react'
import { Calendar, Smile, Calculator } from 'lucide-react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from './command'

const meta = {
  title: 'Navigation/Command',
  component: Command,
  tags: ['autodocs'],
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md w-64">
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <Calendar />
            <span>Calendar</span>
          </CommandItem>
          <CommandItem>
            <Smile />
            <span>Emoji</span>
          </CommandItem>
          <CommandItem>
            <Calculator />
            <span>Calculator</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
}
