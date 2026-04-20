---
type: source
title: "Paperclip.ing — Control plane open-source pour orchestration multi-agents AI"
source_type: website
author: "paperclipai (team non-disclosed, GitHub github.com/paperclipai/paperclip)"
date_published: 2026-04-19
url: "https://paperclip.ing"
github: "https://github.com/paperclipai/paperclip"
confidence: high
fos_compat: medium
effort_estime: S-M
decision: reference-alim-cockpit-os
key_claims:
  - "Tagline : The human control plane for AI labor"
  - "Positionnement : Hire AI employees, set goals, automate jobs and your business runs itself"
  - "Open-source MIT self-hosted, no account required"
  - "Stack : Node.js + embedded Postgres (local) / external Postgres (cloud)"
  - "Install : npx paperclipai onboard --yes"
  - "Target explicite : anyone coordinating 20+ agents (single agents don't require Paperclip)"
  - "Bring-your-own-agent runtime : Claude, OpenClaw, Cursor, Codex, Bash, HTTP"
  - "Governance layer : board-level approval gates pour hires/strategy/budget overrides"
  - "Multi-company isolation dans single deployment"
  - "Ticket system : thread-based tracking + full audit logging + tool-call tracing"
  - "Cost control : budgets mensuels per agent avec auto-pause a 80% soft / 100% hard stop"
  - "Heartbeat system : agents activés par signal, pas execution continue par defaut"
  - "Mobile monitoring : management + supervision remote"
  - "Cliphub (coming soon) : pre-built company templates"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - website
  - agent-orchestration
  - dashboard-inspiration
  - open-source
  - cockpit-os-ref
  - governance
status: mature
related:
  - "[[index-sources]]"
  - "[[Cockpit OS Dashboard]]"
  - "[[Foundation OS]]"
  - "[[Claude Code]]"
  - "[[rtk-ai-token-killer]]"
  - "[[Void Glass]]"
sources: []
---

# Paperclip.ing — Control plane open-source pour orchestration multi-agents AI

## Summary

**Paperclip = plateforme open-source (MIT) de management d'agents AI sous forme d'entreprise**. Traite chaque agent comme un "employe" avec role, boss, budget mensuel, tickets, audit logs. Self-hosted (Node.js + Postgres), no vendor lock-in.

**Pertinence pour Foundation OS** : **reference inspirante pour le projet [[Cockpit OS Dashboard]]** (deja scaffold, ~33h effort, 14 fichiers plan dans `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/`). Paperclip apporte des patterns concrets pour des features du dashboard FOS : org chart + budgets + tickets + governance gates + audit tracing.

**Decision** : **ne pas reimplementer from scratch** (target Paperclip = 20+ agents, FOS = 1 collaboration Kevin+Claude). **Piocher selectivement** les patterns qui resonnent avec les 14 fichiers plan Cockpit OS existants + eventuellement fork + redecore Void Glass si Phase 5 fait exploser le nombre d'agents FOS.

## Key Claims (extraction exhaustive)

### Philosophie / Modele mental
- Analogie centrale : **agents = employes, OS = entreprise**
- Positioning : "OpenClaw is an employee, Paperclip is the company" (testimonial cite)
- NOT : chatbot, framework, drag-drop builder, prompt manager, single-agent tool
- IS : **company management system for AI agents**

### Features principales
- **Org Chart Management** : hierarchies, roles, reporting lines avec agent assignments
- **Goal Alignment** : mission-to-task traceability (chaque task trace vers mission entreprise)
- **Heartbeat System** : scheduled wake-ups, task delegation, cross-team coordination
- **Cost Control** : budgets mensuels per agent, auto-pause a limite (80% soft, 100% hard)
- **Multi-Company Support** : data isolation complete entre multiple business instances
- **Ticket System** : thread-based task tracking + full audit logging + tool-call tracing
- **Governance Layer** : board-level approval gates pour hires/strategy/budget overrides
- **Bring Your Own Agent** : runtime-agnostic (Claude, OpenClaw, Cursor, Codex, Bash, HTTP)
- **Mobile Monitoring** : remote management + supervision any device
- **Cliphub (coming soon)** : pre-built company templates

### Tech stack
- Runtime : Node.js
- DB : Embedded Postgres (local) / external Postgres (cloud)
- Install : `npx paperclipai onboard --yes`
- Language : TypeScript/JavaScript (inferred)
- Deploy : local ou cloud-ready

### Dashboard features (data reelle visualisee)
- **Real-time** :
  - Agent budget utilization (spend mensuel / limite)
  - Task status + assignment tracking
  - Agent/team workload distribution
- **Historical** :
  - Full audit logs (immutable, append-only)
  - Tool-call tracing avec decision points
  - Cost breakdown par agent / task / project / goal
  - Token burn analysis per agent/task
- **Visual** :
  - Org chart avec live agent status
  - Ticket threads avec complete conversation history
  - Budget warning thresholds (soft 80%, hard 100%)
  - Agent performance metrics

