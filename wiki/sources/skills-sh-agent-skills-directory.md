---
type: source
title: "Skills.sh — The Agent Skills Directory (marketplace multi-vendor Vercel)"
source_type: website
author: "Vercel (Made with love by Vercel) + 50+ community contributors"
date_published: 2026-04-19
url: "https://skills.sh"
confidence: high
fos_compat: medium
effort_estime: S (test adoption skill specifique)
decision: reference-piocher-skills-au-besoin
key_claims:
  - "Tagline : The Open Agent Skills Ecosystem"
  - "Description : reusable capabilities for AI agents, install single command"
  - "Made par Vercel, contributions Microsoft/Anthropic/Google/Firebase/Supabase/50+ community"
  - "91,039+ skills disponibles (leaderboard)"
  - "Multi-agent : 20+ platformes (Claude Code + GitHub Copilot + Cursor + Cline + 17 autres)"
  - "Installation : `npx skills add <owner/repo>` (single command)"
  - "Leaderboard : find-skills (1.1M installs), vercel-react-best-practices (330K), frontend-design 312K anthropics, web-design-guidelines 263K, remotion-best-practices 251K"
  - "Categories : design, cloud infra (Azure), framework best practices, doc processing (PDF/PPTX/XLSX/DOCX), testing, marketing"
  - "Sections : Official (Anthropic curated) + Audits (community)"
  - "No pricing disclosed — appears free"
  - "No signup requis visible"
  - "Filters : All Time, Trending 24h, Hot"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - website
  - marketplace
  - skills
  - multi-vendor
  - vercel
  - open-ecosystem
status: mature
related:
  - "[[index-sources]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[hesreallyhim-awesome-claude-code]]"
  - "[[Foundation OS]]"
sources: []
---

# Skills.sh — The Agent Skills Directory (marketplace multi-vendor Vercel)

## Summary

**Marketplace et discovery platform** pour skills AI agents. **Par Vercel**, multi-vendor (Microsoft/Anthropic/Google/Firebase/Supabase/community 50+), **91,039+ skills** disponibles. Installation **single command** `npx skills add <owner/repo>`.

**Multi-agent** : supporte 20+ platformes (Claude Code + Copilot + Cursor + Cline + autres). Claude = 1 category parmi N. Positioning : **infrastructure neutre** pour "AI agent economy".

**Sections** : Official (Anthropic curated) + Audits (community).

## Key Claims

### Leaderboard (exemples top)

| Rank | Skill | Publisher | Installs |
|---|---|---|---|
| 1 | find-skills | vercel-labs | 1.1M |
| 2 | vercel-react-best-practices | vercel-labs | 330.1K |
| 3 | frontend-design | anthropics | 312.7K |
| 4 | web-design-guidelines | vercel-labs | 263.8K |
| 5 | remotion-best-practices | remotion-dev | 251.7K |

### Contributors organisations (corporate + indie)
- **Corporate** : Vercel (host), Microsoft, Anthropic, Google, Firebase, Supabase
- **Indie** : 50+ community developers visibles dans leaderboard

### Installation
```bash
npx skills add vercel-labs/find-skills
npx skills add anthropics/frontend-design
# etc.
```

### Categories
- Design (frontend, UI, UX)
- Cloud infrastructure (Azure, AWS)
- Framework best practices (React, Next.js, Remotion)
- Document processing (PDF, PPTX, XLSX, DOCX)
- Testing
- Marketing automation

### Sections navigation
- **Official** (Anthropic curated skills)
- **Audits** (community contributions)

### Filters
- All Time (91,039+ skills)
- Trending 24h
- Hot

## Entities Mentioned

- **Vercel** — platform creator
- **vercel-labs** — publisher top skills (find-skills, react-best-practices, web-design-guidelines)
- **Microsoft** — contributor (Azure skills cluster 25+)
- **Anthropic** — contributor (frontend-design, pdf, pptx, etc.)
- **Google** — contributor
- **Firebase** — contributor
- **Supabase** — contributor
- **Remotion** (remotion-dev) — contributor

## Concepts Introduced

- **Open Agent Skills Ecosystem** — marketplace neutre cross-vendor
- **`npx skills add`** — pattern single-command install
- **Multi-vendor skills** — skills format portable cross-platforms (Claude Code + Copilot + Cursor + etc.)
- **Official vs Audits** — curation officielle vs community

## Foundation OS Analysis

### Compat OS

