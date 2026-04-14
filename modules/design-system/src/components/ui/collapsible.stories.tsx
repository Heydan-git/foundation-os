import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'
import { Button } from './button'

const meta = {
  title: 'Layout/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Collapsible className="w-72 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Starred repositories</span>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">Toggle</Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-3 text-sm font-mono">
        @radix-ui/react-collapsible
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-3 text-sm font-mono">
          @radix-ui/react-accordion
        </div>
        <div className="rounded-md border px-4 py-3 text-sm font-mono">
          @radix-ui/react-tabs
        </div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
