# 01 — Vision et Cartographie

## 1. Vision

Le dashboard n'est pas un simple panneau de metriques. C'est le **centre nerveux** de Foundation OS — l'interface visuelle a travers laquelle Kevin et Claude collaborent, reflechissent, pilotent et construisent.

Trois axes :
- **Observer** : monitorer chaque organe de l'OS en temps reel
- **Communiquer** : espace de dialogue, notes, idees, feedback entre Kevin et Claude
- **Piloter** : voir ou on en est, ou on va, et decider quoi faire ensuite

Nom de code : **Cockpit OS** (extension visuelle de la commande /cockpit existante)

## 2. Philosophie

- **Zero information cachee** : tout ce qui existe dans l'OS est visible quelque part dans le dashboard
- **Dynamique** : les donnees se mettent a jour a chaque session-start/session-end
- **Bidirectionnel** : Kevin peut ecrire (idees, notes, feedback) et pas seulement lire
- **Source unique** : chaque donnee affichee pointe vers sa source (fichier, commande, API)
- **Void Glass natif** : le dashboard EST l'expression du design system, pas un consommateur tiers

## 3. Cartographie exhaustive — Tout ce qui est monitorable

Inventaire complet de chaque element de Foundation OS qui peut etre affiche, suivi ou manipule dans le dashboard.

### 3.1 Modules applicatifs

| Element | Source | Type | Etat actuel |
|---------|--------|------|-------------|
| App Builder | `modules/app/` | module actif | build OK, 19 tests, 5 routes |
| Design System | `modules/design-system/` | module actif | 46 composants, tokens DTCG, preview port 6007 |
| Finance | — | module prevu | pas encore cree |
| Sante | — | module prevu | pas encore cree |
| Trading | — | module idee | evoque dans specs v2 |

Pour chaque module actif, on peut monitorer :
- Status (actif / prevu / archive)
- Build (OK / FAIL + temps + taille bundle)
- Tests (nombre, passes, echoues)
- Routes (nombre, liste)
- Composants (nombre, liste)
- Dependencies (nombre, outdated)
- Derniere modification (git log)
- Taille du code (lignes TSX, lignes totales)

### 3.2 Core OS (6 modules)

| Module Core | Fichier spec | Role | Ce qu'on monitore |
|-------------|-------------|------|-------------------|
| Cortex | `docs/core/cortex.md` | Routing, orchestration | Table de routing active, agents disponibles, commandes, regles de priorite |
| Communication | `docs/core/communication.md` | Journalisation, memoire | 4 tiers de memoire, taille CONTEXT.md (objectif < 150L), sessions recentes, decisions actives (max 15), idees en parking (max 10) |
| Monitor | `docs/core/monitor.md` | Sante, seuils | Indicateurs critical/warning/info, seuils actuels, historique verdicts, derniere execution health-check |
| Tools | `docs/core/tools.md` + `docs/core/tools/index.json` | Scripts, hooks, CI/CD | 98 outils (9 categories), routing etendu (26 regles), validators actifs, hooks actifs |
| Planner | `docs/core/planner.md` | Generation de plans | Plans generes (nombre, status), heuristiques routing modele, stats sub-agents |
| Worktrees | `docs/core/worktrees.md` | Isolation parallele | Worktrees actifs, archives, branches |

### 3.3 Outils et automatisation

#### Scripts (7)
| Script | Fichier | Ce qu'on monitore |
|--------|---------|-------------------|
| health-check | `scripts/health-check.sh` | Dernier resultat (SAIN/DEGRADED/BROKEN), temps d'execution, indicateurs |
| sync-check | `scripts/sync-check.sh` | 6 checks auto, dernier resultat |
| ref-checker | `scripts/ref-checker.sh` | Refs cassees detectees |
| module-scaffold | `scripts/module-scaffold.sh` | Modules scaffoldes |
| session-lock | `scripts/session-lock.sh` | Verrou actif (qui, depuis quand, TTL) |
| tool-register | `scripts/tool-register.sh` | Outils enregistres |

#### Hooks (4)
| Hook | Ce qu'on monitore |
|------|-------------------|
| validate-void-glass | Violations detectees |
| security-reminder | Rappels securite declenches |
| pre-commit | Commits bloques / passes |
| commit-msg | Commits refuses (format) |

#### CI/CD (2)
| Pipeline | Ce qu'on monitore |
|----------|-------------------|
| GitHub Actions CI | Dernier run, status, duree |
| Supabase ping | Dernier ping, uptime |

### 3.4 Agents Claude Code (4)

