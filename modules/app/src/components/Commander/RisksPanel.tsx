import { Card, Badge } from '@/components'
import type { Risk } from '@/lib/database.types'

interface RisksPanelProps {
  risks: Risk[]
}

const levelColor = (v: string) =>
  ({ high: '#EF4444', medium: '#F97316', low: '#22C55E' }[v] ?? '#94A3B8')

const statusColor = (v: string) =>
  ({ open: '#EF4444', mitigated: '#F97316', closed: '#22C55E' }[v] ?? '#94A3B8')

export function RisksPanel({ risks }: RisksPanelProps) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {risks.map((r, i) => (
        <div key={r.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-start justify-between">
              <div style={{ flex: 1 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{r.id}</span>
                  <Badge label={`impact ${r.impact}`} color={levelColor(r.impact)} />
                  <Badge label={`proba ${r.proba}`}   color={levelColor(r.proba)} />
                </div>
                <p style={{ fontSize: 12, color: '#FAFAFA', marginBottom: 4 }}>{r.risk}</p>
                {r.mitigation && (
                  <p style={{ fontSize: 10, color: '#52525B' }}>Mitigation · {r.mitigation}</p>
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
