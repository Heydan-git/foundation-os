# Foundation OS — Manifeste

> Manifeste vivant. Lecture realiste de ce que le projet est, peut faire, et pourra faire.
> **Source originale** : `docs/manifeste.md` (squelette philosophique, 2026-04-04)
> **Source augmentee** : `foundation-os-manifeste-realiste.pdf` (lecture exhaustive Cowork, 2026-04-07, archive `.archive/manifestes/`)
> **Integration** : 2026-04-08 (post-S3 audit massif Cycle 3)
> **Auteur** : Kevin Noel | **Document** : auto-restitution sans embellissement

---

## 1. Identite — ce qu'est Foundation OS

Un OS de travail personnel IA-driven. Pas un produit commercial. Pas une plateforme. Pas un framework a distribuer. **Un outil personnel** concu pour que chaque session de travail avec Claude soit productive, tracee, reprise sans friction, et honnete.

- Un depot monorepo local (`foundation-os/`), versionne git, deploye sur Vercel
- Un noyau de regles operationnelles (`CLAUDE.md`) et d'etat de verite (`CONTEXT.md`)
- Une application React (`modules/app`) qui commence a heberger l'OS au lieu de le documenter
- Un Core OS a 4 piliers (Cortex / Memory / Monitor / Tools) specifie et actif
- Une stack d'agents, commands, hooks et scripts qui automatisent les gestes repetitifs

> « Que chaque session de travail avec Claude soit productive : Claude sait toujours ou on en est, ne cree pas de bordel, reste honnete, et le projet reste organise. »
> — squelette original 2026-04-04

---

## 2. Objectif

Que chaque session de travail avec Claude soit productive :

- Claude sait toujours ou on en est (`CONTEXT.md`)
- Claude ne cree pas de bordel (garde-fous)
- Claude reste honnete (anti-bullshit gates)
- Le projet reste organise (structure enforcement)

---

## 3. Contexte — d'ou ca vient

Le projet a commence en avril 2026 comme une collection d'artifacts JSX (`fos-commander`, `fos-knowledge`, `fos-scale-orchestrator`...) rendus dans des conversations Claude, pilotes par des fichiers MD « source de verite » (pattern MD-first). Une premiere iteration a pense l'architecture en 6 artifacts et 7 couches de stack (L0→L6).

Le projet a ensuite mute vers une vraie application React (Vite + TypeScript + Tailwind + Supabase + Vercel). Les artifacts JSX ont ete archives (`.archive/artifacts-jsx/`) et remplaces par des pages TSX (Commander, Knowledge, Dashboard...). Les MD pairs correspondants vivent desormais dans `modules/app/data/`.

Quatre phases iteratives (Phase 1 Fondations → Phase 4 Monitoring) ont ete executees et validees SAIN. Un Cycle 3 d'audit massif (24 sessions S0-S23) est en cours sur la branche `audit-massif-cycle3` — S0, S1, S2, S3 terminees au 2026-04-08, S4 a venir.

> **Tension observee**. Certains fichiers legacy (par ex. `modules/app/data/commander.md`) contiennent encore un vocabulaire grandiose (« revolution historique », « reference mondiale », « $1B+ potential ») qui contredit directement les anti-bullshit gates actuels du `CLAUDE.md`. C'est une trace de la premiere iteration, pas l'etat revendique aujourd'hui.

---

## 4. Architecture reelle — 3 couches

Foundation OS se lit comme 3 couches empilees, documentees dans `docs/architecture.md` et `docs/core/architecture-core.md` :

| Couche | Contenu | Role |
|--------|---------|------|
| MODULES | app (actif), finance (prevu), sante (prevu) | Les projets concrets qui utilisent l'OS |
| CORE OS | Cortex, Memory, Monitor, Tools | Le cerveau — routing, persistance, sante, automation |
| TOOLKIT | OMC, BMAD v6, MCP, superpowers, gstack | Les outils externes branches au Core |

