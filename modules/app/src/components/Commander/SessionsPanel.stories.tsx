import type { Meta, StoryObj } from '@storybook/react-vite'
import { SessionsPanel } from './SessionsPanel'
import type { Session } from '@/lib/database.types'

const meta = {
  title: 'App/Commander/SessionsPanel',
  component: SessionsPanel,
  tags: ['autodocs'],
} satisfies Meta<typeof SessionsPanel>

export default meta
type Story = StoryObj<typeof meta>

const mockSessions: Session[] = [
  {
    id: 'S-001',
    created_at: '2026-04-10T10:00:00Z',
    date: '2026-04-10',
    title: 'Design system foundations — tokens + button',
    items: 'Button, Badge, Card, LoadingSkeleton',
    decisions: 'Adopt DTCG semantic tokens, Void Glass dark only',
    phase: 'phase-1',
    status: 'closed',
  },
  {
    id: 'S-002',
    created_at: '2026-04-12T09:00:00Z',
    date: '2026-04-12',
    title: 'Storybook setup — form primitives + feedback',
    items: 'Input, Select, Textarea, Checkbox, Switch, Alert, Toast',
    decisions: null,
    phase: 'phase-1',
    status: 'closed',
  },
  {
    id: 'S-003',
    created_at: '2026-04-14T08:30:00Z',
    date: '2026-04-14',
    title: 'App Commander stories — blocs 4-7',
    items: null,
    decisions: null,
    phase: 'phase-1',
    status: 'active',
  },
]

export const Default: Story = {
  args: { sessions: mockSessions },
}

export const Single: Story = {
  args: { sessions: [mockSessions[0]] },
}

export const Empty: Story = {
  args: { sessions: [] },
}