**Medium** :
- ✅ **Anthropic skills** presents (frontend-design 312k installs, pdf, pptx) — utilisables FOS direct
- ✅ **`npx skills add`** install simple
- ⚠️ **Multi-vendor format** : pas tous les skills compatibles Claude Code natif. Verifier per-skill.
- ✅ FOS utilise deja plugins ecosystem (OMC, claude-obsidian, Superpowers, gstack)

### Effort integration

**S** (10-30 min par skill adopte) : install + test + decide garde/remove.

### Ce qui vaut le coup pour FOS

**Candidats adoption opportuniste** :

1. **anthropics/frontend-design** (312k installs) — design skills officiels Anthropic. Alignement FOS Void Glass a verifier.

2. **anthropics/pdf** + **anthropics/pptx** + **anthropics/xlsx** + **anthropics/docx** — deja dans skills listes FOS au SessionStart (via plugin OMC ?). **A verifier si doublon**.

3. **vercel-labs/find-skills** (1.1M installs) — meta-skill pour decouvrir d'autres skills. Potentiellement utile pour auto-discovery.

4. **vercel-labs/web-design-guidelines** (263K) — utile si FOS construit landing/marketing (ref [[hamish-oneill-shadcncraft]] analyse).

5. **remotion-dev/remotion-best-practices** — pas pertinent FOS (pas de video).

### Limites Claude declarees

- **N'ai pas teste** `npx skills add`. Infrastructure non-verifie.
- **91,039+ skills** = overwhelming, impossible d'auditer tous.
- **Quality heterogene** : official Anthropic curated OK, community "Audits" qualite variable.
- **Multi-vendor format** : je ne connais pas la spec exacte. Claude Code natif skill format vs Cursor skill format = possible incompatibilites.
- **Vercel infrastructure** = trust Vercel (bon track record mais dependency).

### Risques / pieges

1. **Over-adoption** : tentation install 10+ skills d'un coup → pollution FOS. Resister.
2. **Duplicates avec plugins existants** : FOS a deja OMC + claude-obsidian + Superpowers. Skills.sh skills potentiels duplicates. Audit avant adoption.
3. **Multi-vendor format** pas 100% Claude Code natif possible → some skills nécessitent adapter.
4. **91k+ skills** dont beaucoup early-stage / mal maintained. Seule top leaderboard ≠ qualite.
5. **`npx skills add`** = command non-native Claude Code. Installer skills via ce flow peut creer friction avec plugin ecosystem Claude.
6. **Bus factor Vercel** : Vercel comme host = dep sur politique business Vercel (peut monetizer futur).

### Verdict

**Reference + piocher skills specifiques au besoin**.

**Usage recommande** :
1. **Bookmark skills.sh** comme catalog a consulter
2. **Quand Kevin cherche un skill precis** (ex: "besoin skill PDF parsing") → regarder leaderboard + Official Anthropic
3. **Avant d'installer** : verifier compatibilite format Claude Code + redondance FOS existants
4. **Install opportuniste** : 1 skill a la fois, test 1 session, decision garde/remove

**Ne pas** :
- Install en masse (pollution + conflits)
- Parcourir 91k skills systematiquement
- Forker/customiser skills cluster Vercel
- Remplacer plugins FOS existants (OMC, claude-obsidian) par equivalents skills.sh

### Questions ouvertes

- Format skills.sh vs Claude Code natif : convertible ou conversion nécessaire ?
- `npx skills add` : utilise quel registry ? Installe ou ? ~/.claude/skills/ ?
- Redondance anthropics/* skills : deja presents dans Claude Code skills par defaut ?
- Quality signal : "1.1M installs find-skills" = signal adoption, mais quality reelle ?
- Vercel roadmap business : skills.sh toujours free long-terme ?

## Raw Source

- Site : https://skills.sh
- Made by Vercel (footer)
- 91,039+ skills indexed
- Filters : All Time / Trending 24h / Hot

## Notes

**Positioning unique** : **neutre cross-vendor** (Claude Code + Copilot + Cursor + 17 autres). **Infrastructure-level** plutot que outil Claude-specifique.

**Difference vs ecosysteme Claude Code native** :
- Plugins Claude Code (`/plugin marketplace add`) = Anthropic-curated + plugin-format
- Skills.sh = multi-vendor, cross-platform, npm-registry-based via `npx`

**Pattern interessant** : **"npm for AI agent skills"**. Si reussit, could become standard universel.

**Stocke comme ref + marketplace consultable**. Adoption au cas par cas, pas framework.
