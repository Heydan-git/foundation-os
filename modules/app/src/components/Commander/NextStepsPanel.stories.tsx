import type { Meta, StoryObj } from '@storybook/react-vite'
import { NextStepsPanel } from './NextStepsPanel'
import type { NextStep } from '@/lib/database.types'

const meta = {
  title: 'App/Commander/NextStepsPanel',
  component: NextStepsPanel,
  tags: ['autodocs'],
} satisfies Meta<typeof NextStepsPanel>

export default meta
type Story = StoryObj<typeof meta>

const mockNextSteps: NextStep[] = [
  {
    id: 'NS-001',
    created_at: '2026-04-14T08:00:00Z',
    label: 'Creer stories Storybook blocs 4-7 (app components)',
    phase: 'S1-blocs-4-7',
    priority: 'high',
    status: 'in_progress',
    sort_order: 1,
  },
  {
    id: 'NS-002',
    created_at: '2026-04-14T08:00:00Z',
    label: 'Verifier build Storybook apres ajout stories app',
    phase: 'S1-blocs-4-7',
    priority: 'high',
    status: 'todo',
    sort_order: 2,
  },
  {
    id: 'NS-003',
    created_at: '2026-04-14T08:00:00Z',
    label: 'Refactor app avec composants DS Figma Make',
    phase: 'phase-2',
    priority: 'medium',
    status: 'todo',
    sort_order: 3,
  },
  {
    id: 'NS-004',
    created_at: '2026-04-10T08:00:00Z',
    label: 'Setup Storybook design-system (blocs 1-3)',
    phase: 'S1-blocs-1-3',
    priority: 'high',
    status: 'done',
    sort_order: 4,
  },
]

export const Default: Story = {
  args: { nextSteps: mockNextSteps },
}

export const InProgress: Story = {
  args: { nextSteps: [mockNextSteps[0]] },
}

export const AllDone: Story = {
  args: {
    nextSteps: mockNextSteps.map((n) => ({ ...n, status: 'done' as const })),
  },
}

export const Empty: Story = {
  args: { nextSteps: [] },
}
