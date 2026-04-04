/**
 * 🎨 FIGMA VALIDATION DASHBOARD
 * Foundation OS Phase 5 "Connected" - Interface de validation des design tokens
 * Dashboard temps réel pour monitoring + contrôle de la validation Figma
 */

import React from 'react'
import useFigmaDesignValidation, { FigmaValidationConfig } from '../hooks/useFigmaDesignValidation'
import { ValidationResult, ComponentMapping } from '../lib/figma-design-validator'

interface FigmaValidationDashboardProps {
  initialConfig?: FigmaValidationConfig
  className?: string
}

/**
 * 🎛️ Panel de contrôle principal
 */
function ControlPanel({
  isRunning,
  isLoading,
  onStart,
  onStop,
  onForcSync,
  figmaFileKey,
  onSetFileKey
}: {
  isRunning: boolean
  isLoading: boolean
  onStart: () => void
  onStop: () => void
  onForcSync: () => void
  figmaFileKey: string
  onSetFileKey: (key: string) => void
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,.025)',
      border: '1px solid rgba(255,255,255,.055)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ color: '#5EEAD4', fontSize: '16px', fontWeight: '600', margin: 0 }}>
          🎛️ Figma Validation Control
        </h3>
        <div style={{
          padding: '4px 12px',
          borderRadius: '8px',
          background: isRunning ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)',
          color: isRunning ? '#22C55E' : '#EF4444',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          {isRunning ? '🟢 RUNNING' : '🔴 STOPPED'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '12px', alignItems: 'end' }}>
        <div>
          <label style={{ color: 'rgba(255,255,255,.7)', fontSize: '12px', display: 'block', marginBottom: '4px' }}>
            Figma File Key
          </label>
          <input
            type="text"
            value={figmaFileKey}
            onChange={(e) => onSetFileKey(e.target.value)}
            placeholder="Enter Figma file key..."
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255,255,255,.05)',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,.88)',
              fontSize: '14px',
              fontFamily: "'JetBrains Mono', monospace"
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {!isRunning ? (
            <button
              onClick={onStart}
              disabled={isLoading || !figmaFileKey}
              style={{
                padding: '8px 16px',
                background: '#5EEAD4',
                color: '#06070C',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                opacity: (isLoading || !figmaFileKey) ? 0.5 : 1
              }}
            >
              {isLoading ? '⏳ Starting...' : '▶️ Start'}
            </button>
          ) : (
            <button
              onClick={onStop}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                background: 'rgba(239,68,68,.2)',
                color: '#EF4444',
                border: '1px solid rgba(239,68,68,.3)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              ⏹️ Stop
            </button>
          )}

          <button
            onClick={onForcSync}
            disabled={!isRunning || isLoading}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,.05)',
              color: 'rgba(255,255,255,.7)',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: (!isRunning || isLoading) ? 0.5 : 1
            }}
          >
            🔄 Force Sync
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * 📊 Métriques de santé du design system
 */
