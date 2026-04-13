import type { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-canvas)' }}>
      {children}
    </div>
  )
}

interface PageContainerProps {
  children: ReactNode
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="max-w-6xl mx-auto p-8">
      {children}
    </div>
  )
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  version?: string
  meta?: string
  children?: ReactNode
}

export function PageHeader({ title, subtitle, version, meta, children }: PageHeaderProps) {
  return (
    <div style={{ marginBottom: 16, padding: '16px 20px 0', borderBottom: '1px solid rgba(255,255,255,.04)', paddingBottom: 16 }}>
      <div className="flex items-start justify-between" style={{ marginBottom: 8 }}>
        <div>
          <h1
            className="flex items-center"
            style={{ fontFamily: "'Figtree',sans-serif", fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-.02em', gap: 8, display: 'flex', alignItems: 'center', marginBottom: 4 }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent-brand-primary)', display: 'inline-block', animation: 'pulse 3s infinite', flexShrink: 0 }} />
            {title}
          </h1>
          {subtitle && (
            <p style={{ fontSize: 10, color: 'var(--color-text-faint)' }}>{subtitle}</p>
          )}
        </div>
        {(version || meta) && (
          <div style={{ textAlign: 'right' }}>
            {version && (
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--color-text-ghost)' }}>{version}</span>
            )}
            {meta && (
              <p style={{ fontSize: 9, color: 'var(--color-text-ghost)', marginTop: 2 }}>{meta}</p>
            )}
          </div>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap" style={{ gap: 8, marginTop: 12 }}>
          {children}
        </div>
      )}
    </div>
  )
}

interface FooterProps {
  principles?: string[]
  dataVersion?: string
  lastSync?: string
}

export function Footer({ principles = [], dataVersion, lastSync }: FooterProps) {
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,.05)', paddingTop: 16, paddingBottom: 12 }}>
      <div className="flex items-center justify-between flex-wrap" style={{ gap: 8 }}>
        <div className="flex flex-wrap" style={{ gap: 12 }}>
          {principles.map((p, i) => (
            <span key={i} style={{ fontSize: 10, fontFamily: "'JetBrains Mono',monospace", color: 'var(--color-text-ghost)', letterSpacing: '.08em' }}>{p}</span>
          ))}
        </div>
        {(dataVersion || lastSync) && (
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: 'var(--color-text-ghost)' }}>
            {dataVersion && `DATA_VERSION ${dataVersion}`}
            {dataVersion && lastSync && ' · '}
            {lastSync && `LAST_SYNC ${lastSync}`}
          </span>
        )}
      </div>
    </div>
  )
}
