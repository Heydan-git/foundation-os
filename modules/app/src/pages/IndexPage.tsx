import { useNavigate } from 'react-router-dom'
import {
  Sword,
  BookOpen,
  ArrowUpRight,
  Activity,
  Database,
  Shield,
  Zap,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useCommander } from '@/lib/useCommander'

export default function IndexPage() {
  const navigate = useNavigate()
  const { sessions, decisions, risks, nextSteps, loading, source } = useCommander()

  const openRisks = risks.filter((r) => r.status === 'open').length
  const doneSteps = nextSteps.filter((n) => n.status === 'done').length
  const todoPct = nextSteps.length
    ? Math.round((doneSteps / nextSteps.length) * 100)
    : 0

  const STATS = [
    {
      title: 'Sessions',
      value: loading ? '...' : String(sessions.length),
      change: source === 'supabase' ? 'LIVE' : 'SEED',
      glow: 'bg-purple-500/10',
      icon: Activity,
      iconColor: 'text-purple-400',
    },
    {
      title: 'Decisions ADR',
      value: loading ? '...' : String(decisions.length),
      change: `${decisions.length} actives`,
      glow: 'bg-blue-500/10',
      icon: Database,
      iconColor: 'text-blue-400',
    },
    {
      title: 'Risques ouverts',
      value: loading ? '...' : String(openRisks),
      change: `${risks.length} total`,
      glow: 'bg-rose-500/10',
      icon: Shield,
      iconColor: 'text-rose-400',
    },
    {
      title: 'Next Steps',
      value: loading ? '...' : `${todoPct}%`,
      change: `${doneSteps}/${nextSteps.length} done`,
      glow: 'bg-emerald-500/10',
      icon: Zap,
      iconColor: 'text-emerald-400',
    },
  ]

  const MODULES = [
    {
      id: 'commander',
      route: '/commander',
      label: 'FOS Commander',
      subtitle:
        'Sessions, Decisions, Risques, Next Steps (Supabase CRUD)',
      icon: Sword,
      iconColor: 'text-purple-400',
      glow: 'bg-purple-500/10',
      status: 'functional' as const,
    },
    {
      id: 'knowledge',
      route: '/knowledge',
      label: 'FOS Knowledge',
      subtitle:
        'Manifeste, Journal, Frameworks, Stack, Roadmap (knowledge base)',
      icon: BookOpen,
      iconColor: 'text-blue-400',
      glow: 'bg-blue-500/10',
      status: 'static' as const,
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 border-b border-white/[0.05] pb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] w-fit mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-white/70">
            {source === 'supabase' ? 'SUPABASE LIVE' : 'SEED DATA'}
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
              Vue d&apos;ensemble
            </h1>
            <p className="text-white/40 text-xs mt-1 max-w-lg leading-relaxed">
              OS de travail IA-driven. Prototype fonctionnel avec CRUD
              Supabase.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.08] text-white/50 text-xs font-mono">
              v0.1 PROTOTYPE
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
            key={i}
            className="p-5 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] relative overflow-hidden group hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500"
          >
            <div
              className={`absolute top-[10%] right-[10%] w-[30%] h-[30%] ${stat.glow} blur-[30px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
            />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-3">
                <div className="w-8 h-8 rounded-md bg-[#050505] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                  <stat.icon size={14} className={stat.iconColor} />
                </div>
                <span className="flex items-center gap-0.5 text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {stat.change}
                </span>
              </div>
              <p className="text-[9px] uppercase tracking-wider text-white/40 font-mono mb-1">
                {stat.title}
              </p>
              <p className="text-2xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MODULES.map((mod, i) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
            whileHover={{ y: -2 }}
            onClick={() => navigate(mod.route)}
            className="p-5 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/[0.05] relative overflow-hidden group hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500 cursor-pointer"
          >
            <div
              className={`absolute top-[-20%] right-[-10%] w-[40%] h-[40%] ${mod.glow} blur-[80px] rounded-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
            />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-[#050505] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]">
                    <mod.icon size={14} className={mod.iconColor} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                      {mod.label}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {mod.status === 'functional' ? (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-1.5 py-0.5 rounded">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                      FUNCTIONAL
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-white/40 bg-white/[0.05] border border-white/[0.08] px-1.5 py-0.5 rounded">
                      STATIC
                    </span>
                  )}
                  <ArrowUpRight
                    size={14}
                    className="text-white/30 group-hover:text-white/70 transition-colors"
                  />
                </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">
                {mod.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between border-t border-white/[0.05] pt-4 mt-8">
        <div className="flex flex-wrap gap-8">
          {['Prototype honnete', 'CRUD Supabase reel', 'Zero features simulees'].map(
            (p) => (
              <span
                key={p}
                className="text-[10px] font-mono text-white/20 tracking-wider"
              >
                {p}
              </span>
            ),
          )}
        </div>
        <span className="text-[9px] font-mono text-white/20">
          v0.1 PROTOTYPE
        </span>
      </div>
    </div>
  )
}
