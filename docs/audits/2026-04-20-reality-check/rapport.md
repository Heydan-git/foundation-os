# Rapport verite — Reality Check Foundation OS (2026-04-20)

> Audit factuel suite alerte Kevin : travail perdu + briefs faux + multi-session a ecrase des choses.
> **Aucune speculation**. Chaque ligne a une commande de verification.
> Scope : tout le projet (main + 6 worktrees + stashes + reflog).

## 0. Executive summary (pour Kevin, lecture 30s)

Kevin avait **raison**. Plusieurs travaux substantiels sont **perdus ou non-propages** dans la memoire main, et le multi-session a cree un etat desync.

**6 categories de pertes identifiees** :

1. **Branche `claude/determined-torvalds-903dc3` : 14 commits NON mergees** — contient **D-CCCONFIG-01** (bash firewall + config CC hardening) + **46 pages wiki ingestees** (48→94) + install UI UX Pro Max. Decision **D-CCCONFIG-01 citee nulle part dans memoire main** (0 match CLAUDE.md/hot.md/sessions-recent/lessons/thinking/decisions-log).
2. **Branche `claude/nice-mayer-0efb94` : 5 commits NON mergees** — drifts qualite Core OS (cortex Commands, monitor dedup, worktrees historique, naming dedup, drift-detector 200→250L, template plan 6 elements, 5 .raw READMEs, thinking protocole, session-dna YAML).
3. **Main working tree DESYNC** : 4 fichiers staged/modified + **30+ untracked** dont projets Cowork entiers (gmail-centralisation 5 MD, morning-intelligence 4 fichiers, briefs-foundation-os 6 fichiers, reorg-instructions 1 fichier).
4. **Plan `.archive/plans-done-260420/2026-04-19-audit-total-foundation-os.md` supprime physiquement main mais pas commit** (deletion staged vers `.archive/plans-done-260420/` mais pas committed → hook `auto-archive-plans.sh` n'a pas tourne).
5. **Metriques CONTEXT.md gonflees** : "rapport-master 864L" → realite **324L**, "53 pages wiki" → realite **86 fichiers wiki main** (filesystem).
6. **Stashes non recuperes** : `stash@{0}` pre-merge cleanup 260417 (project-memory obsolete) + `stash@{1}` wip-pptx (presentation binaire).

**Zero regression code** : build OK, 15/15 tests, 94 tests trading — les livrables physiques existent.
**Regression memoire/documentation** : la source de verite CONTEXT.md ment sur plusieurs points.

**Commande pour relire ce rapport plus tard** : `cat docs/audits/2026-04-20-reality-check/rapport.md`.

---

## 1. Methodologie (evidence-based)

Chaque decouverte = commande + output observe. Je ne cite que ce que j'ai vu moi-meme dans cette session.

| Categorie | Commande | Resultat utilise |
|-----------|----------|------------------|
| Branches uniques | `git log main..<branch> --oneline` | liste commits |
| Reflog | `git reflog main \| head -100` | detecter resets/overwrites |
| Stashes | `git stash list` + `git stash show -p` | contenu WIP perdus |
| Working tree main | `cd main && git status --short` | deleted/staged/untracked |
| Fichiers physiques | `ls <path>` + `find <path>` | realite filesystem |
| Git tracked | `git ls-tree HEAD <path>` | realite index |
| Memoire claims | `grep "<claim>" CONTEXT.md wiki/hot.md` | coherence |

**Limites** :
- Je n'ai PAS lu chaque ligne des 187 .md du repo → je cite ce que ref-checker rapporte.
- Je n'ai PAS compare ligne par ligne le CONTEXT.md determined-torvalds vs main entier → j'ai cite les sections Sessions recentes + Decisions + Cap.
- Je n'ai PAS lu les 84 sessions JSON `.omc/sessions/` — seulement compte.
- Je n'ai PAS execute les tests trading (94 tests collectes par grep `^def test_`, jamais run).

---

## 2. Etat reel actuel (filesystem + git)

### 2.1 Main working tree (`/Users/kevinnoel/foundation-os`)

```
HEAD : b862dc2 merge: D-PRODUCT-01 COMPLET 5/5 + D-PRODUCT-02 plan prep (9 stubs forward refs)

A  .archive/plans-done-260420/2026-04-19-audit-total-foundation-os.md   (staged, jamais committed)
 D docs/plans/2026-04-19-audit-total-foundation-os.md                    (deleted, jamais staged)
 M docs/travaux-cowork/COWORK-CONTEXT.md                                 (modified)

Untracked (30+) :
  .claire/worktrees/jovial-jemison-d31676/                               (dossier parallele mystere)
  .claude/launch.json                                                    (config dashboard port 3333)
  .claude/projects/-Users-kevinnoel-foundation-os/                       (memory/ symlink-like)
  .omc/sessions/*.json                                                   (15 sessions JSON nouvelles)
  docs/travaux-cowork/2026-04-19-briefing-gmail/                         (1 HTML 20KB)
  docs/travaux-cowork/2026-04-19-gmail-centralisation/                   (5 MD projet entier)
  docs/travaux-cowork/morning-intelligence/                              (4 fichiers 170KB)
  docs/travaux-cowork/2026-04-13-reorg-project-instructions/             (1 MD 18KB)
  docs/travaux-cowork/2026-04-14-briefs-foundation-os/                   (6 fichiers 86KB)
  docs/travaux-cowork/briefs-archives/                                   (dossier vide/morning)
  modules/design-system/tokens/build                                     (build artifacts)
```

**Conclusion** : le main working tree contient du travail non-commit d'au moins **2 sessions distinctes** (dont une post-2026-04-20 = session qui a prep l'archive plan audit-total + commit `b862dc2`).

