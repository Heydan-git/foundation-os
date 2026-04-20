---
type: source
title: "claude-howto par luongnv89 — Master Claude Code in a Weekend"
source_type: repo
author: "luongnv89 (maintainer) + 13 contributors (incluant Copilot SWE Agent integration)"
date_published: 2026-04-19
url: "https://github.com/luongnv89/claude-howto"
confidence: high
fos_compat: high
effort_estime: S (ref) / M (pilot selectif workflows)
decision: stocker-ref-piocher-patterns-au-besoin
key_claims:
  - "27.6k stars, 3.4k forks, #1 trending GitHub — adoption community massive"
  - "MIT license, free to use/modify/distribute"
  - "Derniere update 16 avril 2026, compat Claude Code v2.1.112"
  - "10 sections numerotees : slash-commands / memory / skills / subagents / mcp / hooks / plugins / checkpoints / advanced / cli"
  - "Formats multi : Markdown docs + Python scripts test infra + Shell hook examples"
  - "Multi-lingue : vi (vietnamien), zh (chinois), uk (ukrainien) + anglais base"
  - "Differentiation vs docs Anthropic : combination workflows (pas single-feature isolation)"
  - "Templates copy-paste ready pour chaque feature"
  - "Visuels Mermaid expliquant mecaniques internes"
  - "Self-assessment quiz `/self-assessment` pour identifier gaps"
  - "EPUB offline-reading capability"
  - "11-13 heures parcours complet, immediate value en 15 minutes"
  - "Structure repo : CLAUDE.md + CONTRIBUTING.md + 10 folders numerotes + docs/prompts/resources/scripts/slides + vi/zh/uk translations"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - repo
  - claude-code
  - tutorial
  - community
  - reference
  - workflows
  - mit
status: mature
related:
  - "[[index-sources]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[claude-code-config-guide-2026-04]]"
  - "[[Foundation OS]]"
sources: []
---

# claude-howto par luongnv89 — Master Claude Code in a Weekend

## Summary

**Guide communautaire pedagogique et de reference** pour Claude Code, positioning "Master Claude Code in a Weekend". 27.6k stars GitHub, **#1 trending**, MIT license, maintenu actif (v2.1.112 compat, update 16 avril 2026). 13 contributors, multi-lingue (vi/zh/uk).

**10 sections numerotees** couvrant toutes les features Claude Code avec une approche **"combination workflows"** — pas isolation feature-by-feature comme docs officielles, mais **integration patterns** (slash-commands + memory + subagents + hooks combines).

**Complementaire** au [[claude-code-config-guide-2026-04]] deja ingere (qui est plus structurel/theorique). claude-howto est plus **workflow-concret + templates copy-paste**.

## Key Claims

### Stats & status
- **Stars** : 27.6k+
- **Forks** : 3.4k+
- **Watchers** : 122
- **Contributors** : 13 (inclut Copilot SWE Agent)
- **Compat** : Claude Code v2.1.112
- **Derniere update** : 16 avril 2026
- **Releases** : 6 versions majeures sync avec Claude Code releases
- **Status** : actively maintained, #1 trending GitHub

### Contenu (10 sections numerotees)

| Dossier | Couverture |
|---|---|
| `01-slash-commands` | User-invoked shortcuts et keyboard commands |
| `02-memory` | Mecanismes context persistants cross-sessions |
| `03-skills` | Reusable auto-invoked capabilities avec scripts |
| `04-subagents` | Specialized AI assistants avec isolated contexts |
| `05-mcp` | Model Context Protocol external tool integration |
| `06-hooks` | Event-driven automation et shell commands |
| `07-plugins` | Bundled feature collections et workflows |
| `08-checkpoints` | Session snapshots et rewind functionality |
| `09-advanced-features` | Planning mode, extended thinking, background tasks |
| `10-cli` | Command-line interface reference et usage |

### Workflow examples documentes
- Automated code review (slash commands + subagents + memory + MCP)
- Team onboarding (memory + plugins)
- CI/CD automation (CLI + hooks)
- Documentation generation (skills delegation)

