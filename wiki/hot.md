---
type: meta
title: "Hot Cache Foundation OS"
updated: 2026-04-17
tags:
  - meta
  - hot-cache
status: evergreen
confidence: high
related:
  - "[[index-meta]]"
  - "[[index-wiki]]"
  - "[[overview]]"
---

# Hot Cache

Navigation: [[index-wiki]] | [[overview]]

## Last Updated

2026-04-18 (D-INTEG-01 Phase 1/5) : **Preparation architecturale integration 5 sources externes** (MemPalace + Octogent + Graphify + Penpax.ai + MemPalace site). Audit surface SAIN, lecture profonde 5 sources, synthese comparative (3 tiers : a integrer / a inspirer / a ignorer). Plan 5 phases 6 elements anti-compactage (33KB dual-path). **Phase 1 DONE** : 4 concepts wiki (Confidence Tagging, Graph Report, Layered Loading, Pre-compaction Snapshot), 3 indexes lies (index-wiki, index-concepts, foundation-os-map section Enhancements), knowledge.md section 12 (5 sous-sections 12.1-12.5), thresholds.json seeds (wiki.confidence_required + graph_report + layered_loading + pre_compaction), CONTEXT D-INTEG-01, ref-checker IGNORE_REFS_RE etendu pour scripts Phase 2-4. Verdict : **SAIN** (47 pages, 712 wikilinks, 0 ref cassee, health SAIN, build 246ms, 15/15 tests). Commits : `6386823` + merge `452a342` push origin main. **Next : Phase 2/5 INT-1 pre-compaction snapshot** (~1h).

### Avant (2026-04-17 mapping refactor) : **Refactor radical mapping/routage cerveau OS** (Opus 4.7, 1M context, 14 commits Session A+B+C). Audit exhaustif 128 fichiers + rapport 720L (`docs/audits/2026-04-17-mapping-routage-audit/rapport.md`) + plan execution 15 phases 6 elements. Resolution 15 findings (F1 a F15, 3 🔴 critiques + 10 🟡 moyens + 2 🟢 faibles). Verdict post-refactor : **SAIN** (health + drift SYNC + wiki SAIN + refs 0 + tier 0 + neuro 100% + tests 15/15 + build 244ms).

### Changements structurants