### 4.1 — Core OS, les 4 piliers

| Pilier | Role | Support | Statut |
|--------|------|---------|--------|
| Cortex | Routing tache → agent, lifecycle CONTEXT.md, commands | `CLAUDE.md`, `.claude/agents/`, `.claude/commands/` | actif |
| Memory | 4 tiers (session / contexte / reference / auto-memory), regle d'or 1 info = 1 tier | `CONTEXT.md`, `docs/`, auto-memory Claude | actif |
| Monitor | Health indicators par severite, verdicts SAIN / DEGRADED / BROKEN | `scripts/health-check.sh`, integre a `review-agent` et `/sync` | actif |
| Tools | Validators, scripts, CI/CD, hooks — automation locale | `scripts/`, `.github/workflows/`, hooks git + Claude | actif |

Verdict S3 audit (2026-04-08) : les **4 piliers sont REELS**, alignes a >95% avec leurs specs. Voir `.archive/audit-massif/03-fondations-core.md`.

### 4.2 — Agents et commands

- **4 agents** (`.claude/agents/`, 193 lignes au total) : `os-architect` (50L), `dev-agent` (52L), `doc-agent` (51L), `review-agent` (40L)
- **4 commands** (`.claude/commands/`, 211 lignes) : `/session-start`, `/session-end`, `/new-project`, `/sync`
- Protocole uniforme : entree = `CONTEXT.md` + scope → execution dans son perimetre → sortie = rapport court + fichiers modifies
- Matrice de delegation 4×3 complete (architecture / dev / docs / review) — validee a la session S2 de l'audit

---

## 5. Stack technique — ce qui tourne vraiment

| Couche | Composant | Detail / Version |
|--------|-----------|------------------|
| Frontend | Vite + React 18 + TypeScript + Tailwind 3 | Module `modules/app`, build ~830 ms, bundle 457 KB JS / 17 KB CSS |
| Routing | react-router-dom v7 | 8 routes : `/`, `/commander`, `/knowledge`, `/dashboard`, `/crud-test`, `/phase1-demo`, `/login`, `/reset-password` |
| DB | Supabase (`@supabase/supabase-js`) | 6 tables : `sessions`, `decisions`, `risks`, `next_steps`, `context_blocks`, `docs` — RLS authenticated |
| Auth | Supabase Auth (email + reset) | `AuthContext` React, ProtectedRoute, LoginPage 148L + ResetPasswordPage 154L |
| Deploy | Vercel auto-deploy sur `main` | https://foundation-os.vercel.app · root dir `modules/app` |
| Tests | Vitest | 19 tests / 6 fichiers (app, supabase, mutations, useCommander, AuthContext, forms) — tous verts |
| CI | GitHub Actions | `ci.yml` (Node 24, build + tsc + vitest) + `supabase-ping` (cron hebdo) |
| Design | Void Glass | fond `#06070C`, accent `#5EEAD4`, Figtree + JetBrains Mono — voir `docs/design-system.md` |
| Scripts | bash / python | health-check, sync-check, ref-checker, module-scaffold + 2 hooks PreToolUse |
| AI tooling | Claude Code + OMC + superpowers + gstack + BMAD (dormant) | 4 agents custom + 4 commands + hooks Void Glass / security |

### 5.1 — Schema de base de donnees

Une seule migration active `001_create_tables.sql`. Toutes les tables utilisent UUID v4, timestamps UTC, et policies RLS `authenticated` pour select/insert/update. Triggers `BEFORE INSERT` sur `next_steps`, `context_blocks` et `docs` pour auto-incrementer `sort_order`.

| Table | Role | Champs cles |
|-------|------|-------------|
| sessions | Journal des sessions de travail | date, title, items, decisions, phase, status |
| decisions | Architecture Decision Records | date, title, context, impact, status |
| risks | Risques identifies et mitigations | risk, impact, proba, mitigation, status |
| next_steps | Actions a venir, priorisees | label, phase, priority, status, sort_order |
| context_blocks | Blocs de contexte structures | label, content, sort_order |
| docs | Documents (usage futur) | title, content, category, tags[] |

