import { useState } from 'react'
import { Badge, Card, TabBar, PageHeader, Footer } from '@/components'
import { useCommander } from '@/lib/useCommander'
import { APP_META } from '@/lib/constants'

const PIPELINE_PHASES = [
  { num: '00', label: 'Fondation OS',    color: '#A78BFA', status: 'active'  },
  { num: '01', label: 'Design',          color: '#5EEAD4', status: 'pending' },
  { num: '02', label: 'Architecture',    color: '#F97316', status: 'pending' },
  { num: '03', label: 'Développement',   color: '#3B82F6', status: 'pending' },
  { num: '04', label: 'Qualité',         color: '#EAB308', status: 'pending' },
  { num: '05', label: 'Launch',          color: '#22C55E', status: 'pending' },
  { num: '06', label: 'Monétisation',    color: '#EC4899', status: 'pending' },
  { num: '07', label: 'Growth',          color: '#94A3B8', status: 'pending' },
]

const TABS = [
  { id: 'pipeline',  label: 'Pipeline'  },
  { id: 'sessions',  label: 'Sessions'  },
  { id: 'decisions', label: 'Décisions' },
  { id: 'risques',   label: 'Risques'   },
  { id: 'contextes', label: 'Contextes' },
  { id: 'documents', label: 'Documents' },
]

// ── Helpers ─────────────────────────────────────────────────────────

const impactColor = (v: string) =>
  ({ high: '#EF4444', medium: '#F97316', low: '#22C55E' }[v] ?? '#94A3B8')

// ── Sections ────────────────────────────────────────────────────────

function PipelineSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 8 }}>
      {PIPELINE_PHASES.map((p, i) => (
        <div key={p.num} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: p.color, letterSpacing: '.08em' }}>P{p.num}</span>
              <div className="flex items-center" style={{ gap: 4 }}>
                {p.status === 'active' && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5EEAD4', display: 'inline-block', animation: 'pulse 3s infinite' }} />
                )}
                <Badge label={p.status} color={p.status === 'active' ? '#5EEAD4' : '#94A3B8'} />
              </div>
            </div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#FAFAFA' }}>{p.label}</p>
            <div
              style={{ marginTop: 8, height: 4, borderRadius: 2, backgroundColor: p.color + (p.status === 'active' ? 'CC' : '30') }}
            />
          </Card>
        </div>
      ))}
    </div>
  )
}

function SessionsSection({ sessions }: { sessions: { id: string; date: string; title: string; items: string | null; decisions: string | null }[] }) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {sessions.map((s, i) => (
        <div key={s.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{s.id}</span>
                <span style={{ fontSize: 10, color: '#52525B' }}>{s.date}</span>
              </div>
            </div>
            <h3 style={{ fontSize: 12, fontWeight: 600, color: '#FAFAFA', marginBottom: 6 }}>{s.title}</h3>
            {s.items && (
              <p style={{ fontSize: 10, color: '#71717A', marginBottom: 4 }}>
                <span style={{ color: '#3F3F46' }}>Items · </span>{s.items}
              </p>
            )}
            {s.decisions && (
              <p style={{ fontSize: 10, color: '#71717A' }}>
                <span style={{ color: '#3F3F46' }}>Décisions · </span>{s.decisions}
              </p>
            )}
          </Card>
        </div>
      ))}
    </div>
  )
}

