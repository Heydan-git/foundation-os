import type { Meta, StoryObj } from '@storybook/react'
import { DocsPanel } from './DocsPanel'
import type { Doc } from '@/lib/database.types'

const meta = {
  title: 'App/Commander/DocsPanel',
  component: DocsPanel,
  tags: ['autodocs'],
} satisfies Meta<typeof DocsPanel>

export default meta
type Story = StoryObj<typeof meta>

const mockDocs: Doc[] = [
  {
    id: 'DOC-001',
    created_at: '2026-04-05T10:00:00Z',
    title: 'foundation-os-v2-design.md',
    content: 'Design spec v2 — full architecture and module plan',
    category: 'plan',
    tags: ['architecture', 'phase-1'],
    sort_order: 1,
  },
  {
    id: 'DOC-002',
    created_at: '2026-04-05T10:00:00Z',
    title: 'cortex.md',
    content: 'Core OS routing spec — agent table, signals, commands',
    category: 'doc',
    tags: ['core-os'],
    sort_order: 2,
  },
  {
    id: 'DOC-003',
    created_at: '2026-04-09T10:00:00Z',
    title: 'void-glass-tokens.css',
    content: 'DTCG semantic tokens — colors, spacing, radius',
    category: 'artifact',
    tags: ['design-system'],
    sort_order: 3,
  },
  {
    id: 'DOC-004',
    created_at: '2026-04-10T10:00:00Z',
    title: 'health-check.sh',
    content: 'Monitor script — checks build, lint, structure',
    category: 'monitoring',
    tags: ['scripts'],
    sort_order: 4,
  },
]

export const Default: Story = {
  args: { docs: mockDocs },
}

export const Single: Story = {
  args: { docs: [mockDocs[0]] },
}

export const Empty: Story = {
  args: { docs: [] },
}