---

## 6. Etat reel — verifie (snapshot 2026-04-07)

> Les valeurs ci-dessous sont un snapshot a la date de generation du manifeste-realiste Cowork. Pour l'etat live, voir `CONTEXT.md` section "App Builder — Etat technique" et le verdict de `bash scripts/health-check.sh`.

| Indicateur | Valeur mesuree |
|------------|----------------|
| Build modules/app | SAIN, ~830 ms, 107 modules, exit 0 |
| TypeScript | 0 erreur (`tsc --noEmit`) |
| Tests Vitest | 19 passed / 19 (1.35 s) |
| Bundle | JS 457.15 KB, CSS 17.22 KB (sous seuils 600 KB / 40 KB) |
| References MD | 0 cassee sur 66 references scannees (`ref-checker.sh`) |
| Health check | SAIN (0 critical, 0 warning) |
| Void Glass | 0 violation (`#0A0A0B`, Outfit, Inter, system-ui seul) |
| TSX max | 544 lignes (`Phase1Demo.tsx`) — sous la limite 700 |
| MCPs connectes | Asana, Notion, Figma, Monday, ClickUp, Computer Use, Context7 |
| Modules actifs | 1 / 3 (app) — finance et sante planifies, non crees |
| Phases completees | Phase 1, Phase 2, Phase 3, Phase 4 (Phase 5 = Expansion a venir) |
| Audit Cycle 3 | 4 / 24 sessions (S0, S1, S2, S3) — S4 architecture orga PENDING |
| Branche de travail | `audit-massif-cycle3` (tag baseline `pre-audit-cycle3`) |

---

## 7. Modules prevus

- **App Builder** : dashboard React pour piloter Foundation OS (actif, production-ready)
- **Finance** : dashboard de suivi et trading automatise (a venir, Phase 5)
- **Sante** : agents virtuels conseil + dashboard de suivi (a venir, Phase 5)

---

## 8. Ce que l'OS peut faire — aujourd'hui

- **Piloter une session de travail IA** : `/session-start` lit `CONTEXT.md`, build tous modules, annonce l'etat. `/session-end` verifie la coherence, build, et propose un commit conventionnel.
- **Router une tache vers le bon agent** : Cortex dirige architecture, code, docs ou audit vers l'un des 4 agents, avec fallback direct si trivial.
- **Bloquer les derives visuelles** : hook PreToolUse `validate-void-glass.sh` empeche d'ecrire `#0A0A0B`, Outfit, Inter, system-ui seul.
- **Bloquer les commits casses** : pre-commit lance `health-check.sh` (BROKEN → exit 1) et `commit-msg` enforce les conventional commits (11 types).
- **Auditer la coherence du repo** : `sync-check.sh` (6 checks auto), `ref-checker.sh` (MD + backticks, code-block aware), `health-check.sh`.
- **Scaffolder un nouveau module** : `module-scaffold.sh` genere `modules/<nom>/` et met a jour `CONTEXT.md` (idempotent, kebab-case).
- **Stocker et servir le Commander** : page React connectee a Supabase avec 7 panels (Stats, Sessions, Decisions, Risks, Context, NextSteps, Docs) + 3 forms CRUD.
- **Garder Supabase eveille** : workflow GitHub Actions `supabase-ping` hebdomadaire pour eviter la pause 7 jours inactif.
- **Tracer les decisions** : ADR dans `CONTEXT.md` (max 15 actifs) + archive dans `docs/decisions-log.md` au-dela, toujours datees.

---

## 9. Ce que l'OS pourra faire — trajectoire

### 9.1 — Phase 5 Expansion modules (prevu, pas demarre)