function DecisionsSection({ decisions }: { decisions: { id: string; date: string; title: string; context: string | null; impact: string; status: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
      {decisions.map((d, i) => (
        <div key={d.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{d.id}</span>
              <div className="flex" style={{ gap: 4 }}>
                <Badge label={d.impact} color={impactColor(d.impact)} />
                <Badge label={d.status} color="#5EEAD4" />
              </div>
            </div>
            <p style={{ fontSize: 12, fontWeight: 500, color: '#FAFAFA', marginBottom: 4 }}>{d.title}</p>
            <p style={{ fontSize: 10, color: '#52525B' }}>{d.context}</p>
            <p style={{ fontSize: 9, color: '#3F3F46', marginTop: 4 }}>{d.date}</p>
          </Card>
        </div>
      ))}
    </div>
  )
}

function RisquesSection({ risks }: { risks: { id: string; risk: string; impact: string; proba: string; mitigation: string | null; status: string }[] }) {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {risks.map((r, i) => (
        <div key={r.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-start justify-between">
              <div style={{ flex: 1 }}>
                <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{r.id}</span>
                  <Badge label={`impact ${r.impact}`} color={impactColor(r.impact)} />
                  <Badge label={`proba ${r.proba}`}   color={impactColor(r.proba)} />
                </div>
                <p style={{ fontSize: 12, color: '#FAFAFA', marginBottom: 4 }}>{r.risk}</p>
                {r.mitigation && (
                  <p style={{ fontSize: 10, color: '#52525B' }}>Mitigation · {r.mitigation}</p>
                )}
              </div>
              <Badge label={r.status} color="#94A3B8" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

function ContextesSection({ contextBlocks }: { contextBlocks: { id: string; label: string; content: string }[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
      {contextBlocks.map((c, i) => (
        <div key={c.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center" style={{ gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#5EEAD4', letterSpacing: '.08em' }}>{c.id}</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#FAFAFA', marginBottom: 8 }}>{c.label}</p>
            {c.content.split('\n').map((line, j) => (
              <p key={j} style={{ fontSize: 10, color: '#71717A', marginBottom: 2 }}>{line}</p>
            ))}
          </Card>
        </div>
      ))}
    </div>
  )
}

function DocumentsSection({ docs }: { docs: { id: string; title: string; content: string | null; category: string | null; tags: string[] | null }[] }) {
  const typeColor = (t: string | null) => ({ artifact: '#5EEAD4', plan: '#A78BFA', doc: '#3B82F6', notice: '#F97316', skill: '#EAB308', monitoring: '#EF4444', historique: '#94A3B8', design: '#EC4899', contexte: '#22C55E', guide: '#22C55E', archi: '#A78BFA' }[t ?? ''] ?? '#94A3B8')
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {docs.map((d, i) => (
        <div key={d.id} style={{ animation: `fadeIn 0.3s ease-out ${i * 40}ms both` }}>
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 8 }}>
                <Badge label={d.category ?? 'doc'} color={typeColor(d.category)} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#FAFAFA' }}>{d.title}</span>
              </div>
              <div className="flex items-center" style={{ gap: 8 }}>
                <span style={{ fontSize: 10, color: '#52525B' }}>{d.content}</span>
                {d.tags?.[0] && <span style={{ fontSize: 10, color: '#3F3F46' }}>{d.tags[0]}</span>}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  )
}

// ── Loading skeleton ────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ padding: 48, gap: 12 }}>
      <div style={{ width: 24, height: 24, border: '2px solid rgba(94,234,212,.3)', borderTopColor: '#5EEAD4', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: 12, color: '#52525B', fontFamily: "'JetBrains Mono',monospace" }}>Chargement données...</p>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('pipeline')
  const { sessions, decisions, risks, docs, contextBlocks, loading, source } = useCommander()

  const renderSection = () => {
    if (loading && activeTab !== 'pipeline') return <LoadingSkeleton />
    switch (activeTab) {
      case 'pipeline':  return <PipelineSection />
      case 'sessions':  return <SessionsSection sessions={sessions} />
      case 'decisions': return <DecisionsSection decisions={decisions} />
      case 'risques':   return <RisquesSection risks={risks} />
      case 'contextes': return <ContextesSection contextBlocks={contextBlocks} />
      case 'documents': return <DocumentsSection docs={docs} />
      default:          return null
    }
  }

  return (
    <>
      <PageHeader
        title="FOS Dashboard"
        subtitle={APP_META.objectiveCT}
        version={APP_META.version}
        meta={APP_META.phase}
      >
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(167,139,250,.15)', color: '#A78BFA' }}>
          {PIPELINE_PHASES.length} Phases
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(94,234,212,.15)', color: '#5EEAD4' }}>
          {sessions.length} Sessions
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(59,130,246,.15)', color: '#3B82F6' }}>
          {decisions.length} ADR
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(239,68,68,.15)', color: '#EF4444' }}>
          {risks.length} Risques
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: source === 'supabase' ? 'rgba(34,197,94,.15)' : 'rgba(148,163,184,.15)', color: source === 'supabase' ? '#22C55E' : '#94A3B8' }}>
          {source === 'supabase' ? 'LIVE' : 'SEED'}
        </div>
      </PageHeader>

      <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="mb-8">{renderSection()}</div>

      <Footer
        principles={['Zéro nuisance', 'MD first · JSX second', 'Traçabilité totale']}
        dataVersion={APP_META.version}
        lastSync={new Date().toISOString().split('T')[0]}
      />
    </>
  )
}
