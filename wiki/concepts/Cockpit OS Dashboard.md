---
type: concept
title: "Cockpit OS Dashboard"
complexity: advanced
domain: meta-os
created: 2026-04-19
updated: 2026-04-19
confidence: high
tags:
  - concept
  - dashboard
  - cockpit-os
  - monitoring
  - meta-os
  - foundation-os
  - void-glass
status: seed-active-plan
related:
  - "[[index-concepts]]"
  - "[[Foundation OS]]"
  - "[[Core OS]]"
  - "[[Void Glass]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[paperclip-ing-agent-orchestration]]"
  - "[[rtk-ai-token-killer]]"
  - "[[RTK]]"
  - "[[Neuroplasticite]]"
  - "[[Hot Cache]]"
  - "[[Layered Loading]]"
sources:
  - "[[paperclip-ing-agent-orchestration]]"
  - "[[rtk-ai-token-killer]]"
---

# Cockpit OS Dashboard

## Definition

**Dashboard visuel de Foundation OS** servant de "centre nerveux" pour la collaboration Kevin + Claude. Extension visuelle de la commande `/cockpit` existante.

**Trois axes fondateurs** :
1. **Observer** : monitorer chaque organe OS en temps reel
2. **Communiquer** : espace dialogue / notes / idees / feedback bidirectionnel
3. **Piloter** : voir ou on en est, ou on va, decider prochaine action

**Statut** : **plan valide Kevin 2026-04-13**, prêt pour handoff CLI, ~33h effort reel estime. 14 fichiers plan dans `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/`.

## Plan detaille (14 fichiers)

### Cadre et vision
- `01-vision-et-cartographie.md` — vision + inventaire 220+ elements monitorables
- `02-architecture-navigation.md` — arborescence pages + layout
- `03-pages-detail.md` — specification detaillee de chaque page
- `04-donnees-et-liaisons.md` — modele donnees + integration session-start/end
- `05-ux-et-design-system.md` — principles UX + integration Void Glass
- `06-plan-execution.md` — phases construction + blocs + estimation

### Approfondissements
- `07-features-avancees.md` — features innovantes + assistant contextuel + v1/v2/v3
- `08-ux-ergonomie-a11y.md` — Nielsen + lois UX + WCAG 2.2 AA
- `09-dynamisme-auto-sync.md` — dashboard vivant : auto-sync + conventions + event bus
- `10-motion-microcopy-details.md` — tokens motion + catalogue animations + microcopy
- `11-tech-data-qa-security.md` — architecture tech + types TS + CI/CD + securite + tests
- `12-roadmap-metrics-futur.md` — roadmap Now/Next/Later + OKRs + metriques succes
- `13-gouvernance-design-system.md` — contrainte 100% DS Void Glass + process nouveau composant
- `14-plan-execution-consolide.md` — **source de verite CLI** (52 blocs fusionnes, gates G1/G2)

## Philosophie

- **Zero information cachee** : tout ce qui existe dans l'OS est visible quelque part
- **Dynamique** : donnees mises a jour a chaque session-start/session-end
- **Bidirectionnel** : Kevin peut **ecrire** (idees, notes, feedback) pas seulement lire
- **Source unique** : chaque donnee affichee pointe vers sa source (fichier / commande / API)
- **Void Glass natif** : le dashboard **EST** l'expression du DS, pas un consommateur tiers

## 220+ elements monitorables (cartographie)

| Categorie | Nombre |
|---|---|
| Modules applicatifs | 5 (2 actifs + 3 prevus) |
| Core OS | 7 modules |
| Scripts | 7+ |
| Hooks | 7 (6 actifs + 1 opt-in, post D-CCCONFIG-01) |
| CI/CD | 2 |
| Agents Claude | 4 |
| Commandes | 6-7 |
| Skills Cowork | ~80 |
| Plugins | 5 |
| MCP connexions | 5 |
| Plans | 8+ |
| Specs | 6 |
| Composants DS | 46 ui + 7 patterns |
| Tokens DS | ~117 (primitives + semantiques) |
| Fichiers memoire | ~25 auto-memories |
| Decisions | ~14 actives + archives |
| Travaux Cowork | 4+ |
| Wiki pages | 84+ (post batch actuel) |
| **TOTAL** | **~220+ elements** |

## Refs externes alimentantes (triangle inspiration)

Ce batch de ref ingest 2026-04-19 forme un **triangle d'inspiration** pour Cockpit OS :

