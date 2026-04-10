/**
 * Foundation OS — Design System
 * Card primitive (DS-4)
 *
 * API publique
 * - variant     : default | elevated | interactive  (default: 'default')
 * - as          : div | section | article           (default: 'div')
 * - header      : ReactNode (slot haut, optionnel)
 * - footer      : ReactNode (slot bas, optionnel)
 * - children    : ReactNode (body principal)
 * - onClick     : () => void  (si present, force variant=interactive)
 *
 * Interactive pattern
 * - variant="interactive" OU prop onClick fourni :
 *   - role="button"
 *   - tabIndex=0
 *   - Enter / Space -> onClick (keyboard support WCAG 2.1.1)
 *   - focus-visible outline accent.brand
 *
 * Slots visuels
 * - header : top section, padding 16px, border-bottom soft
 * - body   : middle, padding 16px, flex:1
 * - footer : bottom, padding 16px, border-top soft
 * - Cas sans header/footer : juste le body a full padding
 *
 * Styling
 * - CSS Modules (Card.module.css)
 * - Toutes valeurs via --fos-* CSS vars
 */
import React from 'react'
import styles from './Card.module.css'

export type CardVariant = 'default' | 'elevated' | 'interactive'
export type CardElement = 'div' | 'section' | 'article'

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onClick'> {
  /** Visual variant. Default: 'default' */
  variant?: CardVariant
  /** Rendered HTML element. Default: 'div' */
  as?: CardElement
  /** Optional header slot rendered above the body. */
  header?: React.ReactNode
  /** Optional footer slot rendered below the body. */
  footer?: React.ReactNode
  /** When provided, the card becomes interactive (role="button", keyboard support). */
  onClick?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void
  children?: React.ReactNode
}

const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ')

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  {
    variant = 'default',
    as = 'div',
    header,
    footer,
    onClick,
    className,
    children,
    ...rest
  },
  ref
) {
  const isInteractive = variant === 'interactive' || typeof onClick === 'function'
  const resolvedVariant: CardVariant = isInteractive ? 'interactive' : variant

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (!isInteractive || !onClick) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick(event)
    }
  }

  const Tag = as as unknown as React.ElementType

  return (
    <Tag
      ref={ref as never}
      className={cx(styles.card, styles[`variant-${resolvedVariant}`], className)}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      {...rest}
    >
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles.body}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </Tag>
  )
})
