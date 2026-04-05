# Foundation OS v2 — Design Spec

> Approche C : Iteratif par couches
> Valide par Kevin le 2026-04-05
> Source : Directive Claude Code (12 sections, 18 imperatifs, P0-P9)

## Contexte

Foundation OS est un OS de travail IA-driven personnel. Etat au 2026-04-05 :
- App Builder : MVP live (6 routes, auth, CRUD, Void Glass, Vercel)
- Core OS : 4/4 specs (Cortex, Memory, Monitor, Tools), partiellement implemente
- 3 685 lignes de code TS/TSX, 3 013 lignes artifacts JSX
- 2 smoke tests, pas de tests logique metier
- Ratio docs/code : ~50/50

Kevin a produit une directive de 12 sections couvrant regles de comportement, ameliorations OS, et use cases futurs. Probleme : tout mettre dans CLAUDE.md = four a tokens. Tout executer d'un coup = usine a gaz.

Decision : decomposer en 5 phases iteratives. Chaque phase livre de la valeur concrete.

## Principes

1. **Phase gate** : on ne passe a N+1 que si health-check.sh = SAIN et critere de succes atteint
2. **Pas de derive** : chaque phase a un scope fige et un critere mesurable
3. **Alterner meta/code** : une phase infra, une phase app, pas deux meta d'affilee
4. **2 outils max par phase** : on installe, on evalue, puis on ajoute
5. **Token-aware** : CLAUDE.md < 1500 mots, agents seulement si > 3 fichiers

## Phase 1 — Fondations (1 session)

**Objectif** : Consolider les regles, nettoyer le dead weight, installer 2 outils cles.

### 1.1 — CLAUDE.md v2

Reecrire le CLAUDE.md actuel (~2.8K) en version compacte (~1.2K) :

**Garder tel quel :**
- Stack, Build, Structure
- Regles (conventional commits, Void Glass, JSX < 700L, garde-fous racine)
- Core OS routing, Agents, Commands
- Anti-bullshit gates (6 gates existantes)

**Ajouter depuis la directive :**
- Honnetete : ne jamais mentir, inventer, fabriquer de donnees (IMP-01/02/03)
- Fiabilite : ne jamais pretendre avoir fini sans verification (IMP-06/07)
- Methode : plan avant execution, validation Kevin avant non-trivial (IMP-13/14)
- MD first : modifier NOM-DATA.md avant NOM.jsx (IMP-15)
- Anti-compactage : sauvegarder etat avant compactage, reverifier apres (IMP-17/18)

**Supprimer :**
- Toute duplication (section 0 vs section 2 de la directive)
- Les instructions impossibles techniquement (prediction compactage, auto-amelioration persistante)

**Externaliser vers docs/ :**
- Directive originale complete → `docs/directive-v1.md`
- Details des imperatifs → reference, pas prompt permanent

### 1.2 — Nettoyage dead weight

| Fichier | Action | Raison |
|---------|--------|--------|
| `.claude/safeguards.json` | Supprimer | Config sans implementation — zero valeur |
| `.claude/settings.local.json` | Trimmer | Garder : Asana, Notion, Figma, LSP. Supprimer : neon-browser, permissions trop larges |
| `.omc/state/` fichiers orphelins | Nettoyer | Sessions/replays termines qui trainent |

### 1.3 — Installer 2 outils

**security-guidance (Anthropic official)**
- Hook PreToolUse Python qui scanne 9 patterns de vulnerabilites (XSS, injection, eval)
- Pertinent pour React (dangerouslySetInnerHTML, .innerHTML)
- Installation : ajouter hook dans `.claude/settings.json`

**gstack (Garry Tan, MIT)**
- 23 skills dont /qa (test QA) et /cso (security audit)
- Installation : `git clone` dans `~/.claude/skills/gstack/`
- Pas de modification CLAUDE.md necessaire

### 1.4 — Memoire de reference

- Sauvegarder directive complete dans `docs/directive-v1.md`
- Creer `docs/index.md` — sommaire de navigation minimal :
  - Ou trouver quoi (code, config, specs, scripts)
  - Mis a jour a chaque session-end

### Critere de succes Phase 1

- [ ] `health-check.sh` = SAIN
- [ ] CLAUDE.md v2 < 1500 mots (`wc -w CLAUDE.md`)
- [ ] safeguards.json supprime
- [ ] security-guidance hook actif (test : ecrire un dangerouslySetInnerHTML → bloque)
- [ ] gstack installe (`ls ~/.claude/skills/gstack/SKILL.md`)
- [ ] `docs/directive-v1.md` existe
- [ ] `docs/index.md` existe

---

## Phase 2 — App Hardening (2-3 sessions)

**Objectif** : L'app passe de MVP a production-ready.

### 2.1 — Tests (session 1)

