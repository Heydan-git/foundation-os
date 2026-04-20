---
type: source
title: "Claude-Mem — AI note-taking automatique pour sessions Claude Code"
source_type: website
author: "thedotmack (copyright 2025 Claude-Mem)"
date_published: 2026-04-19
url: "https://claude-mem.ai"
github: "https://github.com/thedotmack/claude-mem"
confidence: low
fos_compat: low
effort_estime: S (test) / XL (adoption full)
decision: redondant-systeme-memoire-fos-actuel-skip
key_claims:
  - "Tagline : Your AI's Perfect Memory Archive"
  - "Plugin Claude Code : install via `/plugin marketplace add thedotmack/claude-mem && /plugin install claude-mem`"
  - "Features declares : live observation, searchable observations, auto-categorization (decision/bugfix/feature/discovery), dual-axis querying (file path + semantic concept), progressive disclosure, causality tracking"
  - "Creator : thedotmack (GitHub handle)"
  - "Copyright 2025"
  - "Multi-LLM : Claude-specific only"
  - "Pricing : non-disclosed"
  - "Tech stack : non-disclosed"
  - "Privacy/security : non-disclosed"
  - "Data storage (cloud/self-hosted) : non-disclosed"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - website
  - memory-service
  - claude-code
  - plugin
  - solo-maintainer
status: seed
related:
  - "[[index-sources]]"
  - "[[Claude Code]]"
  - "[[Foundation OS]]"
  - "[[Hot Cache]]"
  - "[[Layered Loading]]"
  - "[[Neuroplasticite]]"
  - "[[LLM Wiki Pattern]]"
sources: []
---

# Claude-Mem — AI note-taking automatique pour sessions Claude Code

## Summary

**Plugin Claude Code** par thedotmack qui auto-capture observations contextuelles des sessions AI coding (decisions, bug fixes, architectural choices). Positioning "Your AI's Perfect Memory Archive".

**Tres limite en info disclosed** — site minimal, pas de pricing, pas de privacy/security claims, pas de tech stack disclosed, pas d'info sur data storage. Solo maintainer (thedotmack).

**Redondant avec systeme memoire FOS existant** ([[Hot Cache]] + [[Layered Loading]] + [[Neuroplasticite]] + [[LLM Wiki Pattern]] + 5 tiers memoire). Verdict : skip.

## Key Claims

### Features declares (tous declares, pas verifies)
- Live observation : real-time capture AI decisions/bugfixes/architecture
- Searchable observations : indexed par time avec before/after context
- Auto-categorization : tagged par type (decision/bugfix/feature/discovery)
- Dual-axis querying : search par file path ou semantic concept
- Progressive disclosure : lightweight session indices + on-demand full retrieval
- Causality tracking : ce qui precede et suit chaque observation

### Installation
```
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

### Information non-disclosed (red flags)
- Pricing
- Tech stack
- Data storage (cloud ? self-hosted ?)
- Privacy/security claims
- Infrastructure details
- Roadmap
- Testimonials

## Entities Mentioned

- **thedotmack** (GitHub handle) — solo maintainer
- **[[Claude Code]]** — runtime target

## Concepts Introduced

- **Live observation capture** pattern — auto-record decisions pendant session
- **Dual-axis querying** — recherche par path OU semantic
- **Causality tracking** — preceded/followed relationships

## Foundation OS Analysis

### Compat OS

**Low** — **REDONDANCE MAJEURE** avec systeme memoire FOS :

| Claude-Mem feature | FOS equivalent |
|---|---|
| Live observation capture | Auto-memory FOS (~25 fichiers `feedback_*.md` + `project_*.md`) |
| Searchable observations | Grep sur `wiki/` + `docs/` + memoire folder |
| Auto-categorization | Frontmatter `type: concept/entity/source` + tags systematiques |
| Dual-axis querying | Wikilinks + Obsidian graph + confidence tagging |
| Progressive disclosure | [[Layered Loading]] L0-L3 |
| Causality tracking | `sessions-recent.md` + git log + [[Neuroplasticite]] |

FOS a deja un **systeme memoire tres developpe** (5 tiers conversation/CONTEXT.md/auto-memory/docs/wiki, 89 pages wiki, hot cache, layered loading, pre-compaction snapshot). Claude-Mem apporte des features **deja couvertes**.

### Effort integration

**S** pour test (install plugin + test 1 session + evaluer). **XL** pour adoption car nécessiterait de :
1. Migrer ou dupliquer donnees memoire FOS existantes
2. Resoudre conflict avec auto-memory Claude Code (~/.claude/projects/.../memory/)
3. Decider si Claude-Mem REMPLACE ou COMPLEMENTE le wiki

### Limites Claude declarees

- **Info site tres limitee** : documentation presque inexistante en surface web
- **N'ai pas clone** ni inspecte le plugin code. Analyse basee sur landing page fetchee.
- **Pas de trust signal** clair : pas de stars GitHub verifies (URL github.com/thedotmack/claude-mem potentielle mais non-fetch), pas de team identifiee, pas de privacy policy.
- **Solo maintainer thedotmack** = bus factor maximal.

### Risques / pieges

1. **Data privacy inconnue** : ou sont stockees les observations ? Cloud Claude-Mem ? Local ? Pas d'info = red flag.
2. **Dependency sur plugin tiers** : si Claude-Mem stops maintenance, les donnees captures sont-elles portables ?
3. **Pollution memory auto-generee** : si plugin capture EVERYTHING, risque noise > signal.
4. **Conflict potentiel** avec auto-memory Claude Code native (2 systemes ecrivent memoires different format).
5. **Pas de comparison** avec alternatives : pourquoi preferer Claude-Mem a Paperclip, Obsidian, LangGraph memory, LlamaIndex, etc. ?
6. **Info minimaliste site = red flag confiance** : projet serieux aurait pricing, docs, privacy, testimonials.

### Verdict

**SKIP** (redondant FOS actuel + red flags disclosure).

**Si Kevin veut experimenter** :
- Test 1 session dedicated avec Claude-Mem installe
- Comparer avec auto-memory FOS existante
- Mesurer overhead/benefit concret
- Decider adoption OU removal apres 1 semaine

**Mais honestement** : FOS a deja construit un systeme memoire plus mature (5 tiers + neuroplasticity + wiki + confidence tagging). Claude-Mem ne resoudrait pas un probleme concret non-resolu.

### Questions ouvertes

- Github repo thedotmack/claude-mem existe ? Stars/forks/activity ?
- Licence ? Open-source ou proprietaire ?
- Data storage : cloud hosted (privacy issue) ou local only ?
- Integration : plugin ecrit observations dans fichier ou envoi cloud API ?
- Comment comparer performance query a `wiki-query` skill FOS actuel ?

## Raw Source

- Site : https://claude-mem.ai
- Copyright : 2025 Claude-Mem
- GitHub (probable) : https://github.com/thedotmack/claude-mem (non-fetch)

## Notes

**Pattern a noter** : l'emergence de plugins "memory layer for Claude Code" (Claude-Mem + Paperclip + MemPalace + claude-obsidian etc.) indique une **demande reelle** pour persistence context. **FOS a anticipe ce besoin** via adoption precoce claude-obsidian + architecture 5 tiers. Pas besoin d'un autre layer.

**Stocke comme reference ecosysteme** (pour savoir que ça existe). Pas adoption.
