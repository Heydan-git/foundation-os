interface StatPillProps {
  label: string
  value: number | string
  color: string
}

export function StatPill({ label, value, color }: StatPillProps) {
  return (
    <div
      className="px-4 py-2 rounded-lg text-sm font-medium"
      style={{ backgroundColor: color + '25', color }}
    >
      {value} {label}
    </div>
  )
}