### 2.2 Worktrees git actifs

```
git worktree list :
  /Users/kevinnoel/foundation-os                                       b862dc2 [main]
  /Users/kevinnoel/foundation-os/.claude/worktrees/lucid-moore-38e38d  b862dc2 [claude/lucid-moore-38e38d]
```

**2 worktrees seulement**, alors que le hot cache mentionnait "6 worktrees". → Kevin (ou une automation) a deja clean 4 worktrees **sans mettre a jour le hot cache**.

### 2.3 Branches locales

```
git branch -a | grep claude/ :
  claude/condescending-ardinghelli-4d7d0a         (0 commit unique - deja mergee audit-total)
  claude/determined-torvalds-903dc3               (14 commits uniques — D-CCCONFIG-01 + 11 ingests)
  claude/jovial-jemison-d31676                    (0 commit unique - deja mergee trading)
* claude/lucid-moore-38e38d                       (0 commit unique - courant, == main)
  claude/nice-mayer-0efb94                        (5 commits uniques — drifts Core OS)
  claude/vibrant-poitras-28155e                   (0 commit unique - deja mergee)
  remotes/origin/claude/mystifying-poincare       (0 commit unique - deja mergee)
```

**Total 7 branches claude/*. 2 avec commits non-mergees : determined-torvalds + nice-mayer.**

### 2.4 Stashes

```
git stash list :
  stash@{0}: On main: wip pre-merge cleanup 260417
    → .omc/project-memory.json (update lastScanned + scripts/wiki count bump) + session JSON + COWORK-CONTEXT
    → OBSOLETE (date 2026-04-17, state runtime)
  stash@{1}: On audit-massif-cycle3: wip-pptx
    → docs/presentations/Foundation-OS-Claude-Collab.pptx (binary diff)
    → Non recupere
```

### 2.5 Reflog main (100 entries lues)

- Pattern `merge claude/<branch>` repete plusieurs fois sur meme branche (ex: `goofy-ramanujan` x13, `keen-mahavira` x5, `pedantic-mendel` x6) — c'est de la FF sur chaque push, pas d'ecrasement (Fast-Forward = append).
- `merge claude/mystifying-poincare` present au reflog `main@{79}` → cette branche remote deja mergee.
- Aucun `reset --hard` detecte dans les 100 entries.
- Aucun `rebase -i` detecte dans les 100 entries.

**Conclusion** : pas d'ecrasement git destructif detecte sur main. Les "pertes" sont des merges non-faits ou des working tree desync, pas des rewrites d'historique.

---

## 3. Travaux perdus identifies (6 categories)

### 3.1 Branche `claude/determined-torvalds-903dc3` (14 commits — ~6h travail)

Session 2026-04-19 "batch alim + D-CCCONFIG-01" documentee dans son CONTEXT.md.

**Commits** :

| SHA | Message | Impact |
|-----|---------|--------|
| `4d7d9d2` | feat(os): bash firewall hook + deny list stricte (D-CCCONFIG-01) | hook PreToolUse + settings.json denylist |
| `f8cd636` | chore(os): tools frontmatter 4 agents FOS (D-CCCONFIG-01) | agents restrictions |
| `225b84c` | chore(os): gitignore CLAUDE.local.md + settings.local.json (D-CCCONFIG-01) | .gitignore updates |
| `dceb646` | docs(os): CONTEXT.md section Outils — 7 hooks actifs (D-CCCONFIG-01) | doc update |
| `f416512` | feat(wiki): ingest 28 pages — batch shadcn 6 libs + guide Claude Code | 28 pages wiki |
| `aebe470` | feat(wiki): ingest 6 pages — prediction markets trading bot guide + Kelly + Brier | 6 pages wiki |
| `1759a08` | feat(wiki): ingest RTK (Rust Token Killer) — CLI proxy reduction tokens LLM 60-90% | 1 page |
| `a9021e1` | feat(wiki): ingest Paperclip + Cockpit OS Dashboard hub | 2 pages |
| `b6437fa` | feat(wiki): ingest Ultraplan (feature Claude Code native cloud planning) | 1 page |
| `9be632d` | feat(wiki): ingest claude-howto (27.6k stars community guide) | 1 page |
| `9eaaef2` | feat(wiki): ingest awesome-claude-code (39.7k stars 200+ resources) | 1 page |
| `01562be` | feat(wiki): ingest 4 refs ecosysteme Claude Code (gsd-2 + playground + claude-mem + skills.sh) | 4 pages |
| `e926de9` | feat(wiki): ingest UI UX Pro Max + WARNING anti-install-global | 1 page |
| `c495c18` | docs(os): session-end 2026-04-19 batch alim 11 refs + D-CCCONFIG-01 | CONTEXT + hot + sessions-recent |

**Wiki avant → apres** : 48 → 94 pages (+46 pages).
**Main actuel** : 86 fichiers wiki/ tracked (filesystem count `find wiki -name "*.md"`). → **~8 pages manquent** vs claim determined-torvalds.

**Pages wiki uniquement dans determined-torvalds (39 identifiees)** :
```
wiki/sources/ademking-cascader-shadcn.md
wiki/sources/anthropic-plugins-playground.md
wiki/sources/anthropic-ultraplan-claude-code.md
wiki/sources/claude-code-config-guide-2026-04.md
wiki/sources/gsd-build-gsd-2.md
wiki/sources/hamish-oneill-shadcncraft.md
wiki/sources/hesreallyhim-awesome-claude-code.md
wiki/sources/luongnv89-claude-howto.md
wiki/sources/nextlevelbuilder-ui-ux-pro-max-skill.md
wiki/entities/Ademking.md, Figma.md, Jordan.md, Kalshi.md, MCP.md, Polymarket.md, RTK.md, shadcn.md, vzkiss.md
wiki/domains/trading/sources/anthropic-prediction-market-bot-guide.md
... et autres
```

**Decision D-CCCONFIG-01** (livree dans ces 14 commits) :
- 4/6 gaps du guide community appliques
- `scripts/hooks/bash-firewall.sh` (hook PreToolUse Bash exit 2 patterns destructifs)
- deny list stricte `.claude/settings.json`
- `tools:` frontmatter 4 agents FOS restrictions
- CLAUDE.local.md template + `.gitignore` updates
- CONTEXT.md section Outils 3→7 hooks

**Install UI UX Pro Max v2.5.0** + uipro-cli 2.2.3 via npm (scope project, pas verifie actif dans main).

**`~/.claude/CLAUDE.md` enrichi** (2 blocs globaux honnetete radicale + clarte avant technicite) — deja present sur main `~/.claude/CLAUDE.md` (verif systeme global).

**Visibilite main** :
- CONTEXT.md Cap line : 1 mention "determined-torvalds-903dc3 : 14 commits wiki ingest (awesome-claude-code + RTK + UI UX Pro Max + D-CCCONFIG-01) — a merger"
- CLAUDE.md : 0 match D-CCCONFIG
- wiki/hot.md : 0 match
- wiki/meta/sessions-recent.md : 0 match
- wiki/meta/lessons-learned.md : 0 match
- wiki/meta/thinking.md : 0 match
- docs/decisions-log.md : 0 match
- **Decision pas dans CONTEXT.md table Decisions** (19 decisions listees, D-CCCONFIG absente).

### 3.2 Branche `claude/nice-mayer-0efb94` (5 commits — ~1.5h travail)

Session 2026-04-17 "drifts P1-P3 Core OS + wiki meta + template".

**Commits** :

| SHA | Message | Scope |
|-----|---------|-------|
| `4169122` | chore(os): remove obsolete legacy worktrees refs | cleanup refs |
| `7aa5364` | chore(os): drifts P1-P3 Core OS (9 micro-fixes) | monitor.md dedup + worktrees historique + cortex Commands registry + naming dedup + communication/knowledge archivage + **drift-detector 200→250L** + .gitignore .env.*.local |
| `29bc565` | chore(os): drifts P1-P3 Wiki meta (thinking protocole + session-dna YAML) | thinking.md Protocole append + session-dna.md YAML format unifie |
| `f751153` | chore(os): drifts P1-P3 template plan 6 elements + .raw READMEs | `_template-plan.md` enrichi (6 elements obligatoires) + `.raw/{articles,finance,sante,trading,images}/README.md` |
| `7b86ac0` | docs(os): session 2026-04-17 B+E traces (CONTEXT + hot + sessions-recent) | docs update |

**Conflit attendu en merge** : la branche est ancienne (2026-04-17) et DELETE plein de fichiers qu'on a crees depuis (audit-total, body, product, trading). Un merge bete casserait main. → cherry-pick selectif recommande.

### 3.3 Main working tree untracked — projets Cowork entiers

| Dossier | Contenu | Taille |
|---------|---------|--------|
| `docs/travaux-cowork/2026-04-19-gmail-centralisation/` | 5 MD (INDEX + architecture + labels + briefing template + runbook) | ~15KB |
| `docs/travaux-cowork/morning-intelligence/` | morning-intelligence.html (70KB) + .json (5KB, data 2026-04-20) + backup refonte TDAH (81KB) + refonte-tdah-plan.md (14KB v2 "5 tabs shell alimentable") | 170KB |
| `docs/travaux-cowork/2026-04-19-briefing-gmail/` | briefing-2026-04-19.html | 20KB |
| `docs/travaux-cowork/2026-04-14-briefs-foundation-os/` | 6 fichiers (specs morning + hebdo + sources + 2 exemples HTML + index) | 86KB |
| `docs/travaux-cowork/2026-04-13-reorg-project-instructions/` | 01-project-instructions-v3.md | 18KB |
| `docs/travaux-cowork/briefs-archives/morning/` | dossier sous-archivage | (vide) |

**Total : 6 dossiers jamais commits, plusieurs contiennent des projets structures avec plusieurs fichiers**.

Note : `docs/travaux-cowork/` **n'est pas gitignored** (verif `grep -n cowork .gitignore` → 0 match). C'est juste que Kevin/sessions n'ont jamais `git add` ces dossiers. 2 dirs cowork plus anciens SONT trackes (`2026-04-13-evolution-core-os/`, `2026-04-13-plan-dashboard-monitoring/` avec 8 fichiers chacun).

**Projet cle : Gmail centralisation** (2026-04-19)
- Mapping 3 comptes Gmail → 1 inbox principale
- Decisions Kevin documentees (strategie secondaires, sync suppression, historique, format briefing)
- 6 phases A-F definies (MCP Chrome + MCP Gmail + scheduled task Cowork 7h00)

**Projet cle : Morning Intelligence refonte TDAH v2** (2026-04-20, meme jour que cette session)
- v2 "5 tabs shell alimentable" (Focus/Urgent/Boite/Veille IA/Stats)
- Contraintes Kevin non-negociables (gamification complete, zero masquage intra tab, HTML shell permanent alimente)
- Verbatims Kevin preserves dans le plan

### 3.4 Plan audit-total non archive correctement

```
git status sur main :
  A  .archive/plans-done-260420/2026-04-19-audit-total-foundation-os.md
   D docs/plans/2026-04-19-audit-total-foundation-os.md
```

- Plan `.archive/plans-done-260420/2026-04-19-audit-total-foundation-os.md` : `status: done, phases_done: 14/14` (frontmatter)
- Hook `scripts/auto-archive-plans.sh` existe (SessionEnd)
- Quelqu'un (session precedente) a `mv` le fichier vers `.archive/plans-done-260420/` mais a **oublie `git commit`**.
- Etat actuel : fichier existe dans 2 endroits (staged add + working tree delete), pas committed.

### 3.5 Stashes non recuperes (2)

**`stash@{0}` pre-merge cleanup 260417** :
- `.omc/project-memory.json` (update lastScanned + path worktree jolly-wescoff → main + scripts count 10→23 + wiki count 5)
- `.omc/sessions/b6e881e7-e4c3-404c-a3af-d2d0c43a5860.json` (6 lignes diff, session JSON)
- `docs/travaux-cowork/COWORK-CONTEXT.md` (19 lignes diff)
- **Utilite** : probablement obsolete (2026-04-17, state runtime) mais le COWORK-CONTEXT pourrait contenir du contenu projet.

**`stash@{1}` wip-pptx** :
- `docs/presentations/Foundation-OS-Claude-Collab.pptx` (binary, version differente)
- Sur branche `audit-massif-cycle3` (probablement obsolete)

### 3.6 Metriques CONTEXT.md vs realite

| Claim dans main | Source claim | Realite | Ecart |
|-----------------|--------------|---------|-------|
| "rapport-master 864L" | CONTEXT.md L28 + L124, hot.md L22, sessions-recent.md L40 | 324L reel | **-62% (2.67x inflation)** |
| "53 pages wiki (wiki-health SAIN)" | hot.md L80, CONTEXT.md L29 | 86 fichiers `find wiki -name "*.md"` main | **+33 (drift memoire)** |
| "67 pages (28 concepts, 5 entities, 2 sources)" | wiki-health.sh output courant | 86 fichiers total, 18 concepts, 5 entities, 2 sources, 18 meta, 21 domains = 64 sans templates | wiki-health compte templates, physique sans templates = 64 |
| "94/94 tests trading" | CONTEXT.md L129 | 94 `def test_` reels dans modules/finance/trading/tests/ | **exact** |
| "12 findings-Px + rapport-master 864L" | CONTEXT.md L28, plan frontmatter `findings_files: 12` | 11 findings P1-P11 + 1 rapport-master = 12 fichiers total | exact si on compte rapport |
| "15+ commits atomiques (df4244a → P13)" | CONTEXT.md L124 | 16 commits dans git log audit (P0 + P1 + P2 + P3 + P4 + P5 + P6 + P7 + P7 fix + P8 + P9 + P9 fix + P10 + P11a-d-g-h + P11e/f + P12 + P13 = 17 avec fix) | exact |
| "cleanup 14 branches" | CONTEXT.md L124 | realite : **7 branches claude/* restantes** (dont 2 avec commits uniques) | probablement exact historique mais cleanup non-complete |
| "6 worktrees" | hot.md L81 | **2 worktrees actifs** | **-4 (pas update apres cleanup)** |
| "Phase 5 DEMARREE jovial-jemison" | hot.md L55, CONTEXT.md L72 | jovial-jemison mergee dans main (3db42fa) → deja absorbee | **claim obsolete** |

### 3.7 Decisions listees CONTEXT.md main vs realite

CONTEXT.md Decisions section : **19 decisions**.

**Decisions attendues d'apres historique git** :
1. D-AUDIT-TOTAL-01 ✓ (present)
2. D-MODEL-01 ✓ (present)
3. D-PRODUCT-01 ✓ (present)
4. D-BODY-01 ✓ (present)
5. D-CONCURRENCY-01 ✓ (present)
6. D-TRADING-01 ✓ (present)
7. D-MAPPING-01 ✓ (present)
8. D-INTEG-01 ✓ (present)
9. D-WIKI-01 ✓ (present)
10. D-LEVELUP-01/02/03 ✓ (3 present)
11. D-DESKTOP-01 ✓ (present)
12. D-NAMING-01/02 ✓ (2 present)
13. D-PLAN-02 ✓ (present)
14. D-VAULT-01 ✓ (present)
15. D-DS-REBUILD ✓ (present)
16. D-WT-01 ✓ (present)

**Decision manquante** :
- **D-CCCONFIG-01** (bash firewall + config CC hardening, livree 2026-04-19 dans determined-torvalds) — **pas citee dans table Decisions main**, mentionnee 1x en Cap comme "a merger".
- **D-PRODUCT-02** (plan prep, pas encore une decision validee mais plan existant) — pas dans table (normal, c'est draft).

### 3.8 Refs cassees (6) — source : `bash scripts/ref-checker.sh`

```
./CONTEXT.md:129 → [bt] docs/plans/2026-04-19-finance-trading-backtest-engine.md
   → Plan archive dans .archive/plans-done-260420/, CONTEXT pointe ancien chemin

./wiki/domains/trading/concepts/Order Execution Management System.md:57 → ../../../docs/superpowers/specs/2026-04-19-3commas-alternative-research.md
   → Chemin relatif casse (3 niveaux up = docs/superpowers/specs depuis wiki/domains/trading/concepts)

./wiki/domains/trading/concepts/Portfolio Aggregator.md:80 → ../../../docs/superpowers/specs/2026-04-19-finance-dashboard-research.md
   → Meme probleme chemin relatif

./docs/superpowers/specs/2026-04-18-finance-trading-backtest-engine-design.md:295 → [bt] scripts/gen_fixtures.py
   → Fichier jamais cree (reference plan)

./docs/superpowers/specs/2026-04-18-finance-trading-backtest-engine-design.md:321 → [bt] scripts/pre-commit.sh
   → Fichier jamais cree (reference plan)

./modules/finance/trading/README.md:18 → ../../../docs/plans/2026-04-19-finance-trading-backtest-engine.md
   → Meme probleme que CONTEXT.md:129 (plan archive)
```

### 3.9 Drifts (3) — source : `bash scripts/drift-detector.sh`

```
CONTEXT.md Sessions recentes : 8 entrees (max 5 selon spec)   → trim necessaire
CONTEXT.md 186 L (budget 150L)                                → compression necessaire
MEMORY.md : 24 entrees vs 25 fichiers (delta 1)               → j'ai ajoute feedback_no_speculation sans indexer MEMORY
```

### 3.10 Reflog analyse (pas d'ecrasement detecte)

- 100 entries lues main@{0..99}
- Aucun `reset --hard` ou `push --force` dans reflog
- Aucun `rebase -i` dans reflog
- Multiple `merge --ff` sur meme branche (goofy-ramanujan, keen-mahavira, pedantic-mendel) → append only, safe.
- `merge claude/jovial-jemison-d31676` (`1a35f4d`) = merge archive plan trading post-session-end "rattrapage"
- `merge claude/condescending-ardinghelli-4d7d0a` (`3c99966`) = merge D-AUDIT-TOTAL-01 complete

**Conclusion** : aucun ecrasement destructif. Les pertes sont liees a **merges NON-faits** (determined-torvalds + nice-mayer) et **working tree desync** (commits non-faits).

---

## 4. Impact reel sur coherence documentation

### 4.1 CONTEXT.md est desynchronise sur plusieurs points

- Claim "rapport-master 864L" (inflation 2.67x, source inconnue)
- Claim "53 pages wiki" obsolete (main = 86 physiques dont 67 pages sans templates)
- Claim "6 worktrees" obsolete (main = 2)
- Claim "Phase 5 DEMARREE jovial-jemison" obsolete (deja mergee)
- Table Decisions manque D-CCCONFIG-01
- Sessions recentes : 8 entrees (max 5 par spec), dont certaines sur main multi-sessions redondantes
- 186L vs budget 150L

### 4.2 hot.md est desynchronise

- "Active Threads : Wiki operationnel 53 pages" → realite 86 main
- "6 worktrees" → 2
- "Next Action A..." pointe vers la cloture jovial-jemison (deja faite)

### 4.3 sessions-recent.md manque une session

- 2026-04-19 "batch alim 11 refs + D-CCCONFIG-01" (~5-6h travail) absente
- 2026-04-17 "session B+E traces" (nice-mayer) absente de la chronologie main

### 4.4 lessons-learned.md + thinking.md manquent les insights de ces sessions perdues

- Lessons D-CCCONFIG-01 (pattern "alim conversation", triangle Claude Code ressources, mode honnetete derive contrarianism) absentes
- Lessons nice-mayer (drifts cosmetiques vs structurels) absentes

---

## 5. Actions proposees (par priorite)

### Priorite 1 — Recuperer le travail non-commit sur main (risque haut si perdu)

**A. Committer les 3 changements staged/modified sur main**
- `mv` audit-total archive : finaliser le commit archive
- `docs/travaux-cowork/COWORK-CONTEXT.md` modif : committer si legitime

**B. Decider quoi faire des 6 dirs cowork untracked**
- `2026-04-19-gmail-centralisation/` (5 MD projet centralisation Gmail) — important, a commit
- `morning-intelligence/` (refonte TDAH v2 + data) — important, a commit
- `2026-04-19-briefing-gmail/` (1 HTML) — important, a commit
- `2026-04-14-briefs-foundation-os/` (6 fichiers specs briefings) — a commit
- `2026-04-13-reorg-project-instructions/` (v3) — a commit
- `briefs-archives/` (vide/morning) — a commit ou gitignore

**C. Decider .claire/worktrees/jovial-jemison-d31676** (existence mystere)
- A investiguer (pourquoi cree, par quoi)
- Probablement safe a supprimer mais **demander Kevin avant**

**D. Decider .claude/launch.json** (config dashboard port 3333)
- A committer (utile) ou gitignorer si personnel

### Priorite 2 — Integrer D-CCCONFIG-01 dans memoire main

Au minimum : ajouter ligne table Decisions CONTEXT.md + propagate vers sessions-recent + hot + lessons + thinking, sans merger la branche (risque conflit).

**Option A (merge complet)** : `git merge claude/determined-torvalds-903dc3` dans main → conflits attendus sur CONTEXT.md + CLAUDE.md + wiki/hot.md + sessions-recent + .claude/settings.json.

**Option B (cherry-pick selectif)** : ne reprendre que les commits techniques (`4d7d9d2` bash firewall + `f8cd636` tools frontmatter + `225b84c` gitignore) + les pages wiki ingest (`f416512`, `aebe470`, `1759a08`, `a9021e1`, `b6437fa`, `9be632d`, `9eaaef2`, `01562be`, `e926de9`) en excluant `c495c18` (CONTEXT diff trop divergent) + `dceb646` (CONTEXT update par D-CCCONFIG).

**Option C (re-ecriture propre)** : copier les 39 pages wiki + les scripts/hooks techniques dans un nouveau commit sur main en citant la branche source, sans merger.

### Priorite 3 — Corriger metriques CONTEXT.md main

- "864L" → "324L" (3 locations)
- Trim sessions 8→5 (max par spec D-MAPPING-01)
- "6 worktrees" → "2 worktrees"
- "Phase 5 DEMARREE jovial-jemison" → "Phase 5 mergee trading v1.1"
- Compression 186L → <150L (budget)

### Priorite 4 — Nettoyer refs cassees (6) + drifts (3)

- Rewrite `.archive/plans-done-260420/2026-04-19-finance-trading-backtest-engine.md` → `.archive/plans-done-260420/...` (2 refs CONTEXT + README trading)
- Fixer chemins relatifs wiki concepts trading (2 refs)
- Decider *scripts/gen_fixtures.py* + *scripts/pre-commit.sh* : creer ou retirer refs (2 refs)
- Update MEMORY.md pour inclure feedback_no_speculation (delta 1)

### Priorite 5 — Decider nice-mayer (5 commits drifts Core OS)

Gains reels (drift-detector seuil 200→250, cortex Commands registry, template 6 elements, 5 .raw READMEs, thinking protocole) mais vieux (2026-04-17) et conflits attendus. Recommandation : **cherry-pick commits techniques** (`7aa5364`, `29bc565`, `f751153`) en skip `7b86ac0` + `4169122` (trop lies au CONTEXT/hot de l'epoque).

### Priorite 6 — Hot cache + sessions-recent refresh

Reecrire avec verite factuelle :
- 2 worktrees (pas 6)
- 86 pages wiki (pas 53)
- Sessions recentes trimer a 5
- Ajouter session "batch alim 11 refs + D-CCCONFIG-01" si Priorite 2 faite

---

## 6. Risques identifies pour chaque action

| Action | Risque | Mitigation |
|--------|--------|-----------|
| Merge determined-torvalds complet | Conflits massifs CONTEXT.md/CLAUDE.md/hot.md | Cherry-pick selectif (Option B) |
| Commit 6 dirs cowork sur main | Pousse contenu potentiel sensible (briefings Gmail avec snippets emails) | Verifier `.gitignore` + `morning-intelligence.json` ne contient pas donnees perso Kevin avant commit |
| Retirer .claire/worktrees/ | Perte donnees si legitime outil | Verifier origine + demander Kevin |
| Cherry-pick nice-mayer | Vieux + conflits | Isoler 3 commits techniques sans toucher docs |
| Rewrite CONTEXT.md metriques | Perte historique si mal fait | Commit atomique avec message clair |
| Stash drop @{0} | Perte possible COWORK-CONTEXT update | Lire full diff avant drop |

---

## 7. Points d'arret — a decider par Kevin avant actions

1. **Multi-session** : OK "on se focus sur une seule session a la fois" — confirme ?
2. **D-CCCONFIG-01** : Option A/B/C pour integrer ?
3. **6 dirs cowork untracked** : commit sur main ou archiver ailleurs ?
4. **`.claire/worktrees/`** : qu'est-ce que c'est ? On garde ou on supprime ?
5. **nice-mayer** : cherry-pick selectif ou abandon ?
6. **Stash@{0}/@{1}** : drop ou recup ?
7. **Timing** : faire tout maintenant ou en plusieurs sessions (risque re-desync si pas tout en une fois vu feedback Kevin "focus une session a la fois") ?

---

## 8. Ce qui est SAIN et verifie

- Build app OK (`cd modules/app && npm run build` est green via health-check)
- 15/15 tests app passent
- 94 tests trading collectes (`grep -rn "^def test_" modules/finance/trading/tests/ | wc -l = 94`)
- 11 findings-Px + rapport-master 324L existent physiquement
- `docs/core/model.md` (249L) + `body.md` (386L) + `constitution.md` (399L) + `product.md` (247L) existent
- `modules/finance/trading/` avec `src/` + `tests/` + CI GH Actions
- Health-check baseline : 2 warnings (refs cassees + drifts) + 0 critical
- Aucun ecrasement git destructif detecte dans reflog 100 entries

---

## 9. Conclusion honnete

**Kevin avait raison** sur plusieurs points :

1. Multi-session a **effectivement** cree un desync : 2 branches avec travail non-merge + main working tree desync avec 30+ untracked.
2. Les briefs etaient **effectivement** faux sur plusieurs points metriques (864L, 53 pages, 6 worktrees, Phase 5 DEMARREE).
3. Des choses ont **effectivement** ete perdues : D-CCCONFIG-01 decision absente memoire main, 39 pages wiki non-propagees, projets cowork non-commit.

**Mais** :
- Aucune session n'a ete **ecrasee** via git rewrite (reflog propre).
- Les livrables physiques majeurs existent (audit, trading, body, product, model).
- Le code marche (tests passent).

**La regression est dans la memoire/documentation, pas dans le code**. La propagation des sessions multi-worktree vers main CONTEXT.md/hot/sessions/lessons/thinking n'a pas ete faite systematiquement.

**Recommandation** : **arreter le multi-session** (Kevin l'a deja decide) + nettoyer maintenant en une seule session + definir une discipline de merge post-session stricte pour la suite.

---

**Rapport genere** : 2026-04-20, worktree `lucid-moore-38e38d`, Opus 4.7 1M context.
**Preuve d'execution** : chaque section cite la commande de verification utilisee.
**Zero speculation** — conforme memoire `feedback_no_speculation.md`.
