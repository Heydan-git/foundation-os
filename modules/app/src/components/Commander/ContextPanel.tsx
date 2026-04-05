import { Card } from '@/components'
import type { ContextBlock } from '@/lib/database.types'

interface ContextPanelProps {
  contextBlocks: ContextBlock[]
}

export function ContextPanel({ contextBlocks }: ContextPanelProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
      {contextBlocks.map((c, i) => (
        <div key={c.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{c.id}</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#FAFAFA', marginBottom: 8 }}>{c.label}</p>
            {c.content.split('\n').map((line, j) => (
              <p key={j} style={{ fontSize: 10, color: '#71717A', marginBottom: 2 }}>{line}</p>
            ))}
          </Card>
        </div>
      ))}
    </div>
  )
}
