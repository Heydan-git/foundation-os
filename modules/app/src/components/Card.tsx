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
      className={`p-4 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border relative overflow-hidden group transition-all duration-500 ${
        selected
          ? 'border-ds-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
          : 'border-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
      } ${onClick ? 'cursor-pointer' : ''}`}
      style={style}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
