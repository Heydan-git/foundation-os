import { Card, Badge } from '@/components'
import type { Doc } from '@/lib/database.types'

interface DocsPanelProps {
  docs: Doc[]
}

const typeColor = (t: string) =>
  ({ artifact: 'var(--fos-color-accent-brand)', plan: 'var(--fos-color-status-parking)', doc: 'var(--fos-color-status-wip)', notice: 'var(--fos-color-status-alert)', skill: '#EAB308', monitoring: 'var(--fos-color-accent-danger)', historique: 'var(--fos-color-text-subtle)', design: '#EC4899', guide: 'var(--fos-color-status-done)' }[t] ?? 'var(--fos-color-text-subtle)')

export function DocsPanel({ docs }: DocsPanelProps) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {docs.map((d, i) => (
        <div key={d.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 8 }}>
                <Badge label={d.category ?? ''} color={typeColor(d.category ?? '')} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'var(--fos-color-text-bright)' }}>{d.title}</span>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ fontSize: 10, color: 'var(--fos-color-text-faint)' }}>{d.content}</span>
                {d.tags && d.tags.length > 0 && <span style={{ fontSize: 10, color: 'var(--fos-color-text-ghost)' }}>{d.tags[0]}</span>}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
