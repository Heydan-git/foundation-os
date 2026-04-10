import { Card, Badge } from '@/components'
import type { Risk } from '@/lib/database.types'

interface RisksPanelProps {
  risks: Risk[]
}

const levelColor = (v: string) =>
  ({ high: 'var(--fos-color-accent-danger)', medium: 'var(--fos-color-status-alert)', low: 'var(--fos-color-status-done)' }[v] ?? 'var(--fos-color-text-subtle)')

const statusColor = (v: string) =>
  ({ open: 'var(--fos-color-accent-danger)', mitigated: 'var(--fos-color-status-alert)', closed: 'var(--fos-color-status-done)' }[v] ?? 'var(--fos-color-text-subtle)')

export function RisksPanel({ risks }: RisksPanelProps) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {risks.map((r, i) => (
        <div key={r.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-start justify-between">
              <div style={{ flex: 1 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--fos-color-accent-brand)', letterSpacing: '.08em' }}>{r.id}</span>
                  <Badge label={`impact ${r.impact}`} color={levelColor(r.impact)} />
                  <Badge label={`proba ${r.proba}`}   color={levelColor(r.proba)} />
                </div>
                <p style={{ fontSize: 12, color: 'var(--fos-color-text-bright)', marginBottom: 4 }}>{r.risk}</p>
                {r.mitigation && (
                  <p style={{ fontSize: 10, color: 'var(--fos-color-text-faint)' }}>Mitigation · {r.mitigation}</p>
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
