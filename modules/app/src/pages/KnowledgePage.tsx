import { useState } from 'react'
import { motion } from 'motion/react'
import { BookOpen, Scroll, NotebookPen, Boxes, Layers, Map } from 'lucide-react'
import { APP_META } from '@/lib/constants'
import { MANIFESTE, JOURNAL, FRAMEWORKS, STACK, ROADMAP } from '@/lib/knowledge-data'

const TABS = [
  { id: 'manifeste', label: 'Manifeste', icon: Scroll },
  { id: 'journal', label: 'Journal', icon: NotebookPen },
  { id: 'frameworks', label: 'Frameworks', icon: Boxes },
  { id: 'stack', label: 'Stack', icon: Layers },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
]

/* ── Glass Card ──────────────────────────────────────────────────── */

function GlassCard({
  children,
  onClick,
  selected,
}: {
  children: React.ReactNode
  onClick?: () => void
  selected?: boolean
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl bg-[#0a0a0a]/80 backdrop-blur-2xl border relative overflow-hidden group transition-all duration-500 ${
        selected
          ? 'border-ds-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
          : 'border-white/[0.05] hover:border-white/[0.1] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function GlassBadge({ label, color }: { label: string; color: string }) {
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

/* ── Sections ────────────────────────────────────────────────────── */

function ManifesteSection() {
  return (
    <div className="flex flex-col gap-4">
      <GlassCard>
        <p className="text-[9px] uppercase tracking-wider text-ds-blue font-mono mb-2">
          Vision long terme
        </p>
        <p className="text-xs text-white/70 leading-relaxed">{MANIFESTE.visionLT}</p>
      </GlassCard>
      <GlassCard>
        <p className="text-[9px] uppercase tracking-wider text-ds-blue font-mono mb-2">
          Vision court terme
        </p>
        <p className="text-xs text-white/70 leading-relaxed">{MANIFESTE.visionCT}</p>
      </GlassCard>
      <GlassCard>
        <p className="text-[9px] uppercase tracking-wider text-ds-blue font-mono mb-2">
          Mode operatoire
        </p>
        <p className="text-xs text-white/70 leading-relaxed">{MANIFESTE.modeOperatoire}</p>
      </GlassCard>
      <GlassCard>
        <p className="text-[9px] uppercase tracking-wider text-ds-blue font-mono mb-3">
          Principes fondateurs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MANIFESTE.principes.map((p) => (
            <div key={p.id} className="flex items-start gap-3">
              <span className="text-[10px] font-mono text-ds-blue shrink-0 pt-0.5">{p.id}</span>
              <div>
                <span className="text-xs font-medium text-white/90">{p.label}</span>
                <span className="text-xs text-white/40"> — {p.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}

function JournalSection() {
  return (
    <div className="flex flex-col gap-2">
      {JOURNAL.map((entry) => (
        <GlassCard key={entry.num}>
          <div className="flex items-start gap-3">
            <span className="text-[10px] font-mono text-white/30 w-5 shrink-0 pt-0.5">
              {entry.num}.
            </span>
            <span className="text-[10px] font-mono text-ds-blue shrink-0 pt-0.5">
              {entry.conv}
            </span>
            <p className="text-xs text-white/70">{entry.action}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

function FrameworksSection() {
  return (
    <div className="flex flex-col gap-4">
      {FRAMEWORKS.map((fw) => (
        <GlassCard key={fw.id}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-medium text-white/90">{fw.label}</h3>
            <GlassBadge label={fw.tag} color={fw.tagColor} />
          </div>
          <div className="flex flex-col gap-1.5">
            {fw.lines.map((line, j) => (
              <p key={j} className="text-[11px] font-mono text-white/50 leading-relaxed">
                — {line}
              </p>
            ))}
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

function StackSection() {
  return (
    <div className="flex flex-col gap-4">
      {STACK.map((layer) => (
        <GlassCard key={layer.id}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white/90">{layer.label}</h3>
            <GlassBadge label={layer.status} color={layer.statusColor} />
          </div>
          {layer.sublayers.length > 0 && (
            <div className="flex gap-3 mb-3 flex-wrap">
              {layer.sublayers.map((sl) => (
                <div
                  key={sl.id}
                  className="flex-1 min-w-[160px] p-3 rounded-lg bg-[#050505] border border-white/[0.05]"
                >
                  <span className="text-[10px] font-mono text-ds-blue">{sl.id}</span>
                  <p className="text-xs font-medium text-white/90 mt-1">{sl.label}</p>
                  <p className="text-[11px] text-white/40 mt-1">{sl.desc}</p>
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {layer.items.map((item, j) => (
              <span
                key={j}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.05] text-white/50"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            <span className="text-white/30">Action · </span>
            {layer.action}
          </p>
          {layer.note && <p className="text-[11px] text-white/30 mt-1">{layer.note}</p>}
        </GlassCard>
      ))}
    </div>
  )
}

function RoadmapSection() {
  return (
    <div className="flex flex-col gap-3">
      {ROADMAP.map((item, i) => (
        <GlassCard key={item.id}>
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: item.color,
                  boxShadow:
                    item.status === 'active' ? `0 0 8px ${item.color}80` : 'none',
                }}
              />
              {i < ROADMAP.length - 1 && (
                <div className="w-[1px] flex-1 min-h-[16px] bg-white/[0.08]" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-semibold" style={{ color: item.color }}>
                  {item.label}
                </span>
                <span className="text-[10px] text-white/30">{item.date}</span>
                {item.status === 'active' && (
                  <GlassBadge label="en cours" color="#60a5fa" />
                )}
                {item.status === 'done' && (
                  <GlassBadge label="livre" color="#34d399" />
                )}
              </div>
              <p className="text-xs text-white/50">{item.desc}</p>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  )
}

/* ── Main Page ───────────────────────────────────────────────────── */

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState('manifeste')

  const renderSection = () => {
    switch (activeTab) {
      case 'manifeste':
        return <ManifesteSection />
      case 'journal':
        return <JournalSection />
      case 'frameworks':
        return <FrameworksSection />
      case 'stack':
        return <StackSection />
      case 'roadmap':
        return <RoadmapSection />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 border-b border-white/[0.05] pb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] w-fit mb-1">
          <BookOpen size={12} className="text-ds-blue" />
          <span className="text-[10px] font-mono tracking-wider text-white/70">KNOWLEDGE BASE</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
              FOS Knowledge
            </h1>
            <p className="text-white/40 text-xs mt-1 max-w-lg leading-relaxed">
              Manifeste, Journal, Frameworks, Stack, Roadmap — knowledge base statique.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: `${MANIFESTE.principes.length} Principes`, color: 'text-ds-blue', bg: 'bg-ds-blue/10', border: 'border-ds-blue/20' },
              { label: `${JOURNAL.length} Actions`, color: 'text-ds-purple', bg: 'bg-ds-purple/10', border: 'border-ds-purple/20' },
              { label: `${FRAMEWORKS.length} Frameworks`, color: 'text-ds-emerald', bg: 'bg-ds-emerald/10', border: 'border-ds-emerald/20' },
            ].map((b, i) => (
              <span
                key={i}
                className={`text-[9px] font-mono px-2 py-1 rounded ${b.bg} border ${b.border} ${b.color}`}
              >
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap border-b border-white/[0.05] pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-white bg-white/[0.06] border border-white/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.03)]'
                : 'text-white/40 hover:text-white/90 hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderSection()}
      </motion.div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.05] pt-4">
        <div className="flex flex-wrap gap-8">
          {['MD first \u00B7 JSX second', 'Cooperation humain-IA', 'Tracabilite totale'].map(
            (p) => (
              <span key={p} className="text-[10px] font-mono text-white/20 tracking-wider">
                {p}
              </span>
            ),
          )}
        </div>
        <span className="text-[9px] font-mono text-white/20">
          {APP_META.version}
        </span>
      </div>
    </div>
  )
}
