import type { Meta, StoryObj } from '@storybook/react'
import { RisksPanel } from './RisksPanel'
import type { Risk } from '@/lib/database.types'

const meta = {
  title: 'App/Commander/RisksPanel',
  component: RisksPanel,
  tags: ['autodocs'],
} satisfies Meta<typeof RisksPanel>

export default meta
type Story = StoryObj<typeof meta>

const mockRisks: Risk[] = [
  {
    id: 'R-001',
    created_at: '2026-04-05T10:00:00Z',
    risk: 'Context compaction mid-session causes state loss',
    impact: 'high',
    proba: 'medium',
    mitigation: 'Split tasks into short phases, save CONTEXT.md before compaction',
    status: 'open',
  },
  {
    id: 'R-002',
    created_at: '2026-04-10T10:00:00Z',
    risk: 'Supabase RLS misconfiguration exposes data',
    impact: 'high',
    proba: 'low',
    mitigation: 'review-agent audit before any deploy',
    status: 'mitigated',
  },
]

export const Default: Story = {
  args: { risks: mockRisks },
}

export const Open: Story = {
  args: { risks: [mockRisks[0]] },
}

export const Empty: Story = {
  args: { risks: [] },
}
