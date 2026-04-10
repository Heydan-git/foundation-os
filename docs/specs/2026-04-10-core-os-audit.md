# Audit Core OS — 2026-04-10

> Audit profond du Core OS Foundation OS. Objectif : identifier forces et faiblesses pour ameliorer avant Phase 5.
> Methode : lecture integrale de tous les fichiers Core OS (specs, agents, commands, scripts, settings, docs) + verification croisee.
> Auteur : Claude (Opus 4.6) avec contexte global complet.

---

## Grille de synthese

| # | Axe | Verdict | Forces | Faiblesses | Priorite fix |
|---|-----|---------|--------|------------|-------------|
| 1 | Synergie | 🟡 | Bonne separation des roles | Rename Memory→Communication incomplet, ruptures de liens | P1 |
| 2 | Automatisation | 🟡 | Scripts solides, hooks efficaces | Design System ignore par health-check, pas de build dynamique | P1 |
| 3 | Adaptabilite | 🟡 | module-scaffold existe | Scripts hardcodes sur modules/app, pas de decouverte dynamique | P2 |
| 4 | Modularite | 🟢 | 4 piliers bien separes | Cockpit chevauche session-start/end sans delegation claire | P3 |
| 5 | Coherence | 🔴 | CONTEXT.md fiable | 12+ refs cassees Memory→Communication, versions stale, sync-check bug | P0 |
| 6 | Communication | 🟢 | Spec la plus complete (324L) | session-end.md garde section Persistance supprimee dans la spec | P2 |
| 7 | Nomenclature | 🟡 | Convention claire dans communication.md | Pas appliquee partout (Memory, 4 commands vs 5) | P1 |
| 8 | Monitoring | 🟡 | health-check robuste | Baselines obsoletes, DS ignore, seuils non synchronises | P1 |
| 9 | Journalisation | 🟢 | Format structure, budget taille respecte | Rien de critique | P3 |
| 10 | Specification | 🟢 | 4 specs completes et coherentes | monitor.md baselines stale | P2 |
| 11 | Documentation | 🟡 | Manifeste exhaustif | index.md et manifeste.md stale (React 18→19, Vite 5→8) | P1 |
| 12 | Resilience compactage | 🟢 | Decoupage sessions, CONTEXT.md <150L | Pas de mecanisme de recovery si compactage pendant audit | P3 |
| 13 | Onboarding module | 🟡 | module-scaffold idempotent | Aucun script ne met a jour health-check/sync-check pour le nouveau module | P2 |
| 14 | Scalabilite agents | 🟢 | Protocole uniforme, routing table | cockpit pas dans EXPECTED_COMMANDS de sync-check | P2 |

**Legende** : 🟢 solide / 🟡 fonctionne mais gaps / 🔴 probleme actif

---

## Fiches detaillees par axe

---

### Axe 1 — Synergie entre modules

**Ce qui marche bien :**
- Les 4 piliers ont des responsabilites claires et non-chevauchantes (Cortex=routing, Communication=persistance, Monitor=sante, Tools=automation)
- Le schema `cortex.md` section 5 definit explicitement les limites de chaque module
- Les relations croisees sont documentees (`communication.md` section 8)
- Le pattern "pointeur propre" (CLAUDE.md dit "spec complete : docs/core/X.md") evite la duplication

**Faiblesses :**

| Finding | Fichier:ligne | Impact |
|---------|--------------|--------|
| `architecture-core.md` appelle encore le module "Memory" | `docs/core/architecture-core.md:9,19` | Confusion — le schema des couches dit Memory mais la spec est Communication |
| `tools.md` pointe vers "Memory" | `docs/core/tools.md:81` | Lien conceptuel casse |
| Cortex, Monitor et Tools ne referencent pas Communication | Aucun `grep -l communication` dans cortex/monitor/tools | Les 3 autres piliers ignorent le rename |
| Cockpit n'est pas integre dans le schema de synergie | `architecture-core.md` ne mentionne pas cockpit | Le cockpit est un orchestrateur au-dessus de Cortex mais invisible dans l'architecture documentee |