- **counts** : source unique `wiki/meta/counts.md` (4 sources verite -> 1). Consumers pointent vers [[counts]].
- **index-app.md** archive (7 wikilinks casses vers `.archive/app-data-jsx-260417/`). Refs `modules/app/data/*` dans cerveau actif resolues (doc-agent, monitor, manifeste, tools-catalogue).
- **foundation-os-map.md** : 205L -> 74L, 81 wikilinks -> 27 (pattern etoile -> mesh 2 niveaux via sous-indexes).
- **graph.json Obsidian** : 12 -> 9 color groups (retrait 3 duplicates tag:#core-os/#cowork/#app = path equivalents).
- **Journals** : 4 -> 2 (archive log.md + session-dna.md, gardees sessions-recent + session-patterns).
- **SessionStart** : /cockpit + /session-start Tour 1 unifie (9 reads). Hook `session-start-wiki.sh` = pure cat hot.md (pas head -60, drift-detector retire chain dans health-check INFO).
- **Memoires** : project_structure update (Storybook 9, tokens CSS --ds-*), audit_v2_s3_handoff deprecie, feedback_tout_automatique compresse 60L->29L, tools-foundation-os nettoye (177+ bullshit retire).
- **Domains Phase 5** : callout `[!placeholder]` sur trading/finance/sante (reversible).
- **Categories mortes** : suppression comparisons/ + questions/ + canvases/ + templates comparison/question archives.
- **DS components** : 52 wikilinks `[[01-button]]..[[46-carousel]]` + `[[01-colors]]..[[06-icons]]` -> backtick paths `modules/design-system/docs-supernova/*`.

### Avant (2026-04-17 cleanup)

**Cleanup complet drifts + refs + TSX legacy** (6 commits atomiques). Archivage rapports audit v2 + recablage 31 refs cassees + resolution contradiction CLAUDE<->knowledge.md + seuils TSX ajustes + CONTEXT 179->133L + CLAUDE 220->195L.

### Avant (2026-04-17 nuit + soir + matin)

**Audit v2 S3 COMPLET** (P16 memory + P17 contradiction + P18 feedback loop). **Audit v2 S1+S2 EXECUTE** (10 commits, FORME critique + FONCTION partielle).

### Avant (2026-04-16)

Mega Audit V2 COMPLET. 166 findings. Foundation OS = 70% structure + 30% fonction. Definition canonique `wiki/concepts/Foundation OS.md`.

## Plugin State

- **Plugin**: claude-obsidian v1.4.3 installe
- **Obsidian app**: /Applications/Obsidian.app
- **Skills**: 10
- **Commands**: 4 (/wiki, /save, /autoresearch, /canvas)
- **Agents**: 2 (wiki-ingest, wiki-lint)
- **Templates**: 3 (concept, entity, source) — post-Phase 10 2026-04-17 (comparison + question archives)
- **Domaines**: 5 (trading/finance/sante placeholder Phase 5 + design/dev seed)

## Key Recent Facts

- Foundation OS = OS travail IA-driven (code app/design-system) + second-brain knowledge (wiki/)
- 5 tiers memoire : conversation / CONTEXT.md / auto-memory / docs/ / wiki/
- Regle d'or : une info = un seul tier (zero duplication)
- Couplage modules/ <-> wiki/domains/ via frontmatter `implementation:`
- SessionStart Tour 1 = 9 reads deterministes (CONTEXT + hot + sessions-recent + lessons-learned + thinking + git + health + wiki-health + plans)
- Pattern wiki : mesh 2 niveaux (index-wiki niveau 1 + 6 sous-indexes niveau 2 + pages feuilles)

## Recent Changes (post-refactor mapping 2026-04-17)

- `5129f13` refactor(wiki): DS components wikilinks -> backtick paths (Phase 11/15, F6)
- `604fbe3` refactor(wiki): suppression categories mortes (Phase 10/15, F15)
- `14a7714` docs(wiki): domains Phase 5 marques [!placeholder] (Phase 9/15, F14)
- `b461e82` chore(memory): nettoyage memoires outdated (Phase 8/15, F10 F11 F12 F13)
- `d872aa2` refactor(os): SessionStart optimise (Phase 7/15, F1 F2 F3)
- `d425ea9` refactor(wiki): rationalisation journals 4 -> 2 (Phase 6/15, F9)
- `d2c4af3` chore(obsidian): graph.json 12 -> 9 groupes (Phase 5/15, F7 local)
- `dd0825c` refactor(wiki): navigation 2 niveaux (Phase 4/15, F4)
- `6193d7e` refactor(wiki): decomission index-app + refs (Phase 3/15, F5)
- `15bd8fe` refactor(wiki): unification counts (Phase 2/15, F8)
- `005703d` docs(audit): rapport mapping/routage 13 axes + 15 findings (Phase 1/15)

## Active Threads

- **D-INTEG-01 Phase 1/5 DONE** (2026-04-18). Plan : `docs/plans/2026-04-17-integration-sources-externes.md`. 5 phases total : Phase 1 preparation (DONE), Phase 2 INT-1 pre-compaction snapshot (~1h), Phase 3 INT-2 confidence tagging (~2h), Phase 4 INT-3 graph report auto (~3h), Phase 5 INS-1 layered loading formel (~30min).
- **Refactor mapping/routage DONE** (precurseur D-MAPPING-01, `.archive/plans-done-260417/`)
- **Wiki operationnel** : voir [[counts]] (47 pages, 712 wikilinks)
- **Decision Phase 5 modules** (Finance/Sante/Trading) — reportee
- **14 routines Desktop** documentees — a creer via `/schedule` UI

## Next Action

**Phase 2/5 D-INTEG-01 : INT-1 Pre-compaction snapshot** (~1h, session dediee).

Livrables Phase 2 :
- `scripts/hooks/pre-compaction-snapshot.sh` : dump hot.md + CONTEXT Cap + TodoWrite dans `.omc/snapshots/YYYYMMDD-HHMM.md`
- `.claude/settings.json` hook PreCompaction (API a verifier, fallback Stop)
- `.gitignore` snapshots/*.md (garder .gitkeep)
- `docs/core/tools.md` entree script
- Rotation 14 derniers

Specs : `docs/plans/2026-04-17-integration-sources-externes.md` Phase 2 (6 elements) + `docs/core/knowledge.md` section 12.4 + [[Pre-compaction Snapshot]].

Phases suivantes : 3/5 INT-2 confidence (~2h) · 4/5 INT-3 graph report (~3h) · 5/5 INS-1 layered loading (~30min).

Objectif Phase 1 atteint : **fondations posees organiquement**. 4 concepts wiki + spec canonique + seuils + decision + plan dual-path. Phases 2-5 ont tous les wikilinks et refs pre-cable.
