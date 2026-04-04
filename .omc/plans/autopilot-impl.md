# Plan d'implémentation: fos-commander.jsx

## Résumé architectural

Implémenter fos-commander.jsx comme un dashboard à 6 onglets rendant toutes les données de FOS-COMMANDER-DATA.md, réutilisant le système de design Void Glass établi dans fos-index.jsx (467 lignes).

**Contrainte critique**: Intégrer 6 sections riches dans la limite stricte de 700 lignes.

## Budget de lignes (650L cible, 50L marge)

| Zone | Lignes | Contenu |
|------|--------|---------|
| Data constants | 220L | PIPELINE_PHASES, SESSIONS, DECISIONS, etc. |
| Sub-components | 200L | 6 sections + TabBar |
| Main component | 140L | État, header, navigation, footer |
| Styles/Fonts | 90L | CSS keyframes, Google Fonts |

## Étape 1: Data Constants (1-220L)

### 1a. PIPELINE_PHASES (15L)
```javascript
const PIPELINE_PHASES = [
  { num: '00', label: 'Fondation', color: '#A78BFA', status: 'active' },
  { num: '01', label: 'Validation', color: '#5EEAD4', status: 'pending' },
  // ... 8 phases totales depuis FOS-COMMANDER-DATA.md:34-43
];
```

### 1b. SESSIONS (30L)
```javascript
const SESSIONS = [
  { 
    id: 'CONV-01', 
    date: '2026-04-02', 
    title: 'Fondation — Vision & Principes',
    items: 'Règles coopération · Vision LT fondation',
    decisions: 'Coopération > exploitation'
  },
  // ... source: FOS-COMMANDER-DATA.md:59-78
];
```

### 1c. DECISIONS (45L)
```javascript
const DECISIONS = [
  {
    id: 'ADR-001',
    date: '2026-04-02',
    title: 'Coopération > exploitation',
    context: 'Philosophie',
    impact: 'high',
    status: 'active'
  },
  // ... 12 ADR depuis FOS-COMMANDER-DATA.md:84-96
];
```

### 1d-1g. CONTEXTS, RISKS, DOCUMENTS (90L)
- Mêmes patterns pour les 4 autres sections
- Source: FOS-COMMANDER-DATA.md sections correspondantes

## Étape 2: Sub-Components (221-420L)

### 2a. TabBar (25L)
```javascript
const TabBar = ({ tabs, activeTab, onSelect }) => (
  <div className="flex gap-2 mb-6 flex-wrap">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={`flex items-center px-4 py-2 rounded-lg ${
          activeTab === tab.id ? 'bg-opacity-10' : ''
        }`}
        style={{
          backgroundColor: activeTab === tab.id ? `${tab.color}30` : 'rgba(255,255,255,0.025)',
          borderBottom: activeTab === tab.id ? `2px solid ${tab.color}` : 'none'
        }}
        onClick={() => onSelect(tab.id)}
      >
        <span className="mr-2">{tab.icon}</span>
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);
```

### 2b-2g. Sections (175L)
- **PipelineSection** (35L): 8 phases avec barres colorées
- **SessionsSection** (30L): Cards verticales avec dates
- **DecisionsSection** (35L): Grille ADR avec badges statut
- **ContextsSection** (30L): Blocs code avec JetBrains Mono
- **RisksSection** (25L): Cards avec indicateurs impact/proba
- **DocumentsSection** (20L): Table compacte statuts

## Étape 3: Main Component (421-560L)

### 3a. État et layout principal
```javascript
const FOSCommander = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div style={{ backgroundColor: '#06070C' }} className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Figtree' }}>
            Foundation OS Commander
          </h1>
          {/* Stats pills */}
        </div>

        {/* TabBar */}
        <TabBar tabs={TABS} activeTab={activeTab} onSelect={setActiveTab} />

        {/* Content conditionnel */}
        {activeTab === 'pipeline' && <PipelineSection />}
        {activeTab === 'sessions' && <SessionsSection />}
        {/* ... autres sections */}

        {/* Footer */}
      </div>
    </div>
  );
};
```

## Étape 4: Styles identiques fos-index.jsx (561-650L)

- **Keyframes fadeIn**: Reprise exacte avec stagger 40ms
- **Google Fonts**: Figtree + JetBrains Mono preload
- **Tokens Void Glass**: Background #06070C, cards rgba, accent #5EEAD4

## Stratégies compression (si >650L)

1. **Fusionner data** (-20L): Sessions items+decisions en strings
2. **GenericCard partagé** (-15L): Factoriser Sessions/Decisions/Risks
3. **Table Documents simplifiée** (-10L): Liste au lieu de table
4. **Réduire Phase 00 tasks** (-8L): Count au lieu de liste

## Validation

- ✅ Design Void Glass identique à fos-index.jsx
- ✅ Navigation fluide 6 sections principales  
- ✅ Toutes données FOS-COMMANDER-DATA.md représentées
- ✅ <700 lignes, responsive, animations
- ✅ Workflow MD-first respecté (ADR-005)

## Références critiques

- `fos-index.jsx:242-243` - Card styling exact
- `fos-index.jsx:281-305` - Pattern CategoryTabs → TabBar
- `FOS-COMMANDER-DATA.md:34-175` - Sources des 6 sections