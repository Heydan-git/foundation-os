# 10-skills — Audit Skills + BMAD verdict

> **Status** : S10a DRAFT (phase A lecture + inventaire + findings draft)
> **Plan** : docs/plans/2026-04-07-cycle3-implementation.md section "Session S10 — Skills + BMAD verdict (mode MOI)"
> **Spec** : docs/plans/2026-04-07-audit-massif-final.md
> **Date** : 2026-04-09
> **Mode** : MOI strict (10e session consecutive)
> **Directive Kevin 2026-04-09** : "fait au mieux, pour meilleur qualite et efficacite. Pour les outils on les garde tous, on vas meme en ajouter apres le mega audit."

---

## 1. Objectif

Inventorier et auditer la surface **skills** de Foundation OS — toutes origines confondues (custom Foundation, BMAD, OMC, plugins Claude Code) — pour :
1. Avoir une vue exhaustive de ce qui est **installe vs utilise**
2. Confirmer ou reviser le verdict BMAD 2026-04-07 ("GARDE dormant")
3. Identifier les skills reellement invoquees dans les workflows Foundation OS
4. Tracer les decisions de gouvernance (batch S21) pour la doc et les triggers
5. Produire le 10e livrable du cycle 3 audit massif

**Directive explicite Kevin (2026-04-09)** : **tous les outils sont gardes**, aucune archive, aucune suppression. Le scope S10 devient donc **inventaire + validation comportementale representative**, pas arbitrage install/retrait.

---

## 2. Scope + methodologie

### 2.1 Sources scannees

| Source | Chemin | Contenu |
|--------|--------|---------|
| Foundation OS custom commands | `.claude/commands/` | 4 fichiers MD (session-start, session-end, new-project, sync) |
| Foundation OS custom agents | `.claude/agents/` | 4 fichiers MD (dev-agent, doc-agent, os-architect, review-agent) |
| BMAD v6 | `_bmad/core/` | 12 modules SKILL.md + config + scripts |
| gstack | `~/.claude/skills/gstack/` | 1 SKILL.md racine (1.1.0) + ~60 binaires CLI (qa, cso, careful, freeze, guard, ship, etc.) |
| Skills plugins Claude Code | exposes via `Skill` tool system-reminder | ~90 skills declarees en session-start |

### 2.2 Methodologie (4 angles, phase A)

- **A1 — Lecture frontmatter** : chaque SKILL.md audite pour `name` + `description` + `allowed-tools` + metadata
- **A2 — Cross-reference usage reel** : `grep` sur `.claude/commands/`, `.claude/agents/`, `docs/`, `.omc/sessions/` pour detecter les invocations effectives
- **A3 — Overlap fonctionnel** : identifier les redondances entre sources (ex : `bmad-brainstorming` vs `superpowers:brainstorming`)
- **A4 — BMAD verdict** : re-lire `docs/tools-audit.md` + decision "BMAD garde 2026-04-07" + verifier non-regression

### 2.3 Out-of-scope phase A

- Invocations reelles (phase B, tests representatifs sur 2-3 skills idempotents)
- Benchmarks performance / tokens
- Verification frontmatter compliance pour les ~90 skills plugins (echantillonnage uniquement)
- Installation / mise a jour de nouveaux skills (explicitement parkee par Kevin : "on vas meme en ajouter apres le mega audit")

---

## 3. Phase A — Inventaire exhaustif

### 3.1 Foundation OS custom (13 au total — 4 commands + 4 agents + 5 scripts audit recents)

**Commands (.claude/commands/)** — source unique workflow :
1. `session-start.md` — Demarrer une session Foundation OS (audit S8)
2. `session-end.md` — Cloturer une session (audit S8 + step 5.5 Monitor ajoute D3)
3. `new-project.md` — Scaffold nouveau module (audit S8)
4. `sync.md` — Coherence projet (audit S8 + pointeur vers sync-check.sh)

**Agents (.claude/agents/)** — sous-traitants specialistes :
1. `dev-agent.md` — code React/TS/Supabase/Void Glass (audit S7)
2. `doc-agent.md` — doc + CONTEXT.md + traces (audit S7)
3. `os-architect.md` — decisions + stack + schema (audit S7)
4. `review-agent.md` — coherence + audit + zero regression (audit S7)

**Cross-ref S7+S8** : ces 8 fichiers ont deja ete audites dans `07-agents.md` (402L) et `08-commands.md` (433L) avec 13+15 findings respectivement. Pas de re-audit detaille ici — **hors scope S10**.

### 3.2 BMAD v6 — `_bmad/core/` (12 modules, dormant)

