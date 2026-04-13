import { Card, Badge } from '@/components'
import type { NextStep } from '@/lib/database.types'

interface NextStepsPanelProps {
  nextSteps: NextStep[]
}

const priorityColor = (p: string) =>
  ({ critical: '#f43f5e', high: '#f43f5e', medium: '#eab308', low: '#6b7280' }[p] ?? '#6b7280')

const statusColor = (s: string) =>
  ({ todo: '#6b7280', in_progress: '#60a5fa', done: '#34d399' }[s] ?? '#6b7280')

export function NextStepsPanel({ nextSteps }: NextStepsPanelProps) {
  const todo = nextSteps.filter((n) => n.status === 'todo')
  const inProgress = nextSteps.filter((n) => n.status === 'in_progress')
  const done = nextSteps.filter((n) => n.status === 'done')
  const ordered = [...inProgress, ...todo, ...done]

  return (
    <div className="flex flex-col gap-2">
      {ordered.map((n) => (
        <Card key={n.id}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${n.status === 'in_progress' ? 'animate-pulse' : ''}`}
                style={{
                  background: statusColor(n.status),
                  boxShadow:
                    n.status === 'in_progress'
                      ? '0 0 8px rgba(96,165,250,0.8)'
                      : 'none',
                }}
              />
              <span
                className={`text-xs ${
                  n.status === 'done'
                    ? 'text-white/40 line-through'
                    : 'text-white/90'
                }`}
              >
                {n.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {n.phase && (
                <span className="text-[9px] font-mono text-white/20">{n.phase}</span>
              )}
              <Badge label={n.priority} color={priorityColor(n.priority)} />
              <Badge label={n.status} color={statusColor(n.status)} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