### Technical patterns
- Event-triggered automation (25+ hook events, 4 categories)
- Agent orchestration + delegation strategies
- Multi-server MCP configuration
- Session management + checkpoint recovery

### Structure repo

```
Root : README.md, CLAUDE.md, CONTRIBUTING.md, LICENSE
Numbered folders : 01 a 10 (feature modules)
Support : docs/, prompts/, resources/, scripts/, slides/
Translations : vi/ (vietnamien), zh/ (chinois), uk/ (ukrainien)
Quality : .cspell.json, .markdownlint.json, .pre-commit-config.yaml
Testing : coverage.xml, pytest infra, Bandit security scanning
```

### Langages
- 80% Python (test infra, EPUB generation)
- 17.5% Shell (hook examples, automation)
- 2.5% JavaScript

### Starter pattern immediat (README)
```bash
mkdir -p .claude/commands
cp 01-slash-commands/optimize.md .claude/commands/
# Puis taper : /optimize
```

Self-assessment : `/self-assessment` dans Claude Code pour identifier gaps.

## Entities Mentioned

- **luongnv89** — GitHub user, maintainer principal
- **[[Claude Code]]** — produit documente
- **Copilot SWE Agent** — contributeur (integration bot probable)

## Concepts Introduced

- **Combination workflows** — approche "combiner features" vs "isolation single-feature"
- **Progressive learning roadmap** — 10 sections avec time estimates (11-13h total)
- **Self-assessment learning paths** — quiz personnalise pour identifier gaps
- **Visual Mermaid mechanics** — diagrammes pour expliquer mecaniques internes
- **Production-ready copy-paste templates** — pas snippets basiques, templates reels
- **EPUB offline docs** — pattern de packaging docs pour lecture offline

## Foundation OS Analysis

### Compat OS

**High**. MIT license + Claude Code-native + stack aligne FOS (Markdown + shell + Python scripts) + community mature. **Zero friction** d'adoption comme reference.

### Effort integration

**Scenarios** :

| Scenario | Effort | Pertinence FOS |
|---|---|---|
| A. Reference lecture selective (piocher workflows quand besoin) | S (0-30min par section lue) | ✅ Tres pertinent |
| B. Pilot 1-2 workflows specifiques (ex: automated code review) | M (2-4h par workflow) | ✅ Si Kevin identifie un besoin concret |
| C. Adoption framework complet (11-13h parcours complet) | M-L | ❌ Redundant avec [[claude-code-config-guide-2026-04]] |
| D. Forker + customiser FOS | L+ | ❌ Pas pertinent, reference MIT = utilisable direct |

### Ce qui existe deja dans FOS vs claude-howto

| claude-howto topic | FOS coverage actuel | Gap identifie |
|---|---|---|
| slash-commands | ✅ 7 commands FOS (/cockpit, /plan-os, /wt, etc.) | Workflows combines pourraient etre enrichis |
| memory | ✅ 5 tiers (conversation/CONTEXT.md/auto-memory/docs/wiki) + 25 auto-memories | **Bien couvert** FOS |
| skills | ✅ 10 skills claude-obsidian + Anthropic skills nombreux | Pas de skills custom FOS natives (pas gros gap) |
| subagents | ✅ 4 agents FOS (os-architect, dev-agent, doc-agent, review-agent) avec tools restrictions | Workflow d'orchestration peut-etre enrichi |
| mcp | ✅ MCP connectes (Asana, Notion, Figma, Monday, Gmail) | Pas d'autre MCP custom FOS |
| hooks | ✅ 7 hooks FOS actifs (post D-CCCONFIG-01) | **Bien couvert** post-audit recente |
| plugins | ✅ OMC + claude-obsidian + Superpowers + gstack | Stack plugins mature |
| checkpoints | ❓ A verifier si FOS utilise la feature native Claude Code checkpoints | Peut-etre gap mineur |
| advanced features (planning, extended thinking, background tasks) | ❓ Utilises partiellement | Gap partiel, specifiquement background tasks |
| cli reference | ✅ Claude Code CLI utilise quotidiennement | Pas de gap |

