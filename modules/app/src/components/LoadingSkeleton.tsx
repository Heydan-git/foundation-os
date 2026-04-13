export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-[72px] rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] animate-pulse"
        />
      ))}
    </div>
  )
}
