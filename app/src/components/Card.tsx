import type { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  style?: CSSProperties
  onClick?: () => void
  selected?: boolean
}

export function Card({ children, style, onClick, selected }: CardProps) {
  return (
    <div
      onClick={onClick}
      className="hov"
      style={{
        background: selected ? 'rgba(94,234,212,0.10)' : 'rgba(255,255,255,.02)',
        border: selected ? '1px solid #5EEAD4' : '1px solid rgba(255,255,255,.05)',
        borderRadius: 10,
        padding: 14,
        cursor: onClick ? 'pointer' : undefined,
        transition: 'border-color .2s',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
