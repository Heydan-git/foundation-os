import type * as React from 'react'
import { cn } from '../../lib/utils'

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Couleur du glow au hover (ex: 'bg-blue-500/10', 'bg-purple-500/10'). */
  glow?: string
  /** Position du glow (default: top-right). */
  glowPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

const GLOW_POSITION: Record<string, string> = {
  'top-right': 'top-[-20%] right-[-10%]',
  'top-left': 'top-[-20%] left-[-10%]',
  'bottom-right': 'bottom-[-20%] right-[-10%]',
  'bottom-left': 'bottom-[-20%] left-[-10%]',
}

/**
 * GlassCard — conteneur glass iso Figma Make.
 * Fond rounded-xl, bg-[#0a0a0a]/80, backdrop-blur-2xl, border-white/[0.05].
 * Top gradient line + glow radial apparaissent au hover.
 */
export function GlassCard({ glow, glowPosition = 'top-right', className, children, ...props }: GlassCardProps) {
  return (
    <div
      data-slot="glass-card"
      className={cn(
        'rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] p-5 relative overflow-hidden group',
        'hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500',
        className,
      )}
      {...props}
    >
      {glow ? (
        <div
          className={cn(
            'absolute w-[40%] h-[40%] blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700',
            GLOW_POSITION[glowPosition],
            glow,
          )}
        />
      ) : null}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