### Modele UI declare
- "Mimics professional company management tools (Linear-adjacent design)"
- Testimonials praise "great taste / design and UX quality"
- Visual org charts + budget tables + cost breakdown views
- Mental model shift : "managing a team" plutot que "prompting an AI"
- Mobile-first consideration

### Security
- Agents must receive "heartbeat" signals to activate — pas execution continue par defaut
- No continuous runaway

### Pricing
- Open-source MIT, self-hosted, no account required
- Pas de pricing Paperclip lui-meme
- User controle spend via per-agent monthly budgets

## Entities Mentioned

- **paperclipai** (GitHub org) — team non-disclosed publique
- Discord community mentionne (link non fourni)
- Agent runtimes supportes : [[Claude Code]] (indirect via Claude), OpenClaw, Cursor, Codex, Bash, HTTP webhooks
- **Linear** (mentionne comme inspiration design UI)

## Concepts Introduced

- **Control plane for AI labor** — pattern meta : separation management layer / execution runtime
- **Company mental model for agents** — agents = employes avec titre, boss, JD
- **Heartbeat activation** — pattern opposite continuous execution (sent signal, agent wake, do task, stop)
- **Governance gates** — approval workflows avant actions sensibles (new hire, strategy change, budget override)
- **Goal-ancestry context injection** — agents reçoivent auto-context leur mission/goal lineage
- **Per-agent monthly budget with auto-pause** — pattern safety financiere
- **Multi-company data isolation** — 1 deployment sert N entreprises separees

## Foundation OS Analysis

### Compat OS

**Medium**. Paperclip cible 20+ agents, FOS actuellement = 1 collaboration Kevin+Claude + 4 sub-agents ephemeres. Mais :
- **Stack** : Node.js + Postgres ≈ compatible FOS (Vite React + Supabase Postgres) — transposable
- **Philosophie open-source MIT self-hosted** ≈ aligne FOS (pas de SaaS dependency)
- **Bring-your-own-agent** ≈ coherent avec FOS multi-runtime (Claude Code + OMC + plugins)

### Effort integration (4 scenarios realistes)

#### A. Fork + redecore Void Glass si Phase 5 fait exploser agents
**Effort : 2-3 semaines**. Clone repo, swap UI Paperclip vers Void Glass + FOS DS, deploy en self-hosted. Useful **seulement si** Phase 5 lance 5-10+ agents autonomes persistants.

#### B. Piocher patterns selectivement pour [[Cockpit OS Dashboard]] 
**Effort : marginal, integre dans ~33h deja planifies**. Lire les 14 fichiers plan Cockpit, identifier ou les patterns Paperclip complementent, **enrichir les fichiers plan** au lieu d'ajouter du scope.

#### C. Adopter Paperclip tel quel (sans customisation UI)
**Effort : 1h installation**. Fonctionne out-of-the-box, mais UI pas Void Glass. Acceptable en **test/learning** pas en production FOS.

#### D. Ignorer et continuer Cockpit OS sans ref Paperclip
**Effort : 0**. Justifie si patterns Paperclip = deja couverts par les 14 fichiers plan Cockpit OS existants.

### Ce qui existe deja dans FOS

Le projet [[Cockpit OS Dashboard]] a **deja** dans ses 14 fichiers plan :
- `01-vision-et-cartographie.md` : vision + 220+ elements monitorables (Modules / Core OS / Skills / Plans / Git / Memoire / Interactif)
- `02-architecture-navigation.md` : arborescence pages
- `03-pages-detail.md` : specs par page
- `04-donnees-et-liaisons.md` : modele donnees + integration session-start/end
- `05-ux-et-design-system.md` : principles UX + Void Glass integration
- `06-plan-execution.md` : phases construction (~22h)
- `07-features-avancees.md` : features innovantes + v1/v2/v3
- `08-ux-ergonomie-a11y.md` : Nielsen + lois UX + WCAG 2.2 AA
- `09-dynamisme-auto-sync.md` : event bus auto-sync
- `10-motion-microcopy-details.md` : tokens motion + catalogue animations
- `11-tech-data-qa-security.md` : types TS + data + CI/CD + securite + tests
- `12-roadmap-metrics-futur.md` : roadmap Now/Next/Later + OKRs
- `13-gouvernance-design-system.md` : contrainte 100% DS Void Glass
- `14-plan-execution-consolide.md` : source de verite CLI, 52 blocs fusionnes, gates G1/G2

**Delta vs Paperclip** :

