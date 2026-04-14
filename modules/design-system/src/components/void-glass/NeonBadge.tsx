import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * NeonBadge — badge pill mono-typographique iso Figma Make.
 * Variants de couleur avec fond + border + text de la meme teinte.
 */
const neonBadgeVariants = cva(
  'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono tracking-wider whitespace-nowrap border shrink-0 transition-colors [&>svg]:size-3 [&>svg]:pointer-events-none',
  {
    variants: {
      tone: {
        default: 'text-white/40 bg-white/[0.05] border-white/[0.08]',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
        blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
        rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        outline: 'text-white/70 bg-transparent border-white/[0.12]',
      },
    },
    defaultVariants: { tone: 'default' },
  },
)

export interface NeonBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof neonBadgeVariants> {}

export function NeonBadge({ tone, className, children, ...props }: NeonBadgeProps) {
  return (
    <span data-slot="neon-badge" className={cn(neonBadgeVariants({ tone }), className)} {...props}>
      {children}
    </span>
  )
}

export { neonBadgeVariants }