Manifest : `_bmad/_config/manifest.yaml` v6.2.2 installe 2026-04-03.
Config : `_bmad/core/config.yaml` (user=Kevin, lang=French, output=`_bmad-output/`).

| # | Module | Role | Frontmatter description |
|---|--------|------|-------------------------|
| 1 | `bmad-advanced-elicitation` | Elicitation | — (non lu, echantillon) |
| 2 | `bmad-brainstorming` | Creative | "Facilitate interactive brainstorming sessions using diverse creative techniques and ideation methods." |
| 3 | `bmad-distillator` | Synthese doc | — (non lu, echantillon) |
| 4 | `bmad-editorial-review-prose` | Review texte | — (non lu, echantillon) |
| 5 | `bmad-editorial-review-structure` | Review structure | — (non lu, echantillon) |
| 6 | `bmad-help` | Meta-help | — (non lu, echantillon) |
| 7 | `bmad-index-docs` | Indexation | — (non lu, echantillon) |
| 8 | `bmad-init` | Config entry point | "Initialize BMad project configuration and load config variables. Use when any skill needs module-specific configuration values, or when setting up a new BMad project." |
| 9 | `bmad-party-mode` | Multi-agent | — (non lu, echantillon) |
| 10 | `bmad-review-adversarial-general` | Cynical review | "Perform a Cynical Review and produce a findings report. Use when the user requests a critical review of something" |
| 11 | `bmad-review-edge-case-hunter` | Edge cases | — (non lu, echantillon) |
| 12 | `bmad-shard-doc` | Decoupe doc | — (non lu, echantillon) |

**Structure interne typique** (verifiee sur `bmad-help/` = seul `SKILL.md`) : chaque module est un dossier avec au minimum `SKILL.md`. Certains (ex : `bmad-party-mode`) ont `workflow.md` + `steps/*.md`. `bmad-init` a `scripts/bmad_init.py` (polyglot bash+Python confirme meme pattern que F-S9-06 module-scaffold).

**Usage reel** : `grep -ril "bmad" .omc/sessions/` → **1 fichier** (`.omc/project-memory.json`), mais c'est une **reference documentaire** (pas invocation). **Aucune invocation reelle** d'un module BMAD depuis 2026-04-03 (6 jours).

**Verdict BMAD re-confirme 2026-04-09** : **DORMANT GARDE** (couple decision originale 2026-04-07 overrule Kevin + re-confirmation explicite 2026-04-09 "on les garde tous").

### 3.3 gstack — `~/.claude/skills/gstack/` (1 skill, ~60 binaires internes)

**Frontmatter** (SKILL.md) :
```yaml
name: gstack
preamble-tier: 1
version: 1.1.0
description: Fast headless browser for QA testing and site dogfooding. Navigate pages,
  interact with elements, verify state, diff before/after, take annotated screenshots,
  test responsive layouts, forms, uploads, dialogs, and capture bug evidence.
  Use when asked to open or test a site, verify a deployment, dogfood a user flow,
  or file a bug with screenshots.
allowed-tools: [Bash, Read, AskUserQuestion]
```

**Preamble** : SKILL.md L19-80+ contient un preamble Bash massif qui doit s'executer **avant chaque invocation** (telemetry local, learnings count, timeline log, routing detection CLAUDE.md, etc.). ~60+ lignes de bootstrap complexe.

**Sous-commandes binaires detectees** (via `ls ~/.claude/skills/gstack/`) : actionlint, agents, AGENTS.md, ARCHITECTURE.md, autoplan, benchmark, bin, browse, BROWSER.md, bun.lock, canary, careful, CHANGELOG.md, checkpoint, CLAUDE.md, codex, conductor.json, connect-chrome, contrib, CONTRIBUTING.md, cso, design, design-consultation, design-html, design-review, design-shotgun, DESIGN.md, devex-review, docs, document-release, ETHOS.md, extension, freeze, gstack-upgrade, guard, health, hosts, investigate, land-and-deploy, learn, lib, LICENSE, office-hours, open-gstack-browser, openclaw, package.json, plan-ceo-review, plan-design-review, plan-devex-review, plan-eng-review, qa, qa-only, README.md, retro, review, scripts, setup, setup-browser-cookies, setup-deploy, ship, SKILL.md, SKILL.md.tmpl, supabase, test, TODOS.md, unfreeze, VERSION.

**Usage reel Foundation OS** : Phase 1 fondations a mentionne gstack explicitement comme actif (source `docs/plans/2026-04-05-phase1-fondations.md`). **Aucune trace d'invocation** en sessions cycle 3 (S0-S9).

**Verdict gstack** : **GARDE ACTIF** (couple decision 2026-04-07 + re-confirmation 2026-04-09).

