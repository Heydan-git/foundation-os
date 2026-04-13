import { Card, Badge } from '@/components'
import type { Doc } from '@/lib/database.types'

interface DocsPanelProps {
  docs: Doc[]
}

const typeColor = (t: string) =>
  ({ artifact: 'var(--color-accent-brand-primary)', plan: 'var(--color-accent-brand-secondary)', doc: 'var(--color-accent-info)', notice: 'var(--color-accent-danger)', skill: '#EAB308', monitoring: 'var(--color-accent-danger)', historique: 'var(--color-text-muted)', design: '#EC4899', guide: 'var(--color-accent-success)' }[t] ?? 'var(--color-text-muted)')

export function DocsPanel({ docs }: DocsPanelProps) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {docs.map((d, i) => (
        <div key={d.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 8 }}>
                <Badge label={d.category ?? ''} color={typeColor(d.category ?? '')} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--color-text-primary)' }}>{d.title}</span>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>{d.content}</span>
                {d.tags && d.tags.length > 0 && <span style={{ fontSize: 10, color: 'var(--color-text-ghost)' }}>{d.tags[0]}</span>}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