| Agent | Fichier | Ce qu'on monitore |
|-------|---------|-------------------|
| os-architect | `.claude/agents/os-architect.md` | Scope, dernieres invocations (via git log), decisions produites |
| dev-agent | `.claude/agents/dev-agent.md` | Scope, fichiers touches, builds produits |
| doc-agent | `.claude/agents/doc-agent.md` | Scope, docs mises a jour |
| review-agent | `.claude/agents/review-agent.md` | Scope, audits produits, regressions detectees |

### 3.5 Commandes (6)

| Commande | Fichier | Ce qu'on monitore |
|----------|---------|-------------------|
| /cockpit | `.claude/commands/cockpit.md` | Point d'entree unique — scan, brief, routing |
| /session-start | `.claude/commands/session-start.md` | Protocole de debut de session |
| /session-end | `.claude/commands/session-end.md` | Protocole de fin de session |
| /plan-os | `.claude/commands/plan-os.md` | Generateur de plans |
| /new-project | `.claude/commands/new-project.md` | Scaffold de module |
| /sync | `.claude/commands/sync.md` | Verification coherence |

### 3.6 Skills Cowork (~80+)

Organises par domaine :

| Domaine | Exemples | Nombre |
|---------|----------|--------|
| Sante/Medical | health-council, medecin-generaliste, psychiatre, nutritionniste, etc. | ~20 |
| Design/UX | product-design-uxui, ui-expert, ux-ergonome, audit-ux-complet, etc. | ~12 |
| Finance/Trading | crypto-trader, strategy-optimizer, market-regime-detector, quant-researcher | ~4 |
| Dev/Tech | fullstack-dev, lead-dev, database-architect, devops-specialist, ios-dev, etc. | ~8 |
| Foundation OS | foundation-os-orchestrator, skill-supervisor, project-skill-director, skill-creator | ~4 |
| Docs/Creation | docx, pptx, pdf, xlsx, canvas-design, web-artifacts-builder | ~6 |
| Research/Science | chercheur-scientifique, biologiste, neurobiologiste | ~3 |
| UX Research | test-u-analyzer, test-u-recommender, ux-research-orchestrator | ~3 |

Pour chaque skill : nom, description, triggers, derniere utilisation connue, domaine.

### 3.7 Plugins (4 actifs + 1 dormant)

| Plugin | Version | Ce qu'on monitore |
|--------|---------|-------------------|
| OMC (oh-my-claudecode) | v4.10.1 (update v4.11.4 dispo) | Version, update dispo, skills |
| Superpowers | v5.0.7 | Version, skills (dont writing-plans) |
| gstack | — | Version, skills actifs |
| BMAD v6 | — (dormant) | Status dormant, 12 modules |

### 3.8 MCP — Connexions externes

| Service | Status | Ce qu'on monitore |
|---------|--------|-------------------|
| Asana | connecte | workspace ID, user, projets accessibles |
| Notion | connecte | user ID, pages accessibles |
| Figma | connecte | projets, fichiers |
| Monday.com | connecte | boards, workspaces |
| Gmail | auth requise | status connexion |

### 3.9 Plans et roadmap

| Plan | Fichier | Status |
|------|---------|--------|
| Phase 1 — Fondations | `docs/plans/2026-04-05-phase1-fondations.md` | DONE |
| Phase 2 — App Hardening | `docs/plans/2026-04-07-phase2-app-hardening.md` | DONE |
| Phase 3 — OS Intelligence | `docs/plans/2026-04-07-phase3-os-intelligence.md` | DONE |
| Phase 4 — Monitoring | `docs/plans/2026-04-07-phase4-monitoring.md` | DONE |
| Audit massif final | `docs/plans/2026-04-07-audit-massif-final.md` | DONE |
| Cycle 3 implementation | `docs/plans/2026-04-07-cycle3-implementation.md` | DONE |
| Finition OS | `docs/plans/2026-04-07-finition-os.md` | EN COURS |
| DS shadcn finition | `docs/plans/2026-04-11-ds-shadcn-finition.md` | EN COURS (F1-F7 done, F8-F9 restent) |

Pour chaque plan : titre, date, status (draft/validated/executing/done), blocs total, blocs fait, progression %, modeles utilises, duree estimee vs reelle.

### 3.10 Specs et documentation

| Spec | Fichier |
|------|---------|
| Foundation OS v2 Design | `docs/specs/2026-04-05-foundation-os-v2-design.md` |
| Cockpit Design | `docs/specs/2026-04-10-cockpit-design.md` |
| Cockpit Plan | `docs/specs/2026-04-10-cockpit-plan.md` |
| Core OS Audit | `docs/specs/2026-04-10-core-os-audit.md` |
| Tools v2 Design | `docs/specs/2026-04-10-tools-module-v2-design.md` |
| Tools v2 Plan | `docs/specs/2026-04-10-tools-module-v2-plan.md` |

