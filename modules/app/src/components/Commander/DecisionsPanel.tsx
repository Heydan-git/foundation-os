import { Card, Badge } from '@/components'
import type { Decision } from '@/lib/database.types'

interface DecisionsPanelProps {
  decisions: Decision[]
}

const impactColor = (v: string) =>
  ({ high: 'var(--fos-color-accent-danger)', medium: 'var(--fos-color-status-alert)', low: 'var(--fos-color-status-done)' }[v] ?? 'var(--fos-color-text-subtle)')

export function DecisionsPanel({ decisions }: DecisionsPanelProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
      {decisions.map((d, i) => (
        <div key={d.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fos-color-accent-brand)', letterSpacing: '.08em' }}>{d.id}</span>
              <div className="flex" style={{ gap: 4 }}>
                <Badge label={d.impact}  color={impactColor(d.impact)} />
                <Badge label={d.status}  color="var(--fos-color-accent-brand)" />
              </div>
            </div>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--fos-color-text-bright)', marginBottom: 4 }}>{d.title}</p>
            {d.context && <p style={{ fontSize: 10, color: 'var(--fos-color-text-faint)' }}>{d.context}</p>}
            <p style={{ fontSize: 9, color: 'var(--fos-color-text-ghost)', marginTop: 4 }}>{d.date}</p>
          </Card>
        </div>
      ))}
    </div>
  )
}
