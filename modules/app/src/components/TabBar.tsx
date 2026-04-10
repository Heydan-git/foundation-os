interface Tab {
  id: string
  label: string
}

interface TabBarProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap border-b border-white/10 pb-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer hover:bg-opacity-20"
          style={{
            backgroundColor: active === tab.id ? 'rgba(94,234,212,.15)' : 'transparent',
            color: active === tab.id ? 'var(--fos-color-accent-brand)' : 'var(--fos-color-text-subtle)',
            borderBottom: active === tab.id ? '2px solid var(--fos-color-accent-brand)' : 'none',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
