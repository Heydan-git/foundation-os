---
id: 2026-04-13-ds-showcase-tooling-sync
title: DS Showcase + Tooling Sync
created: 2026-04-13
status: draft
models_used: [sonnet, opus]
blocks_total: 15
blocks_subagent: 6
blocks_main: 9
estimated_duration: 360min
---

# DS Showcase + Tooling Sync

> Genere par `/plan-os`. Spec : `docs/core/planner.md`.

## Contexte

Kevin veut un DS complet et visible : Storybook avec tous les composants (46 shadcn + app dashboard), tous les etats interactifs, Supernova comme doc publique, et Asana/Notion synchronises en continu. L'app vient d'etre refactoree avec le design Figma Make (commits 436de80, 5418f35, 25ca4c0).

## Objectif

Storybook montre tous les composants avec tous les etats, Supernova documente le DS completement, Asana/Notion sont a jour et mis a jour automatiquement a chaque session.

---

## Session S1 — Storybook Foundation

### Bloc 1 — Audit Storybook existant + config

- **Modele** : sonnet
- **Justification** : lecture config, verification demarrage — exec standard
- **Sub-agent** : non
- **Justification sub-agent** : necessite contexte global du DS actuel
- **Fichiers** : `modules/design-system/.storybook/`, `modules/design-system/src/components/ui/`
- **Duree estimee** : ~15min
- **Critere de fin** : Storybook demarre sur port 6006, liste des composants avec/sans stories
- **Dependances** : aucune

### Bloc 2 — Stories : Form Primitives (10 composants)

- **Modele** : sonnet
- **Justification** : code repetitif, patterns connus
- **Sub-agent** : oui (agent=executor, model=sonnet)
- **Justification sub-agent** : zone isolee (DS stories), sans memoire session, sortie observable (fichiers .stories.tsx)
- **Fichiers** : `modules/design-system/src/components/ui/{button,input,textarea,label,checkbox,switch,toggle,radio-group,select,slider}.stories.tsx`
- **Duree estimee** : ~30min
- **Critere de fin** : 10 fichiers stories, chaque composant montre default + variants + sizes + disabled + focus
- **Dependances** : Bloc 1
- **Composants** : Button, Input, Textarea, Label, Checkbox, Switch, Toggle, RadioGroup, Select, Slider

### Bloc 3 — Stories : Feedback (9 composants)

- **Modele** : sonnet
- **Justification** : code repetitif, patterns dialog/overlay similaires
- **Sub-agent** : oui (agent=executor, model=sonnet)
- **Justification sub-agent** : zone isolee, sans memoire session, sortie observable
- **Fichiers** : `modules/design-system/src/components/ui/{alert,alert-dialog,dialog,drawer,sheet,popover,tooltip,sonner,hover-card}.stories.tsx`
- **Duree estimee** : ~30min
- **Critere de fin** : 9 fichiers stories, interactions fonctionnelles (open/close)
- **Dependances** : Bloc 1

---

## Session S2 — Storybook Completion

### Bloc 4 — Stories : Layout (10 composants)

- **Modele** : sonnet
- **Justification** : exec standard
- **Sub-agent** : oui (agent=executor, model=sonnet)
- **Justification sub-agent** : zone isolee, sans memoire session, sortie observable
- **Fichiers** : `modules/design-system/src/components/ui/{card,accordion,collapsible,tabs,separator,aspect-ratio,scroll-area,resizable,progress,skeleton}.stories.tsx`
- **Duree estimee** : ~30min
- **Critere de fin** : 10 fichiers stories
- **Dependances** : Bloc 1

### Bloc 5 — Stories : Navigation (8 composants)

- **Modele** : sonnet
- **Justification** : exec standard, composants de nav plus complexes
- **Sub-agent** : oui (agent=executor, model=sonnet)
- **Justification sub-agent** : zone isolee, sans memoire session, sortie observable
- **Fichiers** : `modules/design-system/src/components/ui/{breadcrumb,command,context-menu,dropdown-menu,menubar,navigation-menu,pagination,sidebar}.stories.tsx`
- **Duree estimee** : ~30min
- **Critere de fin** : 8 fichiers stories, menus fonctionnels
- **Dependances** : Bloc 1

