import React, { useState, useEffect } from 'react';

const FosGraph = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [metrics, setMetrics] = useState({
    artifactsDelivered: 4,
    totalArtifacts: 6,
    mdPairsComplete: 4,
    voidGlassCompliance: 100,
    lineCountCompliance: 100,
    healthScore: 83
  });

  // Nodes data from FOS-GRAPH-DATA.md
  const nodes = [
    { id: 'idx', label: 'fos-index', type: 'artifact', status: 'delivered', lines: 431, x: 200, y: 150, radius: 40 },
    { id: 'cmd', label: 'fos-commander', type: 'artifact', status: 'delivered', lines: 364, x: 350, y: 120, radius: 35 },
    { id: 'knw', label: 'fos-knowledge', type: 'artifact', status: 'delivered', lines: 448, x: 350, y: 180, radius: 35 },
    { id: 'sco', label: 'fos-scale-orchestrator', type: 'artifact', status: 'delivered', lines: 558, x: 500, y: 150, radius: 40 },
    { id: 'grp', label: 'fos-graph', type: 'artifact', status: 'building', lines: 500, x: 200, y: 250, radius: 30 },
    { id: 'syn', label: 'fos-sync', type: 'artifact', status: 'planned', lines: 400, x: 350, y: 280, radius: 30 },
    { id: 'pip', label: 'fos-pipeline', type: 'artifact', status: 'planned', lines: 600, x: 500, y: 280, radius: 30 }
  ];

  // Edges data from FOS-GRAPH-DATA.md
  const edges = [
    { from: 'idx', to: 'cmd', type: 'navigation', weight: 3, desc: 'Index → Commander dashboard' },
    { from: 'idx', to: 'knw', type: 'navigation', weight: 3, desc: 'Index → Knowledge base' },
    { from: 'idx', to: 'sco', type: 'navigation', weight: 3, desc: 'Index → Scale orchestrator' },
    { from: 'idx', to: 'grp', type: 'navigation', weight: 2, desc: 'Index → Graph viewer (self)' },
    { from: 'cmd', to: 'sco', type: 'workflow', weight: 4, desc: 'Commander uses Scale data' },
    { from: 'knw', to: 'cmd', type: 'data', weight: 2, desc: 'Knowledge feeds Commander' },
    { from: 'sco', to: 'cmd', type: 'orchestration', weight: 5, desc: 'Scale orchestrator drives Commander' }
  ];

  // Color mapping
  const getNodeColor = (status) => {
    switch (status) {
      case 'delivered': return '#22C55E';
      case 'building': return '#F59E0B';
      case 'planned': return '#6B7280';
      default: return '#EF4444';
    }
  };

  const getEdgeStyle = (type) => {
    const styles = {
      navigation: { stroke: '#60A5FA', width: 2, opacity: 0.8 },
      workflow: { stroke: '#F59E0B', width: 3, opacity: 0.9 },
      data: { stroke: '#A855F7', width: 2, opacity: 0.7 },
      orchestration: { stroke: '#EF4444', width: 4, opacity: 1.0 },
      audit: { stroke: '#6B7280', width: 1, opacity: 0.5 },
      sync: { stroke: '#10B981', width: 2, opacity: 0.6 }
    };
    return styles[type] || styles.navigation;
  };

  // Calculate edge path
  const getEdgePath = (fromNode, toNode) => {
    const from = nodes.find(n => n.id === fromNode);
    const to = nodes.find(n => n.id === toNode);
    if (!from || !to) return '';

    return `M${from.x},${from.y} L${to.x},${to.y}`;
  };

  // Violations check
  const violations = [
    { artifact: 'fos-graph.jsx', issue: 'Missing (building)', severity: 'medium', action: 'Complete e21' },
    { artifact: 'fos-sync.jsx', issue: 'Missing', severity: 'medium', action: 'Complete e22' },
    { artifact: 'fos-pipeline.jsx', issue: 'Missing', severity: 'low', action: 'P6 future' }
  ];

  return (
    <div className="min-h-screen bg-[#06070C] text-white" style={{ fontFamily: 'Figtree, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Foundation OS Graph</h1>
            <p className="text-gray-400">Architecture & Audit Viewer</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{metrics.artifactsDelivered}/{metrics.totalArtifacts}</div>
              <div className="text-gray-400">Artifacts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{metrics.healthScore}%</div>
              <div className="text-gray-400">Health Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{metrics.voidGlassCompliance}%</div>
              <div className="text-gray-400">Void Glass</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Graph Area */}
        <div className="flex-1 p-6">
          <svg width="900" height="600" className="border border-gray-800 rounded-lg bg-[#06070C]">
            {/* Grid background */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1F2937" strokeWidth="1" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Edges */}
            {edges.map((edge, index) => {
              const style = getEdgeStyle(edge.type);
              const isSelected = selectedEdge === index;
              return (
                <g key={index}>
                  <path
                    d={getEdgePath(edge.from, edge.to)}
                    stroke={style.stroke}
                    strokeWidth={style.width + (isSelected ? 1 : 0)}
                    opacity={style.opacity + (isSelected ? 0.2 : 0)}
                    fill="none"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setSelectedEdge(index)}
                    onMouseLeave={() => setSelectedEdge(null)}
                  />
                  {isSelected && (
                    <foreignObject x={400} y={50} width="200" height="60">
                      <div className="bg-gray-900 p-2 rounded border border-gray-700 text-xs">
                        <div className="font-medium text-white">{edge.type.toUpperCase()}</div>
                        <div className="text-gray-400">{edge.desc}</div>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node, index) => {
              const isSelected = selectedNode === index;
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius + (isSelected ? 5 : 0)}
                    fill={getNodeColor(node.status)}
                    stroke="#374151"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      filter: isSelected ? 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))' : 'none'
                    }}
                    onClick={() => setSelectedNode(selectedNode === index ? null : index)}
                  />
                  <text
                    x={node.x}
                    y={node.y - node.radius - 8}
                    textAnchor="middle"
                    className="text-xs fill-white font-medium"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    className="text-xs fill-white"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {node.lines}L
                  </text>
                </g>
              );
            })}

            {/* Legend */}
            <g transform="translate(20, 480)">
              <rect x="0" y="0" width="200" height="100" fill="#111827" stroke="#374151" rx="4"/>
              <text x="10" y="20" className="text-sm font-medium fill-white">Status Legend</text>
              <circle cx="20" cy="35" r="6" fill="#22C55E"/>
              <text x="35" y="40" className="text-xs fill-gray-300">Delivered</text>
              <circle cx="20" cy="55" r="6" fill="#F59E0B"/>
              <text x="35" y="60" className="text-xs fill-gray-300">Building</text>
              <circle cx="20" cy="75" r="6" fill="#6B7280"/>
              <text x="35" y="80" className="text-xs fill-gray-300">Planned</text>
            </g>
          </svg>

          {/* Selected Node Details */}
          {selectedNode !== null && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-2">{nodes[selectedNode].label}</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    nodes[selectedNode].status === 'delivered' ? 'bg-green-600 text-white' :
                    nodes[selectedNode].status === 'building' ? 'bg-orange-600 text-white' :
                    'bg-gray-600 text-white'
                  }`}>
                    {nodes[selectedNode].status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Lines:</span>
                  <span className="ml-2 text-white font-mono">{nodes[selectedNode].lines}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="ml-2 text-white">{nodes[selectedNode].type}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Audit Panel */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Health Metrics</h2>

          {/* Health Score */}
          <div className="mb-6 p-4 bg-[#06070C] rounded-lg border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">Overall Health</span>
              <span className="text-2xl font-bold text-green-400">{metrics.healthScore}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${metrics.healthScore}%` }}
              ></div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-400">Artifacts delivered</span>
              <span className="text-white font-mono">{metrics.artifactsDelivered}/{metrics.totalArtifacts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">MD pairs complete</span>
              <span className="text-white font-mono">{metrics.mdPairsComplete}/{metrics.artifactsDelivered}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Void Glass compliance</span>
              <span className="text-green-400 font-mono">{metrics.voidGlassCompliance}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Line count compliance</span>
              <span className="text-green-400 font-mono">{metrics.lineCountCompliance}%</span>
            </div>
          </div>

          {/* Violations */}
          <h3 className="text-lg font-semibold text-white mb-4">Violations</h3>
          <div className="space-y-3">
            {violations.map((violation, index) => (
              <div key={index} className="p-3 bg-[#06070C] rounded border border-gray-700">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-white">{violation.artifact}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    violation.severity === 'medium' ? 'bg-orange-600' :
                    violation.severity === 'low' ? 'bg-gray-600' : 'bg-red-600'
                  } text-white`}>
                    {violation.severity}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mb-2">{violation.issue}</div>
                <div className="text-xs text-blue-400">{violation.action}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-2">
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
            >
              Refresh Data
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
            >
              Clear Selection
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-gray-700 text-xs text-gray-500">
            <div>Foundation OS Graph v1.0.0</div>
            <div>Last sync: 2026-04-04 10:30</div>
            <div className="mt-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              Storage: fos-graph-v1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FosGraph;