| Feature Paperclip | Couvert par plan Cockpit OS ? | Gap ? |
|---|---|---|
| Org chart management | ❓ a verifier dans `02-architecture-navigation` et `03-pages-detail` | Peut-etre partiel |
| Goal alignment / mission-to-task | ❓ a verifier dans `04-donnees-et-liaisons` | Possible gap |
| Heartbeat system | ❓ a verifier dans `09-dynamisme-auto-sync` | Probable equivalent |
| Cost control budgets per agent | ❌ pas explicitement mentionne | **Gap clair** (FOS n'a pas actuellement de budget per agent) |
| Multi-company isolation | ❌ non applicable (FOS = 1 user) | Non pertinent |
| Ticket system thread-based | ❓ `03-pages-detail` peut-etre | Probable equivalent |
| Governance gates | ❌ pas explicitement mentionne | **Gap partiel** (FOS a Kevin validation implicite) |
| BYOA runtime-agnostic | ✅ FOS multi-runtime (Claude Code + OMC + plugins) | Couvert |
| Mobile monitoring | ❓ `12-roadmap-metrics-futur` v2/v3 peut-etre | A verifier |
| Audit logs immutables | ✅ Git + transcripts `.omc/sessions/` | Couvert differemment |
| Tool-call tracing | ❓ `09-dynamisme-auto-sync` | Probable via event bus |

**Gaps reels** : cost control budgets per agent + governance gates explicites. A piquer dans Paperclip comme inspiration.

### Limites Claude declarees

- **Training** : je ne connais pas Paperclip par mon training. Tout vient du fetch.
- **Team non-disclosed** : pas de founders names, company size, credentials → harder to assess maturity durable.
- **Pas de pricing** affiche → modele business flou (freemium potential futur ? pivot paid ?). Risque moyen terme.
- **N'ai pas** teste l'install ni vu le code source reel.
- **N'ai pas** lu les 14 fichiers plan Cockpit OS detaillé (juste index + vision). Donc mes "probable equivalent" sont hypothetiques.

### Risques / pieges

1. **Target mismatch** : Paperclip = 20+ agents, FOS = collaboration solo Kevin+Claude. Pattern d'enterprise mal calibre pour solo.
2. **Pivot futur vers paid** possible (pas de modele business affiche = signal faible maturity business model).
3. **Team non-disclosed** = bus factor non-evaluable.
4. **Over-engineering tentation** : piocher trop de patterns Paperclip dans Cockpit OS = scope creep des 33h initiales.
5. **Gap evident** : cost control budgets per agent absent de FOS. Mais **est-ce pertinent** si Kevin = solo ? Un budget global FOS (tous agents confondus) peut-etre suffisant.

### Verdict

**Reference-alim-cockpit-os**. Scenario B recommande (piocher patterns selectivement).

**Actions concretes proposees** (si Kevin lance Cockpit OS implementation) :
1. Lors de lecture des 14 fichiers plan Cockpit : garder Paperclip en fenetre ouverte
2. Pour **chaque feature identifiee manquante** dans Cockpit plan, verifier si Paperclip a un pattern ≥
3. **Piquer specifiquement** :
   - **Cost control patterns** (budget per agent + auto-pause) → ajouter dans `11-tech-data-qa-security.md`
   - **Governance gates explicites** (approval workflows) → ajouter dans `07-features-avancees.md`
   - **Tool-call tracing UI patterns** (visualisation) → enrichir `03-pages-detail.md`
4. **Skip** : multi-company isolation (pas pertinent solo), mobile-first priorite basse (Kevin Desktop focus)

**Ne pas** :
- Forker Paperclip tel quel (scope + UI non-aligne Void Glass)
- Construire from-scratch Paperclip-like parallel a Cockpit OS (redundance)
- Attendre Paperclip pour demarrer Cockpit OS (plan Cockpit est deja valide, ready for CLI handoff)

### Questions ouvertes

- Les 14 fichiers plan Cockpit OS couvrent-ils deja les patterns Paperclip ? Audit delta precis necessaire (lire les 14).
- Phase 5 FOS implique-t-elle N agents autonomes persistants (trading bot + sante council + finance analyst) ? Si oui, budget per agent devient critique.
- Paperclip a-t-il un modele business futur pivotant paid ? Risque dep.
- Existe-t-il des concurrents open-source similaires mais plus specifiquement aligne solo-dev (1-5 agents) ? (orchestrators plus legers type LangGraph, CrewAI, AutoGen)
- Plan Cockpit OS prevoit-il un event bus reutilisable par Paperclip-patterns ou architecture differente ?

## Raw Source

- Site : https://paperclip.ing
- GitHub : https://github.com/paperclipai/paperclip
- Discord community : link non fourni sur site

## Notes

**Candidate reference #1 pour alimenter Cockpit OS** dans ce batch (avec [[rtk-ai-token-killer]] pour compression output + Claude Agent SDK pour event streaming).

**Triangle d'inspiration pour Cockpit OS** :
- **Paperclip** = patterns management / governance / budgets / tickets (niveau conceptuel haut)
- **RTK** = compression output CLI (integre au dashboard pour metrics tokens live)
- **Claude Agent SDK** = streaming events pour feed le dashboard (plomberie technique)

Les 3 se completent pour construire le "centre nerveux" Cockpit OS envisage dans `01-vision-et-cartographie.md`.

**Action recommandee** : lors de handoff CLI du plan Cockpit OS, lire ces 3 sources wiki en parallele des 14 fichiers plan pour croiser les patterns.
