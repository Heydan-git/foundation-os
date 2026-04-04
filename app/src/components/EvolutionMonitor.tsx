/**
 * EvolutionMonitor.tsx - Real-time Evolution Monitoring Component
 * Foundation OS Phase 3 - Visual tracking of autonomous modifications
 */

import React from 'react'

interface EvolutionEvent {
  id: string
  timestamp: string
  type: 'analysis' | 'generation' | 'auto-fix' | 'optimization'
  description: string
  filesCreated: string[]
  success: boolean
}

interface EvolutionMonitorProps {
  evolutionHistory: EvolutionEvent[]
  isActive: boolean
  triggerCount: number
}

const eventTypeColors = {
  analysis: 'text-blue-400',
  generation: 'text-green-400',
  'auto-fix': 'text-purple-400',
  optimization: 'text-yellow-400'
}

const eventTypeIcons = {
  analysis: '🔍',
  generation: '🧠',
  'auto-fix': '🤖',
  optimization: '⚡'
}

export const EvolutionMonitor: React.FC<EvolutionMonitorProps> = ({
  evolutionHistory,
  isActive,
  triggerCount
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="bg-black/20 border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#5EEAD4] font-['Figtree'] text-xl">Evolution Monitor</h3>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
            <span className="text-sm text-gray-400 font-['JetBrains_Mono']">
              {isActive ? 'Monitoring' : 'Standby'}
            </span>
          </div>

          <div className="text-sm text-gray-400 font-['JetBrains_Mono']">
            {triggerCount} triggers active
          </div>
        </div>
      </div>

      {/* Active Triggers Status */}
      <div className="mb-6 p-4 bg-gray-900/30 rounded border border-gray-600">
        <h4 className="text-sm font-medium text-gray-300 mb-3 font-['Figtree']">
          Active Evolution Triggers
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs font-['JetBrains_Mono']">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="text-gray-400">Error Detection</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            <span className="text-gray-400">Missing Components</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
            <span className="text-gray-400">User Requests</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
            <span className="text-gray-400">Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
            <span className="text-gray-400">Documentation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
            <span className="text-gray-400">Tech Debt</span>
          </div>
        </div>
      </div>

      {/* Evolution Log */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-300 font-['Figtree']">
          Evolution Log ({evolutionHistory.length} events)
        </h4>

        {evolutionHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500 font-['JetBrains_Mono'] text-sm">
            No evolution events yet. Click "Auto-Improve" to start.
          </div>
        ) : (
          evolutionHistory.map((event) => (
            <div
              key={event.id}
              className={`p-3 rounded border-l-4 ${
                event.success
                  ? 'bg-green-900/20 border-green-400'
                  : 'bg-red-900/20 border-red-400'
              }`}
            >
              {/* Event Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {eventTypeIcons[event.type]}
                  </span>
                  <span className={`text-sm font-medium ${eventTypeColors[event.type]} font-['Figtree']`}>
                    {event.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 font-['JetBrains_Mono']">
                    {formatTime(event.timestamp)}
                  </span>
                </div>

                <div className={`w-2 h-2 rounded-full ${
                  event.success ? 'bg-green-400' : 'bg-red-400'
                }`} />
              </div>

              {/* Event Description */}
              <p className="text-sm text-gray-300 mb-2 font-['JetBrains_Mono']">
                {event.description}
              </p>

              {/* Files Created */}
              {event.filesCreated.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1 font-['Figtree']">
                    Files generated:
                  </div>
                  <div className="space-y-1">
                    {event.filesCreated.map((file, index) => (
                      <div
                        key={index}
                        className="text-xs bg-gray-800/50 px-2 py-1 rounded font-['JetBrains_Mono'] text-[#5EEAD4]"
                      >
                        📄 {file.split('/').pop() || file}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Real-time Stats */}
      <div className="mt-6 p-4 bg-gray-900/30 rounded border border-gray-600">
        <h4 className="text-sm font-medium text-gray-300 mb-3 font-['Figtree']">
          Real-time Statistics
        </h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-[#5EEAD4] font-['Figtree']">
              {evolutionHistory.filter(e => e.success).length}
            </div>
            <div className="text-xs text-gray-400 font-['JetBrains_Mono']">
              Successful
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400 font-['Figtree']">
              {evolutionHistory.reduce((sum, e) => sum + e.filesCreated.length, 0)}
            </div>
            <div className="text-xs text-gray-400 font-['JetBrains_Mono']">
              Files Created
            </div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-400 font-['Figtree']">
              {evolutionHistory.length > 0 ? Math.round((evolutionHistory.filter(e => e.success).length / evolutionHistory.length) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-400 font-['JetBrains_Mono']">
              Success Rate
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Evolution Indicator */}
      {isActive && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-['Figtree']">
              Autonomous evolution active - next check in {Math.floor(Math.random() * 15) + 1}s
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default EvolutionMonitor