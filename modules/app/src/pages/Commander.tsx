import { useState } from 'react'
import { PageHeader, Footer, TabBar, PageContainer } from '@/components'
import {
  StatsBar,
  SessionsPanel,
  DecisionsPanel,
  RisksPanel,
  DocsPanel,
  ContextPanel,
  NextStepsPanel,
} from '@/components/Commander'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { useCommander } from '@/lib/useCommander'
import { APP_META } from '@/lib/constants'

const TABS = [
  { id: 'sessions',   label: 'Sessions'   },
  { id: 'decisions',  label: 'Décisions'  },
  { id: 'risques',    label: 'Risques'    },
  { id: 'nextsteps',  label: 'Next Steps' },
  { id: 'contextes',  label: 'Contextes'  },
  { id: 'documents',  label: 'Documents'  },
]

// ── Main Page ────────────────────────────────────────────────────────

export default function Commander() {
  const [activeTab, setActiveTab] = useState('sessions')
  const { sessions, decisions, risks, docs, contextBlocks, nextSteps, loading, source } = useCommander()

  const renderSection = () => {
    if (loading) return <LoadingSkeleton />
    switch (activeTab) {
      case 'sessions':  return <SessionsPanel  sessions={sessions} />
      case 'decisions': return <DecisionsPanel decisions={decisions} />
      case 'risques':   return <RisksPanel     risks={risks} />
      case 'nextsteps': return <NextStepsPanel nextSteps={nextSteps} />
      case 'contextes': return <ContextPanel   contextBlocks={contextBlocks} />
      case 'documents': return <DocsPanel      docs={docs} />
      default:          return null
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="FOS Commander"
        subtitle={APP_META.objectiveCT}
        version={APP_META.version}
        meta={APP_META.phase}
      >
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(167,139,250,.15)', color: '#A78BFA' }}>
          {sessions.length} Sessions
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(59,130,246,.15)', color: '#3B82F6' }}>
          {decisions.length} ADR
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(239,68,68,.15)', color: '#EF4444' }}>
          {risks.filter(r => r.status === 'open').length} Risques
        </div>
        <div style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, backgroundColor: 'rgba(34,197,94,.15)', color: '#22C55E' }}>
          {nextSteps.filter(n => n.status !== 'done').length} Next Steps
        </div>
      </PageHeader>

      <div style={{ padding: '12px 20px 0' }}>
        <StatsBar
          sessions={sessions}
          decisions={decisions}
          risks={risks}
          nextSteps={nextSteps}
          source={source}
        />
      </div>

      <div style={{ padding: '16px 20px 0' }}>
        <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
        <div style={{ marginBottom: 32 }}>{renderSection()}</div>
      </div>

      <Footer
        principles={['Zéro nuisance', 'MD first · JSX second', 'Traçabilité totale']}
        dataVersion={APP_META.dataVersion}
        lastSync={APP_META.lastSync}
      />
    </PageContainer>
  )
}
