---
type: source
title: "awesome-claude-code par hesreallyhim — curated list 200+ resources Claude Code"
source_type: repo
author: "hesreallyhim (maintainer) + Claude itself (automated PR submitter)"
date_published: 2026-04-19
url: "https://github.com/hesreallyhim/awesome-claude-code"
confidence: high
fos_compat: medium-high
effort_estime: S (ref consultation)
decision: stocker-ref-4-standout-a-explorer
key_claims:
  - "39.7k stars, 3.3k forks, 264 watchers — awesome-list Claude Code #1 adoption"
  - "200+ resources curees sur 9 sections (Agent Skills / Workflows / Tooling / Status Lines / Hooks / Slash-Commands / CLAUDE.md Files / Alternative Clients / Official Docs)"
  - "License CC BY-NC-ND 4.0 (attribution + non-commercial + NO derivatives) — plus restrictive que MIT"
  - "Resources individuels listes gardent leur propre licence (MIT/Apache majoritaire)"
  - "Pattern curation : only Claude peut submit PRs, contributors utilisent issue template"
  - "Suit spec awesome.re"
  - "Alternative formats : EXTRA, CLASSIC, FLAT_ALL_AZ (README_ALTERNATIVES/)"
  - "1090 commits total, maintenance active (Latest Additions section ongoing)"
  - "THE_RESOURCES_TABLE.csv = source de verite tabulaire"
  - "Repo structure mature : .claude/commands, tests/, scripts/, tools/, Makefile, pre-commit-config"
created: 2026-04-19
updated: 2026-04-19
tags:
  - source
  - repo
  - awesome-list
  - claude-code
  - curated-resources
  - reference
  - cc-by-nc-nd
status: mature
related:
  - "[[index-sources]]"
  - "[[Claude Code]]"
  - "[[Claude Code Configuration Pattern]]"
  - "[[luongnv89-claude-howto]]"
  - "[[Cockpit OS Dashboard]]"
  - "[[AI agent patterns]]"
  - "[[Hot Cache]]"
  - "[[Layered Loading]]"
  - "[[Foundation OS]]"
sources: []
---

# awesome-claude-code par hesreallyhim — curated list 200+ resources Claude Code

## Summary

**Awesome-list curee** de l'ecosysteme Claude Code, suivant la spec awesome.re. **39.7k stars**, 200+ resources sur 9 sections. Maintenu par hesreallyhim avec **pattern curation automatique** : seul Claude peut submit PRs, contributors utilisent issue template + automated processing.

**Rôle FOS** : **catalogue de reference** consultable quand Kevin cherche un outil Claude Code specifique. Pas un guide d'apprentissage (c'est [[luongnv89-claude-howto]]). Complementaire.

**Attention licence** : CC BY-NC-ND 4.0 — Attribution + **Non-Commercial** + **No Derivatives**. Plus restrictive que MIT. Pour **la liste elle-meme** (les resources listees ont leur propre licence).

## Key Claims

### Stats & status
- Stars : 39.7k
- Forks : 3.3k
- Watchers : 264
- Commits total : 1090
- Status : actively maintained, "Latest Additions" section ongoing

### License CC BY-NC-ND 4.0 (details)
- ✅ Forking + cloning + sharing avec attribution
- ✅ Non-commercial usage
- ❌ **No derivatives** (pas de fork modifie)
- ❌ **No commercial use**
- Resources individuels listes : chacun garde sa propre licence (MIT/Apache majoritaire)

### 9 sections

| Section | Emoji | Exemples |
|---|---|---|
| Agent Skills | 🤖 | Specialized configurations domain-specific |
| Workflows & Knowledge Guides | 🧠 | General, Teams, Ralph Wiggum |
| Tooling | 🧰 | Orchestrators, config managers, usage monitors, IDE integrations |
| Status Lines | 📊 | Terminal output customizations |
| Hooks | 🪝 | Event-triggered scripts |
| Slash-Commands | 🔪 | General, Git, Code Analysis, Documentation, CI/Deployment, Project Management |
| CLAUDE.md Files | 📂 | Language-Specific, Domain-Specific, Project Scaffolding |
| Alternative Clients | 📱 | Non-official UIs et frontends |
| Official Documentation | 🏛️ | Liens Anthropic canoniques |

