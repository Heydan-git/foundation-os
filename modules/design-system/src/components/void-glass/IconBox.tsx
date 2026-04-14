import type * as React from 'react'
import { cn } from '../../lib/utils'

export interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Taille du conteneur (default 8 = 32px). */
  size?: 6 | 8 | 10
}

/**
 * IconBox — petit conteneur glass carre pour une icone Lucide.
 * Fond noir profond (#050505), border white/[0.08], inset shadow.
 */
export function IconBox({ size = 8, className, children, ...props }: IconBoxProps) {
  const sizeClass = size === 6 ? 'w-6 h-6' : size === 10 ? 'w-10 h-10' : 'w-8 h-8'
  return (
    <div
      data-slot="icon-box"
      className={cn(
        sizeClass,
        'rounded-md bg-[#050505] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
