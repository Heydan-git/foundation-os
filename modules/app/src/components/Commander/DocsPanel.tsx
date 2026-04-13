import { Card, Badge } from '@/components'
import type { Doc } from '@/lib/database.types'

interface DocsPanelProps {
  docs: Doc[]
}

const typeColor = (t: string) =>
  ({
    artifact: '#60a5fa',
    plan: '#c084fc',
    doc: '#60a5fa',
    notice: '#f43f5e',
    skill: '#eab308',
    monitoring: '#f43f5e',
    historique: '#6b7280',
    design: '#ec4899',
    guide: '#34d399',
  }[t] ?? '#6b7280')

export function DocsPanel({ docs }: DocsPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      {docs.map((d) => (
        <Card key={d.id}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge label={d.category ?? ''} color={typeColor(d.category ?? '')} />
              <span className="text-[11px] font-mono text-white/90">{d.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/40 truncate max-w-[200px]">{d.content}</span>
              {d.tags && d.tags.length > 0 && (
                <span className="text-[10px] text-white/20">{d.tags[0]}</span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
