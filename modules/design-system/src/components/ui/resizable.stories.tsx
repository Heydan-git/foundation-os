import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable'

const meta: Meta = { title: 'UI/Resizable' }
export default meta
type Story = StoryObj

export const Default: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="w-[520px] h-[240px] rounded-ds-md border border-ds-border/8 overflow-hidden">
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center p-ds-4 bg-ds-surface-1 text-ds-fg/80">Sidebar</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={60}><div className="flex h-full items-center justify-center p-ds-4 bg-ds-surface-2 text-ds-fg/80">Editor</div></ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={40}><div className="flex h-full items-center justify-center p-ds-4 bg-ds-surface-1 text-ds-fg/60 text-ds-xs font-mono">Terminal</div></ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
