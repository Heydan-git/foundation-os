# Foundation OS — Monitor Dashboard (Design Spec v1)

> **Date** : 2026-04-08
> **Status** : APPROVED (brainstorm Kevin + Claude Opus 4.6)
> **Auteur** : Claude Opus 4.6 (1M context) + validation Kevin
> **Scope** : mini-projet outil interne meta-OS, v1
> **Motivation** : mettre en pause le cycle3 audit massif (S7 DONE non-integre, S8-S23 paused) pour construire un artefact HTML qui monitore visuellement ou on en est sur tous les plans/initiatives/modules/decisions de Foundation OS.

## 1. Contexte

Depuis S0 du cycle3 (2026-04-07), Foundation OS accumule des plans paralleles : audit massif cycle3 (24 sessions S0-S23), phases 1-4 historiques, finition-os, initiatives Cowork en parking, decisions actives. `CONTEXT.md` centralise l'etat narratif mais ne donne pas de **vue graphique** instantanee.

Kevin a explicitement demande un artefact HTML qui :
1. Monitore le plan du mega audit + ou on en est
2. Est mis a jour a chaque fin de session
3. Integre progressivement les autres plans et projets
4. Sera construit en decoupage multi-session pour eviter le compactage

Ce spec decrit la conception v1. L'implementation suit dans un plan dedie (`docs/plans/2026-04-08-monitor-dashboard-plan.md`).

## 2. Requirements

### 2.1 Goals (v1)