**Recommandations :**
1. Rename "Memory" → "Communication" dans architecture-core.md, tools.md
2. Ajouter cockpit dans architecture-core.md comme couche au-dessus de Cortex
3. Mettre a jour les refs croisees dans cortex.md et tools.md

---

### Axe 2 — Automatisation

**Ce qui marche bien :**
- `health-check.sh` (172L) — couvre critical/warning/info, exit codes standards, parsage intelligent du build time
- `sync-check.sh` (215L) — 7 checks enchaines, reutilise health-check
- `ref-checker.sh` — full-repo, code-block aware, glob-safe
- Pre-commit hook execute health-check (BROKEN bloque le commit)
- commit-msg enforce conventional commits
- PreToolUse hooks (Void Glass + security) declenchent a chaque Write/Edit
- CI GitHub Actions (build + tsc + vitest) + supabase-ping cron

**Faiblesses :**

| Finding | Fichier:ligne | Impact |
|---------|--------------|--------|
| health-check ne build que modules/app | `health-check.sh:27` hardcode `cd modules/app` | Design System (100 tests, tokens build) totalement ignore |
| health-check ne lance pas les tests DS | Aucune ref a `modules/design-system` | 100 tests Vitest DS ne sont jamais verifies par le health-check |
| Pas de decouverte dynamique des modules | health-check et sync-check hardcodent `modules/app` | Ajouter un module = modifier les scripts a la main |
| sync-check check 5 (routes) hardcode `App.tsx` | `sync-check.sh:144` | Non-scalable si un 2e module a des routes |
| session-lock.sh existe mais n'est pas integre | `scripts/session-lock.sh` ni dans health-check ni dans sync-check | Outil Cowork isole, pas de verification automatique |

**Recommandations :**
1. Boucle dynamique dans health-check : `for mod in modules/*/package.json; do ... done`
2. Ajouter `npm test -w modules/design-system` dans health-check section WARNING
3. Rendre sync-check extensible par module (decouverte dynamique)

---

### Axe 3 — Adaptabilite

**Ce qui marche bien :**
- `module-scaffold.sh` cree le squelette + met a jour CONTEXT.md (idempotent, kebab-case, --help)
- Structure monorepo npm workspaces permettrait d'ajouter un module facilement
- Le protocole agent est generique (entree CONTEXT.md + scope → execution → sortie)

**Faiblesses :**

| Finding | Detail | Impact |
|---------|--------|--------|
| module-scaffold ne met pas a jour les scripts | Apres scaffold, health-check/sync-check ignorent le nouveau module | Faux vert — le health-check dit SAIN alors que le nouveau module n'est pas teste |
| Agents hardcodes dans sync-check | `EXPECTED_AGENTS` et `EXPECTED_COMMANDS` sont des listes statiques | Ajouter un agent/command = modifier sync-check |
| Routing table Cortex est dans CLAUDE.md | Si un nouveau module a besoin de nouveaux signaux de routing, il faut editer CLAUDE.md | Pas de registre extensible |
| monitor.md dit "Modules actifs : 1 (app)" | `monitor.md:83` | Le Design System est actif mais ignore par la spec Monitor |

**Recommandations :**
1. module-scaffold devrait emettre un warning "Penser a mettre a jour health-check.sh et sync-check.sh"
2. Decouverte dynamique des agents/commands dans sync-check (`ls .claude/agents/*.md`)
3. Mettre a jour monitor.md pour inclure Design System

---

### Axe 4 — Modularite

**Ce qui marche bien :**
- Chaque pilier a UNE spec, UN scope, PAS de debordement
- Agents ont des clauses "hors scope" explicites avec delegation nommee
- Le pattern "3 phases" (entree/execution/sortie) est uniforme sur les 4 agents
- CONTEXT.md est la seule source de verite operationnelle — pas de duplication a gerer
- Les commandes /session-start et /session-end sont dans des fichiers separes avec des phases claires

