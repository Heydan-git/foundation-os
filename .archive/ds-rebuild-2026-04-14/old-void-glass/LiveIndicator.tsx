import type * as React from 'react'
import { cn } from '../../lib/utils'
import { StatusDot } from './StatusDot'

export interface LiveIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  tone?: 'emerald' | 'blue' | 'purple' | 'amber' | 'rose'
  pulse?: boolean
}

/**
 * LiveIndicator — badge "SYNC: 100%" / "SUPABASE LIVE" iso DashboardHome header.
 * Pill avec dot pulsant + label mono uppercase.
 */
export function LiveIndicator({
  label,
  tone = 'emerald',
  pulse = true,
  className,
  ...props
}: LiveIndicatorProps) {
  return (
    <div
      data-slot="live-indicator"
      className={cn(
        'inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] w-fit',
        className,
      )}
      {...props}
    >
      <StatusDot tone={tone} pulse={pulse} size="sm" />
      <span className="text-[10px] font-mono tracking-wider text-white/70">{label}</span>
    </div>
  )
}