function HealthMetrics({
  overallScore,
  totalTokens,
  compliantTokens,
  autoFixableIssues,
  syncLatency
}: {
  overallScore: number
  totalTokens: number
  compliantTokens: number
  autoFixableIssues: number
  syncLatency: number
  successRate: number
}) {
  const getScoreColor = (score: number) => {
    if (score >= 95) return '#22C55E'
    if (score >= 85) return '#F59E0B'
    return '#EF4444'
  }

  const metrics = [
    {
      label: 'Health Score',
      value: `${overallScore}%`,
      color: getScoreColor(overallScore),
      icon: '💚'
    },
    {
      label: 'Token Compliance',
      value: `${compliantTokens}/${totalTokens}`,
      color: compliantTokens === totalTokens ? '#22C55E' : '#F59E0B',
      icon: '🎨'
    },
    {
      label: 'Auto-fixable',
      value: `${autoFixableIssues}`,
      color: autoFixableIssues === 0 ? '#22C55E' : '#5EEAD4',
      icon: '🔧'
    },
    {
      label: 'Sync Speed',
      value: `${(syncLatency / 1000).toFixed(1)}s`,
      color: syncLatency < 5000 ? '#22C55E' : '#F59E0B',
      icon: '⚡'
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {metrics.map((metric, index) => (
        <div
          key={index}
          style={{
            background: 'rgba(255,255,255,.025)',
            border: '1px solid rgba(255,255,255,.055)',
            borderRadius: '12px',
            padding: '16px',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            {metric.icon}
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: '700',
            color: metric.color,
            marginBottom: '4px',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            {metric.value}
          </div>
          <div style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,.6)',
            fontWeight: '500'
          }}>
            {metric.label}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * ⚠️ Tableau des problèmes de validation
 */
function ValidationIssues({
  validationResults,
  onAutoFix
}: {
  validationResults: ValidationResult[]
  onAutoFix: () => void
}) {
  const issues = validationResults.filter(r => !r.isCompliant)

  if (issues.length === 0) {
    return (
      <div style={{
        background: 'rgba(34,197,94,.1)',
        border: '1px solid rgba(34,197,94,.2)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
        <div style={{ color: '#22C55E', fontWeight: '600', marginBottom: '4px' }}>
          Perfect Compliance!
        </div>
        <div style={{ color: 'rgba(255,255,255,.6)', fontSize: '14px' }}>
          All design tokens are compliant with Void Glass specification
        </div>
      </div>
    )
  }

  const autoFixableCount = issues.filter(issue => issue.autoFixAvailable).length

  return (
    <div style={{
      background: 'rgba(255,255,255,.025)',
      border: '1px solid rgba(255,255,255,.055)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ color: '#F59E0B', fontSize: '16px', fontWeight: '600', margin: 0 }}>
          ⚠️ Validation Issues ({issues.length})
        </h3>
        {autoFixableCount > 0 && (
          <button
            onClick={onAutoFix}
            style={{
              padding: '6px 12px',
              background: '#5EEAD4',
              color: '#06070C',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            🔧 Auto-fix {autoFixableCount} issues
          </button>
        )}
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {issues.map((issue, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255,255,255,.02)',
              border: '1px solid rgba(255,255,255,.05)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px' }}>
                  {issue.severity === 'error' ? '🚨' : '⚠️'}
                </span>
                <code style={{
                  background: 'rgba(94,234,212,.1)',
                  color: '#5EEAD4',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: "'JetBrains Mono', monospace"
                }}>
                  {issue.token}
                </code>
              </div>
              {issue.autoFixAvailable && (
                <span style={{
                  background: 'rgba(34,197,94,.1)',
                  color: '#22C55E',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  ✨ AUTO-FIX
                </span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', marginBottom: '8px' }}>
              <div>
                <span style={{ color: 'rgba(255,255,255,.5)' }}>Current: </span>
                <code style={{ color: '#EF4444', fontFamily: "'JetBrains Mono', monospace" }}>
                  {issue.figmaValue}
                </code>
              </div>
              <div>
                <span style={{ color: 'rgba(255,255,255,.5)' }}>Expected: </span>
                <code style={{ color: '#22C55E', fontFamily: "'JetBrains Mono', monospace" }}>
                  {issue.expectedValue}
                </code>
              </div>
            </div>

            {issue.suggestion && (
              <div style={{
                background: 'rgba(94,234,212,.05)',
                border: '1px solid rgba(94,234,212,.1)',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '12px',
                color: 'rgba(255,255,255,.7)',
                fontStyle: 'italic'
              }}>
                💡 {issue.suggestion}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 🧩 Status des composants
 */
function ComponentStatus({ componentMappings }: { componentMappings: ComponentMapping[] }) {
  if (componentMappings.length === 0) {
    return (
      <div style={{
        background: 'rgba(255,255,255,.025)',
        border: '1px solid rgba(255,255,255,.055)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '14px' }}>
          No component mappings found. Start validation to discover components.
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,.025)',
      border: '1px solid rgba(255,255,255,.055)',
      borderRadius: '12px',
      padding: '20px'
    }}>
      <h3 style={{ color: '#5EEAD4', fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' }}>
        🧩 Component Mappings ({componentMappings.length})
      </h3>

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {componentMappings.map((mapping, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: 'rgba(255,255,255,.02)',
              border: '1px solid rgba(255,255,255,.05)',
              borderRadius: '6px',
              marginBottom: '8px',
              fontSize: '12px'
            }}
          >
            <div>
              <div style={{ color: 'rgba(255,255,255,.88)', fontWeight: '600' }}>
                {mapping.figmaComponentName}
              </div>
              <div style={{ color: 'rgba(255,255,255,.5)', marginTop: '2px' }}>
                → {mapping.foundationComponentName}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600',
                background: mapping.codeConnectStatus === 'connected' ? 'rgba(34,197,94,.1)' : 'rgba(245,158,11,.1)',
                color: mapping.codeConnectStatus === 'connected' ? '#22C55E' : '#F59E0B'
              }}>
                {mapping.codeConnectStatus === 'connected' ? '🔗 Connected' : '⚡ Partial'}
              </span>

              <span style={{
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: '600',
                background: mapping.validationStatus === 'compliant' ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.1)',
                color: mapping.validationStatus === 'compliant' ? '#22C55E' : '#EF4444'
              }}>
                {mapping.validationStatus === 'compliant' ? '✅ Valid' : '⚠️ Issues'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 🎨 Dashboard principal
 */
export default function FigmaValidationDashboard({
  initialConfig,
  className = ''
}: FigmaValidationDashboardProps) {
  const { state, actions } = useFigmaDesignValidation(initialConfig)

  return (
    <div className={className} style={{
      fontFamily: "'Figtree', system-ui, sans-serif",
      color: 'rgba(255,255,255,.88)',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          color: '#5EEAD4',
          fontSize: '28px',
          fontWeight: '700',
          margin: '0 0 8px 0'
        }}>
          🎨 Figma Design Validation
        </h1>
        <p style={{
          color: 'rgba(255,255,255,.6)',
          fontSize: '16px',
          margin: 0
        }}>
          Real-time Void Glass compliance monitoring & design token validation
        </p>
      </div>

      {/* Control Panel */}
      <ControlPanel
        isRunning={state.isRunning}
        isLoading={state.isLoading}
        onStart={() => actions.startValidation()}
        onStop={actions.stopValidation}
        onForcSync={actions.forceSyncAll}
        figmaFileKey={state.figmaFileKey}
        onSetFileKey={actions.setFigmaFileKey}
      />

      {/* Error Display */}
      {state.error && (
        <div style={{
          background: 'rgba(239,68,68,.1)',
          border: '1px solid rgba(239,68,68,.2)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          color: '#EF4444'
        }}>
          <strong>❌ Error:</strong> {state.error}
        </div>
      )}

      {/* Health Metrics */}
      {state.designSystemHealth && (
        <HealthMetrics
          overallScore={state.designSystemHealth.overallScore}
          totalTokens={state.designSystemHealth.totalTokens}
          compliantTokens={state.designSystemHealth.compliantTokens}
          autoFixableIssues={state.designSystemHealth.autoFixableIssues}
          syncLatency={state.syncLatency}
          successRate={state.successRate}
        />
      )}

      {/* Validation Issues */}
      <ValidationIssues
        validationResults={state.validationResults}
        onAutoFix={actions.autoFixAllTokens}
      />

      {/* Component Status */}
      <ComponentStatus componentMappings={state.componentMappings} />

      {/* Quick Actions */}
      {state.isRunning && (
        <div style={{
          background: 'rgba(255,255,255,.025)',
          border: '1px solid rgba(255,255,255,.055)',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '24px'
        }}>
          <h3 style={{ color: '#5EEAD4', fontSize: '16px', fontWeight: '600', margin: '0 0 16px 0' }}>
            🛠️ Quick Actions
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={actions.validateAllTokens}
              disabled={state.isLoading}
              style={{
                padding: '8px 16px',
                background: 'rgba(94,234,212,.1)',
                color: '#5EEAD4',
                border: '1px solid rgba(94,234,212,.2)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔍 Validate Tokens
            </button>

            <button
              onClick={actions.syncComponents}
              disabled={state.isLoading}
              style={{
                padding: '8px 16px',
                background: 'rgba(94,234,212,.1)',
                color: '#5EEAD4',
                border: '1px solid rgba(94,234,212,.2)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🧩 Sync Components
            </button>

            <button
              onClick={actions.exportValidationData}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,.05)',
                color: 'rgba(255,255,255,.7)',
                border: '1px solid rgba(255,255,255,.1)',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              📊 Export Report
            </button>
          </div>

          {state.lastSyncTime && (
            <div style={{
              marginTop: '12px',
              fontSize: '12px',
              color: 'rgba(255,255,255,.5)'
            }}>
              Last sync: {new Date(state.lastSyncTime).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}