import { Card } from '@/components'
import type { ContextBlock } from '@/lib/database.types'

interface ContextPanelProps {
  contextBlocks: ContextBlock[]
}

export function ContextPanel({ contextBlocks }: ContextPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {contextBlocks.map((c) => (
        <Card key={c.id}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono text-ds-blue tracking-wider">{c.id}</span>
          </div>
          <p className="text-xs font-semibold text-white/90 mb-2">{c.label}</p>
          {c.content.split('\n').map((line, j) => (
            <p key={j} className="text-[10px] text-white/50 mb-0.5">
              {line}
            </p>
          ))}
        </Card>
      ))}
    </div>
  )
}
