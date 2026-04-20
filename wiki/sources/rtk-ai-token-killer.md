---
type: source
title: "RTK (Rust Token Killer) — CLI proxy reduction tokens LLM 60-90%"
source_type: repo
author: "rtk-ai org (Patrick Szymkowiak founder + Florian Bruniaux + Adrien Eppling)"
date_published: 2026-04-19
url: "https://github.com/rtk-ai/rtk"
site: "https://www.rtk-ai.app"
confidence: high
fos_compat: high
effort_estime: S
decision: go-favorable-after-quick-test
key_claims:
  - "60-90% reduction token consumption LLM sur commandes CLI"
  - "Rust binary single-file, zero runtime dep, <10ms overhead"
  - "100+ commandes supportees : ls/tree/cat/find/grep/git/gh/docker/kubectl/npm/cargo/jest/vitest/pytest etc."
  - "12 AI tools supportes : Claude Code (PreToolUse hook natif), Copilot, Cursor, Gemini CLI, Codex, Windsurf, Cline, Roo Code, OpenCode, OpenClaw, Kilo Code, Google Antigravity"
  - "29.6k stars GitHub, 123 releases, v0.37.1 (18 avril 2026)"
  - "License Apache 2.0 (MIT mentionne dual)"
  - "4 strategies filtering : smart filter / grouping / truncation / deduplication"
  - "Install : brew install rtk OU curl install.sh OU cargo install OU pre-built binaires"
  - "Telemetry opt-in GDPR-compliant, desactivee par defaut, pas de code/args/secrets"
  - "Integration Claude Code via PreToolUse hook (rewrite command to rtk equivalent)"
  - "Team : 3 personnes identifiees avec LinkedIn (Patrick Szymkowiak founder)"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - repo
  - rust
  - cli
  - llm
  - token-optimization
  - claude-code
  - devtools
status: mature
related:
  - "[[index-sources]]"
  - "[[RTK]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[Cockpit OS Dashboard]]"
  - "[[Foundation OS]]"
  - "[[Hot Cache]]"
  - "[[Layered Loading]]"
sources: []
---

# RTK (Rust Token Killer) — CLI proxy reduction tokens LLM 60-90%

## Summary

**RTK = Rust Token Killer**. CLI proxy Rust single-binary qui **reduit la consommation de tokens LLM de 60-90%** en filtrant, groupant, tronquant et dedupliquant l'output des commandes CLI **avant** qu'elles n'atteignent le contexte LLM. Overhead < 10ms. Support 100+ commandes (git, gh, ls, tree, find, grep, npm, cargo, docker, kubectl, jest, pytest, etc.).

**Integration native Claude Code** via PreToolUse hook bash qui rewrite transparemment les commandes en leur equivalent `rtk`. 11 autres AI tools supportes.

**Projet tres mature** : 29.6k stars, 123 releases, Apache 2.0, team identifiee (Patrick Szymkowiak founder + Florian Bruniaux + Adrien Eppling).

## Key Claims

### Performance
- **60-90% reduction tokens** sur commandes courantes
- **<10ms overhead** (Rust binary natif)
- **~80% savings** sur session 30min typique (estimation team)

### Couverture (100+ commandes)
- File ops : `ls`, `tree`, `cat`, `read`, `find`, `grep`, `diff`
- VCS : `git status`, `log`, `diff`, `add`, `commit`, `push`, `pull`
- GitHub CLI : PR/issue listing, workflow runs
- Tests : Jest, Vitest, Playwright, pytest, Go tests, Cargo tests, RSpec, Rake
- Build/Lint : ESLint, TypeScript, Next.js, Prettier, Cargo, Ruff, golangci-lint, Rubocop
- Package : pnpm, pip, bundle, Prisma
- Cloud : AWS CLI (15+ subcommands), Docker, Kubernetes
- Data : JSON, curl, wget, log dedup

### Meta-commandes
- `rtk gain` : analytics token savings avec graphs
- `rtk discover` : identifie opportunites manquees
- `rtk session` : tracking adoption RTK
- `rtk proxy` : raw passthrough avec tracking
- `rtk err` / `rtk test` : error/failure filtering

### Flags globaux
- `-u, --ultra-compact` : ASCII icons, inline format
- `-v, --verbose` : verbosity levels (-v a -vvv)

### 4 strategies filtering
1. **Smart Filtering** : retire noise (comments, whitespace, boilerplate)
2. **Grouping** : agrege items similaires (files par dir, errors par type)
3. **Truncation** : preserve context relevant, elimine redondance
4. **Deduplication** : collapse repeated log lines avec counts