**Faiblesses :**

| Finding | Detail | Impact |
|---------|--------|--------|
| Cockpit vs session-start/end : chevauchement | cockpit.md Phase 2 = session-start brief, Phase 5 = session-end cloture | Deux chemins pour le meme resultat, risque de divergence si l'un evolue et pas l'autre |
| Cockpit cite "voir /session-start (source de verite du format v11)" | `cockpit.md:22` | Dependance implicite — si session-start.md change, cockpit doit suivre manuellement |
| doc-agent et session-end font la meme chose | doc-agent = "met a jour CONTEXT.md", session-end Phase 5 = "met a jour CONTEXT.md" | Qui est responsable ? session-end le fait directement, doc-agent n'est pas invoque |

**Recommandations :**
1. Clarifier : cockpit est un wrapper, pas une alternative. Le documenter comme tel dans architecture-core.md
2. Considerer : session-end devrait-il invoquer doc-agent au lieu de faire les updates lui-meme ?

---

### Axe 5 — Coherence ⚠ PRIORITE HAUTE

**Ce qui marche bien :**
- CONTEXT.md est a jour (130L, sous le budget 150L)
- health-check SAIN, 19/19 tests, 0 ref cassee dans les .md vivants
- Decisions toutes datees (14 datees dans CONTEXT.md)

**Faiblesses (12+ trouvees) :**

| # | Finding | Fichier:ligne | Severite |
|---|---------|--------------|----------|
| C1 | sync-check attend ~~docs/core/memory.md~~ (renomme → communication.md) qui n'existe plus | `sync-check.sh:130` | 🔴 BUG — sync-check reporterait BROKEN a tort |
| C2 | architecture-core.md dit "Memory" | `architecture-core.md:9,19` | 🟡 Nomenclature stale |
| C3 | tools.md dit "→ Memory" | `tools.md:81` | 🟡 Lien conceptuel casse |
| C4 | decisions-log.md ref ~~docs/core/memory.md~~ (renomme → communication.md) | `decisions-log.md:27` | 🟡 Archive, ref cassee |
| C5 | CLAUDE.md dit "cortex, memory, monitor, tools" | `CLAUDE.md:91` | 🟡 Guide principal incorrect |
| C6 | manifeste.md dit "React 18, Vite 5, Tailwind 3" | `manifeste.md:83` | 🟡 Versions obsoletes (reel: React 19, Vite 8, Tailwind 4) |
| C7 | index.md dit "React 18, Vite 5" | `index.md:39` | 🟡 Idem |
| C8 | index.md liste 4 commands, cockpit manquant | `index.md:38` | 🟡 Inventaire incomplet |
| C9 | sync-check EXPECTED_COMMANDS manque cockpit | `sync-check.sh:110` | 🟡 cockpit non verifie |
| C10 | session-end.md a section PERSISTANCE | `session-end.md:148-152` | 🟡 communication.md 6.2 dit "supprimee" |
| C11 | Paths absolus dans settings.json | `settings.json:18,22` | 🟡 Connu, non portable |
| C12 | Phase1Demo et /crud-test encore dans App.tsx | `App.tsx:8,61,63` | 🟡 Routes de demo non nettoyees |
| C13 | monitor.md baseline JS ~457KB | `monitor.md:79` | 🟡 Reel: 244KB (post-upgrade) |

**Recommandations :**
1. **P0** : Fixer C1 (sync-check `memory` → `communication`) — c'est un bug actif
2. **P1** : Fixer C2-C5 (rename Memory→Communication partout)
3. **P1** : Fixer C6-C8 (versions et inventaire stale)
4. **P2** : Fixer C9-C13 (cockpit, persistance, paths, demo routes, baselines)

---

### Axe 6 — Communication