### Paperclip.ing → patterns management niveau conceptuel haut
- Source wiki : [[paperclip-ing-agent-orchestration]]
- **Patterns a piocher** :
  - Cost control budgets per agent + auto-pause (gap FOS identifie)
  - Governance gates (approval workflows)
  - Tool-call tracing UI (visualisation structure calls)
  - Org chart mental model (agents = employes, OS = entreprise)
  - Ticket threads + full audit logging
  - Heartbeat activation pattern (agents signales vs continuous execution)
- **Ne pas piocher** : multi-company isolation (solo), mobile-first priorite basse
- **Ne pas faire** : fork Paperclip UI (pas Void Glass), reecrire from-scratch (33h plan Cockpit OS suffit)

### RTK (Rust Token Killer) → compression output CLI
- Source wiki : [[rtk-ai-token-killer]] / entity [[RTK]]
- **Integration dashboard** :
  - `rtk gain` output = data source pour metrics token savings live
  - Token burn par commande visualisable
  - Cost $ temps reel dans dashboard (via usage reports RTK + Claude)

### Claude Agent SDK → event streaming (plomberie technique)
- Pas encore page wiki dediee (potentiel future batch)
- **Usage dashboard** :
  - Stream token-par-token de ce que Claude ecrit
  - Tool calls en temps reel (git status, bash, Read...)
  - Usage (input/output/cache hits, cost $ per message)
  - Intermediate messages (thinking, decisions, retries)
  - Hooks events (PreToolUse/PostToolUse/etc.)
  - Session metadata (id, turns, duree)

## Stack technique envisage (per `11-tech-data-qa-security.md`)

> A verifier lors lecture detaillee, hypothese :
- Vite + React 19 + TypeScript (stack FOS actuel)
- Supabase (persistence notes/idees/feedback)
- [[Void Glass]] DS (contrainte 100%)
- Integration `/session-start` + `/session-end` pour trigger sync
- Event bus pour auto-sync sans intervention manuelle

## Gates validation Kevin

Per `14-plan-execution-consolide.md` : **gates G1/G2 arbitres** — Kevin valide a ces points avant de poursuivre. Pattern anti-gaspillage effort si direction change.

## Connections

- [[Foundation OS]] — systeme parent que Cockpit monitore
- [[Core OS]] — 7 modules operationnels monitores
- [[Void Glass]] — DS contrainte UI 100%
- [[Claude Code]] — runtime source des events dashboard
- [[Claude Code Configuration Pattern]] — 7 hooks FOS visualises dans dashboard
- [[paperclip-ing-agent-orchestration]] — ref patterns management
- [[RTK]] — ref compression + metrics tokens live
- [[Hot Cache]] / [[Layered Loading]] / [[Pre-compaction Snapshot]] — mecanismes FOS affiches dans sections memoire
- [[Neuroplasticite]] — 4 reflexes affiches dans sections meta-cognition

## Prochaine action

**Non-urgent, en parking** : ~33h effort, pret pour handoff CLI, mais pas prioritaire vs Phase 5 / OMC update / cleanup worktrees. A relancer quand Kevin decide explicitement.

**Si relance** :
1. Lire `14-plan-execution-consolide.md` en priorite (source CLI)
2. Ouvrir en parallele les 3 refs alim : [[paperclip-ing-agent-orchestration]] + [[rtk-ai-token-killer]] + future page SDK
3. Executer phases selon gates G1/G2
4. Enrichir wiki au fur et a mesure (decisions, lessons, patterns)

## Sources

- Plan complet : `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/` (14 fichiers + index)
- Ref alimentante #1 : [[paperclip-ing-agent-orchestration]]
- Ref alimentante #2 : [[rtk-ai-token-killer]] / [[RTK]]
- Ref alimentante #3 : Claude Agent SDK (wiki page future)

## Notes

**Nom de code** : Cockpit OS = extension visuelle de `/cockpit` command. Pas juste un panneau metriques, **centre nerveux collaboration Kevin+Claude**.

**Pattern meta** : Cockpit OS incarne les 3 axes FOS fondamentaux :
- Observer = niveau conscient "ou on en est"
- Communiquer = niveau dialogue "echange continu"
- Piloter = niveau decisionnel "ou on va"

Ces 3 axes correspondent aux 3 strates de collaboration Kevin-Claude : **voir / parler / decider**.
