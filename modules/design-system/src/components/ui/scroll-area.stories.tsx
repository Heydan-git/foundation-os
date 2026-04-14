import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from './scroll-area'

const meta: Meta = {
  title: 'UI/ScrollArea',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<ScrollArea className="h-[200px] w-[300px] rounded-md border border-ds-border/5 p-3 text-xs"><div className="space-y-2">{Array.from({ length: 30 }).map((_, i) => (<div key={i}>Row {i + 1}</div>))}</div></ScrollArea>),
}
