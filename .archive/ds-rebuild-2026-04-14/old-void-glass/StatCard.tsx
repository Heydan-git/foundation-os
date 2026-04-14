import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../../lib/utils'
import { GlassCard } from './GlassCard'
import { IconBox } from './IconBox'
import { NeonBadge, type NeonBadgeProps } from './NeonBadge'
import { SubLabel } from './SubLabel'

export interface StatCardProps {
  title: string
  value: React.ReactNode
  /** Libelle de changement (ex: "+12.4%"). */
  change?: string
  /** Tone du badge de change (default = emerald). */
  changeTone?: NeonBadgeProps['tone']
  /** Afficher une fleche dans le badge. */
  changeIcon?: boolean
  icon?: LucideIcon
  iconColor?: string
  /** Couleur du glow au hover. */
  glow?: string
  className?: string
}

/**
 * StatCard — carte statistique iso DashboardHome.
 * Icone en haut a gauche + badge de change en haut a droite + titre + valeur gradient.
 */
export function StatCard({
  title,
  value,
  change,
  changeTone = 'emerald',
  changeIcon = true,
  icon: Icon,
  iconColor = 'text-white/70',
  glow,
  className,
}: StatCardProps) {
  return (
    <GlassCard glow={glow} className={className}>
      <div className="flex justify-between items-start mb-3">
        {Icon ? (
          <IconBox>
            <Icon size={14} className={iconColor} />
          </IconBox>
        ) : (
          <div />
        )}
        {change ? (
          <NeonBadge tone={changeTone}>
            {changeIcon ? <ArrowUpRight size={10} /> : null}
            {change}
          </NeonBadge>
        ) : null}
      </div>
      <SubLabel className="mb-1 block">{title}</SubLabel>
      <p className={cn('text-2xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70')}>
        {value}
      </p>
    </GlassCard>
  )
}