### Exemples concrets

**`ls` standard vs `rtk ls`** :
- Standard : 45 lignes ~800 tokens
- RTK : 12 lignes ~150 tokens → **81% reduction**

**`git push` standard vs `rtk git push`** :
- Standard : ~200 tokens ("Enumerating objects...Delta compression...")
- RTK : ~10 tokens ("ok main") → **95% reduction**

### Integration Claude Code
- **Auto-rewrite Hook** : bash hook intercepte transparemment commandes, rewrite en equivalent rtk avant exec
- **CLAUDE.md Injection** : fallback mode pour environnements sans bash hook (Windows native)
- **Tee Mode** : saves full unfiltered output on failure pour LLM review sans re-exec

### Installation
- **brew install rtk** (macOS/Linux recommande)
- `curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh`
- `cargo install --git https://github.com/rtk-ai/rtk`
- Pre-built binaires : macOS Intel/ARM, Linux x86/ARM, Windows

### Config
- User config : `~/.config/rtk/config.toml` (macOS : `~/Library/Application Support/rtk/config.toml`)
- Per-command exclusions
- Tee mode control
- Environment variable overrides

## Entities Mentioned

- **[[RTK]]** — produit principal (entity dediee)
- **[[Claude Code]]** — integration principale (PreToolUse hook)
- Patrick Szymkowiak (founder) — GitHub pszymkowiak
- Florian Bruniaux (core contributor)
- Adrien Eppling (core contributor)
- `Homebrew`, `Cargo`, `curl` — install methods
- `Rust` (92.1% codebase), `Bash` (5.8%), `TypeScript` (1.8%)

## Concepts Introduced

- **CLI output compression for LLM contexts** — pattern meta : appliquer filter/group/truncate/dedupe a l'output CLI avant injection LLM
- **Transparent hook-based integration** — bash hook qui rewrite commandes sans modifier l'agent LLM
- **4-strategy filtering model** — filter / group / truncate / dedup comme framework universel de compression
- Lie a [[Hot Cache]] FOS (cache 500 mots) + [[Layered Loading]] FOS (L0-L3) : tous 3 visent la **reduction du context load** mais a des niveaux differents (RTK = output CLI, hot.md = session memory, layered = file loading strategy).

## Foundation OS Analysis

### Compat OS

**High**. Integration native Claude Code via PreToolUse hook bash = **exactement** le pattern FOS actuel ([[Claude Code Configuration Pattern]]). Stack Rust binary = zero dep = safe adoption.

**Considerations FOS-specifiques** :
1. FOS a deja un **PreToolUse Bash hook** (`bash-firewall.sh`, livre D-CCCONFIG-01 il y a ~2h). RTK veut aussi un PreToolUse Bash hook. **Compatibility** : les 2 hooks peuvent coexister (Claude Code execute les hooks en sequence). Mais **ordre matter** : bash-firewall DOIT tourner en premier (block dangereuses commandes), RTK ensuite (compresse sortie safe commandes).
2. FOS `scripts/health-check.sh` + `wiki-health.sh` + `ref-checker.sh` produisent beaucoup d'output → RTK pourrait les compresser. **Potentiel savings real** : estime 50-70% sur les runs health-check typiques.
3. FOS `git status`, `git log`, `git diff` tres frequents en session → RTK compresse fortement ces outputs. **Impact** : moins de pollution context, plus de focus.

### Effort integration

**S** (~30min) :
1. `brew install rtk` (5min)
2. Setup PreToolUse hook RTK dans `.claude/settings.json` apres bash-firewall (5min)
3. Verifier ordre hooks (bash-firewall → rtk) (5min)
4. Test sur 3-4 commandes FOS typiques (git status, npm test, bash scripts/health-check.sh) (10min)
5. Decider adoption full ou partielle selon resultats (5min)

**Risque rollback** : bas (uninstall = `brew uninstall rtk` + retirer hook settings.json).

### Ce qui existe deja dans FOS (pour contexte)

FOS a deja 3 mecanismes de reduction token context :
- **[[Hot Cache]]** (wiki/hot.md) : cache flash 500 mots session-to-session
- **[[Layered Loading]]** (L0-L3) : load context par priorite (docs/core/communication.md section 6.5)
- **[[Pre-compaction Snapshot]]** : snapshot avant compaction pour recovery

**RTK attaque un niveau different** : pas la memoire long terme ni la session, mais **l'output CLI immediat**. Complementaire, pas redondant.

### Limites Claude declarees

