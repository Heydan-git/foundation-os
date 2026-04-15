import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible'
import { Button } from './button'

const meta: Meta = { title: 'UI/Collapsible' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <div className="w-[360px] space-y-ds-2">
      <Collapsible defaultOpen>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">Toggle details</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-ds-2 p-ds-3 rounded-ds-md bg-ds-surface-2 border border-ds-border/5 text-ds-sm text-ds-fg/80">
          Revealed content — use for progressive disclosure, filters, accordions single.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
}