### Bloc 6 — Stories : Data Display + Form avance (9 composants)

- **Modele** : sonnet
- **Justification** : exec standard
- **Sub-agent** : oui (agent=executor, model=sonnet)
- **Justification sub-agent** : zone isolee, sans memoire session, sortie observable
- **Fichiers** : `modules/design-system/src/components/ui/{avatar,badge,calendar,chart,table,carousel,form,input-otp,toggle-group}.stories.tsx`
- **Duree estimee** : ~30min
- **Critere de fin** : 9 fichiers stories
- **Dependances** : Bloc 1

### Bloc 7 — Stories : Composants App (dashboard)

- **Modele** : sonnet
- **Justification** : composants custom, interconnexion avec shadcn
- **Sub-agent** : non
- **Justification sub-agent** : necessite contexte global (composants app + design decisions)
- **Fichiers** : stories pour DashboardLayout, GlassCard, GlassBadge, Commander panels (SessionsPanel, DecisionsPanel, etc.)
- **Duree estimee** : ~30min
- **Critere de fin** : stories montrent composants app avec donnees mock, composites utilisent les vrais sous-composants
- **Dependances** : Blocs 2-6

---

## Session S3 — States Audit + Supernova Setup

### Bloc 8 — Audit etats manquants

- **Modele** : sonnet
- **Justification** : analyse systematique, pas d'architecture
- **Sub-agent** : non
- **Justification sub-agent** : necessite jugement global sur le DS
- **Fichiers** : rapport dans `docs/plans/` ou section de ce plan
- **Duree estimee** : ~20min
- **Critere de fin** : tableau par composant avec etats existants vs manquants (hover, focus, disabled, loading, error, active, empty)
- **Dependances** : Blocs 2-7

### Bloc 9 — Supernova : creer compte + workspace

- **Modele** : opus
- **Justification** : navigation web inconnue, decisions de configuration
- **Sub-agent** : non
- **Justification sub-agent** : necessite interaction Chrome + decisions de config
- **Fichiers** : aucun code — config externe
- **Duree estimee** : ~30min
- **Critere de fin** : compte Supernova cree, workspace "Foundation OS" visible
- **Dependances** : aucune

### Bloc 10 — Supernova : importer tokens + structure doc

- **Modele** : opus
- **Justification** : mapping tokens DTCG → Supernova, decisions de structure
- **Sub-agent** : non
- **Justification sub-agent** : necessite contexte DS complet
- **Fichiers** : config Supernova + `tokens/build/tokens.json`
- **Duree estimee** : ~30min
- **Critere de fin** : tokens visibles dans Supernova, structure doc creee (Foundations, Components, Patterns)
- **Dependances** : Bloc 9

---

## Session S4 — Supernova Documentation

### Bloc 11 — Documentation Foundations (tokens, couleurs, typo, spacing)

- **Modele** : opus
- **Justification** : ecriture documentation quali, decisions editoriales
- **Sub-agent** : non
- **Justification sub-agent** : necessite jugement quali + contexte design
- **Fichiers** : pages Supernova
- **Duree estimee** : ~30min
- **Critere de fin** : pages Foundations completes (Colors, Typography, Spacing, Radius, Motion, Icons)
- **Dependances** : Bloc 10

### Bloc 12 — Documentation Components (46 composants)