| Cible | Tests a ecrire |
|-------|----------------|
| useCommander hook | fetch OK, fallback seed, erreur Supabase |
| mutations.ts | createSession, updateDecision, deleteSession, edge cases |
| AuthContext | signIn OK, signIn erreur, signUp, signOut, session restore |
| NextStepActions | optimistic update, revert on error, keyboard shortcuts |
| Composants | AddSessionForm validation, EditDecisionModal, Layout render |

**Objectif** : 15+ tests, 0 failure, coverage logique metier.

### 2.2 — Navigation (session 1 ou 2)

- Sidebar ou top-nav dans Layout.tsx
- Liens entre /, /commander, /dashboard
- Active state sur la route courante (react-router-dom NavLink)
- Mobile-responsive

### 2.3 — Auth complete (session 2)

- Email verification sur signup (Supabase config)
- Password reset flow (forgot password → email → reset page)
- Minimum : 8 caracteres mot de passe (actuellement 6)

### 2.4 — Integration artifacts (session 2 ou 3)

- Integrer fos-commander et fos-knowledge comme vraies pages
- Convertir JSX → TSX avec types
- Supprimer les artifacts restants ou les archiver dans `.archive/`
- Mettre a jour les MD pairs correspondants

### Critere de succes Phase 2

- [ ] `vitest run` = 15+ tests, 0 failure
- [ ] Navigation entre modules sans URL manuelle
- [ ] Signup avec verification email fonctionne
- [ ] Password reset fonctionne
- [ ] Au moins 2 artifacts integres dans l'app
- [ ] `health-check.sh` = SAIN

---

## Phase 3 — OS Intelligence (1-2 sessions)

**Objectif** : Rendre l'OS plus intelligent dans sa gestion de sessions et memoire.

### 3.1 — Session-end ameliore

Remplacer le statut binaire par 4 niveaux (inspire de PAUL framework) :

| Statut | Signification | Action suivante |
|--------|---------------|-----------------|
| DONE | Phase complete, tout verifie | Passer a la suite |
| DONE_WITH_CONCERNS | Fait mais points d'attention | Documenter les concerns dans CONTEXT.md |
| NEEDS_CONTEXT | Bloque par manque d'info | Lister les questions dans CONTEXT.md |
| BLOCKED | Impossible de continuer | Documenter le blocage + workaround tente |

- health-check.sh obligatoire avant chaque session-end
- CONTEXT.md mis a jour avec le statut + raison

### 3.2 — Index de navigation

`docs/index.md` — carte complete :

```
## Code
modules/app/src/pages/       → Routes (6 pages)
modules/app/src/components/  → UI (Layout, Card, Badge, panels)
modules/app/src/lib/         → Data (Supabase, mutations, auth, hooks)
modules/app/src/artifacts/   → Interactive JSX (7 fichiers)
modules/app/data/            → MD pairs (7 fichiers)

## Config
.claude/agents/              → 4 agents (architect, dev, doc, review)
.claude/commands/            → 4 commands (session-start/end, new-project, sync)
.claude/settings.json        → Hooks + permissions

## Specs
docs/core/                   → Core OS (cortex, memory, monitor, tools)
docs/specs/                  → Design specs
docs/design-system.md        → Void Glass tokens

## Scripts
scripts/health-check.sh      → Monitor health (SAIN/DEGRADED/BROKEN)
scripts/hooks/validate-void-glass.sh → PreToolUse Void Glass gate
```

Mis a jour a chaque session-end si des fichiers sont crees/deplaces.

### 3.3 — Audit BMAD + OMC

| Outil | Question | Si non utilise |
|-------|----------|----------------|
| BMAD (12 modules) | Utilise en session ? Resultat ? | Archiver dans .archive/ |
| OMC skills (30+) | Lesquels invoques ? Lesquels utiles ? | Documenter dans docs/tools-audit.md |
| Coderabbit | Overlap avec code-review Anthropic ? | Garder le meilleur, virer l'autre |

### Critere de succes Phase 3

- [ ] /session-end genere un statut 4-niveaux
- [ ] `docs/index.md` existe et reflette la structure reelle
- [ ] Audit BMAD + OMC documente dans `docs/tools-audit.md`
- [ ] `health-check.sh` = SAIN

---

## Phase 4 — Monitoring (1 session)

**Objectif** : Les checks de sante deviennent automatiques.

### 4.1 — health-check.sh en pre-commit

- Ajouter comme git pre-commit hook
- BROKEN (exit 1) → bloque le commit
- DEGRADED (exit 2) → warning dans le terminal, laisse passer
- SAIN (exit 0) → passe silencieusement

### 4.2 — Bundle size tracking

- health-check.sh extrait deja les tailles → les sauvegarder dans CONTEXT.md
- Seuil d'alerte : JS > 600KB ou CSS > 40KB (marge ~37% au-dessus de l'actuel)
- Si depasse : health-check.sh retourne WARNING

### 4.3 — Regles token-awareness (dans CLAUDE.md v2)

