import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '../../lib/utils'

/**
 * GlowButton — bouton iso Figma Make.
 * Variants : primary (white + glow), glass (dark + inset), ghost (transparent).
 */
const glowButtonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none whitespace-nowrap',
  {
    variants: {
      variant: {
        primary:
          'bg-white text-black hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.2),inset_0_-1px_0_rgba(0,0,0,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4),inset_0_-1px_0_rgba(0,0,0,0.2)]',
        glass:
          'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]',
        ghost:
          'bg-transparent text-white/40 hover:text-white/90 hover:bg-white/[0.03]',
      },
      size: {
        sm: 'h-7 px-2.5 text-[11px]',
        md: 'h-9 px-3 text-xs',
        lg: 'h-10 px-5 text-sm',
      },
    },
    defaultVariants: { variant: 'glass', size: 'md' },
  },
)

export interface GlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glowButtonVariants> {
  asChild?: boolean
}

export function GlowButton({ variant, size, className, asChild, ...props }: GlowButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="glow-button"
      className={cn(glowButtonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { glowButtonVariants }