**Ce qui marche bien :**
- Spec la plus complete du Core OS (324L, 9 sections)
- 4 tiers clairement definis avec regle d'or "1 info = 1 tier"
- Nomenclature unifiee avec table de migration (ancien→nouveau)
- Budget de taille par section (total ~125L, garde-fou 200L)
- Lifecycle des idees bien pense (capture → presentation → resolution → suppression)
- Brief v11 TDAH-friendly bien specifie (structure, alignement, couleurs, texte)
- Section 8 "Relation avec les autres modules" = bonne pratique rare

**Faiblesses :**

| Finding | Detail | Impact |
|---------|--------|--------|
| session-end.md template garde PERSISTANCE | `session-end.md:148-152` "┌─ PERSISTANCE ─┐" | Contradicts communication.md section 6.2 qui dit "Section Persistance supprimee (redondante)" |
| Auto-memory tier peu specifie | communication.md:14 mentionne auto-memory mais ne donne pas de guidelines sur quoi y mettre | Risque de duplication tier Contexte ↔ Auto-memory |
| Pas de mecanisme de purge des decisions archivees | decisions-log.md peut grossir indefiniment | A long terme, dette documentaire |

**Recommandations :**
1. Retirer la section PERSISTANCE du template session-end.md
2. Ajouter dans communication.md un paragraphe sur ce qui va dans auto-memory vs CONTEXT.md
3. Optionnel : regle de purge pour decisions-log.md (ex: decisions > 6 mois → supprimables)

---

### Axe 7 — Nomenclature

**Ce qui marche bien :**
- communication.md section 2 definit la table de migration des noms
- Convention `D-[SCOPE]-NN` pour les decisions, appliquee dans CONTEXT.md
- Statuts session (DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED) documentes et utilises
- Dates toujours YYYY-MM-DD
- Conventional commits enforces par hook

**Faiblesses :**

| Finding | Detail | Impact |
|---------|--------|--------|
| Rename Memory→Communication pas applique partout | architecture-core.md, tools.md, CLAUDE.md, sync-check.sh, decisions-log.md | cf. Axe 5 findings C1-C5 |
| "4 commands" vs "5 commands" | cockpit.md existe mais n'est pas compte dans sync-check ni index.md | Inventaire inconstant |
| EXPECTED_SPECS inclut "architecture-core" | `sync-check.sh:130` | Ce n'est pas un module Core OS, c'est un doc meta — devrait etre separe |
| Pas de convention de nommage pour les specs | `docs/specs/` contient 3 fichiers avec formats differents | Mineur, mais pas de template |

**Recommandations :**
1. Appliquer le rename Memory→Communication dans tous les fichiers (cf. Axe 5)
2. Decider : cockpit = command ou skill ? Si command, l'ajouter aux inventaires
3. Optionnel : convention nommage specs `YYYY-MM-DD-<scope>-<type>.md`

---

### Axe 8 — Monitoring

**Ce qui marche bien :**
- health-check.sh est robuste : gere les edge cases (build time en ms/s, single-commit repo, code-block aware refs)
- Verdicts 3 niveaux (SAIN/DEGRADED/BROKEN) avec exit codes standards (0/2/1)
- Pre-commit bloque sur BROKEN, warn sur DEGRADED — bon equilibre
- ref-checker.sh est le plus sophistique des scripts (code-block aware, glob-safe, backtick resolution)

**Faiblesses :**

| Finding | Fichier:ligne | Impact |
|---------|--------------|--------|
| Design System absent du monitoring | health-check ne build ni ne teste DS | 100 tests invisibles, regression tokens possible sans alerte |
| Baselines obsoletes dans monitor.md | `monitor.md:79-80` JS ~457KB (reel 244KB), build ~800ms (reel 178ms) | Seuils d'alerte decales — on pourrait doubler le bundle sans warning |
| monitor.md dit "Modules actifs : 1 (app)" | `monitor.md:83` | DS est actif depuis DS-1, pas comptabilise |
| Pas de check Design System tokens build | Aucun script ne verifie que `tokens/build/` est a jour | Tokens stale possibles |
| Seuils note "source de verite unique" (monitor.md:85) mais CONTEXT.md:95 a ses propres seuils | `CONTEXT.md:95` vs `monitor.md:109` | Deux sources de verite pour les seuils |

