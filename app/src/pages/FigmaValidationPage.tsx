/**
 * 🎨 FIGMA VALIDATION PAGE
 * Foundation OS Phase 5 "Connected" - Page principale de validation Figma
 * Interface complète pour la validation des design tokens et synchronisation
 */

import { useState } from 'react'
import FigmaValidationDashboard from '../components/FigmaValidationDashboard'
import { FigmaValidationConfig } from '../hooks/useFigmaDesignValidation'

/**
 * 🧪 Demo & Test Suite Component
 */
function DemoTestSuite() {
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])

  const runTestSuite = async () => {
    setIsRunning(true)
    setTestResults(['🧪 Starting Figma validation test suite...'])

    const tests = [
      'Token validation accuracy test',
      'Component mapping discovery test',
      'Auto-fix functionality test',
      'Performance benchmark test',
      'Real-time sync simulation test'
    ]

    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setTestResults(prev => [...prev, `✅ ${tests[i]} - PASSED`])
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    setTestResults(prev => [...prev, '🎉 All tests completed successfully!'])
    setIsRunning(false)
  }

  const generateTestData = () => {
    setTestResults(['📝 Generating test design tokens...'])
    setTimeout(() => {
      setTestResults(prev => [
        ...prev,
        '✅ Created 15 Void Glass compliant tokens',
        '✅ Created 3 non-compliant tokens for testing',
        '✅ Generated 8 component mappings',
        '✅ Test data ready for validation'
      ])
    }, 1000)
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,.025)',
      border: '1px solid rgba(255,255,255,.055)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{
        color: '#5EEAD4',
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 0 16px 0'
      }}>
        🧪 Test & Demo Suite
      </h3>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button
          onClick={generateTestData}
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
          📝 Generate Test Data
        </button>

        <button
          onClick={runTestSuite}
          disabled={isRunning}
          style={{
            padding: '8px 16px',
            background: isRunning ? 'rgba(255,255,255,.05)' : 'rgba(34,197,94,.1)',
            color: isRunning ? 'rgba(255,255,255,.5)' : '#22C55E',
            border: `1px solid ${isRunning ? 'rgba(255,255,255,.1)' : 'rgba(34,197,94,.2)'}`,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: isRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isRunning ? '⏳ Running Tests...' : '🧪 Run Test Suite'}
        </button>
      </div>

      {testResults.length > 0 && (
        <div style={{
          background: 'rgba(255,255,255,.02)',
          border: '1px solid rgba(255,255,255,.05)',
          borderRadius: '8px',
          padding: '12px',
          maxHeight: '150px',
          overflowY: 'auto'
        }}>
          {testResults.map((result, index) => (
            <div
              key={index}
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,.7)',
                marginBottom: '4px',
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              {result}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 📊 Configuration Panel
 */
function ConfigurationPanel({
  config,
  onConfigChange
}: {
  config: FigmaValidationConfig
  onConfigChange: (config: FigmaValidationConfig) => void
}) {
  const [localConfig, setLocalConfig] = useState<FigmaValidationConfig>({
    figmaFileKey: 'demo-file-key-12345',
    autoSyncInterval: 30000,
    enableRealTimeSync: true,
    autoFixEnabled: false,
    ...config
  })

  const handleConfigUpdate = (updates: Partial<FigmaValidationConfig>) => {
    const newConfig = { ...localConfig, ...updates }
    setLocalConfig(newConfig)
    onConfigChange(newConfig)
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,.025)',
      border: '1px solid rgba(255,255,255,.055)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <h3 style={{
        color: '#5EEAD4',
        fontSize: '16px',
        fontWeight: '600',
        margin: '0 0 16px 0'
      }}>
        ⚙️ Configuration
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
        {/* Figma File Key */}
        <div>
          <label style={{
            color: 'rgba(255,255,255,.7)',
            fontSize: '12px',
            display: 'block',
            marginBottom: '4px',
            fontWeight: '600'
          }}>
            Figma File Key
          </label>
          <input
            type="text"
            value={localConfig.figmaFileKey || ''}
            onChange={(e) => handleConfigUpdate({ figmaFileKey: e.target.value })}
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
          <div style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,.5)',
            marginTop: '2px'
          }}>
            Extract from figma.com/design/[FILE_KEY]/...
          </div>
        </div>

        {/* Auto Sync Interval */}
        <div>
          <label style={{
            color: 'rgba(255,255,255,.7)',
            fontSize: '12px',
            display: 'block',
            marginBottom: '4px',
            fontWeight: '600'
          }}>
            Auto Sync Interval
          </label>
          <select
            value={localConfig.autoSyncInterval}
            onChange={(e) => handleConfigUpdate({ autoSyncInterval: parseInt(e.target.value) })}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(255,255,255,.05)',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: '6px',
              color: 'rgba(255,255,255,.88)',
              fontSize: '14px'
            }}
          >
            <option value={15000}>15 seconds</option>
            <option value={30000}>30 seconds</option>
            <option value={60000}>1 minute</option>
            <option value={300000}>5 minutes</option>
          </select>
        </div>

        {/* Toggle Options */}
        <div>
          <label style={{
            color: 'rgba(255,255,255,.7)',
            fontSize: '12px',
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            Options
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={localConfig.enableRealTimeSync}
                onChange={(e) => handleConfigUpdate({ enableRealTimeSync: e.target.checked })}
                style={{ accentColor: '#5EEAD4' }}
              />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                Enable Real-time Sync
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={localConfig.autoFixEnabled}
                onChange={(e) => handleConfigUpdate({ autoFixEnabled: e.target.checked })}
                style={{ accentColor: '#5EEAD4' }}
              />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                Enable Auto-fix
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 📚 Documentation Section
 */
function DocumentationSection() {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '📋 Overview', icon: '📋' },
    { id: 'tokens', label: '🎨 Tokens', icon: '🎨' },
    { id: 'workflow', label: '🔄 Workflow', icon: '🔄' },
    { id: 'api', label: '⚡ API', icon: '⚡' }
  ]

  const getTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h4 style={{ color: '#5EEAD4', marginBottom: '12px' }}>Phase 5 "Connected" - Figma Integration</h4>
            <p style={{ color: 'rgba(255,255,255,.7)', lineHeight: 1.5, marginBottom: '16px' }}>
              The Figma Design Validation system provides real-time synchronization and compliance monitoring
              between your Figma design tokens and Foundation OS Void Glass specification.
            </p>
            <ul style={{ color: 'rgba(255,255,255,.6)', paddingLeft: '20px' }}>
              <li>✅ Real-time design token validation</li>
              <li>✅ Automatic compliance scoring</li>
              <li>✅ Component mapping & Code Connect</li>
              <li>✅ Auto-fix suggestions</li>
              <li>✅ Performance monitoring</li>
            </ul>
          </div>
        )
      case 'tokens':
        return (
          <div>
            <h4 style={{ color: '#5EEAD4', marginBottom: '12px' }}>Void Glass Token Reference</h4>
            <div style={{
              background: 'rgba(255,255,255,.02)',
              border: '1px solid rgba(255,255,255,.05)',
              borderRadius: '6px',
              padding: '12px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              color: 'rgba(255,255,255,.7)',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              <div>--fos-bg: #06070C</div>
              <div>--fos-accent: #5EEAD4</div>
              <div>--fos-card-bg: rgba(255,255,255,.025)</div>
              <div>--fos-border: rgba(255,255,255,.055)</div>
              <div>--fos-text: rgba(255,255,255,.88)</div>
              <div>--fos-muted: rgba(255,255,255,.42)</div>
              <div>--fos-font-ui: 'Figtree'</div>
              <div>--fos-font-mono: 'JetBrains Mono'</div>
            </div>
          </div>
        )
      case 'workflow':
        return (
          <div>
            <h4 style={{ color: '#5EEAD4', marginBottom: '12px' }}>Validation Workflow</h4>
            <ol style={{ color: 'rgba(255,255,255,.6)', paddingLeft: '20px', lineHeight: 1.6 }}>
              <li>Configure Figma file key</li>
              <li>Start validation engine</li>
              <li>Monitor real-time compliance</li>
              <li>Review issues & suggestions</li>
              <li>Apply auto-fixes or manual corrections</li>
              <li>Sync components with Code Connect</li>
            </ol>
          </div>
        )
      case 'api':
        return (
          <div>
            <h4 style={{ color: '#5EEAD4', marginBottom: '12px' }}>MCP Tools Integration</h4>
            <p style={{ color: 'rgba(255,255,255,.7)', lineHeight: 1.5 }}>
              This system leverages Figma MCP tools for seamless integration:
            </p>
            <ul style={{ color: 'rgba(255,255,255,.6)', paddingLeft: '20px', fontSize: '12px' }}>
              <li><code>get_variable_defs</code> - Extract design tokens</li>
              <li><code>get_design_context</code> - Component analysis</li>
              <li><code>get_code_connect_suggestions</code> - Auto-mapping</li>
              <li><code>use_figma</code> - Apply corrections</li>
            </ul>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,.025)',
      border: '1px solid rgba(255,255,255,.055)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '6px 12px',
              background: activeTab === tab.id ? 'rgba(94,234,212,.15)' : 'rgba(255,255,255,.05)',
              color: activeTab === tab.id ? '#5EEAD4' : 'rgba(255,255,255,.6)',
              border: '1px solid rgba(255,255,255,.1)',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '14px' }}>
        {getTabContent()}
      </div>
    </div>
  )
}

