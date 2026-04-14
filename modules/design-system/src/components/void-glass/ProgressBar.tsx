import { cn } from '../../lib/utils'

export interface ProgressBarProps {
  /** Valeur 0..100. */
  value: number
  /** Variante de couleur. */
  tone?: 'gradient' | 'emerald' | 'blue' | 'purple' | 'amber' | 'rose'
  className?: string
  /** Epaisseur (1..2). */
  height?: 'sm' | 'md'
}

const TONE_FILL: Record<NonNullable<ProgressBarProps['tone']>, string> = {
  gradient: 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]',
  emerald: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]',
  blue: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.4)]',
  purple: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]',
  amber: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.4)]',
  rose: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.4)]',
}

/**
 * ProgressBar — barre de progression iso Figma Make (agents, chargement, etc.)
 */
export function ProgressBar({ value, tone = 'gradient', height = 'sm', className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const isComplete = clamped === 100
  const fillTone = isComplete ? 'emerald' : tone
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        'w-full bg-white/[0.03] rounded-full overflow-hidden',
        height === 'md' ? 'h-1.5' : 'h-1',
        className,
      )}
    >
      <div
        className={cn('h-full rounded-full relative', TONE_FILL[fillTone])}
        style={{ width: `${clamped}%` }}
      >
        {!isComplete && clamped > 0 ? (
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-[1px]" />
        ) : null}
      </div>
    </div>
  )
}