**Recommandations :**
1. Ajouter DS dans health-check : `cd modules/design-system && npm run build && npm test`
2. Mettre a jour baselines monitor.md (JS 244KB, build 178ms)
3. Retirer les seuils de CONTEXT.md (pointer vers monitor.md comme source unique)
4. Ajouter "Modules actifs : 2 (app, design-system)" dans monitor.md

---

### Axe 9 — Journalisation

**Ce qui marche bien :**
- Format session structure avec champs fixes (CONTEXT.md > Sessions recentes)
- Gradation derniere session (4-8L) vs anciennes (1-2L) — bon compromis detail/compacite
- Max 5 sessions, suppression des plus anciennes (pas de bloat)
- Decisions avec lifecycle (actives max 15 → archivage)
- Idees avec lifecycle (capture → presentation → resolution → suppression, max 10)
- CONTEXT.md a 130L (sous le budget 150L, bien en-dessous du garde-fou 200L)
- Protocole session-end ordonne (8 sections dans un ordre fixe)

**Faiblesses :**

| Finding | Detail | Impact |
|---------|--------|--------|
| Pas de verification automatique du budget taille | session-end dit "si > 200L warning" mais aucun script ne le verifie | Depend de la discipline Claude, pas automatise |
| Pas de check "sessions recentes > 5" automatise | Idem, verification manuelle | Risque de bloat lent |

**Recommandations :**
1. Optionnel : ajouter un check `wc -l CONTEXT.md` dans health-check (info level, pas bloquant)
2. Optionnel : check nombre de sessions dans CONTEXT.md

---

### Axe 10 — Specification

**Ce qui marche bien :**
- Les 4 specs sont completes, structurees, et lisibles
- communication.md est un modele (324L, 9 sections, table de migration, budgets, lifecycle)
- Chaque spec a une section "Limites" explicite (ce que le module ne fait PAS)
- cortex.md est concis et actionnable (103L, routing table + regles)
- tools.md documente l'inventaire ET les drops (outils rejetes avec justification)

**Faiblesses :**

| Finding | Fichier:ligne | Impact |
|---------|--------------|--------|
| monitor.md baselines stale | `monitor.md:79-83` | cf. Axe 8 |
| cortex.md section 6 (cockpit) est un renvoi | `cortex.md:92-103` renvoie a la spec cockpit sans details | OK si la spec cockpit est a jour, mais cree une dependance |
| architecture-core.md pas mis a jour apres rename + cockpit + DS | lignes 9, 19, 52 | Schema des couches desynchronise |
| Pas de spec pour le Design System dans docs/core/ | DS a sa spec dans `docs/design-system.md` hors de `docs/core/` | Inconsistance : le DS est un module actif mais pas un pilier Core OS |

**Recommandations :**
1. Mettre a jour architecture-core.md (rename + cockpit + DS)
2. Mettre a jour baselines monitor.md
3. Clarifier : le DS est un module (comme app) ou un pilier Core OS ? Si module, c'est normal qu'il n'ait pas de spec dans docs/core/

---

### Axe 11 — Documentation et notices

**Ce qui marche bien :**
- Manifeste exhaustif (287L, 15 sections) — lecture honnete et auto-critique
- Manifeste section 13 documente les tensions/dette connues — transparence rare
- CLAUDE.md est compact et actionnable (structure + regles + routing)
- docs/core/ est la source de verite pour les specs — pas de duplication
- setup-guide.md existe pour l'onboarding

**Faiblesses :**

