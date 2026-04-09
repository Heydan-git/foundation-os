/**
 * Foundation OS — Design System
 * Input primitive (DS-4)
 *
 * API publique
 * - type        : text | email | password | number | search | tel | url  (default: text)
 * - label       : string (recommande ; accessible + visuel)
 * - helperText  : string (hint neutre sous l'input)
 * - errorText   : string (si present, state=error + aria-invalid)
 * - successText : string (si present, state=success, pas d'invalid)
 * - leadingIcon : ReactNode (decoratif, left)
 * - trailingIcon: ReactNode (decoratif, right)
 * - id          : string (genere via React.useId si absent)
 * - Herite tous les attributs HTML input natifs (disabled, placeholder, value, onChange, etc.).
 *
 * A11y
 * - Label associe via htmlFor/id (pas de placeholder-as-label).
 * - aria-invalid="true" si errorText present.
 * - aria-describedby pointe vers l'ID du helper/error/success text (concatenation).
 * - Focus ring outline 2px accent.brand via focus-within sur le wrapper.
 *
 * Styling
 * - CSS Modules (Input.module.css)
 * - Tout via --fos-* CSS vars (aucune couleur hardcodee)
 */
import React from 'react'
import styles from './Input.module.css'

export type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** HTML input type. Default: 'text' */
  type?: InputType
  /** Label text — rendered as an associated <label>. */
  label?: string
  /** Neutral hint displayed below the input. */
  helperText?: string
  /** Error message — when set, input is marked aria-invalid and error styling applies. */
  errorText?: string
  /** Success message — displayed below with success styling (does NOT mark aria-invalid). */
  successText?: string
  /** Decorative leading icon (inside the input, left). */
  leadingIcon?: React.ReactNode
  /** Decorative trailing icon (inside the input, right). */
  trailingIcon?: React.ReactNode
}

const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ')

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    type = 'text',
    label,
    helperText,
    errorText,
    successText,
    leadingIcon,
    trailingIcon,
    id: idProp,
    disabled,
    className,
    'aria-describedby': ariaDescribedByProp,
    ...rest
  },
  ref
) {
  const autoId = React.useId()
  const id = idProp ?? `fos-input-${autoId}`

  const state: 'default' | 'error' | 'success' = errorText
    ? 'error'
    : successText
      ? 'success'
      : 'default'

  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  const successId = `${id}-success`

  const describedByIds = [
    ariaDescribedByProp,
    errorText && errorId,
    successText && successId,
    helperText && helperId
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cx(styles.field, disabled && styles.disabled, className)}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={cx(
          styles.inputWrapper,
          styles[`state-${state}`],
          disabled && styles.disabled
        )}
      >
        {leadingIcon && (
          <span className={styles.iconLeading} aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          disabled={disabled}
          aria-invalid={state === 'error' || undefined}
          aria-describedby={describedByIds || undefined}
          className={styles.input}
          {...rest}
        />
        {trailingIcon && (
          <span className={styles.iconTrailing} aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </div>
      {errorText && (
        <div id={errorId} className={cx(styles.hint, styles['hint-error'])} role="alert">
          {errorText}
        </div>
      )}
      {successText && !errorText && (
        <div id={successId} className={cx(styles.hint, styles['hint-success'])}>
          {successText}
        </div>
      )}
      {helperText && !errorText && !successText && (
        <div id={helperId} className={styles.hint}>
          {helperText}
        </div>
      )}
    </div>
  )
})
