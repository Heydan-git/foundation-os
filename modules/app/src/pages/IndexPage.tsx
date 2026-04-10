import { useNavigate } from 'react-router-dom'

interface Module {
  id: string
  route: string
  label: string
  subtitle: string
  color: string
  status: 'functional' | 'static'
}

const MODULES: Module[] = [
  {
    id: 'commander',
    route: '/commander',
    label: 'FOS Commander',
    subtitle: 'Sessions, Decisions, Risques, Next Steps (Supabase CRUD)',
    color: 'var(--fos-color-status-parking)',
    status: 'functional',
  },
  {
    id: 'knowledge',
    route: '/knowledge',
    label: 'FOS Knowledge',
    subtitle: 'Manifeste, Journal, Frameworks, Stack, Roadmap (knowledge base)',
    color: 'var(--fos-color-accent-brand)',
    status: 'static',
  },
  {
    id: 'dashboard',
    route: '/dashboard',
    label: 'Dashboard',
    subtitle: 'Pipeline, Sessions, Decisions, Risques (donnees statiques)',
    color: 'var(--fos-color-status-wip)',
    status: 'static',
  },
  {
    id: 'crud-test',
    route: '/crud-test',
    label: 'Test CRUD Supabase',
    subtitle: 'Creer, lire, modifier, supprimer sessions et decisions',
    color: 'var(--fos-color-status-done)',
    status: 'functional',
  },
  {
    id: 'phase1-demo',
    route: '/phase1-demo',
    label: 'Phase 1 Validation',
    subtitle: 'Suite de tests automatises pour valider les operations CRUD',
    color: 'var(--fos-color-status-paused)',
    status: 'functional',
  },
]

const STATUS_COLORS: Record<string, string> = {
  functional: 'var(--fos-color-status-done)',
  static: 'var(--fos-color-text-subtle)',
}

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--fos-color-bg-canvas)', fontFamily: "'Figtree', sans-serif" }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        .module-card { transition: border-color .18s, box-shadow .18s; }
        .module-card:hover { border-color: rgba(94,234,212,.25) !important; box-shadow: 0 0 24px rgba(94,234,212,.07); }
      `}</style>

      {/* Header */}
      <div className="max-w-5xl mx-auto mb-12" style={{ animation: 'fadeIn .35s ease-out both' }}>
        <div className="flex items-center gap-3 mb-3">
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: 'var(--fos-color-accent-brand)',
              display: 'inline-block',
              animation: 'pulse 3s infinite',
            }}
          />
          <h1
            style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: 'var(--fos-color-text-bright)',
              letterSpacing: '-.02em',
            }}
          >
            Foundation OS
          </h1>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: 'var(--fos-color-status-paused)',
              background: 'rgba(245,158,11,.1)',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            Prototype
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--fos-color-text-faint)' }}>
          OS de travail IA-driven -- Prototype fonctionnel avec CRUD Supabase
        </p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mt-6">
          <span
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              background: 'rgba(34,197,94,.12)',
              color: 'var(--fos-color-status-done)',
            }}
          >
            {MODULES.filter((m) => m.status === 'functional').length} Functional
          </span>
          <span
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              background: 'rgba(148,163,184,.12)',
              color: 'var(--fos-color-text-subtle)',
            }}
          >
            {MODULES.filter((m) => m.status === 'static').length} Static
          </span>
        </div>
      </div>

      {/* Module cards */}
      <div
        className="max-w-5xl mx-auto grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
      >
        {MODULES.map((mod, i) => (
          <button
            key={mod.id}
            onClick={() => navigate(mod.route)}
            className="module-card text-left"
            style={{
              animation: `fadeIn .3s ease-out ${i * 60}ms both`,
              background: 'var(--fos-color-bg-surface)',
              border: '1px solid var(--fos-color-border-default)',
              borderRadius: 12,
              padding: '20px 22px',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: mod.color,
                  display: 'inline-block',
                  boxShadow: `0 0 8px ${mod.color}60`,
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  color: STATUS_COLORS[mod.status],
                  background: STATUS_COLORS[mod.status] + '18',
                  padding: '2px 7px',
                  borderRadius: 4,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                }}
              >
                {mod.status}
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Figtree', sans-serif",
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--fos-color-text-bright)',
                marginBottom: 5,
              }}
            >
              {mod.label}
            </h2>

            <p style={{ fontSize: 11, color: 'var(--fos-color-text-tertiary)', lineHeight: 1.5, marginBottom: 14 }}>
              {mod.subtitle}
            </p>

            <div className="flex items-center justify-end">
              <span style={{ fontSize: 11, color: mod.color, fontWeight: 600 }}>Ouvrir</span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        className="max-w-5xl mx-auto mt-16 flex flex-wrap items-center justify-between"
        style={{
          borderTop: '1px solid rgba(255,255,255,.05)',
          paddingTop: 16,
          gap: 8,
        }}
      >
        <div className="flex flex-wrap gap-8">
          {['Prototype honnete', 'CRUD Supabase reel', 'Zero features simulees'].map((p) => (
            <span
              key={p}
              style={{
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--fos-color-text-ghost)',
                letterSpacing: '.08em',
              }}
            >
              {p}
            </span>
          ))}
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: 'var(--fos-color-text-ghost)',
          }}
        >
          v0.1 PROTOTYPE
        </span>
      </div>
    </div>
  )
}
