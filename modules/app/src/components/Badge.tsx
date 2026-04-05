interface BadgeProps {
  label: string
  color: string
}

export function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="text-xs px-2 py-0.5 font-medium"
      style={{
        backgroundColor: color + '25',
        color,
        borderRadius: 4,
        fontFamily: "'JetBrains Mono',monospace",
        letterSpacing: '.04em',
      }}
    >
      {label}
    </span>
  )
}
