import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from './resizable'

const meta = {
  title: 'Layout/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
} satisfies Meta<typeof ResizablePanelGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  render: () => (
    <ResizablePanelGroup direction="horizontal" className="h-48 w-96 rounded-md border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4">
          <span className="text-sm text-muted-foreground">Left panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4">
          <span className="text-sm text-muted-foreground">Right panel</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}

export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup direction="vertical" className="h-64 w-64 rounded-md border">
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4">
          <span className="text-sm text-muted-foreground">Top panel</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4">
          <span className="text-sm text-muted-foreground">Bottom panel</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
}
