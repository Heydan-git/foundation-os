interface BadgeProps {
  label: string
  color: string
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
      style={{
        color,
        backgroundColor: color + '18',
        borderColor: color + '30',
      }}
    >
      {label}
    </span>
  )
}
