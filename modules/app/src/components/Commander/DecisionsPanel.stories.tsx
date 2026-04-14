import type { Meta, StoryObj } from '@storybook/react-vite'
import { DecisionsPanel } from './DecisionsPanel'
import type { Decision } from '@/lib/database.types'

const meta = {
  title: 'App/Commander/DecisionsPanel',
  component: DecisionsPanel,
  tags: ['autodocs'],
} satisfies Meta<typeof DecisionsPanel>

export default meta
type Story = StoryObj<typeof meta>

const mockDecisions: Decision[] = [
  {
    id: 'D-001',
    created_at: '2026-04-05T10:00:00Z',
    date: '2026-04-05',
    title: 'Adopt Void Glass design system — dark only, #030303 base',
    context: 'ISO Figma Make preview, no light mode planned',
    impact: 'high',
    status: 'active',
  },
  {
    id: 'D-002',
    created_at: '2026-04-09T09:00:00Z',
    date: '2026-04-09',
    title: 'npm workspaces at repo root — package.json root = workspace only',
    context: 'Separates app, design-system, future modules cleanly',
    impact: 'medium',
    status: 'active',
  },
  {
    id: 'D-003',
    created_at: '2026-04-10T08:00:00Z',
    date: '2026-04-10',
    title: 'Storybook hosted in design-system module, scans app stories via glob',
    context: null,
    impact: 'low',
    status: 'active',
  },
]

export const Default: Story = {
  args: { decisions: mockDecisions },
}

export const HighImpact: Story = {
  args: { decisions: [mockDecisions[0]] },
}

export const Empty: Story = {
  args: { decisions: [] },
}
