/**
 * KnowledgePage — Foundation OS Knowledge Base
 *
 * Source de verite : modules/app/data/knowledge.md
 * Donnees statiques (manifeste, journal, frameworks, stack, roadmap) — pas de Supabase.
 */
import { useState } from 'react'
import { Badge, Card, Footer, PageContainer, PageHeader, TabBar } from '@/components'
import { APP_META } from '@/lib/constants'
import { MANIFESTE, JOURNAL, FRAMEWORKS, STACK, ROADMAP } from '@/lib/knowledge-data'

const TABS = [
  { id: 'manifeste',  label: 'Manifeste'  },
  { id: 'journal',    label: 'Journal'    },
  { id: 'frameworks', label: 'Frameworks' },
  { id: 'stack',      label: 'Stack'      },
  { id: 'roadmap',    label: 'Roadmap'    },
]

// ── Sections ─────────────────────────────────────────────────────────

function ManifesteSection() {
  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      <Card>
        <h3 style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#5EEAD4', marginBottom: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Vision long terme</h3>
        <p style={{ fontSize: 13, color: '#D4D4D8', lineHeight: 1.6 }}>{MANIFESTE.visionLT}</p>
      </Card>
      <Card>
        <h3 style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#5EEAD4', marginBottom: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Vision court terme</h3>
        <p style={{ fontSize: 13, color: '#D4D4D8', lineHeight: 1.6 }}>{MANIFESTE.visionCT}</p>
      </Card>
      <Card>
        <h3 style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#5EEAD4', marginBottom: 8, letterSpacing: '.08em', textTransform: 'uppercase' }}>Mode operatoire</h3>
        <p style={{ fontSize: 13, color: '#D4D4D8', lineHeight: 1.6 }}>{MANIFESTE.modeOperatoire}</p>
      </Card>
      <Card>
        <h3 style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: '#5EEAD4', marginBottom: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>Principes fondateurs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 12 }}>
          {MANIFESTE.principes.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#5EEAD4', flexShrink: 0, paddingTop: 1 }}>{p.id}</span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#FAFAFA' }}>{p.label}</span>
                <span style={{ fontSize: 13, color: '#71717A' }}> — {p.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function JournalSection() {
  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {JOURNAL.map((entry) => (
        <Card key={entry.num}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#52525B', width: 22, flexShrink: 0, paddingTop: 1 }}>{entry.num}.</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#5EEAD4', flexShrink: 0, paddingTop: 1 }}>{entry.conv}</span>
            <p style={{ fontSize: 13, color: '#D4D4D8' }}>{entry.action}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

function FrameworksSection() {
  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      {FRAMEWORKS.map((fw) => (
        <Card key={fw.id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>{fw.label}</h3>
            <Badge label={fw.tag} color={fw.tagColor} />
          </div>
          <div className="flex flex-col" style={{ gap: 6 }}>
            {fw.lines.map((line, j) => (
              <p key={j} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#A1A1AA', lineHeight: 1.6 }}>— {line}</p>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}

function StackSection() {
  return (
    <div className="flex flex-col" style={{ gap: 16 }}>
      {STACK.map((layer) => (
        <Card key={layer.id}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA' }}>{layer.label}</h3>
            <Badge label={layer.status} color={layer.statusColor} />
          </div>
          {layer.sublayers.length > 0 && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              {layer.sublayers.map((sl) => (
                <div key={sl.id} style={{ flex: '1 1 160px', padding: 12, borderRadius: 6, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#5EEAD4' }}>{sl.id}</span>
                  <p style={{ fontSize: 12, fontWeight: 500, color: '#FAFAFA', marginTop: 2 }}>{sl.label}</p>
                  <p style={{ fontSize: 11, color: '#71717A', marginTop: 2 }}>{sl.desc}</p>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {layer.items.map((item, j) => (
              <span key={j} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, padding: '2px 8px', borderRadius: 4, background: 'rgba(94,234,212,.08)', color: '#94A3B8' }}>{item}</span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#71717A', marginTop: 8 }}>
            <span style={{ color: '#52525B' }}>Action · </span>{layer.action}
          </p>
          {layer.note && (
            <p style={{ fontSize: 11, color: '#52525B', marginTop: 4 }}>{layer.note}</p>
          )}
        </Card>
      ))}
    </div>
  )
}

function RoadmapSection() {
  return (
    <div className="flex flex-col" style={{ gap: 12 }}>
      {ROADMAP.map((item, i) => (
        <Card key={item.id}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0, paddingTop: 2 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, boxShadow: item.status === 'active' ? `0 0 8px ${item.color}80` : 'none' }} />
              {i < ROADMAP.length - 1 && (
                <div style={{ width: 1, flex: 1, minHeight: 16, background: 'rgba(255,255,255,.1)' }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: item.color }}>{item.label}</span>
                <span style={{ fontSize: 11, color: '#52525B' }}>{item.date}</span>
                {item.status === 'active' && <Badge label="en cours" color="#5EEAD4" />}
                {item.status === 'done' && <Badge label="livre" color="#22C55E" />}
              </div>
              <p style={{ fontSize: 13, color: '#A1A1AA' }}>{item.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState('manifeste')

  const renderSection = () => {
    switch (activeTab) {
      case 'manifeste':  return <ManifesteSection  />
      case 'journal':    return <JournalSection    />
      case 'frameworks': return <FrameworksSection />
      case 'stack':      return <StackSection      />
      case 'roadmap':    return <RoadmapSection    />
      default:           return null
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="FOS Knowledge"
        subtitle="Manifeste · Journal · Frameworks · Stack · Roadmap"
        version={APP_META.version}
        meta="Knowledge Base"
      >
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(94,234,212,.15)', color: '#5EEAD4' }}>
          {MANIFESTE.principes.length} Principes
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(167,139,250,.15)', color: '#A78BFA' }}>
          {JOURNAL.length} Actions
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(59,130,246,.15)', color: '#3B82F6' }}>
          {FRAMEWORKS.length} Frameworks
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(249,115,22,.15)', color: '#F97316' }}>
          {STACK.length} Layers
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(255,255,255,.07)', color: '#94A3B8' }}>
          {ROADMAP.length} Milestones
        </div>
      </PageHeader>

      <div style={{ padding: '16px 20px 0' }}>
        <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
        <div style={{ marginBottom: 32 }}>{renderSection()}</div>
      </div>

      <Footer
        principles={['MD first · JSX second', 'Cooperation humain-IA', 'Tracabilite totale']}
        dataVersion={APP_META.dataVersion}
        lastSync={APP_META.lastSync ?? '2026-04-03'}
      />
    </PageContainer>
  )
}
