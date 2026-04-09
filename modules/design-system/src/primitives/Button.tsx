/**
 * Foundation OS — Design System
 * Button primitive (DS-3)
 *
 * API publique
 * - variant: primary | secondary | ghost | danger  (default: primary)
 * - size   : sm | md | lg                          (default: md)
 * - isLoading : boolean                            (default: false)
 * - leadingIcon, trailingIcon: ReactNode          (optional)
 * - Hérite de tous les attributs HTML button natifs (disabled, onClick, aria-*).
 *
 * A11y
 * - focus-visible: outline 2px accent.brand + offset 2px (WCAG 2.4.7).
 * - isLoading: aria-busy="true" + spinner aria-hidden.
 * - disabled (HTML natif) si disabled=true OU isLoading=true.
 *
 * Styling
 * - CSS Modules (Button.module.css) — decouple de Tailwind (Q-DS-02 / D-DS-07).
 * - Toutes les couleurs via --fos-* CSS vars + color-mix() pour hover/active.
 *   Aucune couleur hardcodee (respect Void Glass guideline CLAUDE.md).
 */
import React from 'react'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'ref'> {
  /** Visual variant. Default: 'primary' */
  variant?: ButtonVariant
  /** Button size. Default: 'md' */
  size?: ButtonSize
  /** Loading state: disables the button and displays a spinner. Default: false */
  isLoading?: boolean
  /** Icon rendered before the label. Should be decorative (aria-hidden). */
  leadingIcon?: React.ReactNode
  /** Icon rendered after the label. Should be decorative (aria-hidden). */
  trailingIcon?: React.ReactNode
}

const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ')

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leadingIcon,
    trailingIcon,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const isDisabled = disabled || isLoading
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={cx(
        styles.button,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        isLoading && styles.loading,
        className
      )}
      {...rest}
    >
      {isLoading && (
        <span className={styles.spinner} aria-hidden="true">
          <span className={styles.spinnerDot} />
          <span className={styles.spinnerDot} />
          <span className={styles.spinnerDot} />
        </span>
      )}
      {!isLoading && leadingIcon && (
        <span className={styles.iconLeading} aria-hidden="true">
          {leadingIcon}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {!isLoading && trailingIcon && (
        <span className={styles.iconTrailing} aria-hidden="true">
          {trailingIcon}
        </span>
      )}
    </button>
  )
})
