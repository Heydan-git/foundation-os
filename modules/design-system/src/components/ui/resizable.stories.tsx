import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable'

const meta: Meta = {
  title: 'UI/Resizable',
}
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (<ResizablePanelGroup direction="horizontal" className="w-[400px] h-[160px] rounded-md border border-ds-border/5"><ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center text-xs">Panel A</div></ResizablePanel><ResizableHandle /><ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center text-xs">Panel B</div></ResizablePanel></ResizablePanelGroup>),
}