- **Module Finance** : dashboard budget + tracking depenses + backtest de strategies crypto (3Commas, Pine Script mentionnes dans les skills installes)
- **Module Sante** : conseil multidisciplinaire (agents specialistes deja presents en skills : endocrinologue, nutritionniste, medecin-du-sport, etc.) + programme d'hygiene de vie
- **Module Trading** : moteur de backtest + dashboard positions + P&L. Skills `crypto-trader`, `strategy-optimizer`, `quant-researcher` deja installes
- **Prerequis dur** : Phases 1-4 toutes en statut DONE strict (pas DONE_WITH_CONCERNS) + Cycle 3 S23 merge

### 9.2 — Cycle 3 audit massif en cours

24 sessions S0-S23 planifiees pour auditer 100 % de l'OS. **4 terminees** (S0/S1/S2/S3), 20 restantes. 3 portes (GATE G1 synthese S19, G2 fixes appliques S22, G3 PR finale S23) avant merge `main`. Directive Kevin du 2026-04-07 : « nourrir l'audit pour ameliorer le fonctionnement de l'OS » → section learnings metaboliques dans chaque livrable.

### 9.3 — Pistes techniques identifiees dans le spec

- Statut 4 niveaux pour `/session-end` (DONE, DONE_WITH_CONCERNS, NEEDS_CONTEXT, BLOCKED) — deja concu Phase 3
- Bundle size tracking dans `CONTEXT.md` — partiellement en place via `health-check.sh`
- Integration Perplexity Pro — mentionnee dans la directive, non implementee
- BMAD v6 — 12 modules installes dans `_bmad/`, gardes dormants par decision explicite (2026-04-07)

---

## 10. Ce que l'OS ne pretend pas faire

- **Pas un produit**. Pas de vente, pas d'utilisateurs externes, pas de SaaS multi-tenant.
- **Pas de memoire persistante magique**. 4 tiers explicites : session (volatile), `CONTEXT.md`, `docs/`, auto-memory Claude natif.
- **Pas d'auto-amelioration autonome**. Reconnu comme techniquement impossible dans le spec v2.
- **Pas de 5 agents dev en parallele**. Max 3 agents paralleles documente — qualite se degrade au-dela.
- **Pas de run en production pour un tiers**. Le seul « user » est Kevin, les seules metriques sont locales.
- **Pas de « revolution »**. Mots interdits dans `CLAUDE.md` : revolution, historique, reference mondiale, premier au monde, $XB, accomplish.

---

## 11. Principes operationnels — les regles qui tiennent

### 11.1 — Principes fondateurs (squelette original 2026-04-04)

1. **Simplicite** — moins de fichiers, moins de complexite, moins de maintenance
2. **Realisme** — ne documenter que ce qui existe, verifier avant d'affirmer
3. **Continuite** — chaque session reprend la ou la precedente s'est arretee
4. **Organicite** — le systeme grandit naturellement, se range automatiquement

### 11.2 — Regles operationnelles (12 imperatifs CLAUDE.md, etat 2026-04-07)

- **Honnetete** — Ne jamais mentir, inventer, fabriquer. Dire quand on ne sait pas.
- **Fiabilite** — Ne jamais pretendre fini sans verification reelle (build + test executes).
- **MD-first** — Modifier `NOM-DATA.md` avant `NOM.jsx`. Si le JSX est perdu, le MD doit suffire a reconstruire.
- **Plan d'abord** — Plan avant execution. Validation Kevin avant changement non-trivial.
- **Zero racine** — Aucun fichier a la racine sauf `CLAUDE.md`, `CONTEXT.md`, `README.md`, `.gitignore`.
- **Source unique** — Une info = un seul tier. Pas de duplication entre `CONTEXT.md` et `docs/`.
- **Anti-bullshit** — Pas de « TERMINE » sans preuve. Mots grandiloquents bannis.
- **Cause racine** — Identifier la cause racine de chaque erreur avant de fixer (pas de patch symptomatique).
- **Anti-compactage** — Decouper systematiquement en phases/sessions courtes. Sauvegarder avant compactage, reverifier apres.
- **Tracabilite** — Chaque decision → `CONTEXT.md` (datee) ou `docs/decisions-log.md`. Chaque changement → conventional commit.
- **Pragmatisme** — Dire « je ne peux pas X » plutot que faire semblant.
- **Sub-agents restreints** — Sub-agents uniquement quand le contexte global n'est pas necessaire. Findings cross-fichier toujours re-verifies avec contexte global.