- **Modele** : sonnet
- **Justification** : documentation repetitive avec pattern stable
- **Sub-agent** : oui (agent=writer, model=sonnet)
- **Justification sub-agent** : zone isolee (doc par composant), sans memoire session, sortie observable
- **Fichiers** : pages Supernova — 1 page par composant
- **Duree estimee** : ~45min
- **Critere de fin** : chaque composant documente (description, props, variants, usage, do/don't)
- **Dependances** : Bloc 11

---

## Session S5 — Asana + Notion Sync

### Bloc 13 — Asana : sync etat projet actuel

- **Modele** : sonnet
- **Justification** : exec standard, API MCP Asana
- **Sub-agent** : non
- **Justification sub-agent** : necessite contexte global projet (CONTEXT.md, decisions, sessions)
- **Fichiers** : Asana workspace 1213280972575193
- **Duree estimee** : ~20min
- **Critere de fin** : taches Asana refletent l'etat reel du projet (DS done, app refactor done, Storybook/Supernova en cours)
- **Dependances** : aucune

### Bloc 14 — Notion : sync etat projet actuel

- **Modele** : sonnet
- **Justification** : exec standard, API MCP Notion
- **Sub-agent** : non
- **Justification sub-agent** : necessite contexte global
- **Fichiers** : Notion workspace user 4f1b99db
- **Duree estimee** : ~20min
- **Critere de fin** : pages Notion a jour avec modules, decisions, metriques
- **Dependances** : aucune

### Bloc 15 — Integrer sync Asana/Notion dans session-start/end

- **Modele** : opus
- **Justification** : modification Core OS commands, decisions d'architecture
- **Sub-agent** : non
- **Justification sub-agent** : necessite contexte Core OS complet
- **Fichiers** : `.claude/commands/session-start.md`, `.claude/commands/session-end.md`, `CLAUDE.md`
- **Duree estimee** : ~20min
- **Critere de fin** : /session-start lit et affiche derniere update Asana/Notion, /session-end propose sync
- **Dependances** : Blocs 13-14

---

## Routing resume

| # | Bloc | Modele | Sub-agent | Duree | Dep | Session |
|---|------|--------|-----------|-------|-----|---------|
| 1 | Audit Storybook config | sonnet | non | 15min | — | S1 |
| 2 | Stories Form Primitives (10) | sonnet | oui (executor) | 30min | 1 | S1 |
| 3 | Stories Feedback (9) | sonnet | oui (executor) | 30min | 1 | S1 |
| 4 | Stories Layout (10) | sonnet | oui (executor) | 30min | 1 | S2 |
| 5 | Stories Navigation (8) | sonnet | oui (executor) | 30min | 1 | S2 |
| 6 | Stories Data Display (9) | sonnet | oui (executor) | 30min | 1 | S2 |
| 7 | Stories App Dashboard | sonnet | non | 30min | 2-6 | S2 |
| 8 | Audit etats manquants | sonnet | non | 20min | 2-7 | S3 |
| 9 | Supernova compte + workspace | opus | non | 30min | — | S3 |
| 10 | Supernova tokens + structure | opus | non | 30min | 9 | S3 |
| 11 | Doc Foundations Supernova | opus | non | 30min | 10 | S4 |
| 12 | Doc Components Supernova | sonnet | oui (writer) | 45min | 11 | S4 |
| 13 | Asana sync | sonnet | non | 20min | — | S5 |
| 14 | Notion sync | sonnet | non | 20min | — | S5 |
| 15 | Integrer dans session-start/end | opus | non | 20min | 13-14 | S5 |

**Total** : 15 blocs, ~360 min (~6h), 5 sessions, modeles : sonnet (11), opus (4), sub-agents : 6

## Validation

- [ ] Kevin a lu le routing
- [ ] Kevin a valide les choix de modele
- [ ] Kevin a valide la regle sub-agent par bloc
- [ ] Kevin a dit "go"

## Execution log

- [x] Bloc 1 — done (audit config OK, port 6006, theme Void Glass)
- [x] Bloc 2 — done (10 stories Form Primitives)
- [x] Bloc 3 — done (9 stories Feedback)
- [ ] Bloc 4 — pending
- [ ] Bloc 5 — pending
- [ ] Bloc 6 — pending
- [ ] Bloc 7 — pending
- [ ] Bloc 8 — pending
- [ ] Bloc 9 — pending
- [ ] Bloc 10 — pending
- [ ] Bloc 11 — pending
- [ ] Bloc 12 — pending
- [ ] Bloc 13 — pending
- [ ] Bloc 14 — pending
- [ ] Bloc 15 — pending

## Notes post-execution

[A remplir apres. Ecarts estimation vs reel, surprises, lecons.]
