/**
 * Foundation OS — Design System
 * Text primitive (DS-3)
 *
 * API publique
 * - variant: h1 | h2 | h3 | body | body-small | label | code  (default: body)
 * - as     : keyof JSX.IntrinsicElements                      (default: element
 *            mappe depuis variant — h1..h3 -> <hN>, body/body-small -> <p>,
 *            label -> <span>, code -> <code>)
 * - weight : regular | medium | semibold | bold               (override token)
 * - color  : primary | muted                                   (default: primary)
 *
 * A11y
 * - color="muted" = rgba(255,255,255,0.42) = ratio 4.01:1 sur bg.canvas.
 *   Conforme WCAG AA large (3:1) UNIQUEMENT : reserver pour variants h1/h2/h3
 *   ou body >= 18pt bold. Ne PAS utiliser pour body-small, label, caption
 *   (ratio insuffisant pour AA normal 4.5:1). Runtime warning en dev.
 *
 * Styling
 * - CSS Modules (Text.module.css)
 * - Toutes les valeurs via --fos-typography-* et --fos-color-text-* CSS vars
 */
import React from 'react'
import styles from './Text.module.css'

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'body-small' | 'label' | 'code'
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'
export type TextColor = 'primary' | 'muted'

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'> {
  /** Typographic variant. Default: 'body' */
  variant?: TextVariant
  /** Override the rendered HTML element. */
  as?: keyof React.JSX.IntrinsicElements
  /** Override the token font-weight. */
  weight?: TextWeight
  /** Color intention. Default: 'primary'. 'muted' is AA-large only (use on h1/h2/h3/body >= 18px bold). */
  color?: TextColor
  children?: React.ReactNode
}

const variantToTag: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  body: 'p',
  'body-small': 'p',
  label: 'span',
  code: 'code'
}

const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ')

// Dev warning: muted + small variants = AA normal fail (ratio 4.01 < 4.5 required)
const smallVariants = new Set<TextVariant>(['body-small', 'label'])

export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  { variant = 'body', as, weight, color = 'primary', className, children, ...rest },
  ref
) {
  if (import.meta.env?.DEV && color === 'muted' && smallVariants.has(variant)) {
    // eslint-disable-next-line no-console
    console.warn(
      `[fos-ds] Text color="muted" on variant="${variant}" fails WCAG AA normal (4.5:1). ` +
        'Use color="primary" or switch to variant="body"/"h1..h3".'
    )
  }
  const Tag = (as ?? variantToTag[variant]) as unknown as React.ElementType
  return (
    <Tag
      ref={ref as never}
      className={cx(
        styles.text,
        styles[`variant-${variant}`],
        weight && styles[`weight-${weight}`],
        styles[`color-${color}`],
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  )
})
