import type { Meta, StoryObj } from '@storybook/react-vite'
import { Zap, Filter, RefreshCw, Download, Plus, MoreVertical, CheckCircle2 } from 'lucide-react'
import { Button } from './button'

const meta: Meta = { title: 'UI/Button' }
export default meta
type Story = StoryObj

const SubLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-ds-sm uppercase tracking-wider text-ds-fg/40 font-mono mb-ds-3 block">{children}</span>
)

export const Default: Story = {
  render: () => (
    <div className="p-ds-5 rounded-ds-xl bg-ds-surface-2/80 border border-ds-border/5 w-[720px] space-y-ds-5">
      <div>
        <SubLabel>Primary & Sizes</SubLabel>
        <div className="flex flex-wrap items-center gap-ds-3">
          <Button size="xs">XS</Button>
          <Button size="sm">Small</Button>
          <Button>
            <Zap size={14} /> Default
          </Button>
          <Button size="lg">Large</Button>
          <Button size="xl">X-Large</Button>
        </div>
      </div>

      <div>
        <SubLabel>Variants</SubLabel>
        <div className="flex flex-wrap items-center gap-ds-3">
          <Button variant="glass">Glass</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="success">Success</Button>
          <Button variant="destructive">Danger</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </div>

      <div>
        <SubLabel>Icon & Combos</SubLabel>
        <div className="flex flex-wrap items-center gap-ds-2">
          <Button variant="icon" size="icon" title="Filter"><Filter size={14} /></Button>
          <Button variant="icon" size="icon" title="Refresh"><RefreshCw size={14} /></Button>
          <Button variant="icon" size="icon" title="Download"><Download size={14} /></Button>
          <Button variant="icon" size="icon" title="Add"><Plus size={14} /></Button>
          <Button variant="icon" size="icon" title="More"><MoreVertical size={14} /></Button>
        </div>
      </div>

      <div>
        <SubLabel>States</SubLabel>
        <div className="flex flex-wrap items-center gap-ds-3">
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="success">
            <CheckCircle2 size={12} /> Success
          </Button>
          <Button variant="outline" disabled>Disabled outline</Button>
        </div>
      </div>
    </div>
  ),
}