- **G1** : artefact HTML ouvrable en double-clic (file://) ou serveur local simple, zero build, zero npm
- **G2** : Void Glass respecte strictement (tokens `--fos-*` de `docs/design-system.md`)
- **G3** : affiche 5 sections — meta/next-action, plans, modules, initiatives, decisions+sessions recentes
- **G4** : donnees dans un unique fichier `data.js` hand-editable (pas de parser, pas de backend)
- **G5** : mise a jour integree au workflow `/session-end` via nouvelle etape 6.5
- **G6** : sert de testbed pour extraire les tokens Void Glass en CSS variables partagees (`docs/design-system/tokens.css`) — **ameliorer** le DS comme demande par Kevin
- **G7** : decoupage 3 sessions courtes (D1 spec+plan, D2 implementation, D3 integration+commit)

### 2.2 Non-goals (v1)

- Pas de parser automatique de `CONTEXT.md` (reporte v2 si utile)
- Pas de charts, velocity, historique, graphiques interactifs
- Pas de filtres, recherche, tri dynamique
- Pas de dark/light toggle (Void Glass = sombre uniquement)
- Pas de persistance localStorage ni backend
- Pas de responsive mobile pousse (assume desktop)
- Pas de framework (React/Vue/Svelte) — vanilla JS strict
- Pas d'integration dans `modules/app` (separation meta-OS vs produit, respecte D-S7-01)

## 3. Architecture

### 3.1 Arborescence

```
docs/monitor/
  index.html        # skeleton HTML + layout, minimal
  style.css         # styles dashboard, importe tokens
  data.js           # window.MONITOR_DATA = { ... }  (source de verite)
  render.js         # vanilla JS, lit MONITOR_DATA, rend sections en DOM
  README.md         # schema + guide update + how-to-open

docs/design-system/
  tokens.css        # NOUVEAU — variables CSS Void Glass partagees
```

### 3.2 Stack

- **HTML 5** vanilla
- **CSS 3** vanilla (variables, grid, flexbox)
- **JavaScript** vanilla (ES2020+), zero dep, zero bundle
- **Zero build** : ouverture directe `file://docs/monitor/index.html` ou `python -m http.server 8000 -d docs/monitor`

### 3.3 Justification stack

- Meta-OS tool, pas de produit → pas besoin de React, build, bundler
- Zero maintenance npm (pas de `npm audit`, pas de versions)
- Portable : le dossier `docs/monitor/` est autonome, copiable, diffable
- Lisible par Kevin sans outillage
- **Contraint** : force a rester simple, pas de dette tech qui s'accumule

### 3.4 Isolation vs modules/app

Le dashboard vit dans `docs/monitor/`, **jamais** dans `modules/app/`. Raisons :
- D-S7-01 : Foundation OS = outil produit, modules/app c'est le produit. Le dashboard est un outil meta-OS pour piloter le projet, pas un livrable utilisateur
- Pas d'impact build : `modules/app` peut casser sans affecter le dashboard et inverse
- Clarte des responsabilites : `docs/` = documentation + outils internes, `modules/` = code produit

## 4. Data Schema (`data.js`)

Un seul objet global `window.MONITOR_DATA` avec 6 cles racine.

### 4.1 Shape complete

```js
window.MONITOR_DATA = {
  meta: {
    version: "0.1.0",          // SemVer du schema lui-meme
    updatedAt: "2026-04-08",   // ISO date YYYY-MM-DD
    updatedInSession: "D1 — Spec + plan dashboard",
    nextAction: "Session D2 — implementation skeleton + tokens.css"
  },

  plans: [
    {
      id: "cycle3-audit",
      title: "Cycle 3 — Audit massif",
      status: "PAUSED",                         // enum, voir 4.2
      priority: "P0",                            // P0 | P1 | P2 | P3
      path: "docs/plans/2026-04-07-cycle3-implementation.md",
      progress: { done: 7, total: 24, unit: "sessions" },
      currentPhase: "S7 DONE non-integre, pause decidee D1 dashboard",
      startedAt: "2026-04-07",
      sessions: [
        { id: "S0", title: "Pre-flight", status: "DONE", date: "2026-04-07" },
        { id: "S1", title: "Carto repo", status: "DONE", date: "2026-04-07" },
        { id: "S2", title: "Inventaire components", status: "DONE", date: "2026-04-07" },
        { id: "S3", title: "Fondations Core OS", status: "DONE", date: "2026-04-08" },
        { id: "S4", title: "Architecture orga", status: "DONE", date: "2026-04-08" },
        { id: "S5", title: "Workflows + routing", status: "DONE", date: "2026-04-08" },
        { id: "S6", title: "Orchestration + automation", status: "DONE", date: "2026-04-08" },
        { id: "S7", title: "Agents (4) deep", status: "DONE", date: "2026-04-08" },
        { id: "S8", title: "Commands (4) deep", status: "PAUSED" },
        // ... S9-S23 PENDING ou PAUSED
      ],
      notes: "Decision D-S7-01 : audit lineaire puis fixes en bloc (pas interleave)"
    }
    // autres plans : phase1, phase2, phase3, phase4, finition-os, audit-massif-final
  ],

  modules: [
    {
      id: "app",
      name: "App Builder",
      status: "production-ready",
      detail: "8 routes, Navbar 4 items, Vitest 19/19, build 825ms"
    }
    // core-os, finance, sante, cowork, plan-router, meta-audit
  ],

  initiatives: [
    {
      id: "cowork-sprint1",
      title: "Cowork Sprint 1 (skill orchestrator v3)",
      status: "PARKING",
      path: "docs/travaux-cowork/2026-04-08-collaboration-ia/02-plan-action.md",
      blockedBy: "D-S7-01 — post-audit cycle3",
      detail: "Skill orchestrator v3 + brancher session-lock.sh + fix validate-void-glass.sh"
    }
    // plan-router, dashboard-monitor (ce projet lui-meme)
  ],

  decisions: [
    {
      id: "D-S7-01",
      date: "2026-04-08",
      title: "Foundation OS = outil produit",
      summary: "Audit lineaire S7-S23 puis fixes en bloc, Cowork en parking, Phase 5 Finance/Sante objectif final"
    }
    // autres decisions actives
  ],

  recentSessions: [
    {
      date: "2026-04-08",
      tag: "IN_PROGRESS",
      title: "D1 — Spec + plan dashboard monitor",
      summary: "Pause audit mega, brainstorm + spec + plan du dashboard v1"
    }
    // derniere 5 sessions max
  ]
};
```

### 4.2 Enum `status`

| Status | Semantique | Couleur badge (indicative) |
|--------|-----------|----------------------------|
| `DONE` | Termine, verifie | `--fos-accent` (#5EEAD4) existant |
| `WIP` | En cours, cette session | nouveau token `--fos-accent-wip` target `#3B82F6` (derive `--fos-orb-3` existant) |
| `PAUSED` | Commence, mis en pause volontaire | nouveau token `--fos-accent-paused` target `#F59E0B` (ambre) |
| `PENDING` | Pas commence, dans le plan | `--fos-muted` existant |
| `PARKING` | Gele, attend un deblocage externe (decision, dependance) | nouveau token `--fos-accent-parking` target `#A78BFA` (derive `--fos-orb-2` existant) |
| `ARCHIVED` | Abandonne/obsolete, garde pour historique | nouveau token `--fos-accent-archived` target `rgba(255,255,255,.12)` |

**4 nouveaux tokens a creer** (`--fos-accent-wip|paused|parking|archived`) = **trigger concret pour enrichir le DS** via `tokens.css`. Les hex sont des cibles de design, ajustables en D2 apres rendu visuel.

### 4.3 Regles de maintenance

- **Pas de restructuring** : ajouts = append a la fin des tableaux
- **IDs stables** : une fois attribue, un `id` ne change jamais (refs inter-tables)
- **`updatedAt` + `updatedInSession`** : mis a jour a CHAQUE edit (obligatoire)
- **`recentSessions`** : max 5 entrees, prepend + pop
- **Documentation** du schema dans `README.md` dedie

## 5. Layout visuel

### 5.1 Structure page (scroll vertical unique)

```
┌────────────────────────────────────────────────────┐
│  [Header hero]                                      │
│  Foundation OS — Monitor                            │
│  updatedAt · updatedInSession                       │
├────────────────────────────────────────────────────┤
│  [Next Action banner]                               │
│  >> meta.nextAction (police Figtree 20px)          │
├────────────────────────────────────────────────────┤
│  [Plans grid]  (3 col desktop, 1 col < 900px)      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ Plan    │  │ Plan    │  │ Plan    │             │
│  │ card    │  │ card    │  │ card    │             │
│  └─────────┘  └─────────┘  └─────────┘             │
├────────────────────────────────────────────────────┤
│  [Modules]          │  [Initiatives]                │
│  - App Builder      │  - Cowork Sprint 1 (PARKING)  │
│  - Core OS          │  - Plan-Router (PARKING)      │
│  - Finance (prevu)  │                               │
├────────────────────────────────────────────────────┤
│  [Decisions]        │  [Sessions recentes]          │
│  - D-S7-01          │  - 2026-04-08 D1 ...          │
│  - ...              │  - 2026-04-08 S6.5 ...        │
└────────────────────────────────────────────────────┘
```

### 5.2 Detail plan card

```
┌─────────────────────────────┐
│ [STATUS] priority           │   ← badge + pill
│ Cycle 3 — Audit massif       │   ← h3 Figtree 18px 600
│ ██████░░░░ 7/24 sessions     │   ← progress bar + mono
│ currentPhase...              │   ← muted Figtree 13px
│ [▼ Expand]                   │
└─────────────────────────────┘
  ↓ expanded
┌─────────────────────────────┐
│ Sessions timeline            │
│ ✓ S0 Pre-flight              │   ← ✓ = DONE
│ ✓ S1 Carto repo              │
│ ⏸ S8 Commands (PAUSED)       │   ← ⏸ = PAUSED
│ ○ S9 Scripts (PENDING)       │
│ ...                          │
│ Notes : ...                  │
└─────────────────────────────┘
```

Expand/collapse : JS vanilla, pas d'animation complexe. Toggle class CSS.

### 5.3 Contraintes DS (Void Glass strict)

- Fond : `var(--fos-bg)` (#06070C)
- Texte principal : `var(--fos-text)` (rgba(255,255,255,.88))
- Texte secondaire : `var(--fos-muted)` (rgba(255,255,255,.42))
- Cards : `var(--fos-card-bg)` + `border: 1px solid var(--fos-border)` + `border-radius: var(--fos-radius-card)` (12px)
- Accent : `var(--fos-accent)` (#5EEAD4) pour highlights, boutons, badges DONE
- Font UI : `var(--fos-font-ui)` (Figtree)
- Font mono : `var(--fos-font-mono)` (JetBrains Mono) pour ids, paths, dates
- Radii : 12px cards, 8px pills, 6px small elements
- **4 nouveautes a ajouter** (enrichissent le DS, cf 4.2) : `--fos-accent-wip` (blue `#3B82F6`), `--fos-accent-paused` (ambre `#F59E0B`), `--fos-accent-parking` (purple `#A78BFA`), `--fos-accent-archived` (white 12%)

## 6. Update workflow

### 6.1 Integration `/session-end`

La skill `/session-end` recoit une nouvelle etape **6.5** (inseree entre update CONTEXT.md et propose commit) :

```
6.5. Update dashboard monitor (docs/monitor/data.js)
     a) meta.updatedAt = today
     b) meta.updatedInSession = "SX — <titre court session>"
     c) meta.nextAction = <prochaine action mise a jour>
     d) plans[*].sessions : append ou update status des sessions touchees
     e) plans[*].currentPhase + notes si change
     f) recentSessions : prepend entree, pop si > 5
     g) decisions : append si nouvelle D-XXX
     h) modules/initiatives : update si status change
     i) Verifier : ouvrir docs/monitor/index.html, zero erreur console
```

Cout estime : **2-3 min par /session-end**. Edition purement additive. Pas de restructuring.

### 6.2 Edition manuelle hors /session-end

Autorisee pour corrections ponctuelles. Toujours incrementer `meta.updatedAt` si modifie.

### 6.3 Evolution future (hors v1, note)

Si maintenance manuelle devient trop couteuse (signal : >5 min/session regulierement), envisager :
- Script `scripts/build-monitor-data.js` qui parse `CONTEXT.md` tables + scanne `docs/plans/`
- Ne remplace pas 100% : garde `nextAction` + `notes` narratifs en manuel

Pas construit en v1 (YAGNI explicite).

## 7. DS refinement (le point "affiner le DS")

### 7.1 Extraction tokens

Creation de `docs/design-system/tokens.css` (nouveau fichier) qui contient TOUTES les variables CSS Void Glass documentees dans `docs/design-system.md`. Import :

```css
/* docs/monitor/style.css */
@import url('../design-system/tokens.css');

body { background: var(--fos-bg); font-family: var(--fos-font-ui); }
```

### 7.2 Enrichissements attendus

En construisant v1, on ajoute (au minimum) :
- **4 nouveaux tokens couleurs status** (cf 4.2) : `--fos-accent-wip`, `--fos-accent-paused`, `--fos-accent-parking`, `--fos-accent-archived`
- Eventuellement si besoin en codant : spacing scale (`--fos-space-1` a `-6`), font-size scale (`--fos-text-xs` a `-2xl`)

Chaque token ajoute -> **mise a jour de `docs/design-system.md`** section Couleurs + mention dans Figma Mapping. Pas touche a la section Interdictions (pas de nouvelles regles, juste ajouts).

### 7.3 Phase 2 hors v1 (note)

Objectif a moyen terme : **`modules/app`** importera ces memes tokens -> Void Glass a une source de verite unique. Ca supprime la duplication entre Tailwind config et CSS variables. **Pas fait en v1** : trop de portee, risque de casser modules/app. Note dans plan v2.

## 8. Acceptance criteria

Validation finale (fin session D3) :

- [ ] `docs/monitor/index.html` ouvre en double-clic, affiche 5 sections sans erreur console
- [ ] Void Glass respecte : audit visuel + zero violation regles `docs/design-system.md`
- [ ] `docs/design-system/tokens.css` existe, contient tous les tokens documentes + au moins 4 nouveaux couleurs status
- [ ] `docs/design-system.md` mis a jour avec les nouveaux tokens (section Couleurs)
- [ ] `/session-end` skill contient etape 6.5 dashboard update
- [ ] Un cycle manuel `/session-end` fictif -> edit data.js -> re-check rendu = testable en < 3 min
- [ ] `README.md` explique : schema, workflow update, how-to-open, evolution v2
- [ ] `CONTEXT.md` reflete : cycle3 audit PAUSED + dashboard monitor DONE
- [ ] `git status` propre sur les zones touchees, commit conventional `feat(monitor):` + `docs(context):` ou equivalent
- [ ] Health-check SAIN ou DEGRADED maximum (pas de nouvelle degradation imputable)
- [ ] Aucune regression fonctionnelle sur `modules/app` (build + tests passent identiques)

## 9. Decoupage sessions (anti-compactage)

| Session | Scope | Livrable | Commit(s) |
|---------|-------|----------|-----------|
| **D1** (en cours 2026-04-08) | Brainstorm + spec + plan ecrit | `docs/specs/2026-04-08-monitor-dashboard-design.md` + `docs/plans/2026-04-08-monitor-dashboard-plan.md` + pause audit dans `CONTEXT.md` | `docs(spec): monitor dashboard design + plan` puis `docs(context): pause cycle3 + D1 done` |
| **D2** | Implementation skeleton : `tokens.css` + `index.html` + `style.css` + `data.js` rempli avec etat reel + `render.js` minimal | `docs/monitor/` fonctionnel, ouvre sans erreur, 5 sections visibles | `feat(monitor): skeleton + render + data init` |
| **D3** | Integration `/session-end` skill etape 6.5 + `README.md` + tests visuels + update `CONTEXT.md` final + commit global | Workflow complet, projet DONE | `feat(session-end): step 6.5 monitor update` + `docs(context): monitor DONE` |

Pattern valide S6 : decouper en 2-3 commits WIP intermediaires + commit final consolidation. Meme pattern ici.

## 10. Risques identifies

| Risque | Probabilite | Impact | Mitigation |
|--------|-------------|--------|------------|
| Drift data.js vs CONTEXT.md (oubli update /session-end) | Moyenne | Moyen | Etape 6.5 obligatoire, check visuel a chaque session |
| Schema data.js evolue, casse render.js | Faible | Moyen | `meta.version` schema, render.js tolerant aux champs manquants |
| Kevin trouve le dashboard peu utile apres 2 sessions | Faible | Faible | v1 minimale, effort limite 3 sessions, on peut archiver sans regret |
| Extraction tokens.css casse modules/app si mal fait | Faible | Eleve | Phase 2 hors v1, v1 touche uniquement docs/monitor/ |
| Compactage pendant D2 (implementation) | Moyenne | Moyen | D2 decoupe en sous-phases A-E si necessaire, commits WIP |
| docs/monitor/ devient bloat si non maintenu | Moyenne | Faible | Archivage possible dans `.archive/` sans impact reste du repo |

## 11. Decisions cles (ce spec)

- **D-MON-01** : Standalone HTML dans `docs/monitor/`, pas de module React, pas de route dans `modules/app`. Raison : separation meta-OS vs produit (D-S7-01), zero build, portabilite.
- **D-MON-02** : Scope (iii) large — plans + modules + initiatives + decisions + sessions recentes. Raison : Kevin choix explicite, vue panoramique vs vue etroite audit-seulement.
- **D-MON-03** : Update mecanisme (A) manuel 100% v1, possibilite (B) script plus tard. Raison : YAGNI, decouvrir le format d'abord, parser CONTEXT.md est complexe.
- **D-MON-04** : Extraction `docs/design-system/tokens.css` partagee en v1. Raison : Kevin a explicitement demande "affiner le DS", le dashboard est le vehicule.
- **D-MON-05** : 3 sessions D1/D2/D3 anti-compactage. Raison : pattern valide S6, CLAUDE.md imperatif decoupage.

## 12. Open questions (reportees plan)

Ces questions sont resolues en D2 ou D3 :

- **OQ1** (D2) : `render.js` — listener `DOMContentLoaded` ou `defer` script ? (Simple choice, resolu en codant)
- **OQ2** (D2) : Expand/collapse plans — `<details>` natif ou toggle class JS ? (Probablement `<details>` pour simplicite accessible)
- **OQ3** (D3) : Ordre des plans dans le rendu — tri par status (WIP d'abord), par priority, ou ordre fichier ? (A trancher en D3 au vu du rendu)
- **OQ4** (D3) : Seuil "recentSessions" — 5 ok ou etendre a 10 ? (A tester en D3)

## 13. References

- `CLAUDE.md` — regles Foundation OS (imperatifs, Void Glass, anti-bloat)
- `CONTEXT.md` — etat projet courant, source verite narrative
- `docs/design-system.md` — specs Void Glass v1 (a enrichir en D2)
- `docs/specs/2026-04-05-foundation-os-v2-design.md` — design global Foundation OS
- `docs/plans/2026-04-07-cycle3-implementation.md` — plan cycle3 (en pause suite ce spec)
- Decision D-S7-01 (2026-04-08) — Foundation OS = outil produit