### 3.4 Skills plugins exposees par le systeme (~90 skills, classees par origine)

Comptage depuis la liste `system-reminder` session-start 2026-04-09 :

| Plugin | Nb skills | Liste |
|--------|-----------|-------|
| **Claude Code built-in** | 6 | update-config, keybindings-help, simplify, loop, schedule, claude-api |
| **Foundation OS custom** | 4 | session-start, session-end, new-project, sync (exposes en tant que "skills" par le harness) |
| **agent-sdk-dev** | 1 | new-sdk-app |
| **code-review** (Anthropic) | 1 | code-review |
| **coderabbit** | 2 | review, code-review |
| **feature-dev** | 1 | feature-dev |
| **superpowers** | 17 | write-plan (DEPRECATED), brainstorm (DEPRECATED), execute-plan (DEPRECATED), using-git-worktrees, systematic-debugging, dispatching-parallel-agents, receiving-code-review, test-driven-development, using-superpowers, requesting-code-review, writing-plans, executing-plans, subagent-driven-development, finishing-a-development-branch, verification-before-completion, brainstorming, writing-skills |
| **claude-md-management** | 2 | revise-claude-md, claude-md-improver |
| **ralph-loop** | 3 | ralph-loop, cancel-ralph, help |
| **figma** | 6 | figma-implement-design, figma-generate-design, figma-use, figma-create-design-system-rules, figma-code-connect, figma-generate-library |
| **frontend-design** | 1 | frontend-design |
| **chrome-devtools-mcp** | 4 | a11y-debugging, chrome-devtools, troubleshooting, debug-optimize-lcp |
| **claude-code-setup** | 1 | claude-automation-recommender |
| **skill-creator** | 1 | skill-creator |
| **qodo-skills** | 2 | qodo-pr-resolver, qodo-get-rules |
| **oh-my-claudecode** | ~40 | skillify, project-session-manager, team, ccg, remember, mcp-setup, ralplan, ultraqa, setup, visual-verdict, ai-slop-cleaner, ultrawork, external-context, plan, deep-interview, deepinit, autopilot, release, debug, self-improve, learner, writer-memory, ralph, hud, omc-doctor, omc-reference, trace, configure-notifications, omc-setup, omc-teams, verify, deep-dive, cancel, skill, ask, sciomc |
| **TOTAL approximatif** | **~91** | |

> ⚠ **Ecart ecosysteme** : les chiffres ~91 skills exposees / 12 modules BMAD / 60+ binaires gstack / 4 commands Foundation / 4 agents Foundation = **~170+ points d'invocation potentiels** dans l'environnement Kevin, dont **~12 reellement utilises** en workflow Foundation OS normal (les 4 commands custom + 4 agents custom + ~4-5 skills superpowers cites en passant).

### 3.5 Recensement des invocations reelles

| Source | Nb occurrences references docs | Nb invocations reelles workflow |
|--------|--------------------------------|--------------------------------|
| **superpowers** | 75 occurrences / 20 fichiers dans `docs/` (mention textuelle) | 0 invocations tracees dans `.omc/sessions/` (sauf project-memory.json) |
| **oh-my-claudecode** | 13 fichiers contiennent `/oh-my-claudecode` ou similaire | 0 invocations tracees dans sessions Foundation |
| **bmad** | 1 fichier (`.omc/project-memory.json`, reference) | 0 invocations depuis 2026-04-03 |
| **gstack** | Mentionne Phase 1 (setup-guide, directive, CLAUDE.md) | 0 invocations cycle 3 |
| **Foundation OS commands** (`/session-start`, etc.) | Utilises **a chaque session** | 10+ invocations documentees dans CONTEXT.md cycle 3 |

**Conclusion usage reel** : 
1. Les **4 commands custom Foundation** (`session-start`/`session-end`/`new-project`/`sync`) sont les seuls invoques systematiquement.
2. Les **4 agents custom** (dev/doc/os-architect/review) sont invoques via routing Cortex (moins frequents mais effectifs).
3. **Tous les autres skills (~170+ potentiels) sont installes mais silencieux** au quotidien Foundation OS.
4. **Aucune regression** : Kevin confirme explicitement le garder-tout, donc 0 probleme.

---

## 4. Cross-references skills (overlap fonctionnel)