### Curation model unique
- Seul Claude peut submit PRs au repo
- Contributors utilisent "Recommend a new resource" issue template
- Automated system processes recommendations
- Manual PRs explicitly discouraged
- Quality gates : attribution, respect licenses, curated pas exhaustive

## Entities Mentioned

- **hesreallyhim** — GitHub user, maintainer awesome-list
- **[[Claude Code]]** — ecosysteme documente
- **Claude (automated PR submitter)** — pattern curation unique

## Concepts Introduced

- **Automated list curation** — Claude lui-meme comme PR submitter unique
- **Awesome-list hierarchical organization** — primary (type) + secondary (domain) + tertiary (specialization)
- **Recommend-via-issue-template** — pattern anti-PR-review-overhead

## 4 resources standout a retenir (FOS-relevant)

### 1. ccxray
**HTTP proxy + dashboard real-time pour API visibility** entre Claude Code et Anthropic.
- **Pertinence FOS** : **forte pour [[Cockpit OS Dashboard]]**. Complement a [[RTK]] (niveau compression output CLI). ccxray serait le niveau plomberie observability reseau (tool calls, latence, responses API).
- **A explorer** quand Cockpit OS demarre implementation.

### 2. Encyclopedia of Agentic Coding Patterns (190+ patterns)
**Meta-ressource** pattern language pour AI-assisted development.
- **Pertinence FOS** : enrichir [[AI agent patterns]] (actuellement focus sur 4 patterns routing/orchestrator-worker/evaluator-optimizer/human-in-the-loop). Encyclopedia = 190+ patterns, extension massive.
- **A fetch/analyser** si Kevin lance Phase 5 AI-heavy (Trading bot, health council).

### 3. ralph-orchestrator
**Autonomous task completion** via recursive loops + safety guardrails.
- **Pertinence FOS** : **redondant probablement** avec OMC skill `ralph` (deja installe FOS, keyword trigger `"ralph"`). A verifier si c'est meme source ou projet different.
- **Si meme** : juste noter et skip. **Si different** : comparer approches.

### 4. Context Engineering Kit + ContextKit
**Minimal token footprint + 4-phase planning methodology**.
- **Pertinence FOS** : complementaire aux 3 mecanismes tokens FOS existants ([[Hot Cache]], [[Layered Loading]], [[Pre-compaction Snapshot]]).
- **A fetch/comparer** si Kevin veut optimiser encore le context loading.

## Foundation OS Analysis

### Compat OS

**Medium-high** :
- ✅ Reference catalog = utile sans dependency
- ✅ Resources individuels MIT/Apache adoptables
- ⚠️ **Licence liste** CC BY-NC-ND bloque forker + modifier (mais usage reference OK)
- ✅ Alignement ecosysteme Claude Code natif

### Effort integration

**S** (consultation ref). Usage recommande :
1. Garder URL en bookmark / wiki
2. Consulter quand Kevin cherche outil specifique
3. Fetch resource individuel si interesse, verifier licence avant adoption
4. **Ne pas** forker la liste (CC BY-NC-ND bloque)

### Ce qui existe deja dans FOS vs awesome-claude-code

| Categorie awesome | Coverage FOS |
|---|---|
| Agent Skills | ✅ OMC + claude-obsidian + Anthropic skills (nombreux) |
| Workflows | ✅ OMC Tier-0 (autopilot, ralph, ultrawork, team, ralplan) |
| Tooling | ✅ Tools-foundation-os entity + 109 outils catalog |
| Status Lines | ❓ Pas verifie si FOS utilise (peut-etre gap mineur) |
| Hooks | ✅ 7 hooks FOS actifs post-D-CCCONFIG-01 |
| Slash-Commands | ✅ 7 commands FOS + 4 commands claude-obsidian |
| CLAUDE.md Files | ✅ FOS CLAUDE.md 199L + user global CLAUDE.md |
| Alternative Clients | N/A (FOS = Claude Code CLI + Desktop) |
| Official Docs | N/A (FOS reference Anthropic docs natif) |

**Gaps potentiels** : Status Lines (cosmetique terminal), peut-etre quelques patterns specifiques Encyclopedia. Pas gros gap.

