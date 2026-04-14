import { Card, Badge } from '@/components'
import type { Session } from '@/lib/database.types'

interface SessionsPanelProps {
  sessions: Session[]
}

export function SessionsPanel({ sessions }: SessionsPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      {sessions.map((s) => (
        <Card key={s.id}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-ds-blue tracking-wider">{s.id}</span>
              <span className="text-[10px] text-white/30">{s.date}</span>
            </div>
            <Badge label="session" color="#60a5fa" />
          </div>
          <h3 className="text-xs font-semibold text-white/90 mb-1.5">{s.title}</h3>
          {s.items && (
            <p className="text-[10px] text-white/50 mb-1">
              <span className="text-white/30">Items · </span>{s.items}
            </p>
          )}
          {s.decisions && (
            <p className="text-[10px] text-white/50">
              <span className="text-white/30">Decisions · </span>{s.decisions}
            </p>
          )}
        </Card>
      ))}
    </div>
  )
}
