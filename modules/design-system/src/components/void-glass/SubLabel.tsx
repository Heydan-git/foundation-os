import type * as React from 'react'
import { cn } from '../../lib/utils'

/**
 * SubLabel — texte mono uppercase tres fin, utilise pour les labels de section
 * (ex: "NETWORK ACTIVITY", "LEDGER", "SESSIONS").
 */
export function SubLabel({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="sub-label"
      className={cn(
        'text-[9px] uppercase tracking-wider text-white/40 font-mono',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