| Situation | Action |
|-----------|--------|
| < 3 fichiers, 1 domaine | Direct (pas d'agent) |
| 3+ fichiers ou 2+ domaines | Agent(s) |
| Recherche exploratoire | Agent Explore |
| Max agents paralleles | 3 (projet solo) |
| Build/tests | run_in_background |

### Critere de succes Phase 4

- [ ] Commit avec build casse → bloque par pre-commit
- [ ] Bundle size dans CONTEXT.md section "Etat technique"
- [ ] Regles token-awareness dans CLAUDE.md v2
- [ ] `health-check.sh` = SAIN

---

## Phase 5 — Expansion (quand 1-4 DONE)

**Objectif** : Premier nouveau module.

**Prerequis strict** : Phases 1-4 toutes DONE (pas DONE_WITH_CONCERNS).

### Options (choix au moment de l'execution)

**Finance :**
- Etudier architecture Dexter (virattt/dexter) comme reference
- Dashboard budget, tracking depenses, projections
- API : financial data APIs ou import CSV
- Stack : meme que App Builder (React + Supabase)

**Sante :**
- Conseil multi-disciplinaire (agents specialises par domaine medical)
- Programme hygiene de vie personnalise
- Pas de diagnostic — recommandations et suivi uniquement

**Trading :**
- Evaluer Kryll.io (https://os.kryll.io/) pour strategies automatisees
- Moteur de backtest
- Dashboard positions + P&L

### Critere de succes Phase 5

- [ ] `modules/[nom]/` scaffold avec package.json
- [ ] `npm run build` passe dans le nouveau module
- [ ] Au moins 1 route fonctionnelle
- [ ] CONTEXT.md mis a jour avec le nouveau module
- [ ] `health-check.sh` = SAIN (adapte pour inclure le nouveau module)

---

## Repos externes — Decisions

| Repo | Decision | Quand |
|------|----------|-------|
| security-guidance (Anthropic) | **Installer** | Phase 1 |
| gstack (Garry Tan) | **Installer** | Phase 1 |
| superpowers (obra) | **Garder** | Deja installe |
| code-review (Anthropic) | **Evaluer** | Phase 3 (audit Coderabbit d'abord) |
| awesome-claude-code | **Bookmarker** | Reference permanente |
| Dexter (virattt) | **Etudier** | Phase 5 (si Finance) |
| Vibe Kanban (BloopAI) | **Evaluer** | Phase 5 (si multi-modules) |
| awesome-claude-skills (Composio) | **Ignorer** | — |
| SuperClaude Framework | **Ignorer** | Overlap OMC |
| Continuous Claude v3 | **Ignorer** | Docker trop lourd |
| claude-mem | **Ignorer** | AGPL + overlap memoire |
| PAUL | **Concept vole** | 4-status → Phase 3 |
| OpenSpace | **Ignorer** | Trop jeune |
| CLI-Anything | **Ignorer** | Mauvais domaine |
| everything-claude-code | **Ignorer** | Stars suspectes, no license |
| marketingskills | **Ignorer** | Mauvais domaine |
| frontend-design (Anthropic) | **Ignorer** | Conflit Void Glass |
| theme-factory (x2) | **Ignorer** | Pas pertinent |

## Imperatifs retenus pour CLAUDE.md v2

| Ref | Regle compacte |
|-----|----------------|
| IMP-01/02/03 | Ne jamais mentir, inventer, ou fabriquer (donnees, URLs, citations) |
| IMP-04/05 | Dire quand je ne sais pas ou ne suis pas sur |
| IMP-06/07 | Ne jamais pretendre avoir fini sans verification reelle |
| IMP-08 | Pas de completion Asana sans OK Kevin |
| IMP-09/10 | 100% ou rien, verifier le repertoire courant |
| IMP-13/14 | Plan avant execution, validation Kevin avant non-trivial |
| IMP-15 | MD first : NOM-DATA.md avant NOM.jsx |
| IMP-17/18 | Sauvegarder etat avant compactage, reverifier apres |

IMP-11/12 (ethique) : implicites dans le comportement de base — pas besoin de les repeter dans CLAUDE.md.
IMP-16 (tracer tout) : couvert par les session-end et CONTEXT.md — pas de regle supplementaire.

## Ce qui n'est PAS dans ce plan

- Perplexity Pro integration (evaluer plus tard, pas prioritaire)
- Indicateur terminal custom (OMC HUD couvre deja ce besoin)
- Auto-amelioration persistante (techniquement impossible — CONTEXT.md + auto-memory est le max)
- 5 agents dev paralleles (possible mais qualite degrade au-dela de 3 — regle documentee)
- Knowledge Graph MCP (evaluer en Phase 3 si besoin identifie)
- Skill-creator (superpowers writing-skills existe deja)
- Auditeur de skills automatise (fait manuellement en Phase 3)
