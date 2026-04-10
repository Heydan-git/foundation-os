export function LoadingSkeleton() {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {[1, 2, 3].map(i => (
        <div
          key={i}
          style={{
            height: 72,
            borderRadius: 10,
            background: 'rgba(255,255,255,.02)',
            border: '1px solid rgba(255,255,255,.04)',
            animation: 'pulse 2s infinite',
          }}
        />
      ))}
    </div>
  )
}
