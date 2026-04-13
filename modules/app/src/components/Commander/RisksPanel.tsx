import { Card, Badge } from '@/components'
import type { Risk } from '@/lib/database.types'

interface RisksPanelProps {
  risks: Risk[]
}

const levelColor = (v: string) =>
  ({ high: '#f43f5e', medium: '#f59e0b', low: '#34d399' }[v] ?? '#6b7280')

const statusColor = (v: string) =>
  ({ open: '#f43f5e', mitigated: '#f59e0b', closed: '#34d399' }[v] ?? '#6b7280')

export function RisksPanel({ risks }: RisksPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      {risks.map((r) => (
        <Card key={r.id}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-blue-400 tracking-wider">{r.id}</span>
                <Badge label={`impact ${r.impact}`} color={levelColor(r.impact)} />
                <Badge label={`proba ${r.proba}`} color={levelColor(r.proba)} />
              </div>
              <p className="text-xs text-white/90 mb-1">{r.risk}</p>
              {r.mitigation && (
                <p className="text-[10px] text-white/40">Mitigation · {r.mitigation}</p>
              )}
            </div>
            <Badge label={r.status} color={statusColor(r.status)} />
          </div>
        </Card>
      ))}
    </div>
  )
}
