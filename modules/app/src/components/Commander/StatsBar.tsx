import type { Session, Decision, Risk, NextStep } from '@/lib/database.types'

interface StatsBarProps {
  sessions: Session[]
  decisions: Decision[]
  risks: Risk[]
  nextSteps: NextStep[]
  source: 'supabase' | 'seed'
}

const Pill = ({ value, label, color }: { value: number; label: string; color: string }) => (
  <div style={{ padding: '4px 12px', borderRadius: 6, backgroundColor: color + '18', border: `1px solid ${color}30` }}>
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 600, color, letterSpacing: '.06em' }}>
      {value} {label}
    </span>
  </div>
)

export function StatsBar({ sessions, decisions, risks, nextSteps, source }: StatsBarProps) {
  const openRisks  = risks.filter(r => r.status === 'open').length
  const todoPct    = nextSteps.length ? Math.round((nextSteps.filter(n => n.status === 'done').length / nextSteps.length) * 100) : 0

  return (
    <div className="flex flex-wrap items-center" style={{ gap: 8, marginBottom: 4 }}>
      <Pill value={sessions.length}   label="Sessions"  color="var(--fos-color-status-parking)" />
      <Pill value={decisions.length}  label="ADR"       color="var(--fos-color-status-wip)" />
      <Pill value={openRisks}         label="Risques"   color="var(--fos-color-accent-danger)" />
      <Pill value={nextSteps.length}  label="NextSteps" color="var(--fos-color-status-done)" />
      <Pill value={todoPct}           label="% done"    color="var(--fos-color-accent-brand)" />
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 6, height: 6, borderRadius: '50%',
          background: source === 'supabase' ? 'var(--fos-color-accent-brand)' : 'var(--fos-color-status-alert)',
          display: 'inline-block',
          animation: source === 'supabase' ? 'pulse 3s infinite' : 'none',
        }} />
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--fos-color-text-faint)', letterSpacing: '.08em' }}>
          {source === 'supabase' ? 'SUPABASE LIVE' : 'SEED DATA'}
        </span>
      </div>
    </div>
  )
}
