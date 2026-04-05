# FOS-PIPELINE-DATA.md
> Pipeline iOS Development · 8 phases × 3 budgets
> Workflow intégré dans fos-toolbox.jsx

---

## Context

**Note** : Ce pipeline est maintenant intégré dans fos-toolbox.jsx (section CREATE → "Je veux créer une nouvelle app iOS"). Ce fichier conserve la spécification détaillée pour référence.

---

## Pipeline iOS 8 Phases

### Phase 1 : Research & Discovery
**Budget A** (2-3 semaines) · **Budget B** (1-2 semaines) · **Budget C** (3-5 jours)

#### Livrables
- Market research & competitive analysis
- User personas & pain points
- Technical feasibility assessment
- MVP scope definition

#### Outils Foundation OS
- `bmad-brainstorming` → User needs exploration
- `bmad-review-adversarial` → Challenge assumptions  
- `Context7` → iOS development best practices
- `@os-architect` → Technical feasibility ADR

### Phase 2 : Design & Prototyping
**Budget A** (3-4 semaines) · **Budget B** (2-3 semaines) · **Budget C** (1 semaine)

#### Livrables
- User journey maps
- Wireframes & mockups
- Interactive prototypes
- Design system & style guide

#### Outils Foundation OS
- `Figma MCP` → Design creation & iteration
- `bmad-party-mode` → Design critique sessions
- `frontend-design` → UI implementation
- Void Glass adaptation pour iOS (couleurs, typography)

### Phase 3 : Architecture & Planning
**Budget A** (2-3 semaines) · **Budget B** (1-2 semaines) · **Budget C** (3-5 jours)

#### Livrables  
- Technical architecture document
- Database schema design
- API specifications
- Development roadmap & milestones

#### Outils Foundation OS
- `@os-architect` → Architecture decisions + ADR
- `Context7` → Swift/SwiftUI documentation
- `bmad-distillator` → Requirements compression
- `database-architect` → Core Data / SQLite schema

### Phase 4 : Core Development
**Budget A** (8-12 semaines) · **Budget B** (5-8 semaines) · **Budget C** (3-4 semaines)

#### Livrables
- Core app functionality
- Data persistence layer  
- Basic UI implementation
- Unit tests & documentation

#### Outils Foundation OS
- `/oh-my-claudecode:team` → Coordinated development
- `Context7` → iOS SDK documentation
- `code-review` → Quality assurance
- `test-driven-development` → TDD approach

### Phase 5 : Integration & Polish
**Budget A** (4-6 semaines) · **Budget B** (2-4 semaines) · **Budget C** (1-2 semaines)

#### Livrables
- Feature integration
- UI/UX polish & animations
- Error handling & edge cases
- Performance optimization

#### Outils Foundation OS
- `bmad-review-edge-case-hunter` → Edge case coverage
- `chrome-devtools-mcp` → Performance profiling (si WebView)
- `simplify` → Code quality review
- `verification-before-completion` → Final QA

### Phase 6 : Testing & QA
**Budget A** (3-4 semaines) · **Budget B** (2-3 semaines) · **Budget C** (1 semaine)

#### Livrables
- Comprehensive test suite
- User acceptance testing
- Bug fixes & refinements  
- Performance benchmarks

#### Outils Foundation OS
- `/oh-my-claudecode:ultraqa` → QA cycling workflow
- `systematic-debugging` → Bug investigation
- `bmad-review-adversarial` → Break-it testing
- Device testing matrix (iPhone/iPad/versions)

### Phase 7 : Deployment & Launch
**Budget A** (2-3 semaines) · **Budget B** (1-2 semaines) · **Budget C** (3-5 jours)

#### Livrables
- App Store submission
- Marketing materials & screenshots
- Analytics & crash reporting setup
- Launch strategy execution

#### Outils Foundation OS
- `app-store-publisher` → Store optimization
- Fastlane automation → CI/CD pipeline
- TestFlight → Beta distribution
- ASO (App Store Optimization) tools

### Phase 8 : Growth & Iteration  
**Budget A** (ongoing) · **Budget B** (4-6 semaines) · **Budget C** (2-3 semaines)

#### Livrables
- User feedback analysis
- Feature roadmap updates
- Performance monitoring
- Growth optimization

#### Outils Foundation OS
- `analytics-interpreter` → User behavior analysis
- `bmad-brainstorming` → Feature ideation
- `/oh-my-claudecode:ralph` → Continuous improvement
- A/B testing framework

---

## Stack Technique iOS

### Recommandation Foundation OS
```swift
// Core Stack
- Swift 6+ (latest)
- SwiftUI (interface)
- TCA (The Composable Architecture)
- Core Data (persistence)

// Auxiliaire
- Combine (reactive programming)
- CloudKit (sync Apple)
- StoreKit (achats in-app)
- HealthKit (si santé)
```

### Architecture Pattern
```
App/
├── Features/           # TCA Features
│   ├── Dashboard/
│   ├── Settings/
│   └── Onboarding/
├── Shared/            # Composants réutilisables
│   ├── UI/
│   ├── Models/
│   └── Services/
├── Core/              # Business logic
│   ├── Database/
│   ├── Network/
│   └── Analytics/
└── Resources/         # Assets, localisation
```

---

## Budget Scenarios

### 🚀 Budget A — Premium (20-30k€)
- **Timeline** : 4-6 mois
- **Quality** : Production-ready, App Store featured
- **Features** : Complètes + advanced (AR, ML, widgets)
- **Team** : Lead dev + UI/UX + QA
- **ROI** : Maximum feature set

### 💼 Budget B — Standard (10-15k€)  
- **Timeline** : 2-4 mois
- **Quality** : MVP robust, store-ready
- **Features** : Core + quelques advanced
- **Team** : Dev + occasional UI review
- **ROI** : Balanced quality/cost

### 🎯 Budget C — Lean (3-7k€)
- **Timeline** : 1-2 mois  
- **Quality** : MVP viable, beta-ready
- **Features** : Core only, simple UI
- **Team** : Dev focused
- **ROI** : Proof of concept

---

## Intégration Foundation OS

### Dans fos-toolbox.jsx
```javascript
// Section CREATE → iOS App
{i:"📱",t:"Je veux créer une nouvelle app iOS",
 w:"Pipeline 8 phases avec 3 budgets selon ambition.",
 ex:"\"App de fitness\" · \"Outil productivité\" · \"Jeu simple\"",
 steps:[
   // Phase 1-8 steps intégrés
 ]}
```

### Workflow Type
1. **Kévin** : "Je veux créer une app iOS de [domaine]"
2. **Claude** : Analyse besoin → sélectionne budget → propose pipeline
3. **Mode 6** : Validation workflow complet
4. **Exécution** : Phase par phase avec checkpoints

### Checkpoints
- Fin Phase 1 : Validation concept + budget confirmation
- Fin Phase 3 : Architecture review + technical validation  
- Fin Phase 5 : Feature completeness + UX review
- Fin Phase 7 : Launch readiness + store approval

---

## Success Metrics

### Technique
- **Build time** < 30s (Xcode)
- **App size** < 50MB (optimized)  
- **Crash rate** < 0.1%
- **Performance** 60fps, < 3s launch

### Business
- **Store approval** 1st submission
- **Rating** > 4.0 stars
- **Downloads** target by budget (A: 10k+, B: 5k+, C: 1k+)
- **Revenue** if monetized

### Learning
- **Patterns documented** pour projets futurs
- **Tools refined** based on usage
- **Workflows optimized** via RALPH loop

---

*iOS Pipeline v1.0 · Intégré dans fos-toolbox.jsx*  
*2026-04-04 · Foundation OS*