### 3.11 Design System — Void Glass

| Element | Source | Ce qu'on monitore |
|---------|--------|-------------------|
| Tokens primitifs | `modules/design-system/tokens/source/` | Nombre, valeurs, coherence |
| Tokens semantiques | idem | Nombre (95 vars), couverture |
| Composants shadcn | `modules/design-system/src/components/ui/` | 46 composants, tests, variants |
| Preview Storybook | port 6007 | Disponibilite, stories |
| Build tokens | Style Dictionary | Status build, fichiers generes |
| Violations Void Glass | `scripts/hooks/validate-void-glass.sh` | Couleurs/fonts interdites detectees |

### 3.12 Memoire et apprentissage

| Element | Source | Ce qu'on monitore |
|---------|--------|-------------------|
| CONTEXT.md | racine | Taille (< 150L), sections, fraicheur |
| Auto-memory Cowork | `/mnt/.auto-memory/` | Fichiers memoire, MEMORY.md |
| Auto-memory CLI | `~/.claude/projects/.../memory/` | Fichiers memoire |
| Decisions actives | CONTEXT.md | Nombre (max 15), anciennete |
| Decisions archivees | `docs/decisions-log.md` | Nombre total |
| Idees en parking | CONTEXT.md | Nombre (max 10), types |

### 3.13 Git et versionnement

| Element | Commande | Ce qu'on monitore |
|---------|----------|-------------------|
| Branche active | `git branch --show-current` | Nom |
| Dernier commit | `git log -1` | Hash, message, date, auteur |
| Fichiers non commites | `git status --short` | Nombre, liste |
| Branches | `git branch -a` | Liste, stale branches |
| Tags | `git tag` | Versions |

### 3.14 Travaux Cowork

| Travail | Dossier | Status |
|---------|---------|--------|
| Instructions Cowork | `docs/travaux-cowork/2026-04-08-instructions-cowork/` | — |
| Evolution Core OS | `docs/travaux-cowork/2026-04-13-evolution-core-os/` | EN COURS |
| Plan Dashboard Monitoring | `docs/travaux-cowork/2026-04-13-plan-dashboard-monitoring/` | CE DOCUMENT |

### 3.15 Infrastructure

| Element | Source | Ce qu'on monitore |
|---------|--------|-------------------|
| Vercel deploy | `https://foundation-os.vercel.app/` | Status, derniere URL, erreurs |
| Supabase | Dashboard | 6 tables, uptime, pause risk |
| GitHub repo | `.git/` | Stars, issues, PRs |

### 3.16 Sessions (historique de travail)

| Element | Source | Ce qu'on monitore |
|---------|--------|-------------------|
| Sessions recentes | CONTEXT.md | 5 dernieres, status, resume |
| Historique complet | `git log` | Toutes les sessions |
| Session active | `session-lock.sh` | Qui (cowork/cli), depuis quand, TTL |
| Verrou | `.fos-session.lock` | Status (locked/free), owner |

### 3.17 Elements interactifs (ecriture Kevin)

Ces elements ne sont pas du monitoring mais de la **communication bidirectionnelle** :

| Element | Usage |
|---------|-------|
| Boite a idees | Kevin ecrit une idee, elle atterrit dans un fichier, Claude la voit au prochain session-start |
| Notes libres | Bloc-notes par module ou global, persiste entre sessions |
| Brief de module | Kevin peut pre-remplir un brief pour un futur module (Finance, Sante, Trading) |
| Feedback | Kevin peut laisser un feedback sur le travail de Claude (va en auto-memory) |
| Inbox/Outbox | Messages persistants entre Kevin et Claude (pas ephemeres) |

## 4. Synthese — Nombre d'elements monitorables

| Categorie | Nombre d'elements |
|-----------|-------------------|
| Modules applicatifs | 5 (2 actifs + 3 prevus/idees) |
| Core OS | 6 modules |
| Scripts | 7 |
| Hooks | 4 |
| CI/CD | 2 |
| Agents | 4 |
| Commandes | 6 |
| Skills Cowork | ~80 |
| Plugins | 5 |
| MCP connexions | 5 |
| Plans | 8+ |
| Specs | 6 |
| Composants DS | 46 |
| Tokens DS | ~117 (22 primitives + 95 semantiques) |
| Fichiers memoire | variable |
| Decisions | ~20 actives + archives |
| Travaux Cowork | 3+ |
| **TOTAL** | **~220+ elements monitorables** |