---

## 12. Inventaire verifiable — ce qui existe sur disque

> Snapshot 2026-04-07. Pour l'etat vivant, voir `docs/index.md`.

| Categorie | Nombre / Taille | Emplacement |
|-----------|-----------------|-------------|
| Documents Core OS | 5 specs | `docs/core/` (cortex, memory, monitor, tools, architecture-core) |
| Plans de phases | 7 plans dates | `docs/plans/` (phase1 → phase4, cycle3, finition-os, audit-massif) |
| Specs | 1 design spec v2 | `docs/specs/2026-04-05-foundation-os-v2-design.md` |
| Audit massif Cycle 3 | 4 livrables rediges + 20 placeholders | `.archive/audit-massif/` (00-INDEX + 00-preflight + 01-carto + 02-inventaire + 03-fondations-core) |
| Agents Claude | 4 agents / 193L | `.claude/agents/` |
| Commands Claude | 4 commands / 211L | `.claude/commands/` |
| Scripts bash + python | 8 scripts / ~1088L | `scripts/` + `scripts/hooks/` + `scripts/git-hooks/` |
| Hooks PreToolUse | 2 hooks actifs | `validate-void-glass.sh`, `security-reminder.py` |
| Pages React | 7 pages TSX | `modules/app/src/pages/` |
| Composants React | 13 composants (dont 7 panels Commander + 3 forms) | `modules/app/src/components/` |
| Tests Vitest | 19 tests / 6 fichiers | `modules/app/src/test/` |
| MD pairs Data | 7 fichiers | `modules/app/data/` (commander, graph, index, knowledge, scale-orchestrator, sync, toolbox) |
| Migration SQL | 1 migration | `supabase/migrations/001_create_tables.sql` |
| Workflows CI | 2 workflows | `.github/workflows/ci.yml`, `supabase-ping.yml` |
| BMAD v6 | 12 modules (dormant) | `_bmad/core/` |
| Archive | artifacts-jsx + legacy + manifestes | `.archive/` (7 JSX archives Phase 2.4 + manifeste-realiste-2026-04-07.pdf) |

---

## 13. Tensions et dette observees — honnete

### 13.1 — Vocabulaire legacy contradictoire
Les fichiers `data/*.md` du module app contiennent encore des ADR « revolutionary », « $1B+ potential », « reference mondiale absolue » dates du 2026-04-04. Ces termes sont explicitement interdits par le `CLAUDE.md` actuel. Ce sont des vestiges du premier design (artifacts JSX). A traiter en S20 fixes batch.

### 13.2 — Deux architectures coexistent
La skill `foundation-os-orchestrator` decrit un modele a 19 fichiers `fos-*`, stack L0→L6, Cowork desktop, Claude.ai Projects. Le depot actuel pratique un modele a 1 module React + Core OS 4-piliers. Les deux ne se contredisent pas, mais la documentation n'explicite pas le passage de l'un a l'autre.

### 13.3 — Routes de demo non nettoyees
`/phase1-demo` et `/crud-test` existent encore en routes protegees. `Phase1Demo.tsx` = 544 lignes, plus grosse TSX du repo. Nettoyage candidat pour Cycle 3 (S13 / S20).

### 13.4 — BMAD dormant mais present
12 modules BMAD v6 dans `_bmad/`, decision explicite de les garder dormants (2026-04-07 — overrule Kevin sur le verdict audit « ARCHIVER »). Cout : poids sur le repo, confusion potentielle.

