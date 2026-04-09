/**
 * Foundation OS — Design System
 * Welcome story — vue d'ensemble des tokens semantic Void Glass.
 *
 * Affiche :
 *  - Header brand Foundation OS
 *  - Swatches des couleurs semantic (bg, text, border, accent, status)
 *  - Echelle typographique (h1, h2, h3, body, body-small, label, code)
 *
 * Toutes les valeurs viennent des CSS vars `--fos-*` injectees par
 * `tokens/build/tokens.css` via `.storybook/preview.ts`.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

interface SwatchProps {
  name: string
  cssVar: string
  description?: string
}

const Swatch: React.FC<SwatchProps> = ({ name, cssVar, description }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: 12,
      borderRadius: 8,
      background: 'var(--fos-color-bg-surface)',
      border: '1px solid var(--fos-color-border-default)'
    }}
  >
    <div
      aria-hidden="true"
      style={{
        width: 48,
        height: 48,
        borderRadius: 6,
        background: `var(${cssVar})`,
        border: '1px solid var(--fos-color-border-default)',
        flexShrink: 0
      }}
    />
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fos-color-text-primary)' }}>{name}</div>
      <div
        style={{
          fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
          color: 'var(--fos-color-text-primary)'
        }}
      >
        {cssVar}
      </div>
      {description && (
        <div style={{ fontSize: 12, color: 'var(--fos-color-text-primary)', marginTop: 4 }}>{description}</div>
      )}
    </div>
  </div>
)

const TypeRow: React.FC<{ label: string; styleVars: React.CSSProperties; sample: string }> = ({
  label,
  styleVars,
  sample
}) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: 12,
      borderRadius: 8,
      background: 'var(--fos-color-bg-surface)',
      border: '1px solid var(--fos-color-border-default)'
    }}
  >
    <div
      style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
        fontFamily: "'JetBrains Mono', monospace",
        color: 'var(--fos-color-text-primary)'
      }}
    >
      {label}
    </div>
    <div style={styleVars}>{sample}</div>
  </div>
)

const Welcome: React.FC = () => (
  <div
    style={{
      minHeight: '100vh',
      padding: 32,
      background: 'var(--fos-color-bg-canvas)',
      color: 'var(--fos-color-text-primary)',
      fontFamily: 'var(--fos-font-family-sans)',
      boxSizing: 'border-box'
    }}
  >
    <header style={{ marginBottom: 40 }}>
      <h1
        style={{
          fontSize: 'var(--fos-typography-h1-size)',
          fontWeight: 800,
          lineHeight: 'var(--fos-typography-h1-line-height)' as React.CSSProperties['lineHeight'],
          margin: 0
        }}
      >
        Foundation OS — Design System
      </h1>
      <p
        style={{
          fontSize: 'var(--fos-typography-body-size)',
          color: 'var(--fos-color-text-primary)',
          marginTop: 8,
          marginBottom: 0
        }}
      >
        Tokens semantic Void Glass — base WCAG AA, 100% from-scratch.
      </p>
    </header>

    <section aria-labelledby="colors-heading" style={{ marginBottom: 40 }}>
      <h2
        id="colors-heading"
        style={{
          fontSize: 'var(--fos-typography-h3-size)',
          fontWeight: 600,
          marginTop: 0,
          marginBottom: 16
        }}
      >
        Couleurs semantic
      </h2>
      <div
        style={{
          display: 'grid',
          gap: 12,
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
        }}
      >
        <Swatch name="bg.canvas" cssVar="--fos-color-bg-canvas" description="Fond principal" />
        <Swatch name="bg.surface" cssVar="--fos-color-bg-surface" description="Cards / panels (alpha 2.5%)" />
        <Swatch name="text.primary" cssVar="--fos-color-text-primary" description="Texte principal (88%)" />
        <Swatch name="text.muted" cssVar="--fos-color-text-muted" description="Texte secondaire (42%)" />
        <Swatch name="border.default" cssVar="--fos-color-border-default" description="Borders (alpha 5.5%)" />
        <Swatch name="accent.brand" cssVar="--fos-color-accent-brand" description="Turquoise (focus, CTA)" />
        <Swatch name="status.wip" cssVar="--fos-color-status-wip" description="Work in progress" />
        <Swatch name="status.paused" cssVar="--fos-color-status-paused" description="Paused / blocked" />
        <Swatch name="status.parking" cssVar="--fos-color-status-parking" description="Parked / deferred" />
        <Swatch name="status.archived" cssVar="--fos-color-status-archived" description="Archived" />
      </div>
    </section>

    <section aria-labelledby="typo-heading">
      <h2
        id="typo-heading"
        style={{
          fontSize: 'var(--fos-typography-h3-size)',
          fontWeight: 600,
          marginBottom: 16
        }}
      >
        Typographie
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TypeRow
          label="h1 — 40px / 800"
          styleVars={{
            fontFamily: 'var(--fos-typography-h1-family)',
            fontSize: 'var(--fos-typography-h1-size)',
            fontWeight: 800,
            lineHeight: 'var(--fos-typography-h1-line-height)' as React.CSSProperties['lineHeight']
          }}
          sample="Foundation OS Design System"
        />
        <TypeRow
          label="h2 — 32px / 700"
          styleVars={{
            fontFamily: 'var(--fos-typography-h2-family)',
            fontSize: 'var(--fos-typography-h2-size)',
            fontWeight: 700
          }}
          sample="Headline secondaire"
        />
        <TypeRow
          label="h3 — 24px / 600"
          styleVars={{
            fontFamily: 'var(--fos-typography-h3-family)',
            fontSize: 'var(--fos-typography-h3-size)',
            fontWeight: 600
          }}
          sample="Section heading"
        />
        <TypeRow
          label="body — 16px / 400"
          styleVars={{
            fontFamily: 'var(--fos-typography-body-family)',
            fontSize: 'var(--fos-typography-body-size)'
          }}
          sample="Texte courant Void Glass — Figtree regular."
        />
        <TypeRow
          label="body-small — 14px / 400"
          styleVars={{
            fontFamily: 'var(--fos-typography-body-small-family)',
            fontSize: 'var(--fos-typography-body-small-size)'
          }}
          sample="Texte secondaire 14px."
        />
        <TypeRow
          label="label — 12px / 500"
          styleVars={{
            fontFamily: 'var(--fos-typography-label-family)',
            fontSize: 'var(--fos-typography-label-size)',
            fontWeight: 500
          }}
          sample="LABEL UI"
        />
        <TypeRow
          label="code — 14px / mono"
          styleVars={{
            fontFamily: 'var(--fos-typography-code-family)',
            fontSize: 'var(--fos-typography-code-size)'
          }}
          sample="const tokens = require('@foundation-os/design-system/tokens')"
        />
      </div>
    </section>
  </div>
)

const meta = {
  title: 'Welcome',
  component: Welcome,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof Welcome>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
