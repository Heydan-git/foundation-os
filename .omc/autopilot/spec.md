# Autopilot Spec: fos-commander.jsx

## Interprétation de la demande
Créer **fos-commander.jsx** basé sur FOS-COMMANDER-DATA.md existant avec le design Void Glass identique à fos-index.jsx.

## Contexte Foundation OS
- Workflow MD-first (ADR-005) : FOS-COMMANDER-DATA.md = source de vérité
- Design Void Glass : #06070C, Figtree, JetBrains Mono
- Limite : <700 lignes par artifact
- Pattern de référence : fos-index.jsx (467 lignes)

## Exigences fonctionnelles

### 1. Architecture des données
- **Source** : FOS-COMMANDER-DATA.md (10 sections)
- **Pattern** : Données hardcodées comme const JavaScript (même modèle que fos-index.jsx)
- **Sections prioritaires** : 6 sections principales dans navigation tabs
  1. **Pipeline** : 8 phases avec statuts et couleurs
  2. **Sessions** : Journal CONV-01 à CONV-11 
  3. **Décisions** : 12 ADR avec statuts
  4. **Contextes** : 4 context blocks (C-01 à C-04)
  5. **Risques** : 4 risques actifs avec mitigation
  6. **Documents** : Tracker de 16 fichiers avec statuts

### 2. Design Void Glass (identique fos-index.jsx)
- **Background** : #06070C
- **Fonts** : Figtree (UI), JetBrains Mono (code/labels)
- **Cards** : rgba(255,255,255,.025) bg, rgba(255,255,255,.055) border
- **Accent** : #5EEAD4 (actif/sélectionné)
- **Animation** : Fade-in staggeré 40ms par élément

### 3. Navigation et interface
- **Layout principal** : Header + Tabs + Content + Footer
- **Navigation** : 6 onglets pour les sections prioritaires
- **Interactions** : Click-to-highlight, tab switching
- **Responsive** : 1-2-3 colonnes selon viewport

## Sections omises (optimisation lignes)
- **Meta Projet** : Intégré dans header
- **Garde-fous** : Intégré dans footer
- **Sync Cowork** : Omis (opérationnel)  
- **Changelog** : Omis (disponible dans MD)

## Contraintes techniques
- **Limite** : ~650 lignes (marge sur 700L)
- **Environment** : Claude.ai artifact sandbox
- **Dependencies** : React hooks, Google Fonts CDN
- **Storage** : Aucun (statique comme fos-index.jsx)

## Critères de succès
1. Design Void Glass 100% conforme à fos-index.jsx
2. Navigation fluide entre 6 sections principales
3. Toutes les données FOS-COMMANDER-DATA.md représentées
4. <700 lignes total, responsive, animations
5. Aucune régression vs. design fos-index.jsx

## Approche technique
- **Composants** : Header, TabNavigation, SectionContent, Footer
- **Data** : Constants JS transcrits depuis MD
- **State** : activeTab, aucune persistence
- **Render** : Conditional sections basé sur activeTab