### 13.5 — Paths absolus dans settings.json
Finding F-S2-08 de la session S2 : les hooks dans `.claude/settings.json` referencent des paths `/Users/kevinnoel/...` non portables. Fix prevu en S21.

### 13.6 — MD pairs figes mais lus
`modules/app/data/*.md` sont declares « referentiel fige » mais leur contenu n'est plus synchrone avec l'app React. A clarifier : archive read-only ou source vivante ?

### 13.7 — CLAUDE.md liste outils Tools obsolete (F-S3-01, ajoute 2026-04-08)
`CLAUDE.md` L95-96 liste les outils Tools mais ref-checker.sh est dans le backlog alors qu'il est construit, et 3 scripts (sync-check, module-scaffold, pre-commit) manquent. Fix S20.

---

## 14. Lecture synthetique — en une page

Foundation OS est un chantier de 2 mois. Il est passe d'un empilement d'artifacts JSX pilotes par des MD a une vraie application React + Supabase + Vercel, deployee, testee (19 tests verts), et entouree d'un Core OS a 4 piliers (Cortex, Memory, Monitor, Tools) specifie et actif. Quatre phases iteratives ont ete executees et validees SAIN. Un audit massif (Cycle 3, 24 sessions) est en cours pour nettoyer la dette accumulee avant d'ouvrir Phase 5 (expansion Finance / Sante / Trading).

**Les forces observables** : discipline operationnelle elevee (`CLAUDE.md` + `CONTEXT.md` + anti-bullshit gates), tracabilite systematique, health check automatise, scripts idempotents, build rapide et leger, stack minimaliste et bien choisie, 0 reference cassee, 0 violation Void Glass.

**Les fragilites observables** : vocabulaire legacy grandiloquent dans les MD pairs, deux architectures qui cohabitent sans pont explicite, routes de demo encore presentes, BMAD dormant mais lourd, dependance forte a un acteur humain (Kevin) pour chaque decision non-triviale. Aucune de ces fragilites n'est critique — toutes sont suivies dans `CONTEXT.md` ou dans le plan de Cycle 3.

**Le trait distinctif** : ce n'est pas un « OS » au sens systeme d'exploitation. C'est un protocole de cooperation entre un humain et un assistant IA, materialise en fichiers, regles, hooks, agents et une app React. La valeur ne vient pas du code, elle vient de la contrainte volontaire imposee a Claude (et a Kevin) pour que chaque session reste honnete, tracee, et reprenable.

---

## 15. Sources et references

### Sources lues pour ce manifeste

`CLAUDE.md`, `CONTEXT.md`, `README.md`, `docs/architecture.md`, `docs/core/architecture-core.md`, `docs/core/cortex.md`, `docs/core/memory.md`, `docs/core/monitor.md`, `docs/core/tools.md`, `docs/directive-v1.md`, `docs/index.md`, `docs/design-system.md`, `docs/specs/2026-04-05-foundation-os-v2-design.md`, `.archive/audit-massif/00-INDEX.md`, `.archive/audit-massif/00-preflight.md`, `.archive/audit-massif/01-carto-repo.md`, `.archive/audit-massif/02-inventaire-components.md`, `.archive/audit-massif/03-fondations-core.md`, `.claude/agents/os-architect.md`, `modules/app/package.json`, `modules/app/src/App.tsx`, `modules/app/data/commander.md`, `supabase/migrations/001_create_tables.sql`. Inventaires filesystem obtenus via `find` et `wc -l`.

### Refs externes

- Squelette original (preserve sections 2, 7, 11.1) : `docs/manifeste.md` 2026-04-04
- Manifeste-realiste source (PDF Cowork, 12 sections) : `.archive/manifestes/foundation-os-manifeste-realiste-2026-04-07.pdf`
- Live state : `CONTEXT.md` section "App Builder — Etat technique"
- Inventaire vivant : `docs/index.md`
- Audit en cours : `.archive/audit-massif/` (4 livrables + 20 placeholders)
