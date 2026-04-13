import { useState } from 'react'
import {
  SessionsPanel,
  DecisionsPanel,
  RisksPanel,
  DocsPanel,
  ContextPanel,
  NextStepsPanel,
} from '@/components/Commander'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { useCommander } from '@/lib/useCommander'
import { motion } from 'motion/react'
import { Sword, Activity, Shield, Zap, FileText, Layers } from 'lucide-react'

const TABS = [
  { id: 'sessions', label: 'Sessions', icon: Activity },
  { id: 'decisions', label: 'Decisions', icon: FileText },
  { id: 'risques', label: 'Risques', icon: Shield },
  { id: 'nextsteps', label: 'Next Steps', icon: Zap },
  { id: 'contextes', label: 'Contextes', icon: Layers },
  { id: 'documents', label: 'Documents', icon: FileText },
]

export default function Commander() {
  const [activeTab, setActiveTab] = useState('sessions')
  const { sessions, decisions, risks, docs, contextBlocks, nextSteps, loading, source } =
    useCommander()

  const openRisks = risks.filter((r) => r.status === 'open').length
  const pendingSteps = nextSteps.filter((n) => n.status !== 'done').length

  const renderSection = () => {
    if (loading) return <LoadingSkeleton />
    switch (activeTab) {
      case 'sessions':
        return <SessionsPanel sessions={sessions} />
      case 'decisions':
        return <DecisionsPanel decisions={decisions} />
      case 'risques':
        return <RisksPanel risks={risks} />
      case 'nextsteps':
        return <NextStepsPanel nextSteps={nextSteps} />
      case 'contextes':
        return <ContextPanel contextBlocks={contextBlocks} />
      case 'documents':
        return <DocsPanel docs={docs} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 border-b border-white/[0.05] pb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.05] w-fit mb-1">
          <Sword size={12} className="text-purple-400" />
          <span className="text-[10px] font-mono tracking-wider text-white/70">COMMANDER</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40">
              FOS Commander
            </h1>
            <p className="text-white/40 text-xs mt-1 max-w-lg leading-relaxed">
              Sessions, Decisions, Risques, Next Steps — CRUD Supabase en temps reel.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.05]">
              <div
                className={`w-1.5 h-1.5 rounded-full ${source === 'supabase' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse' : 'bg-rose-400'}`}
              />
              <span className="text-[9px] font-mono tracking-wider text-white/50">
                {source === 'supabase' ? 'SUPABASE LIVE' : 'SEED DATA'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Sessions', value: sessions.length, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          { label: 'ADR', value: decisions.length, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Risques', value: openRisks, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
          { label: 'Next Steps', value: pendingSteps, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map((stat, i) => (
          <div
            key={i}
            className={`px-3 py-2 rounded-md ${stat.bg} border ${stat.border} flex items-center gap-2`}
          >
            <span className={`text-sm font-mono font-semibold ${stat.color}`}>{stat.value}</span>
            <span className="text-[10px] font-mono text-white/50 tracking-wider">{stat.label}</span>
          </div>
        ))}
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
          {['Zero nuisance', 'MD first \u00B7 JSX second', 'Tracabilite totale'].map((p) => (
            <span key={p} className="text-[10px] font-mono text-white/20 tracking-wider">
              {p}
            </span>
          ))}
        </div>
        <span className="text-[9px] font-mono text-white/20">v0.1</span>
      </div>
    </div>
  )
}
