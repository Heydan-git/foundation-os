import React, { useState, useMemo } from 'react';

// === CONSTANTS ===

const CATALOG = [
  // Category 1: ARTIFACTS LIVRÉS (delivered)
  {
    id: 'fos-index',
    name: 'fos-index.jsx',
    category: 'artifacts-delivered',
    role: 'Navigation · index fichiers',
    status: 'delivered',
    lines: 410,
    mdPair: 'FOS-INDEX-DATA.md'
  },
  // Category 2: ARTIFACTS PLANIFIÉS (planned)
  {
    id: 'fos-graph',
    name: 'fos-graph.jsx',
    category: 'artifacts-delivered',
    role: 'Graphe SVG · audit artifacts',
    status: 'delivered',
    lines: 309,
    mdPair: 'FOS-GRAPH-DATA.md'
  },
  {
    id: 'fos-sync',
    name: 'fos-sync.jsx',
    category: 'artifacts-delivered',
    role: 'Projects KB · DA compliance · overlaps',
    status: 'delivered',
    lines: 390,
    mdPair: 'FOS-SYNC-DATA.md'
  },
  {
    id: 'fos-pipeline',
    name: 'fos-pipeline.jsx',
    category: 'artifacts-planned',
    role: 'Pipeline 8 phases × 3 budgets',
    status: 'planned',
    mdPair: 'FOS-PIPELINE-DATA.md'
  },
  // Category 3: DONNÉES MD (data files)
  {
    id: 'fos-index-data',
    name: 'FOS-INDEX-DATA.md',
    category: 'data-md',
    role: 'Source de vérité fos-index',
    status: 'stable'
  },
  {
    id: 'fos-commander-data',
    name: 'FOS-COMMANDER-DATA.md',
    category: 'data-md',
    role: 'Source de vérité fos-commander',
    status: 'stable'
  },
  {
    id: 'fos-knowledge-data',
    name: 'FOS-KNOWLEDGE-DATA.md',
    category: 'data-md',
    role: 'Source de vérité fos-knowledge',
    status: 'stable'
  },
  {
    id: 'fos-scale-orchestrator-data',
    name: 'FOS-SCALE-ORCHESTRATOR-DATA.md',
    category: 'data-md',
    role: 'Source de vérité fos-scale-orchestrator',
    status: 'stable'
  },
  {
    id: 'context-md',
    name: 'CONTEXT.md',
    category: 'data-md',
    role: 'Source de verite — etat actuel du projet',
    status: 'stable'
  },
  {
    id: 'claude-md',
    name: 'CLAUDE.md',
    category: 'data-md',
    role: 'Instructions Claude Code',
    status: 'stable'
  },
  {
    id: 'design-system',
    name: 'docs/design-system.md',
    category: 'data-md',
    role: 'Void Glass tokens et specs',
    status: 'stable'
  },
  {
    id: 'architecture',
    name: 'docs/architecture.md',
    category: 'data-md',
    role: 'Decisions techniques et ADR',
    status: 'stable'
  },
  {
    id: 'setup-guide',
    name: 'docs/setup-guide.md',
    category: 'data-md',
    role: 'Guide setup 22 etapes',
    status: 'stable'
  },
  {
    id: 'manifeste',
    name: 'docs/manifeste.md',
    category: 'data-md',
    role: 'Vision Foundation OS',
    status: 'stable'
  },
  {
    id: 'readme',
    name: 'README.md',
    category: 'data-md',
    role: 'README repo GitHub',
    status: 'stable'
  },
  // Category 4: AGENTS (.claude/agents/)
  {
    id: 'os-architect',
    name: 'os-architect.md',
    category: 'agents',
    role: 'Architecture · ADR · review structure',
    status: 'stable'
  },
  {
    id: 'doc-agent',
    name: 'doc-agent.md',
    category: 'agents',
    role: 'MD · traçabilité · journal · sync',
    status: 'stable'
  },
  {
    id: 'review-agent',
    name: 'review-agent.md',
    category: 'agents',
    role: 'Garde-fous · cohérence · zéro régression',
    status: 'stable'
  },
  {
    id: 'dev-agent',
    name: 'dev-agent.md',
    category: 'agents',
    role: 'Code React · Supabase · Void Glass',
    status: 'stable'
  },
  // Category 5: COMMANDS (.claude/commands/)
  {
    id: 'session-start',
    name: 'session-start.md',
    category: 'commands',
    role: 'Charger contexte + état + prochaine action',
    status: 'stable'
  },
  {
    id: 'session-end',
    name: 'session-end.md',
    category: 'commands',
    role: 'Résumer + lister fichiers modifiés + next step',
    status: 'stable'
  },
  {
    id: 'new-project',
    name: 'new-project.md',
    category: 'commands',
    role: 'Créer structure nouveau projet',
    status: 'stable'
  },
  {
    id: 'sync',
    name: 'sync.md',
    category: 'commands',
    role: 'Vérifier cohérence projet',
    status: 'stable'
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All', color: '#5EEAD4' },
  { id: 'artifacts-delivered', label: 'Artifacts Delivered', color: '#22C55E' },
  { id: 'artifacts-planned', label: 'Artifacts Planned', color: '#F97316' },
  { id: 'data-md', label: 'Data MD', color: '#A78BFA' },
  { id: 'agents', label: 'Agents', color: '#5EEAD4' },
  { id: 'commands', label: 'Commands', color: '#3B82F6' }
];

const getStatusColor = (status) => {
  const colors = {
    delivered: '#22C55E',
    'in-progress': '#F59E0B',
    planned: '#F97316',
    stable: '#A78BFA'
  };
  return colors[status] || '#94A3B8';
};

const getFileIcon = (category) => {
  const icons = {
    'artifacts-delivered': '⚙️',
    'artifacts-planned': '📋',
    'data-md': '📄',
    agents: '🤖',
    commands: '⌨️'
  };
  return icons[category] || '📁';
};

// === COMPONENTS ===

const Badge = ({ label, color }) => (
  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
    style={{ backgroundColor: color + '25', color }}>
    {label}
  </span>
);

const Card = ({ children, style }) => (
  <div className="p-4 rounded-lg border"
    style={{ backgroundColor: 'rgba(255,255,255,.025)', borderColor: 'rgba(255,255,255,.055)', ...style }}>
    {children}
  </div>
);

const FileCard = ({ item, isSelected, onSelect }) => {
  const handleClick = () => {
    onSelect(isSelected ? null : item.id);
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 rounded-lg border transition-all cursor-pointer"
      style={{
        backgroundColor: isSelected ? 'rgba(94, 234, 212, 0.1)' : 'rgba(255, 255, 255, 0.025)',
        borderColor: isSelected ? '#5EEAD4' : 'rgba(255, 255, 255, 0.055)'
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getFileIcon(item.category)}</span>
          <h3 className="font-mono text-sm text-white">{item.name}</h3>
        </div>
        <Badge label={item.status} color={getStatusColor(item.status)} />
      </div>
      <p className="text-xs text-gray-300 mb-2">{item.role}</p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        {item.lines && <span>{item.lines}L</span>}
        {item.mdPair && <span>• {item.mdPair}</span>}
      </div>
    </div>
  );
};

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search files, roles, or descriptions..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400/50"
      />
    </div>
  );
};