| Finding | Fichier:ligne | Impact |
|---------|--------------|--------|
| index.md last updated 2026-04-07 | `index.md:4` | 3 jours de retard, versions stale (React 18→19, Vite 5→8), cockpit manquant, 4→5 commands |
| manifeste.md section 5 versions stale | `manifeste.md:83` React 18, Vite 5, Tailwind 3, build ~830ms, bundle 457KB | Tout a change post-upgrade |
| manifeste.md section 6 snapshot 2026-04-07 | `manifeste.md:109` "snapshot a la date de generation" mais pas refreshed | Valeurs obsoletes |
| manifeste.md section 4.2 dit "193 lignes" agents | `manifeste.md:72` | Peut avoir change post-harmonisation |
| manifeste.md section 3 dit "Cycle 3 en cours" | `manifeste.md:43` | Cycle 3 est clos (24/24 done) |
| architecture.md non verifiee | Potentiellement stale aussi | A verifier |

**Recommandations :**
1. Mettre a jour index.md (versions, cockpit, counts)
2. Mettre a jour manifeste.md sections 3, 5, 6 (versions, cycle 3 clos, metriques)
3. Definir quand les docs sont refreshed : index.md et manifeste.md ne sont dans aucun protocole session-end

---

### Axe 12 — Resilience au compactage (bonus)

**Ce qui marche bien :**
- CLAUDE.md impose le decoupage en sessions courtes
- CONTEXT.md < 150L = lisible en 1 lecture, pas besoin de contexte cumule
- Regle "sauvegarder avant compactage, reverifier apres" documentee
- Le brief session-start reconstruit le contexte complet a partir de CONTEXT.md seul

**Faiblesses :**

| Finding | Detail | Impact |
|---------|--------|--------|
| Pas de mecanisme de snapshot pre-compactage | La regle existe dans CLAUDE.md mais aucun outil ne l'automatise | Depend de la discipline Claude |
| Un audit long (comme celui-ci) risque le compactage | 11+ axes = beaucoup de contexte | Mitigation : ecrire le livrable au fur et a mesure |

**Recommandations :**
1. Optionnel : script de snapshot CONTEXT.md avant compactage
2. Pour les audits longs : ecrire dans un fichier au fur et a mesure (pattern utilise ici)

---

### Axe 13 — Onboarding d'un nouveau module (bonus)

**Ce qui marche bien :**
- module-scaffold.sh existe, est idempotent, supporte --help
- CONTEXT.md table Modules est simple a comprendre
- Le workflow est documente dans tools.md

**Faiblesses :**

| Finding | Detail | Impact |
|---------|--------|--------|
| module-scaffold ne met pas a jour les scripts de monitoring | Nouveau module invisible pour health-check et sync-check | Faux vert |
| module-scaffold ne met pas a jour CLAUDE.md | Un nouveau module n'apparait pas dans le routing Cortex | Pas de routing automatique |
| Pas de checklist "nouveau module" documentee | Il faut savoir qu'il faut modifier health-check, sync-check, monitor.md, CLAUDE.md | Fragile, depend de la memoire |

**Recommandations :**
1. Ajouter dans module-scaffold.sh un output "Checklist post-scaffold" listant les fichiers a mettre a jour
2. Ou mieux : decouverte dynamique des modules dans les scripts (elimine le probleme)

---

### Axe 14 — Scalabilite des agents (bonus)

**Ce qui marche bien :**
- Protocole uniforme (entree/execution/sortie) = facile d'ajouter un agent
- Chaque agent a "hors scope" avec delegation nommee = pas de confusion
- Routing table Cortex est simple (signal → agent)
- Max 3 agents paralleles documente = garde-fou realiste

**Faiblesses :**

| Finding | Detail | Impact |
|---------|--------|--------|
| sync-check EXPECTED_AGENTS est statique | `sync-check.sh:109` hardcode 4 noms | Ajouter un agent = modifier sync-check |
| Routing table est dans CLAUDE.md ET cortex.md | Deux endroits a maintenir | Risque de divergence |
| Cockpit a sa propre copie de la routing table | `cockpit.md:43-49` | 3e copie de la meme table |

