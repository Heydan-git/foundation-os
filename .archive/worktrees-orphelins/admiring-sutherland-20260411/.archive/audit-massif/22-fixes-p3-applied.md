# 22-fixes-p3-applied — S22 Batch P3 cosmetic
> **Status** : DONE
> **Session** : S22 (2026-04-10)
> **Branche** : audit-massif-cycle3

## Objectif

Appliquer les ~15 fixes P3 cosmetic identifies dans `19-synthese-roadmap.md` section 4.

## Fixes appliques

| # | Finding | Fix | Fichier(s) |
|---|---------|-----|------------|
| 1 | F-S7-01 | Ajout `model:` frontmatter aux 4 agents (sonnet/opus) | `.claude/agents/*.md` |
| 2 | F-S5-03 | doc-agent trigger restreint : "met a jour" → "met a jour CONTEXT", "met a jour docs" | `.claude/agents/doc-agent.md` + `docs/core/cortex.md` |
| 3 | F-S5-04 | cortex.md section 3 : supprime /sync detail duplique, pointe vers source unique `.claude/commands/` | `docs/core/cortex.md` |
| 4 | F-S5-05 | session-start fallback si CONTEXT.md absent → abort explicite | `.claude/commands/session-start.md` |
| 5 | F-S5-06 | session-start : build failure = BROKEN equivalent | `.claude/commands/session-start.md` |
| 6 | F-S5-08 | session-end : ref-checker explicite (`bash scripts/ref-checker.sh`) | `.claude/commands/session-end.md` |
| 7 | F-S5-09 | session-end : DEGRADED → DONE_WITH_CONCERNS + documenter warning | `.claude/commands/session-end.md` |
| 8 | F-S8-04 | session-start : workspace build pattern documente (cd + npm -w) | `.claude/commands/session-start.md` |
| 9 | F-S8-08 | new-project : ajout template sortie (4 lignes) | `.claude/commands/new-project.md` |
| 10 | F-S8-09 | new-project : supprime template README duplique, pointe vers `scripts/module-scaffold.sh` | `.claude/commands/new-project.md` |
| 11 | F-S16-07 | CONTEXT.md : supprime "0 artifact JSX" obsolete, MAJ metriques (Navbar 3, JS 440kB, 7 routes) | `CONTEXT.md` |
| 12 | F-S15-10 | .DS_Store untrack (6 fichiers) via `git rm --cached` | `.DS_Store` x6 |

## Findings N/A ou deja fixes

| Finding | Raison |
|---------|--------|
| F-S13-19 (import React inutile) | Tous les imports restants utilisent `React.` directement (types FC, FormEvent, etc.) |
| F-S5-01 (sync.md ref-checker backlog) | Deja fixe en S21 (sync.md 80→16L) |
| F-S5-02 (PAUL jargon session-end) | Deja fixe en S21 (PAUL supprime 4 fichiers) |
| F-S8-07 (PAUL jargon commands) | Deja fixe en S21 (meme batch) |
| F-S16-06 (build time snapshot) | Fixe dans le meme edit que F-S16-07 (728ms → ~980ms) |
| F-S16-08/10 (CI hardcode) | Strategic, pas cosmetic — hors scope P3 |
| F-S16-09 (CONTRIBUTING DS) | Creation fichier = hors scope P3 |

## Decisions

| ID | Date | Decision |
|----|------|----------|
| D-S22-01 | 2026-04-10 | Agents model routing : dev-agent/doc-agent/review-agent → sonnet, os-architect → opus |
| D-S22-02 | 2026-04-10 | Template README new-project : source unique = `scripts/module-scaffold.sh`, spec command = pointeur |
| D-S22-03 | 2026-04-10 | Cortex commands registry : table de pointeurs, pas de contenu duplique |

## Verification

- Build app : OK (889ms, JS 440.22kB, CSS 22.12kB)
- Health-check : DEGRADED (0 critical, 1 warning — 83 refs cassees baseline)
- tsc : 0 erreur
- Tests : 19/19 passed