const CategoryTabs = ({ categories, activeCategory, onSelect }) => {
  return (
    <div className="flex gap-2 mb-6 flex-wrap border-b border-white/10 pb-3">
      {categories.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
          style={{
            backgroundColor: activeCategory === tab.id ? 'rgba(94,234,212,.15)' : 'transparent',
            color: activeCategory === tab.id ? '#5EEAD4' : '#94A3B8',
            borderBottom: activeCategory === tab.id ? '2px solid #5EEAD4' : 'none'
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// === MAIN COMPONENT ===

export default function FOSIndex() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredItems = useMemo(() => {
    return CATALOG.filter((item) => {
      const categoryMatch =
        activeCategory === 'all' || item.category === activeCategory;
      const searchMatch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, searchQuery]);

  const stats = useMemo(() => ({
    total: CATALOG.length,
    delivered: CATALOG.filter((i) => i.status === 'delivered').length,
    planned: CATALOG.filter((i) => i.status === 'planned').length
  }), []);

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: '#06070C' }}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Figtree' }}>
          Foundation OS Index
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Complete navigation catalog of all Foundation OS artifacts, data files, agents, and commands.
        </p>

        {/* Stats Pills */}
        <div className="flex gap-4 mb-6">
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(167,139,250,.15)', color: '#A78BFA' }}>
            {stats.total} Files
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(94,234,212,.15)', color: '#5EEAD4' }}>
            {stats.delivered} Delivered
          </div>
          <div className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'rgba(249,115,22,.15)', color: '#F97316' }}>
            {stats.planned} Planned
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryTabs
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              style={{ animation: `fadeIn 0.3s ease-out ${index * 40}ms both` }}
            >
              <FileCard
                item={item}
                isSelected={selectedItem === item.id}
                onSelect={setSelectedItem}
              />
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No files match your search.</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-8 text-gray-500 text-xs border-t border-white/10">
          <p>
            Showing {filteredItems.length} of {CATALOG.length} files
            {activeCategory !== 'all' && ` in ${CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
          </p>
        </div>
      </div>

      <style>{`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  * { font-family: 'Figtree', sans-serif; }
  code, pre { font-family: 'JetBrains Mono', monospace; }
`}</style>
      <link rel="preload"
        href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap"
        as="style"
        onLoad={(e) => { e.target.onload = null; e.target.rel = 'stylesheet'; }} />
      <noscript>
        <link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </noscript>
      <link rel="preload"
        href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
        as="style"
        onLoad={(e) => { e.target.onload = null; e.target.rel = 'stylesheet'; }} />
      <noscript>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </noscript>
    </div>
  );
}
