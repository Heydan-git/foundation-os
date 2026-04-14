import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface HashPillProps {
  hash: string
  /** Tone de la couleur du hash (default: blue). */
  tone?: 'blue' | 'purple' | 'emerald' | 'amber' | 'rose' | 'white'
  className?: string
  /** Active le bouton copy. */
  copyable?: boolean
}

const TONE: Record<NonNullable<HashPillProps['tone']>, string> = {
  blue: 'text-blue-400/90',
  purple: 'text-purple-400/90',
  emerald: 'text-emerald-400/90',
  amber: 'text-amber-400/90',
  rose: 'text-rose-400/90',
  white: 'text-white/80',
}

/**
 * HashPill — code pill mono-typographique pour afficher un hash/id, avec copie optionnelle.
 */
export function HashPill({ hash, tone = 'blue', copyable = true, className }: HashPillProps) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(hash).catch(() => undefined)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <span data-slot="hash-pill" className={cn('inline-flex items-center gap-1.5', className)}>
      <code
        className={cn(
          'px-1.5 py-0.5 rounded bg-[#050505] border border-white/[0.05] text-[10px] font-mono shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]',
          TONE[tone],
        )}
      >
        {hash}
      </code>
      {copyable ? (
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Copie' : 'Copier'}
          className="text-white/30 hover:text-white/90 transition-colors p-0.5"
        >
          {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
        </button>
      ) : null}
    </span>
  )
}