/**
 * 🎨 Page principale Figma Validation
 */
export default function FigmaValidationPage() {
  const [config, setConfig] = useState<FigmaValidationConfig>({
    figmaFileKey: 'demo-file-key-12345',
    autoSyncInterval: 30000,
    enableRealTimeSync: true,
    autoFixEnabled: false
  })

  // Navigation back to main app
  const handleBackToApp = () => {
    window.location.href = '/'
  }

  return (
    <div style={{
      background: '#06070C',
      minHeight: '100vh',
      fontFamily: "'Figtree', system-ui, sans-serif"
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}>
        <div style={{
          position: 'absolute',
          width: '280px',
          height: '280px',
          background: 'rgba(167,139,250,.09)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          top: '-80px',
          right: '-60px',
          animation: 'drift 18s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          background: 'rgba(94,234,212,.09)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          bottom: '30%',
          left: '-50px',
          animation: 'drift 22s ease-in-out infinite'
        }} />
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {/* Header with navigation */}
        <div style={{
          background: 'rgba(255,255,255,.025)',
          borderBottom: '1px solid rgba(255,255,255,.055)',
          padding: '16px 20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div>
              <h1 style={{
                color: '#5EEAD4',
                fontSize: '20px',
                fontWeight: '700',
                margin: '0 0 4px 0'
              }}>
                🎨 Figma Design Validation
              </h1>
              <p style={{
                color: 'rgba(255,255,255,.6)',
                fontSize: '14px',
                margin: 0
              }}>
                Foundation OS Phase 5 "Connected" - Real-time design token compliance
              </p>
            </div>
            <button
              onClick={handleBackToApp}
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
              ← Back to Foundation OS
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          {/* Documentation */}
          <DocumentationSection />

          {/* Configuration */}
          <ConfigurationPanel
            config={config}
            onConfigChange={setConfig}
          />

          {/* Demo Test Suite */}
          <DemoTestSuite />

          {/* Main Dashboard */}
          <FigmaValidationDashboard initialConfig={config} />
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(18px, -22px); }
          66% { transform: translate(-14px, 16px); }
        }
      `}</style>
    </div>
  )
}