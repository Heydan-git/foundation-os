import { Card, Badge } from '@/components'
import type { Decision } from '@/lib/database.types'

interface DecisionsPanelProps {
  decisions: Decision[]
}

const impactColor = (v: string) =>
  ({ high: '#f43f5e', medium: '#f59e0b', low: '#34d399' }[v] ?? '#6b7280')

export function DecisionsPanel({ decisions }: DecisionsPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {decisions.map((d) => (
        <Card key={d.id}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-blue-400 tracking-wider">{d.id}</span>
            <div className="flex gap-1">
              <Badge label={d.impact} color={impactColor(d.impact)} />
              <Badge label={d.status} color="#60a5fa" />
            </div>
          </div>
          <p className="text-xs font-medium text-white/90 mb-1">{d.title}</p>
          {d.context && <p className="text-[10px] text-white/40">{d.context}</p>}
          <p className="text-[9px] text-white/20 mt-1 font-mono">{d.date}</p>
        </Card>
      ))}
    </div>
  )
}
