---
type: concept
title: "Body"
complexity: advanced
domain: dev
aliases:
  - "Corps"
  - "Module Body"
  - "Proprioception FOS"
created: 2026-04-19
updated: 2026-04-19
tags:
  - concept
  - body
  - alignment
  - core-os
  - canonical-definition
status: canonical
confidence: medium
related:
  - "[[Core OS]]"
  - "[[Foundation OS]]"
  - "[[Alignment]]"
  - "[[Constitution FOS]]"
  - "[[Neuroplasticite]]"
  - "[[index-concepts]]"
sources: []
---

# Body — Proprioception Kevin-Claude

Module Core OS (Phase 8) responsable de l'alignement entre *ce que Kevin demande* et *ce que Claude fait*. Adoption D-BODY-01 (2026-04-19).

## Metaphore

Le cerveau FOS pense (Cortex/Knowledge), le **corps** sent les desalignements. Quand Kevin dit "X" et que Claude fait "X-simplifie", le Body detecte la derive et ramene au scope initial. C'est la proprioception du systeme : l'ancrage intention ↔ action.

## 4 couches

| # | Couche | Role | Fichiers cles |
|---|---|---|---|
| C1 | **Constitution** | Source verite ecrite (~41 P-XX) | `docs/core/constitution.md` |
| C2 | **Intent capture** | Ancrage pre-action (5 champs) | `.omc/intent/YYYY-MM-DD-<slug>.md` |
| C3 | **Feedback structure** | Traces post-action (rating enrichi) | `.omc/alignment/YYYY-MM-DD-<session>.jsonl` |
| C4 | **Learning loop** | Auto-correction (subagent + scripts) | `alignment-auditor` + `alignment-analyze` + `constitution-suggest` |

## Integration 8e module Core OS

- Cortex route la tache → Body surveille que l'execution respecte le scope intent
- Communication section 6.5 L2 → constitution.md chargee au SessionStart
- Monitor chain INFO → `alignment-analyze --quiet` dans health-check
- Tools → +3 scripts (intent-capture / alignment-analyze / constitution-suggest)
- Planner `/plan-os` Tour 1 bis → intent-capture OBLIGATOIRE
- Worktrees → `.omc/intent/` + `.omc/alignment/` versionnes git, cross-worktree via merge
- Knowledge → 3 pages wiki concepts (Body + Alignment + Constitution FOS)

## Workflows

1. **Pre-action check** : avant actions risquees (rm, mv, push, commit > 3 files, refactor >= 1h), relire intent + top 10 P-XX. Desalignement → stop.
2. **Post-action review** : `/session-end` Phase 7bis rating enrichi (4 questions) + Phase 7ter subagent auditor clean-slate.
3. **Learning loop** : Kevin dit "derive" → flag `🎯 to-constitute` lessons-learned → `constitution-suggest.sh` → draft P-XX → Kevin append constitution.md.
4. **Dashboard brief v12** : tuile `🧭 ALIGNMENT` derniere rating + streak + top P-XX viole.

## Sources externes

- [Constitutional AI (Anthropic)](https://arxiv.org/abs/2212.08073) : principes + self-critique
- [Reflexion framework](https://stackviv.ai/blog/reflection-ai-agents-self-improvement) : +11% coding benchmark via verbal self-critique
- [IFEval](https://arxiv.org/abs/2311.07911) : verifiable constraints instruction following
- [AlignmentCheck (Meta, Augment Code)](https://www.augmentcode.com/guides/why-multi-agent-llm-systems-fail-and-how-to-fix-them) : 41.77% des multi-agent failures = specification drift

## Regle d'or

Une demande Kevin = 1 intent capture (si `/plan-os`) + 1 alignment entry a la fin.
Constitution seedee (derive des sources existantes) > constitution inventee.
Auditor = indicateur, Kevin reste juge final.

## Limites explicites

- Pas de LLM-as-judge runtime primary (biais meme instance)
- Pas de hook UserPromptSubmit (API Desktop pas simple)
- Pas d'auto-fix (risque casser intention reelle)
- Discipline-dependent : force par flow `/plan-os`, opt-in ailleurs

## Sources internes FOS

- Spec canonique : `docs/core/body.md`
- Constitution : `docs/core/constitution.md`
- Plan execution : `.archive/plans-done-260419/2026-04-19-body-module-complet.md`
- Decision : D-BODY-01 (CONTEXT.md)
