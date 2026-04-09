/**
 * Foundation OS — Design System
 * Icon primitive (DS-3)
 *
 * Wrapper tree-shakeable autour de lucide-react. Les icones sont importees
 * nominalement (named imports) pour garantir un tree-shaking optimal : seuls
 * les composants reellement utilises seront inclus dans le bundle final.
 *
 * API publique
 * - name : IconName (cle du iconMap, autocompletion TS garantie)
 * - size : number | string  (default: 16)
 * - strokeWidth : number    (default: 2)
 * - color : string          (default: 'currentColor' — herite du parent)
 * - aria-label : string     (optionnel — si present, role="img")
 * - aria-hidden : boolean   (default: true si aria-label absent, false sinon)
 *
 * A11y
 * - Par defaut aria-hidden=true (icone decorative, ignore par screen reader).
 * - Si aria-label fourni, l'icone devient semantique avec role="img".
 * - Pattern recommande par WCAG / axe-core pour les icones inline.
 *
 * Extension
 * - Pour ajouter une icone, l'importer en named import depuis lucide-react
 *   puis l'ajouter au iconMap ci-dessous. Le type IconName se met a jour
 *   automatiquement.
 */
import React from 'react'
import type { LucideProps } from 'lucide-react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Edit,
  Info,
  Loader,
  Minus,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  X
} from 'lucide-react'

/**
 * Module-private lookup table.
 *
 * NOTE : non exporte intentionnellement. Storybook react-docgen-typescript
 * enrichit tous les exports qui ressemblent a un composant avec
 * `displayName` et `__docgenInfo`, ce qui polluait l'objet quand il etait
 * expose et casse l'iteration `Object.keys()` cote stories.
 */
const iconRegistry = {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Edit,
  Info,
  Loader,
  Minus,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  X
} as const

export type IconName = keyof typeof iconRegistry

/**
 * Liste gelee des noms d'icones exposees par le DS. Derivee manuellement
 * (pas via Object.keys) pour rester stable face au docgen de Storybook.
 */
export const ICON_NAMES: readonly IconName[] = Object.freeze([
  'AlertCircle',
  'ArrowLeft',
  'ArrowRight',
  'Bell',
  'Check',
  'CheckCircle',
  'ChevronDown',
  'ChevronLeft',
  'ChevronRight',
  'ChevronUp',
  'Copy',
  'Edit',
  'Info',
  'Loader',
  'Minus',
  'Plus',
  'Search',
  'Settings',
  'Trash2',
  'User',
  'X'
])

export interface IconProps extends Omit<LucideProps, 'ref' | 'size'> {
  /** Icon name from the DS curated set. */
  name: IconName
  /** Size in px (number) or CSS length (string). Default: 16 */
  size?: number | string
  /** Accessible label — when provided, sets role="img" and aria-label. */
  'aria-label'?: string
  /** Decorative flag — default true when no aria-label, false otherwise. */
  'aria-hidden'?: boolean
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(function Icon(
  {
    name,
    size = 16,
    strokeWidth = 2,
    color = 'currentColor',
    'aria-label': ariaLabel,
    'aria-hidden': ariaHiddenProp,
    className,
    ...rest
  },
  ref
) {
  const LucideIconComponent = iconRegistry[name]
  if (!LucideIconComponent) {
    if (import.meta.env?.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[fos-ds] Icon: unknown name="${name}". Available: ${ICON_NAMES.join(', ')}`)
    }
    return null
  }

  // A11y resolution: if user provides aria-label, icon is semantic (role="img").
  // Otherwise default to decorative (aria-hidden=true).
  const isDecorative = ariaLabel === undefined
  const ariaHidden = ariaHiddenProp ?? isDecorative

  return (
    <LucideIconComponent
      ref={ref}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={className}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden || undefined}
      role={ariaLabel ? 'img' : undefined}
      focusable="false"
      {...rest}
    />
  )
})