- **Fetch** : README GitHub + metadata complete. N'ai **pas** installe ni teste localement. Confidence "high" sur claims (metrics, features, install), "medium" sur **reelle** performance chez Kevin (depend usage patterns).
- **29.6k stars** tres eleve — **chiffre inhabituel pour un outil aussi nouveau** (123 releases suggerent projet 2024-2026). A verifier si pas artificiellement gonfle (mais equipe identifiee + docs complete = signal safe).
- **Training** : je ne connais pas RTK par mon training (outil recent). Tout vient du fetch actuel.

### Risques / pieges

1. **Conflit potentiel avec bash-firewall hook** (livre aujourd'hui D-CCCONFIG-01). Verifier ordre + pas de duplication. Solution : bash-firewall tourne en premier (security), rtk ensuite (compression).
2. **Over-filtering** : si RTK filtre trop agressivement, Claude peut manquer des infos critiques (ex: warning important dans log build). **Tee mode** save full output on failure = mitigation.
3. **Silent corruption** : si RTK a un bug sur une commande rare, output wrong peut leurrer Claude. Pas de verif verbatim possible.
4. **Adoption partial** : Claude Code supporte le hook, mais d'autres contextes FOS (scripts cron, CI/CD) pas couverts. Reduction tokens **session interactive** uniquement.
5. **Telemetry** : opt-in, disabled default — OK, mais a verifier en config pour etre sur.
6. **Licence** : Apache 2.0 (permissive), OK pour adoption FOS sans probleme.
7. **Dep chain** : Rust binary = zero runtime dep, mais **update path** via brew = OK si Kevin installe brew package (pas compile from source).
8. **Fitness au workflow FOS** : Kevin utilise **Claude Opus 4.7 1M context** → pression tokens moindre que context 200k. RTK benefit mesurable mais pas critique.

### Verdict

**Go favorable apres test rapide** (30min).

**Plan suggere** :
1. **Phase test** (aujourd'hui ou demain) :
   - `brew install rtk`
   - Configure hook dans worktree test (pas main)
   - Run 5 commandes FOS typiques (git status, health-check.sh, wiki-health.sh, npm run test, ls wiki/)
   - Mesure reduction tokens reelle via `rtk gain`
2. **Decision apres test** :
   - Si reduction > 40% reelle sur commandes FOS → **adopter full**
   - Si reduction 20-40% → **adopter selectif** (juste git/test/health-check)
   - Si < 20% → **skip** (benefit marginal vs complexite)
3. **Si adopte** : ajouter hook dans `.claude/settings.json` apres bash-firewall + documenter dans `wiki/meta/lessons-learned.md`.

**Valeur immediate pour FOS** :
- Reduction tokens session = **plus de context utile** meme avec Opus 1M
- Moins de tokens bash pollution = **focus Claude** sur tache principale
- Pattern "CLI output compression" reutilisable si FOS cree d'autres hooks custom

### Questions ouvertes

- Performance reelle sur workflow FOS (git, health-check, wiki-health, npm test) : 40%? 60%? 80%?
- Conflit avec bash-firewall : ordre hooks dans settings.json OK ?
- Interaction avec security-reminder.py (PreToolUse Write|Edit|MultiEdit) : pas de bugaboo ?
- `rtk discover` : quelles commandes FOS non-couvertes mais optimisables ?
- Adoption Opus 4.7 1M context vs Sonnet 4.6 200k : RTK benefit plus grand avec context plus petit ?
- Telemetry : reellement opt-out par defaut ? A verifier dans config.toml.
- Alternatives : y'a-t-il d'autres CLI proxies similaires (moins stars mais plus specifiques) ?

## Raw Source

- Repo : https://github.com/rtk-ai/rtk
- Site : https://www.rtk-ai.app
- Guide : https://www.rtk-ai.app/guide
- Supported agents : https://www.rtk-ai.app/guide/getting-started/supported-agents
- Troubleshooting : https://www.rtk-ai.app/guide/troubleshooting

## Notes

**Candidat #1 du batch courant pour adoption FOS**. Effort tres bas (S, 30min test), reward potentiellement eleve (60-90% reduction tokens sur commandes CLI frequentes), risque rollback tres bas (brew uninstall).

**Attention sequence hooks** : si adopte, `bash-firewall.sh` DOIT rester avant RTK (security check > compression). Documenter dans `wiki/concepts/Claude Code Configuration Pattern.md` si adoption.

**Pattern a retenir** : **CLI output compression** = niveau 4eme d'optimisation tokens apres hot cache, layered loading, pre-compaction snapshot. Les 4 se completent dans l'ecosysteme FOS.
