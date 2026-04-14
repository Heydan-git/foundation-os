import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface SectionHeaderProps {
  icon?: LucideIcon
  /** Couleur de l'icone (ex: 'text-blue-400'). */
  iconColor?: string
  /** Background du glow derriere l'icone (ex: 'bg-blue-500/30'). */
  glowColor?: string
  /** Origine du gradient de ligne a gauche (ex: 'from-blue-500'). */
  lineColor?: string
  /** Label a droite. */
  label: string
  className?: string
}

/**
 * SectionHeader — titre de section iso DashboardDesignSystem.
 * Ligne gradient a gauche + icone dans un glow + label.
 */
export function SectionHeader({
  icon: Icon,
  iconColor = 'text-white/70',
  glowColor = 'bg-white/20',
  lineColor = 'from-white/30',
  label,
  className,
}: SectionHeaderProps) {
  return (
    <div data-slot="section-header" className={cn('flex items-center gap-3', className)}>
      <div className={cn('w-8 h-[1px] bg-gradient-to-r to-transparent', lineColor)} />
      <h2 className="text-base text-white/90 flex items-center gap-2">
        {Icon ? (
          <span className="relative flex items-center justify-center w-5 h-5">
            <span className={cn('absolute inset-0 rounded-md blur-[6px]', glowColor)} />
            <Icon size={12} className={cn(iconColor, 'relative z-10')} />
          </span>
        ) : null}
        {label}
      </h2>
    </div>
  )
}
