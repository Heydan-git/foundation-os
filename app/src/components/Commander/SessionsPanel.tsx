import { Card, Badge } from '@/components'
import type { Session } from '@/lib/database.types'

interface SessionsPanelProps {
  sessions: Session[]
}

export function SessionsPanel({ sessions }: SessionsPanelProps) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {sessions.map((s, i) => (
        <div key={s.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{s.id}</span>
                <span style={{ fontSize: 10, color: '#52525B' }}>{s.date}</span>
                {s.phase && (
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#3F3F46' }}>P{s.phase}</span>
                )}
              </div>
              <Badge label={s.status} color={s.status === 'active' ? '#5EEAD4' : '#52525B'} />
            </div>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: '#FAFAFA', marginBottom: 6 }}>{s.title}</h3>
            {s.items && (
              <p style={{ fontSize: 10, color: '#71717A', marginBottom: 4 }}>
                <span style={{ color: '#3F3F46' }}>Items · </span>{s.items}
              </p>
            )}
            {s.decisions && (
              <p style={{ fontSize: 10, color: '#71717A' }}>
                <span style={{ color: '#3F3F46' }}>Décisions · </span>{s.decisions}
              </p>
            )}
          </Card>
        </div>
      ))}
    </div>
  )
}
