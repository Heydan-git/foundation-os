---
type: concept
title: "Pre-compaction Snapshot"
complexity: intermediate
domain: meta
aliases:
  - "pre-compression snapshot"
  - "auto-save hook"
  - "context rescue"
created: 2026-04-17
updated: 2026-04-17
tags:
  - concept
  - neuroplasticity
  - hooks
  - session-continuity
status: seed
confidence: high
related:
  - "[[index-concepts]]"
  - "[[Hot Cache]]"
  - "[[Neuroplasticite]]"
  - "[[Foundation OS]]"
  - "[[Layered Loading]]"
sources: []
---

# Pre-compaction Snapshot

## Definition

Snapshot atomique de la memoire active de session **AVANT** que Claude Code compacte le contexte (auto-compaction sur sessions longues > 100k tokens). Dump dans `.omc/snapshots/YYYYMMDD-HHMM.md` contenant :

- `wiki/hot.md` verbatim (L0 courant)
- Section "Cap + Prochaine action" de `CONTEXT.md`
- Dernier TodoWrite connu (extrait du transcript JSONL Claude Code)

Rotation : les 14 derniers snapshots sont conserves, les plus anciens auto-prunes.

## How It Works

1. Hook Claude Code Desktop `PreCompaction` (a verifier API, fallback possible `Stop` matcher) declenche `scripts/hooks/pre-compaction-snapshot.sh`.
2. Script lit hot.md + extrait section CONTEXT + parse dernier TodoWrite depuis `~/.claude/projects/.../sessions/*.jsonl`.
3. Ecrit atomiquement `.omc/snapshots/YYYYMMDD-HHMM.md`.
4. Prune les snapshots > 14 (garde les plus recents).
5. Retourne exit 0 (hook non-bloquant, meme si echec).

## Why It Matters

- **Recovery post-compaction** : apres compaction auto, Claude perd 50-80% du contexte. Le snapshot permet de recuperer la memoire active en une lecture (`cat .omc/snapshots/$(ls .omc/snapshots | tail -1)`).
- **Sessions ultra-longues** : Phase 5 domaines sante/finance/trading genereront des sessions tres longues (ingest papers + analyse). Sans snapshot, perte nette.
- **Complement neuroplasticite** : les 4 reflexes (recall wiki, consolidation, lessons-learned, self-check) protegent la memoire **entre** sessions. Le snapshot protege la memoire **pendant** une session longue.
- **Non-intrusif** : hook best-effort, jamais bloquant. Si API Desktop n'expose pas `PreCompaction`, fallback manuel via alias bash.

## Examples

- Session 2h sur ingest 5 papers sante : snapshot toutes les 45 min permet de reprendre sans relire les papers.
- Session audit mapping 128 fichiers : snapshot pre-compaction preserve findings bruts + plan en cours.
- Nouveau Claude redemarrant session interrompue : lecture `cat .omc/snapshots/$(ls -t .omc/snapshots | head -1)` recupere hot + cap + todos instantanement.

## Connections

- [[Hot Cache]] — le snapshot etend hot.md temporellement (pas overwrite, append serie datee)
- [[Layered Loading]] — capture L0 + extrait L1 (cap CONTEXT)
- [[Neuroplasticite]] — sauvegarde les reflexes en cours (TodoWrite = reflex 4 self-check active)
- [[Foundation OS]] — anti-perte-de-contexte, un des 5 objectifs de l'OS

## Sources

- [MemPalace auto-save hook](https://github.com/MemPalace/mempalace) — pattern : snapshot pre-compression Claude Code
- Plan : `docs/plans/2026-04-17-integration-sources-externes.md` Phase 2
- Spec canonique : `docs/core/knowledge.md` section 12.4
- Rotation : 14 derniers (configurable via `scripts/thresholds.json` si besoin Phase 2)
