import React, { useState, useEffect } from 'react';

const FosSync = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [syncData, setSyncData] = useState({});

  // Projects Knowledge Base files
  const kbFiles = [
    { name: 'FOS-SETUP-GUIDE.md', size: '15KB', priority: 'P1', status: 'pending' },
    { name: 'FOS-SCALE-ORCHESTRATOR-DATA.md', size: '18KB', priority: 'P1', status: 'pending' },
    { name: 'FOS-MONITORING.md', size: '12KB', priority: 'P1', status: 'pending' },
    { name: 'FOS-JOURNAL.md', size: '25KB', priority: 'P1', status: 'pending' },
    { name: 'FOS-TECH-ARCHITECTURE.md', size: '8KB', priority: 'P2', status: 'pending' },
    { name: 'FOS-META-PLAN.md', size: '6KB', priority: 'P2', status: 'pending' },
    { name: 'project-context.md', size: '4KB', priority: 'P2', status: 'pending' },
    { name: 'FOS-COMMANDER-DATA.md', size: '7KB', priority: 'P3', status: 'pending' },
    { name: 'FOS-KNOWLEDGE-DATA.md', size: '9KB', priority: 'P3', status: 'pending' },
    { name: 'FOS-INDEX-DATA.md', size: '5KB', priority: 'P3', status: 'pending' },
    { name: 'FOS-GRAPH-DATA.md', size: '8KB', priority: 'P3', status: 'pending' },
    { name: 'FOS-SYNC-DATA.md', size: '6KB', priority: 'P3', status: 'pending' },
    { name: 'FOS-SKILL-ORCHESTRATOR.md', size: '12KB', priority: 'P4', status: 'pending' },
    { name: 'FOS-MANIFESTE.md', size: '4KB', priority: 'P4', status: 'pending' },
    { name: 'FOS-ERROR-LOG.md', size: '2KB', priority: 'P4', status: 'pending' }
  ];

  // Void Glass compliance data
  const artifacts = [
    { name: 'fos-index.jsx', bg: true, fontUI: true, fontCode: true, compliance: 100 },
    { name: 'fos-commander.jsx', bg: true, fontUI: true, fontCode: true, compliance: 100 },
    { name: 'fos-knowledge.jsx', bg: true, fontUI: true, fontCode: true, compliance: 100 },
    { name: 'fos-scale-orchestrator.jsx', bg: true, fontUI: true, fontCode: true, compliance: 100 },
    { name: 'fos-graph.jsx', bg: true, fontUI: true, fontCode: true, compliance: 100 },
    { name: 'fos-sync.jsx', bg: true, fontUI: true, fontCode: true, compliance: 100 }
  ];

  // MD/JSX pairs integrity
  const mdJsxPairs = [
    { md: 'FOS-INDEX-DATA.md', jsx: 'fos-index.jsx', linesMD: 126, linesJSX: 431, lastSync: '2026-04-03', status: 'synced' },
    { md: 'FOS-COMMANDER-DATA.md', jsx: 'fos-commander.jsx', linesMD: 98, linesJSX: 364, lastSync: '2026-04-03', status: 'synced' },
    { md: 'FOS-KNOWLEDGE-DATA.md', jsx: 'fos-knowledge.jsx', linesMD: 112, linesJSX: 448, lastSync: '2026-04-03', status: 'synced' },
    { md: 'FOS-SCALE-ORCHESTRATOR-DATA.md', jsx: 'fos-scale-orchestrator.jsx', linesMD: 330, linesJSX: 558, lastSync: '2026-04-04', status: 'synced' },
    { md: 'FOS-GRAPH-DATA.md', jsx: 'fos-graph.jsx', linesMD: 125, linesJSX: 309, lastSync: '2026-04-04', status: 'synced' },
    { md: 'FOS-SYNC-DATA.md', jsx: 'fos-sync.jsx', linesMD: 120, linesJSX: 380, lastSync: '2026-04-04', status: 'building' }
  ];

  // Load sync data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fos-sync-v1');
    if (saved) {
      setSyncData(JSON.parse(saved));
    }
  }, []);

  // Save sync data to localStorage
  const saveSyncData = (data) => {
    localStorage.setItem('fos-sync-v1', JSON.stringify(data));
    setSyncData(data);
  };

  // Calculate upload progress
  const uploadedCount = kbFiles.filter(f => f.status === 'uploaded').length;
  const uploadProgressPercent = Math.round((uploadedCount / kbFiles.length) * 100);

  // Priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P1': return 'text-red-400 bg-red-900/30';
      case 'P2': return 'text-orange-400 bg-orange-900/30';
      case 'P3': return 'text-yellow-400 bg-yellow-900/30';
      case 'P4': return 'text-gray-400 bg-gray-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  // Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'uploaded': return 'text-green-400 bg-green-900/30';
      case 'pending': return 'text-orange-400 bg-orange-900/30';
      case 'synced': return 'text-green-400 bg-green-900/30';
      case 'building': return 'text-blue-400 bg-blue-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const tabs = [
    { id: 'upload', label: 'Knowledge Base Upload', icon: '📤' },
    { id: 'compliance', label: 'Void Glass Compliance', icon: '🎨' },
    { id: 'integrity', label: 'MD/JSX Integrity', icon: '🔗' },
    { id: 'overlaps', label: 'Overlaps Detection', icon: '🔍' },
    { id: 'github', label: 'GitHub Integration', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-[#06070C] text-white" style={{ fontFamily: 'Figtree, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Foundation OS Sync</h1>
            <p className="text-gray-400">Projects KB · DA Compliance · Overlaps</p>
          </div>
          <div className="flex space-x-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{uploadedCount}/{kbFiles.length}</div>
              <div className="text-gray-400">KB Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">100%</div>
              <div className="text-gray-400">Void Glass</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">100%</div>
              <div className="text-gray-400">MD-first</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-800">
        <div className="flex space-x-1 p-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Knowledge Base Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Upload Progress</h3>
                <span className="text-lg font-bold text-orange-400">{uploadProgressPercent}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-600 to-orange-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${uploadProgressPercent}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {uploadedCount} of {kbFiles.length} files uploaded to Claude.ai Projects Knowledge Base
              </p>
            </div>

            <div className="grid gap-4">
              {kbFiles.map((file, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    <div>
                      <div className="font-medium text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {file.name}
                      </div>
                      <div className="text-sm text-gray-400">{file.size}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(file.priority)}`}>
                      {file.priority}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(file.status)}`}>
                      {file.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Void Glass Compliance Tab */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Global Void Glass Score: 100%</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Wrong Background</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Wrong UI Font</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Wrong Code Font</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Missing Declarations</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {artifacts.map((artifact, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {artifact.name}
                    </div>
                    <div className="text-lg font-bold text-green-400">{artifact.compliance}%</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${artifact.bg ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-gray-400">#06070C Background</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${artifact.fontUI ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-gray-400">Figtree UI</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${artifact.fontCode ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      <span className="text-gray-400">JetBrains Mono</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MD/JSX Integrity Tab */}
        {activeTab === 'integrity' && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-2">MD-first Compliance: 100%</h3>
              <p className="text-gray-400 text-sm">All MD files created before their corresponding JSX artifacts</p>
            </div>

            <div className="grid gap-4">
              {mdJsxPairs.map((pair, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="font-medium text-white mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        {pair.jsx}
                      </div>
                      <div className="text-sm text-gray-400">{pair.md}</div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(pair.status)}`}>
                      {pair.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">MD Lines:</span>
                      <span className="ml-2 text-white font-mono">{pair.linesMD}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">JSX Lines:</span>
                      <span className="ml-2 text-white font-mono">{pair.linesJSX}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Last Sync:</span>
                      <span className="ml-2 text-white font-mono">{pair.lastSync}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overlaps Detection Tab */}
        {activeTab === 'overlaps' && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Code Duplication Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-[#06070C] rounded border border-gray-700">
                  <div>
                    <div className="font-medium text-white">Void Glass base styles</div>
                    <div className="text-sm text-gray-400">6x occurrences in all artifacts</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-green-900/30 text-green-400">Acceptable</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#06070C] rounded border border-gray-700">
                  <div>
                    <div className="font-medium text-white">Navigation components</div>
                    <div className="text-sm text-gray-400">4x in cmd,knw,sco,grp</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-orange-900/30 text-orange-400">Consider shared component</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#06070C] rounded border border-gray-700">
                  <div>
                    <div className="font-medium text-white">Storage helpers</div>
                    <div className="text-sm text-gray-400">5x in cmd,knw,sco,grp,syn</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-orange-900/30 text-orange-400">Consider shared utils</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#06070C] rounded border border-gray-700">
                  <div>
                    <div className="font-medium text-white">Form validation</div>
                    <div className="text-sm text-gray-400">3x in cmd,knw,syn</div>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-green-900/30 text-green-400">Light duplication</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GitHub Integration Tab */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Repository Health</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Repository Status</div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    <span className="text-white">foundation-os (Public)</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Auto-deploy</div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                    <span className="text-white">Vercel Active</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Branch</div>
                  <div className="text-white font-mono">main</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Last Push</div>
                  <div className="text-white font-mono">2026-04-04</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Commit History Health</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Conventional format</span>
                  <span className="text-green-400 font-mono">100%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Co-authored commits</span>
                  <span className="text-green-400 font-mono">95%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Atomic commits</span>
                  <span className="text-green-400 font-mono">85%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Clear messages</span>
                  <span className="text-green-400 font-mono">90%</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 p-4 text-center">
        <div className="flex justify-center items-center space-x-6 text-sm text-gray-400">
          <div>Foundation OS Sync v1.0.0</div>
          <div>Last sync: 2026-04-04 11:00</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace' }}>Storage: fos-sync-v1</div>
        </div>
      </div>
    </div>
  );
};

export default FosSync;