**Gaps identifies** : checkpoints feature native (a verifier) + background tasks + quelques workflows combines specifiques.

### Limites Claude declarees

- **N'ai pas clone** le repo. Analyse basee sur README + fetch GitHub page.
- **N'ai pas lu** les templates reels dans les 10 dossiers. Impossible de juger qualite code/scripts.
- **Training** : je ne connais pas claude-howto par mon training. Tout vient du fetch.
- **Pas verifie** les workflows documentes vs ceux deja couverts par OMC / Superpowers / claude-obsidian plugins FOS.

### Risques / pieges

1. **Solo-ish maintainer** (luongnv89 + 13 contributors majoritairement mineurs). Bus factor moyen. 27.6k stars = social proof fort mais pas garantie long-terme.
2. **Duplication partielle** avec docs Anthropic officielles + guide-community deja ingere. Lecture integrale = cout-benefice discutable si FOS deja bien configure.
3. **Multilingue** : translations vi/zh/uk peuvent etre stale vs anglais base. Si Kevin lit non-anglais, verifier fraicheur traduction.
4. **Templates Python** (80% codebase) : si Kevin copie templates, verifier que dependencies Python ne polluent pas FOS (qui est React/TS).
5. **Copy-paste templates** : risque adoption templates non-adaptees FOS (Void Glass, conventions nommage, hooks-existants). A reviewer avant usage.
6. **Keep up with Claude Code releases** : claude-howto sync v2.1.112. Si Claude Code evolue vite, risque guide lagging.

### Verdict

**Stocker ref, piocher patterns au besoin**.

**Usage recommande** :
- **Quand Kevin code un nouveau workflow FOS** combinant plusieurs features (ex: Phase 5 module avec subagent + hooks + memory) → ouvrir la section correspondante de claude-howto comme reference, piocher pattern, adapter Void Glass
- **Quand Kevin a un doute** sur une feature specifique Claude Code (ex: "comment utiliser checkpoints ?") → consulter section dediee
- **Quand un nouveau dev rejoint** FOS (hypothese) → pointer vers claude-howto comme introduction solide avant specificites FOS

**Ne pas** :
- Copier templates aveuglement (risque pollution FOS stack React/TS avec Python non-aligne)
- Remplacer workflows FOS existants par versions claude-howto (FOS est plus contextualise)
- Parcourir integralement 11-13h (redundant vs existant FOS)

### Questions ouvertes

- Checkpoints Claude Code feature : FOS utilise-t-elle ? Gap reel ou non ?
- Background tasks Claude Code : utile pour FOS workflows longs (ex: health-check batch overnight) ?
- Templates specifiques : y'a-t-il un workflow claude-howto particulierement utile pour Phase 5 FOS (trading bot ? health council ?) ?
- Workflows combines : comparaison qualitative claude-howto vs OMC workflows (autopilot, ralph, ultrawork) — complementaire ou redundant ?

## Raw Source

- Repo : https://github.com/luongnv89/claude-howto
- Structure : root + 10 folders + docs + prompts + resources + scripts + slides + vi/zh/uk translations
- License : MIT
- Maintainer : luongnv89

## Notes

**Reference solide pour enrichir workflows FOS complexes**. Candidate naturel pour consultation opportuniste quand Kevin build un nouveau chantier Claude Code qui combine plusieurs features natives.

**Pattern meta interessant** : les docs officielles Anthropic decrivent les features **isolement**, claude-howto decrit les **combinaisons**. Pattern reutilisable pour documentation FOS elle-meme : chaque feature specifique (docs/core/* modules) est bien documentee mais les **workflows combines** pourraient beneficier d'un meta-doc dedie (ex: "comment utiliser hooks + memory + subagents ensemble" dans FOS).

**Stocke comme reference, pas integration**. Pas de hook, pas de modif CLAUDE.md, pas d'adoption automatique.
