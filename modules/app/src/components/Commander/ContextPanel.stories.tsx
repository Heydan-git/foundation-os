import type { Meta, StoryObj } from '@storybook/react'
import { ContextPanel } from './ContextPanel'
import type { ContextBlock } from '@/lib/database.types'

const meta = {
  title: 'App/Commander/ContextPanel',
  component: ContextPanel,
  tags: ['autodocs'],
} satisfies Meta<typeof ContextPanel>

export default meta
type Story = StoryObj<typeof meta>

const mockContextBlocks: ContextBlock[] = [
  {
    id: 'CTX-001',
    created_at: '2026-04-05T10:00:00Z',
    label: 'Stack technique',
    content: 'Vite + React + TypeScript\nTailwind CSS\nSupabase (auth + DB)\nVercel (deploy)',
    sort_order: 1,
  },
  {
    id: 'CTX-002',
    created_at: '2026-04-05T10:00:00Z',
    label: 'Modules actifs',
    content: 'App Builder — actif, phase 1\nFinance — prevu\nSante — prevu',
    sort_order: 2,
  },
]

export const Default: Story = {
  args: { contextBlocks: mockContextBlocks },
}

export const Single: Story = {
  args: { contextBlocks: [mockContextBlocks[0]] },
}

export const Empty: Story = {
  args: { contextBlocks: [] },
}
