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
    color: '#A78BFA',
    status: 'functional',
  },
  {
    id: 'dashboard',
    route: '/dashboard',
    label: 'Dashboard',
    subtitle: 'Pipeline, Sessions, Decisions, Risques (donnees statiques)',
    color: '#3B82F6',
    status: 'static',
  },
  {
    id: 'crud-test',
    route: '/crud-test',
    label: 'Test CRUD Supabase',
    subtitle: 'Creer, lire, modifier, supprimer sessions et decisions',
    color: '#22C55E',
    status: 'functional',
  },
  {
    id: 'phase1-demo',
    route: '/phase1-demo',
    label: 'Phase 1 Validation',
    subtitle: 'Suite de tests automatises pour valider les operations CRUD',
    color: '#F59E0B',
    status: 'functional',
  },
]

const STATUS_COLORS: Record<string, string> = {
  functional: '#22C55E',
  static: '#94A3B8',
}

export default function IndexPage() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: '#06070C', fontFamily: "'Figtree', sans-serif" }}
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
              background: '#5EEAD4',
              display: 'inline-block',
              animation: 'pulse 3s infinite',
            }}
          />
          <h1
            style={{
              fontFamily: "'Figtree', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: '#FAFAFA',
              letterSpacing: '-.02em',
            }}
          >
            Foundation OS
          </h1>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: '#F59E0B',
              background: 'rgba(245,158,11,.1)',
              padding: '2px 8px',
              borderRadius: 4,
            }}
          >
            Prototype
          </span>
        </div>
        <p style={{ fontSize: 13, color: '#52525B' }}>
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
              color: '#22C55E',
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
              color: '#94A3B8',
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
              background: 'rgba(255,255,255,.025)',
              border: '1px solid rgba(255,255,255,.055)',
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
                color: '#FAFAFA',
                marginBottom: 5,
              }}
            >
              {mod.label}
            </h2>

            <p style={{ fontSize: 11, color: '#71717A', lineHeight: 1.5, marginBottom: 14 }}>
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
                color: '#3F3F46',
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
            color: '#3F3F46',
          }}
        >
          v0.1 PROTOTYPE
        </span>
      </div>
    </div>
  )
}
