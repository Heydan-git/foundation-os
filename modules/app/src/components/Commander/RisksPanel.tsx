import { Card, Badge } from '@/components'
import type { Risk } from '@/lib/database.types'

interface RisksPanelProps {
  risks: Risk[]
}

const levelColor = (v: string) =>
  ({ high: 'var(--color-accent-danger)', medium: 'var(--color-accent-danger)', low: 'var(--color-accent-success)' }[v] ?? 'var(--color-text-muted)')

const statusColor = (v: string) =>
  ({ open: 'var(--color-accent-danger)', mitigated: 'var(--color-accent-danger)', closed: 'var(--color-accent-success)' }[v] ?? 'var(--color-text-muted)')

export function RisksPanel({ risks }: RisksPanelProps) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {risks.map((r, i) => (
        <div key={r.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-start justify-between">
              <div style={{ flex: 1 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--color-accent-brand-primary)', letterSpacing: '.08em' }}>{r.id}</span>
                  <Badge label={`impact ${r.impact}`} color={levelColor(r.impact)} />
                  <Badge label={`proba ${r.proba}`}   color={levelColor(r.proba)} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-primary)', marginBottom: 4 }}>{r.risk}</p>
                {r.mitigation && (
                  <p style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>Mitigation · {r.mitigation}</p>
                )}
              </div>
              <Badge label={r.status} color={statusColor(r.status)} />
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