### Limites Claude declarees

- **N'ai pas clone** ni parcouru les 200+ resources listes. Analyse basee sur README + fetch.
- **N'ai pas verifie** chaque resource standout (ccxray, Encyclopedia, ralph-orchestrator, Context Engineering Kit). Verdict "pertinent" = hypothese sur description, pas verifie.
- **Training** : je ne connais pas awesome-claude-code par mon training. Tout vient du fetch actuel.
- **Licence** : lecture des termes CC BY-NC-ND standard, mais details specifiques a ce repo potentiellement differents. Kevin doit verifier LICENSE file si adoption.

### Risques / pieges

1. **Licence restrictive liste** : pas forker pour faire "ma version". Pattern different de claude-howto MIT.
2. **"Curated" implique selection biaisee** : pas exhaustive. Peut manquer des resources pertinentes si non-connues de Claude (PR submitter unique).
3. **Stars count 39.7k** : impressionant mais beaucoup des resources listees peuvent etre early-stage / abandonnees. Status "curated" = quality filter mais pas garantie maintenance long-terme.
4. **Redondance potentielle** avec plugins FOS existants (OMC, claude-obsidian, Superpowers) : verifier avant d'adopter un nouveau plugin "awesome".
5. **Automated curation Claude-driven** : interessant mais blackbox. Criteres d'approbation pas transparents.
6. **Overwhelming resource count** : 200+ resources = paradoxe du choix. Sans criteres clairs, risque paralysie.

### Verdict

**Stocker ref + 4 standout identifies pour future exploration** :
- ccxray (si Cockpit OS demarre)
- Encyclopedia of Agentic Coding Patterns (si Phase 5 AI)
- ralph-orchestrator (si OMC ralph insuffisant)
- Context Engineering Kit (si besoin optimization tokens)

**Usage recommande** : bookmark + consultation opportuniste quand besoin specifique. Pas de parcours systematique.

**Ne pas** :
- Forker la liste (license bloque)
- Adopter aveuglement plusieurs resources sans audit individuel
- Parcourir les 200+ entries integralement
- Considerer cette liste comme source unique (Anthropic docs officielles restent canoniques)

### Questions ouvertes

- **ccxray** est-il mature + compatible FOS stack (React/TS + Supabase) ? Fetch repo pour verifier.
- **Encyclopedia of Agentic Coding Patterns** : contenu reel des 190+ patterns ? Accessible gratuitement ou paywall ?
- **ralph-orchestrator vs OMC ralph** : meme projet, fork, ou concurrent ? Fetch pour clarifier.
- **Context Engineering Kit vs [[Hot Cache]] + [[Layered Loading]] FOS** : complementaire ou redundant ?
- Status Lines dans FOS : gap mineur ou non-pertinent (Kevin utilise Desktop UI, pas terminal pur) ?

## Raw Source

- Repo : https://github.com/hesreallyhim/awesome-claude-code
- License : CC BY-NC-ND 4.0 (attribution + non-commercial + no derivatives)
- Submission : issue template "Recommend a new resource"
- Alternative formats : README_ALTERNATIVES/ (EXTRA, CLASSIC, FLAT_ALL_AZ)
- THE_RESOURCES_TABLE.csv = source de verite tabulaire

## Notes

**Pattern curation "only Claude submits PRs"** est interessant meta-observation : pattern communautaire ou l'IA devient le curateur des outils qui lui sont destines. Boucle auto-referentielle qui merite reflexion (auto-organization, biais selection Claude, meta-curation).

**Complementaire a [[luongnv89-claude-howto]]** : claude-howto = guide progressif structure, awesome-claude-code = catalogue reference. Les 2 ensemble couvrent : **apprendre** + **chercher**.

**Triangle ressources Claude Code FOS** :
- [[claude-code-config-guide-2026-04]] = **theorie** structurelle (config, hooks, permissions)
- [[luongnv89-claude-howto]] = **workflows pratiques** combines
- [[hesreallyhim-awesome-claude-code]] = **catalogue** resources individuels

Ces 3 sources couvrent l'espace Claude Code meta-knowledge a trois niveaux.

**Stocke comme reference**. Pas d'integration automatique FOS. Consultation opportuniste.
