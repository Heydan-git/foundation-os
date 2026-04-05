import { Card, Badge } from '@/components'
import type { Doc } from '@/lib/database.types'

interface DocsPanelProps {
  docs: Doc[]
}

const typeColor = (t: string) =>
  ({ artifact: '#5EEAD4', plan: '#A78BFA', doc: '#3B82F6', notice: '#F97316', skill: '#EAB308', monitoring: '#EF4444', historique: '#94A3B8', design: '#EC4899', guide: '#22C55E' }[t] ?? '#94A3B8')

export function DocsPanel({ docs }: DocsPanelProps) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {docs.map((d, i) => (
        <div key={d.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 8 }}>
                <Badge label={d.category ?? ''} color={typeColor(d.category ?? '')} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#FAFAFA' }}>{d.title}</span>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ fontSize: 10, color: '#52525B' }}>{d.content}</span>
                {d.tags && d.tags.length > 0 && <span style={{ fontSize: 10, color: '#3F3F46' }}>{d.tags[0]}</span>}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}