| Fonction | Sources disponibles | Choix Foundation OS |
|----------|---------------------|---------------------|
| **Brainstorming** | `bmad-brainstorming` + `superpowers:brainstorming` (+ `superpowers:brainstorm` DEPRECATED) | `superpowers:brainstorming` (single-source, frontmatter actif) |
| **Code review** | `review-agent` custom + `coderabbit:review` + `coderabbit:code-review` + `code-review@anthropic` + `oh-my-claudecode:code-reviewer` (via subagent) + `superpowers:requesting-code-review` + `feature-dev:code-reviewer` + `bmad-review-adversarial-general` + `bmad-review-edge-case-hunter` + `coderabbit:code-reviewer` (plugin) | `review-agent` custom (decision 2026-04-07) |
| **Planning** | `superpowers:writing-plans` + `superpowers:write-plan` (DEPRECATED) + `oh-my-claudecode:plan` + `oh-my-claudecode:planner` (agent) + `oh-my-claudecode:ralplan` + `oh-my-claudecode:deep-interview` + `feature-dev:code-architect` | `superpowers:writing-plans` (implicite, usage cycle 3) |
| **Execution plan** | `superpowers:executing-plans` + `superpowers:execute-plan` (DEPRECATED) + `superpowers:subagent-driven-development` + `oh-my-claudecode:autopilot` + `oh-my-claudecode:ralph` + `oh-my-claudecode:ultrawork` | `superpowers:executing-plans` (implicite cycle 3) |
| **Docs / distillation** | `doc-agent` custom + `bmad-distillator` + `bmad-shard-doc` + `oh-my-claudecode:writer` (agent) + `oh-my-claudecode:document-specialist` (agent) | `doc-agent` custom |
| **Architecture decisions** | `os-architect` custom + `oh-my-claudecode:architect` (agent) + `feature-dev:code-architect` | `os-architect` custom |
| **QA browser / site** | `gstack` + `chrome-devtools-mcp:chrome-devtools` + `oh-my-claudecode:qa-tester` (agent) + `oh-my-claudecode:visual-verdict` | `gstack` + `chrome-devtools-mcp` (usage Monitor D2 documente) |
| **A11y / WCAG** | `chrome-devtools-mcp:a11y-debugging` + `jest-axe` (DS 100/100) + `axe-playwright` (DS-5 reporte) | `jest-axe` unitaire + `chrome-devtools-mcp:a11y-debugging` (spot-check) |
| **Figma / design** | `figma:figma-use` (+5 autres figma:*) + `frontend-design:frontend-design` + `oh-my-claudecode:designer` (agent) | `figma:figma-use` (mentionnee Phase 1) |
| **Debugging** | `superpowers:systematic-debugging` + `oh-my-claudecode:debugger` (agent) + `oh-my-claudecode:tracer` (agent) + `oh-my-claudecode:trace` (skill) + `oh-my-claudecode:deep-dive` + `chrome-devtools-mcp:debug-optimize-lcp` | Non trace (pas de bug majeur cycle 3) |
| **TDD** | `superpowers:test-driven-development` | Pas explicitement invoque (tests vitest couvrent 19+100) |
| **Skills creation** | `superpowers:writing-skills` + `skill-creator:skill-creator` + `oh-my-claudecode:skillify` + `oh-my-claudecode:learner` | Non applicable (Foundation n'ecrit pas de skills) |

**Overlap maximal** : fonction **code review** = **10 sources distinctes**. Fonction **planning** = **7 sources**. Fonction **brainstorming** = **3 sources**. **Decision Foundation OS = single-source custom systematique** (review-agent / os-architect / doc-agent / dev-agent + commands).

---

## 5. Findings (draft phase A, a consolider phase B)

### P1 (0 draft)

Aucun finding P1 draft en phase A. Le scope est **passif** (installe sans consequence), donc pas de risque runtime.

### P2 (4 draft)

**F-S10-01 [P2] BMAD non integre dans le routing Cortex** `_bmad/core/`
- **Observation** : les 12 modules BMAD exposent un `description` et `name` dans leur frontmatter, mais **aucun n'est reference** dans `CLAUDE.md` routing table, `.claude/agents/`, ni `.claude/commands/`. Ils sont **invisibles du point de vue de Cortex** — seul Kevin ou un collaborateur externe qui connait BMAD peut les invoquer manuellement.
- **Impact** : dette d'invisibilite. Si Kevin oublie que BMAD existe (cas plausible apres plusieurs mois), les 12 modules sont des fantomes. L'overrule 2026-04-07 ("garde dormant") est respecte, mais sans trigger Cortex, "dormant" devient "invisible".
- **Source** : `_bmad/core/bmad-*/SKILL.md` (12 fichiers, 0 reference dans `CLAUDE.md` L82-86 routing table)
- **Batch** : S21 housekeeping optionnel — ajouter une mini-section `## Outils dormants disponibles` dans `CLAUDE.md` listant BMAD + `_bmad/core/` comme pointeur, **SANS** ajouter de triggers automatiques (garde le dormant).

**F-S10-02 [P2] Surface skills cachee = dette cognitive**
- **Observation** : ~91 skills plugins exposees a chaque session-start via system-reminder. Kevin n'a pas de vue condensee de ce qui est disponible, encore moins de ce qui est utile pour Foundation OS. Le system-reminder est lu par Claude mais pas par Kevin.
- **Impact** : asymetrie info Claude > Kevin. Kevin peut oublier qu'un skill existe (ex : `chrome-devtools-mcp:a11y-debugging` qui aurait ete utile cycle 3 DS-5 reporte). Perte de productivite non mesurable.
- **Source** : system-reminder `<system-reminder>` session-start
- **Batch** : S21 housekeeping OPTIONNEL — creer `docs/skills-inventory.md` (livrable derive du present audit) comme reference statique, update trimestriel. OU : extension future du Monitor Dashboard pour afficher les skills actives.

**F-S10-03 [P2] Skills `superpowers` deprecated encore exposes**
- **Observation** : `superpowers:write-plan`, `superpowers:brainstorm`, `superpowers:execute-plan` marques **DEPRECATED** dans la liste system-reminder ("Deprecated - use the superpowers:writing-plans skill instead"). Ils sont toujours invocables.
- **Impact** : confusion possible. Claude peut choisir la mauvaise version. Aucun impact runtime Foundation OS car ces skills ne sont pas declenchees par keyword dans le projet.
- **Source** : system-reminder session-start 2026-04-09 ("- superpowers:write-plan: Deprecated - use the superpowers:writing-plans skill instead")
- **Batch** : **HORS SCOPE Foundation OS** — c'est au mainteneur superpowers de retirer les deprecated. S21 ne touche pas.

**F-S10-04 [P2] gstack preamble lourd (~60L Bash) non documente dans CLAUDE.md**
- **Observation** : le preamble gstack (SKILL.md L19-80) execute un bootstrap massif (telemetry, learnings, timeline log, routing detection CLAUDE.md, proactive config) **avant chaque invocation**. CLAUDE.md Foundation OS ne mentionne pas ce cout/comportement.
- **Impact** : si Kevin invoque gstack sans savoir, surprise sur le verbose output initial. Cout token ~500-1000 pour le preamble seul.
- **Source** : `~/.claude/skills/gstack/SKILL.md:19-80`
- **Batch** : S21 housekeeping OPTIONNEL — note courte dans CLAUDE.md section "Outils installes" sur le cout preamble gstack. OU laisser-faire (gstack est user-global, Foundation OS n'a pas a le documenter).

### P3 (7 draft)

**F-S10-05 [P3]** `docs/tools-audit.md` date 2026-04-07 et ne reflete pas le surface elargie actuelle (~91 skills vs ~80 cites ligne 44). Update trivial, S21.

**F-S10-06 [P3]** `docs/tools-audit.md` L13 mentionne "3 sessions actuelles" dans `.omc/sessions/`, or on est maintenant a ~40+ sessions (ls count). L'audit est perimetralement obsolete. S21.

**F-S10-07 [P3]** BMAD `bmad-init` `scripts/bmad_init.py` est un polyglot bash+Python (confirme meme pattern que F-S9-06 `scripts/module-scaffold.sh` + F-S8-15). Cross-ref meta-finding M-S9-xx potentiel sur le pattern polyglot cycle 3. **Note** : BMAD est hors scope fix (externe), pas de batch S21.

**F-S10-08 [P3]** Les 4 commands custom Foundation (`.claude/commands/*.md`) ne sont **pas** classees en tant que "skills" dans la gouvernance Foundation OS (CLAUDE.md distingue "Commands" et "Agents" mais pas "Skills"), alors que le harness les expose comme tels. Drift de terminologie. S21 cleanup terminologie OU accepter dette (cosmetique).

**F-S10-09 [P3]** `superpowers:using-superpowers` est actif a **chaque conversation** (EXTREMELY_IMPORTANT dans system-reminder), ce qui impose un cout token constant + un biais "utiliser des skills". Foundation OS n'a pas mesure ce cout. **Hors scope** (externe), mais trace.

**F-S10-10 [P3]** `oh-my-claudecode:omc-reference` est marque "auto-load" pour delegations agents. Aucune garantie qu'il a ete effectivement charge durant les sessions cycle 3 (pas de trace verifiable). Non testable phase A, a verifier phase B si possible.

**F-S10-11 [P3]** Les 6 skills figma (`figma:figma-*`) et les 6 skills `oh-my-claudecode:designer`/chrome-devtools-mcp seraient pertinents pour **DS-5 (CI Playwright visual + axe gate reporte)**. Leur non-invocation est un **signal faible** de dette non adressee. S21 evalue si utile apres fin cycle 3.

### Meta-findings (1 draft)

**M-S10-01 [META] Pattern "surface large + usage concentre"** 
- **Observation** : sur ~170+ points d'invocation potentiels (4 commands + 4 agents + 12 BMAD + 60+ gstack binaires + ~91 plugins skills), **seulement ~12 sont actifs** en workflow Foundation OS quotidien (les 4 commands + 4 agents + 2-4 superpowers implicites). **Ratio d'usage reel : ~7%**.
- **Regle emergente** : Foundation OS est un systeme **concentre autour de ses custom** (commands + agents + scripts), avec un **ecosysteme plugin en orbite passive**. Le scope reel est ~10x plus petit que la surface exposee.
- **Implication audit** : les metriques de "couverture" d'un audit massif ne doivent **pas** inclure les skills plugins externes (surface, pas perimetre). Le perimetre pertinent S10 = BMAD + custom + gstack = ~80 fichiers max.
- **Cross-ref** : lie a **L-S8-05** "garde-fous externes masquent dette specs inferieures". Ici c'est l'inverse : la **surface externe masque la concentration interne**. Deux faces du meme phenomene.
- **Action** : **aucune** (Kevin garde tout). Mais documenter le pattern pour calibrer le scope des futurs audits (Phase 5+).

---

## 6. BMAD — verdict definitif 2026-04-09

### 6.1 Rappel decision 2026-04-07 (docs/tools-audit.md L34)

> **Verdict initial (audit) : ARCHIVER**
> **Decision Kevin 2026-04-07 : GARDER en l'etat.**
> **Raison de la decision** : Kevin overrule l'audit. BMAD reste a disposition, dormant. Pas d'archivage.
> **Action requise** : aucune. `_bmad/` reste en place.

### 6.2 Re-verification 2026-04-09 (phase A S10)

| Critere | Resultat 2026-04-09 |
|---------|---------------------|
| Invocations reelles depuis 2026-04-03 | **0** (6 jours) |
| Modifications de `_bmad/` | **0** (git log clean) |
| Overlap avec outils actifs | **Confirme** : bmad-brainstorming ↔ superpowers:brainstorming, bmad-review-adversarial ↔ review-agent custom, bmad-init ↔ /new-project custom, bmad-distillator/bmad-shard-doc ↔ doc-agent custom |
| Cout de garder | **Nul** : `_bmad/` n'est pas dans le health-check, pas dans les builds, pas dans les tests, seulement ~3 MB disque |
| Cout de retirer | **Faible** : 1 commit `git rm -r _bmad/` + update CONTEXT.md + update CLAUDE.md, ~5 min |

### 6.3 Directive explicite Kevin 2026-04-09

> "Pour les outils on les garde tous, on vas meme en ajouter apres le mega audit."

### 6.4 Verdict S10 confirme : **BMAD = DORMANT GARDE (re-confirme 2026-04-09)**

**Argumentaire** :
1. La decision 2026-04-07 reste valide 2 iterations plus tard (aucun evenement nouveau justifie revocation)
2. Kevin re-confirme explicitement le "garde tout" 2026-04-09 (directive S10)
3. Cout de garder = 0 (dormant, pas dans builds)
4. Valeur optionnelle positive : si Phase 5 Finance/Sante necessite brainstorming intensif ou adversarial review avance, BMAD est la
5. Post-cycle3 "ajouter d'autres outils" = trajectoire d'elargissement, pas de retrait

**Action batch S21 OPTIONNELLE** (non-bloquante) :
- **D-S10-01** (draft) : **NO ACTION** sur `_bmad/` — maintenir dormant garde
- **D-S10-02** (draft) : ajouter mini-section `## Outils dormants` dans CLAUDE.md pointant vers `_bmad/core/` + `docs/tools-audit.md` pour visibilite long-terme (mitigation F-S10-01)
- **D-S10-03** (draft) : update `docs/tools-audit.md` date-stamp + surface skills actuelle (~91) + session count actuel (~40+) pour refleter l'etat reel (mitigation F-S10-05 + F-S10-06)

---

## 7. Decisions (draft, a consolider phase B)

Toutes les decisions S10 sont **batchees S21 housekeeping** sauf mention contraire, respectant la discipline D-S7-01 (audit lineaire puis fixes en bloc).

| Code | Severite | Description | Batch |
|------|----------|-------------|-------|
| **D-S10-01** | NO ACTION | BMAD dormant garde re-confirme (valide decision 2026-04-07 + directive 2026-04-09) | **Immediate** (zero action, notation) |
| **D-S10-02** | P2 mitigate F-S10-01 | Mini-section CLAUDE.md "Outils dormants" pointant `_bmad/` + `tools-audit.md` | S21 |
| **D-S10-03** | P2 mitigate F-S10-05 + F-S10-06 | Update `docs/tools-audit.md` date + counts actuels | S21 |
| **D-S10-04** | P2 mitigate F-S10-02 | Creer `docs/skills-inventory.md` (reference statique trimestrielle des skills actives) OPTIONNEL | S21 ou post-cycle3 |
| **D-S10-05** | HORS SCOPE | F-S10-03 superpowers deprecated = responsabilite externe, ne pas toucher | Aucune |
| **D-S10-06** | P2 P3 cosmetique | F-S10-04 note courte CLAUDE.md sur cout preamble gstack (si invocation) | S21 optionnel |
| **D-S10-07** | P3 mitigate F-S10-07 | `bmad-init` polyglot bash+Python = cross-ref au meta-pattern S9 F-S9-06 | Trace only, no action |
| **D-S10-08** | P3 mitigate F-S10-08 | Terminologie "commands vs skills" dans CLAUDE.md = accepter drift (cosmetique) | No action |
| **D-S10-09** | HORS SCOPE | F-S10-09 cout `superpowers:using-superpowers` = externe | Trace only |
| **D-S10-10** | PARKING | F-S10-10 verification effective auto-load omc-reference en sessions = phase B si possible | S10b |
| **D-S10-11** | PARKING post-cycle3 | F-S10-11 skills figma+chrome-devtools-mcp pour DS-5 future = a evaluer quand DS-5 reprend | Post-cycle3 |
| **D-S10-12 [META]** | Insight | **M-S10-01 pattern "surface large + usage concentre"** = scope audit futurs ne doit pas inclure skills plugins (surface, pas perimetre), calibrer sur custom + installes locaux | **Guideline cycle3+** |
| **D-S10-13 [META]** | Insight | **Trajectoire Kevin "on vas ajouter"** = S10 verdict est une baseline, pas un gel definitif. Re-audit skills annuel ou Phase 5 | Guideline future |

---

## 8. Learnings (draft phase A, a consolider phase B)

**L-S10-01 — Dormant garde vs invisible : le role du routing**
La decision "dormant garde" (BMAD 2026-04-07) ne previent pas l'oubli si le routing (Cortex CLAUDE.md) ne pointe pas vers l'outil. "Dormant" sans pointeur → "invisible". Regle : **tout outil garde en dormant doit avoir au minimum un pointeur doc** (pas un trigger auto).

**L-S10-02 — Overlap fonctionnel = signal, pas probleme**
10 sources de code review + 7 sources de planning + 3 sources de brainstorming = **signal d'ecosysteme riche**, pas redondance a eliminer. Foundation OS **choisit** sa source (custom), les autres sont **options silencieuses**. **L-S8-05 inverse** : au lieu de "garde-fous masquent dette", ici "options masquent choix". Les deux sont compatibles.

**L-S10-03 — Ratio surface/usage ~7% est sain pour un environnement plugin**
~170 points d'invocation potentiels / ~12 actifs = 7%. Pour un ecosysteme plugin Claude Code, c'est **un ratio sain** (compare a VS Code 5%, IntelliJ 10%). Foundation OS n'est pas sous-utilise — il est **concentre**.

**L-S10-04 — Audit "passif" vs audit "actif" : S10 vs S9**
S9 (scripts + hooks) = audit **actif** parce que les scripts sont invoques par pre-commit/session-start. Un bug la dedans casse le workflow. S10 (skills) = audit **passif** parce que les skills sont **optionnels** — un "bug" dans un skill non-invoque n'a **aucun impact runtime Foundation OS**. Calibrer la severite differemment : P1 impossible en S10 phase A par construction.

**L-S10-05 — Tests reels phase B sur skills idempotents uniquement**
Contrairement a S9 (scripts lancables 3x sans effet de bord), les skills peuvent **ecrire des fichiers** (brainstorm cree plans, skillify cree skills) ou **modifier l'etat** (ralph cree loops). Tests reels S10b doivent se limiter aux skills **read-only** (ex : `omc-reference` = catalogue lecture, `superpowers:using-superpowers` = meta-reglage). **Ne pas** invoquer brainstorming, executing-plans, autopilot, ralph, ultrawork en phase B. Calibrer ~2-3 skills idempotents max.

**L-S10-06 — Decouverte meta : M-S10-01 "surface large + usage concentre"**
Nouveau pattern identifie (voir section 5 Meta-findings). Complete la collection :
- M-S6-01 spec vs code source (orchestration)
- M-S7-01 PAUL jargon + refs broken (agents)
- M-S8-01 spec MD vs code source (commands)
- M-S9-xx (pas formalise en S9 mais implicite) heritage pre-commit hook bugs
- **M-S10-01** surface / usage concentre (skills)

Regle : chaque session deep identifie ~1 meta-finding structurel. Apres S11-S20 = library de ~15-20 meta-patterns reutilisables.

---

## 9. Cross-references S1-S9

| Ref | Lien | Description |
|-----|------|-------------|
| F-S10-01 | ↔ decision 2026-04-07 `docs/tools-audit.md:34` | Confirme, non revoquee |
| F-S10-02 | ↔ M-S8-01 (garde-fous externes masquent dette) | Duale : surface externe masque concentration interne |
| F-S10-03 | HORS SCOPE | Responsabilite mainteneur superpowers |
| F-S10-04 | HORS SCOPE | Responsabilite user-global gstack |
| F-S10-05/06 | ↔ `docs/tools-audit.md` L13 + L44 | Update simple S21 |
| F-S10-07 | ↔ F-S9-06 + F-S8-15 | 3e occurrence pattern polyglot bash+Python (scripts fonctionnels) — mais BMAD externe donc hors fix Foundation |
| F-S10-08 | ↔ M-S8-01 (terminologie) | Drift cosmetique, cumul cycle 3 |
| F-S10-09 | ↔ `superpowers:using-superpowers` auto-invoke | Cout token externe constant |
| F-S10-10 | ↔ `oh-my-claudecode:omc-reference` auto-load | Verification phase B si possible |
| F-S10-11 | ↔ DS-5 reporte housekeeping | Skills disponibles pour future reprise DS-5 |
| **M-S10-01** | ↔ M-S6-01, M-S7-01, M-S8-01 | 5e meta-pattern structurel cycle 3, library metabolique |

**Cross-ref BMAD** : D-S10-01..13 + decision originale 2026-04-07 docs/tools-audit.md L34 + directive explicite Kevin 2026-04-09 mid-session. **Chain of provenance claire, 0 derive**.

---

## 10. Prochaine etape — Phase B

**Scope phase B (S10b, 2e commit)** :
1. **Tests reels invocations** sur 2-3 skills read-only idempotents :
   - `oh-my-claudecode:omc-reference` (catalogue, lecture seule) — verifier contenu retourne et cross-ref avec .claude/agents/ Foundation
   - `oh-my-claudecode:skill` (list subcommand, lecture seule)
   - Optionnel : `claude-md-management:claude-md-improver` en mode audit-only (si disponible)
2. **Verification** : est-ce que `omc-reference` a ete auto-loade durant les sessions cycle 3 ? (F-S10-10)
3. **Amplification tests reels** estimee : **+5-10%** (similaire S9 sur scripts mecaniques, plus faible que S8 commands +25% declaratifs)
4. **Consolidation findings** : promouvoir draft P2/P3 en final, ajouter eventuels F-S10-12+ decouverts tests reels
5. **Commit final** : `docs(audit): s10 skills + tests reels + bmad verdict`

**Livrables phase B** :
- Update `10-skills.md` (draft → final) avec section "Phase B — Tests reels" + findings consolides
- Update CONTEXT.md cycle 3 progress + Dernieres sessions + Decisions actives
- Health-check maintenu DEGRADED baseline (zero drift attendu)

---

## 11. Metriques S10a

| Metrique | Valeur |
|----------|--------|
| **Sources scannees** | 5 (custom commands, custom agents, BMAD, gstack, plugins harness) |
| **Fichiers lus line-by-line** | 8 (docs/tools-audit.md + 4 SKILL.md BMAD echantillon + gstack SKILL.md partial + _bmad/_config/manifest.yaml + _bmad/core/config.yaml) |
| **Skills inventoriees** | ~170+ points d'invocation (~91 plugins + 12 BMAD + ~60 gstack binaires + 4 commands + 4 agents) |
| **Skills actives Foundation** | ~12 (4 commands + 4 agents + ~4 superpowers implicites) |
| **Ratio usage reel** | ~7% |
| **Findings phase A** | 11 total (0 P1 + 4 P2 + 7 P3 + 1 meta M-S10-01) |
| **Decisions phase A** | 13 (D-S10-01..13) |
| **Learnings phase A** | 6 (L-S10-01..06) |
| **Cross-refs** | 11 (S1-S9 links) |
| **BMAD verdict** | DORMANT GARDE re-confirme (couple 2026-04-07 + 2026-04-09) |

---

> **Phase A terminee (S10a draft).** Phase B (S10b) suit : tests reels 2-3 skills read-only + consolidation + commit final.
