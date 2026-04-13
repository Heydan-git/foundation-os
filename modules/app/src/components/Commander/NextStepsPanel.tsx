import { Card, Badge } from '@/components'
import type { NextStep } from '@/lib/database.types'

interface NextStepsPanelProps {
  nextSteps: NextStep[]
}

const priorityColor = (p: string) =>
  ({ critical: 'var(--color-accent-danger)', high: 'var(--color-accent-danger)', medium: '#EAB308', low: 'var(--color-text-muted)' }[p] ?? 'var(--color-text-muted)')

const statusColor = (s: string) =>
  ({ todo: 'var(--color-text-faint)', in_progress: 'var(--color-accent-brand-primary)', done: 'var(--color-accent-success)' }[s] ?? 'var(--color-text-faint)')

export function NextStepsPanel({ nextSteps }: NextStepsPanelProps) {
  const todo       = nextSteps.filter(n => n.status === 'todo')
  const inProgress = nextSteps.filter(n => n.status === 'in_progress')
  const done       = nextSteps.filter(n => n.status === 'done')
  const ordered    = [...inProgress, ...todo, ...done]

  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {ordered.map((n, i) => (
        <div key={n.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: statusColor(n.status),
                  display: 'inline-block',
                  flexShrink: 0,
                  animation: n.status === 'in_progress' ? 'pulse 2s infinite' : 'none',
                }} />
                <span style={{ fontSize: 12, color: n.status === 'done' ? 'var(--color-text-faint)' : 'var(--color-text-primary)', textDecoration: n.status === 'done' ? 'line-through' : 'none' }}>
                  {n.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {n.phase && (
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--color-text-ghost)' }}>{n.phase}</span>
                )}
                <Badge label={n.priority} color={priorityColor(n.priority)} />
                <Badge label={n.status}   color={statusColor(n.status)} />
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
