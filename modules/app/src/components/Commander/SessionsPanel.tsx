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
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--color-accent-brand-primary)', letterSpacing: '.08em' }}>{s.id}</span>
                <span style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>{s.date}</span>
              </div>
              <Badge label="session" color="var(--color-accent-brand-primary)" />
            </div>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 6 }}>{s.title}</h3>
            {s.items && (
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                <span style={{ color: 'var(--color-text-ghost)' }}>Items · </span>{s.items}
              </p>
            )}
            {s.decisions && (
              <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                <span style={{ color: 'var(--color-text-ghost)' }}>Décisions · </span>{s.decisions}
              </p>
            )}
          </Card>
        </div>
      ))}
    </div>
  )
}
