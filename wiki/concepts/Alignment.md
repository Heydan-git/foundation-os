---
type: concept
title: "Alignment"
complexity: advanced
domain: dev
aliases:
  - "Alignement Kevin-Claude"
  - "Faithfulness"
  - "Intent fidelity"
created: 2026-04-19
updated: 2026-04-19
tags:
  - concept
  - alignment
  - scope-drift
  - llm
  - faithfulness
status: canonical
confidence: medium
related:
  - "[[Body]]"
  - "[[Constitution FOS]]"
  - "[[Foundation OS]]"
  - "[[Neuroplasticite]]"
  - "[[index-concepts]]"
sources: []
---

# Alignment — Scope drift et faithfulness

Concept cross-domain : mesurer et reduire l'ecart entre l'intention utilisateur et l'action/output LLM. Pivot de la recherche agentic 2024-2026.

## Definitions operationnelles

| Terme | Definition | Ref |
|---|---|---|
| **Scope drift** | Action de l'agent qui sort du scope declare de la demande | Meta AlignmentCheck |
| **Faithfulness** | Degre de fidelite entre prompt utilisateur et output. SLO typique : >= 0.92 | Maxim Agent Observability |
| **Specification drift** | Instructions perdues pendant l'execution multi-step | 41.77% des multi-agent failures |
| **Instruction following** | Capacite a executer des contraintes verifiables (longueur, keywords, format) | IFEval benchmark (25 types) |

## Patterns detection

### Constitutional AI (Anthropic, 2022+)

Set de principes ecrits. Le modele genere reponse → critique contre principes → revise. Training-time ou runtime (self-critique). Anthropic a publie sa [constitution publique](https://time.com/7354738/claude-constitution-ai-alignment/) en janvier 2026.

### Reflexion framework

Generate → Critique → Refine loop avec episodic memory. Boost GPT-4 coding benchmark 80% → 91% via verbal self-critique stocke. Applicable a la revision post-session.

### AlignmentCheck (Meta)

Compare sequence d'actions vs objectif utilisateur. Flag deviations (covert prompt injection / misleading tool output / hijacked instructions). "Scope is enforced by architecture, not just instruction."

### IFEval / AGENTIF

25 types de contraintes **objectivement verifiables** ("write > 400 words", "mention keyword 3x"). Hybrid verification = code check + LLM judge. Extension AGENTIF pour agents function-calling.

## Application Foundation OS (D-BODY-01)

Le module [[Body]] implemente 4 couches :
1. **Constitution** (~41 P-XX) = set principes lisibles
2. **Intent capture** = ancrage pre-action (5 champs)
3. **Feedback structure** = traces post-action enrichies
4. **Learning loop** = subagent auditor clean-slate + script constitution-suggest

## Limites alignment measurement

- **Biais auto-juge** : LLM-as-judge sur son propre output = biais. Subagent clean-slate reduit mais n'elimine pas.
- **Contraintes non-verifiables** : "Etre clair" = subjectif, pas IFEval-able. Faut accepter zone grise.
- **Intent ambigu** : si Kevin n'explicite pas, scope fluctuant. D'ou obligation `/plan-os` → intent capture 5 champs.

## Metriques typiques

- `scope_respected: bool` (fichiers touches vs scope declare)
- `interpretation_faithful: bool` (comprends vs verbatim)
- `honest_claims: bool` (claims verifiables)
- `drift_categories: [...]` (7 categories FOS)
- Streak detection (3 N consecutifs = retrospective)
- Pattern 7-dernieres (tendance)

## Sources

- [Constitutional AI arxiv 2212.08073](https://arxiv.org/abs/2212.08073)
- [IFEval arxiv 2311.07911](https://arxiv.org/abs/2311.07911)
- [Reflexion framework 2026](https://stackviv.ai/blog/reflection-ai-agents-self-improvement)
- [AlignmentCheck / specification drift](https://www.augmentcode.com/guides/why-multi-agent-llm-systems-fail-and-how-to-fix-them)
- [Agent Observability (Maxim)](https://www.getmaxim.ai/articles/agent-observability-the-definitive-guide-to-monitoring-evaluating-and-perfecting-production-grade-ai-agents/)
- [AGENTIF benchmark](https://keg.cs.tsinghua.edu.cn/persons/xubin/papers/AgentIF.pdf)
