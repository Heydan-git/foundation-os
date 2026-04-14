import type * as React from 'react'
import { cn } from '../../lib/utils'

type Tone = 'emerald' | 'blue' | 'purple' | 'amber' | 'rose' | 'white'

export interface StatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone
  pulse?: boolean
  size?: 'xs' | 'sm' | 'md'
}

const TONE: Record<Tone, { bg: string; shadow: string }> = {
  emerald: { bg: 'bg-emerald-400', shadow: 'shadow-[0_0_8px_rgba(52,211,153,0.8)]' },
  blue: { bg: 'bg-blue-400', shadow: 'shadow-[0_0_8px_rgba(96,165,250,0.8)]' },
  purple: { bg: 'bg-purple-400', shadow: 'shadow-[0_0_8px_rgba(168,85,247,0.8)]' },
  amber: { bg: 'bg-amber-400', shadow: 'shadow-[0_0_8px_rgba(251,191,36,0.8)]' },
  rose: { bg: 'bg-rose-400', shadow: 'shadow-[0_0_8px_rgba(251,113,133,0.8)]' },
  white: { bg: 'bg-white/80', shadow: 'shadow-[0_0_8px_rgba(255,255,255,0.6)]' },
}

const SIZE = { xs: 'w-1 h-1', sm: 'w-1.5 h-1.5', md: 'w-2 h-2' }

/**
 * StatusDot — point d'etat pulsant iso Figma Make (LIVE, actif, waiting, error).
 */
export function StatusDot({ tone = 'emerald', pulse = true, size = 'sm', className, ...props }: StatusDotProps) {
  const t = TONE[tone]
  return (
    <div
      data-slot="status-dot"
      className={cn('rounded-full inline-block', SIZE[size], t.bg, t.shadow, pulse && 'animate-pulse', className)}
      {...props}
    />
  )
}
