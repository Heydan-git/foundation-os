import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover, PopoverTrigger, PopoverContent } from './popover'
import { Button } from './button'
import { Label } from './label'
import { Input } from './input'

const meta: Meta = { title: 'UI/Popover' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
      <PopoverContent className="w-[280px]">
        <div className="space-y-ds-3">
          <div>
            <h4 className="text-ds-fg text-ds-base mb-ds-1">Dimensions</h4>
            <p className="text-ds-xs text-ds-fg/60">Set the dimensions for the layer.</p>
          </div>
          <div className="space-y-ds-2">
            <div className="flex items-center gap-ds-3"><Label htmlFor="width" className="w-16 text-ds-xs">Width</Label><Input id="width" defaultValue="100%" className="h-7" /></div>
            <div className="flex items-center gap-ds-3"><Label htmlFor="height" className="w-16 text-ds-xs">Height</Label><Input id="height" defaultValue="25px" className="h-7" /></div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