**Recommandations :**
1. Decouverte dynamique des agents dans sync-check (`ls .claude/agents/*.md`)
2. Routing table : source unique dans cortex.md, CLAUDE.md et cockpit.md pointent vers cortex.md avec un "voir cortex.md section 1"

---

## Plan d'action par priorite

### P0 — Bug actif (a fixer maintenant)

| # | Action | Fichier |
|---|--------|---------|
| P0-1 | sync-check.sh : renommer "memory" en "communication" dans EXPECTED_SPECS | `scripts/sync-check.sh:130` |

### P1 — Coherence critique (a fixer cette session)

| # | Action | Fichiers |
|---|--------|----------|
| P1-1 | Rename Memory→Communication dans architecture-core.md | `docs/core/architecture-core.md:9,19` |
| P1-2 | Rename Memory→Communication dans tools.md | `docs/core/tools.md:81` |
| P1-3 | Rename Memory→Communication dans CLAUDE.md | `CLAUDE.md:91` |
| P1-4 | Rename Memory→Communication dans decisions-log.md | `docs/decisions-log.md:27` |
| P1-5 | Mettre a jour index.md (versions React 19/Vite 8/Tailwind 4, ajouter cockpit, counts) | `docs/index.md` |
| P1-6 | Mettre a jour baselines monitor.md (JS 244KB, build 178ms, 2 modules actifs) | `docs/core/monitor.md:79-83` |
| P1-7 | health-check : ajouter build + test Design System | `scripts/health-check.sh` |

### P2 — Ameliorations importantes (prochaine session)

| # | Action | Fichiers |
|---|--------|----------|
| P2-1 | Ajouter cockpit dans sync-check EXPECTED_COMMANDS | `scripts/sync-check.sh:110` |
| P2-2 | Retirer section PERSISTANCE du template session-end.md | `.claude/commands/session-end.md:148-152` |
| P2-3 | Decouverte dynamique modules dans health-check (boucle sur modules/*/package.json) | `scripts/health-check.sh` |
| P2-4 | Decouverte dynamique agents/commands dans sync-check | `scripts/sync-check.sh:109-110` |
| P2-5 | Mettre a jour manifeste.md (versions, cycle 3 clos, metriques) | `docs/manifeste.md` |
| P2-6 | Mettre a jour architecture-core.md (ajouter cockpit, corriger schema couches) | `docs/core/architecture-core.md` |
| P2-7 | Retirer seuils de CONTEXT.md (source unique = monitor.md) | `CONTEXT.md:95` |
| P2-8 | Ajouter paragraphe auto-memory dans communication.md | `docs/core/communication.md` |

### P3 — Nice-to-have (backlog)

| # | Action | Fichiers |
|---|--------|----------|
| P3-1 | Routing table : source unique cortex.md, pointeurs dans CLAUDE.md et cockpit.md | `CLAUDE.md`, `cockpit.md`, `cortex.md` |
| P3-2 | Check CONTEXT.md taille dans health-check (info level) | `scripts/health-check.sh` |
| P3-3 | Checklist post-scaffold dans module-scaffold.sh | `scripts/module-scaffold.sh` |
| P3-4 | Clarifier relation doc-agent ↔ session-end (qui update CONTEXT.md ?) | `doc-agent.md`, `session-end.md` |
| P3-5 | Nettoyer routes demo Phase1Demo + crud-test | `modules/app/src/App.tsx` |
| P3-6 | Rendre settings.json portable (paths relatifs ou variables) | `.claude/settings.json` |

---

## Metriques de l'audit

- **Fichiers lus** : 22 (4 specs + 4 agents + 5 commands + 6 scripts + settings.json + CONTEXT.md + manifeste + index + architecture)
- **Findings totaux** : 34
- **Bugs actifs** : 1 (sync-check attend memory.md)
- **Refs stale** : 12+ (rename Memory non propage)
- **Versions obsoletes** : 6 (manifeste + index + monitor baselines)
- **Axes audites** : 14 (11 demandes + 3 bonus)
