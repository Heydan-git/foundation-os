---
type: concept
title: "AI agent patterns"
complexity: advanced
domain: dev
created: 2026-04-19
updated: 2026-04-19
confidence: medium
tags:
  - concept
  - ai
  - agent-patterns
  - workflow
  - llm
  - phase-5
status: seed
related:
  - "[[index-concepts]]"
  - "[[nolly-studio-cult-ui-pro]]"
  - "[[Jordan]]"
  - "[[Nolly Studio]]"
  - "[[MCP]]"
  - "[[Foundation OS]]"
  - "[[Shadcn Block Libraries Landscape 2026-04]]"
sources:
  - "[[nolly-studio-cult-ui-pro]]"
---

# AI agent patterns

## Definition

Ensemble de **patterns architecturaux** pour orchestrer des LLMs (agents IA) dans des workflows multi-etapes, utilisant tools / function calling / MCP. Popularise par Anthropic engineering docs + Vercel AI SDK multi-step + LangGraph.

4 patterns canoniques :

### 1. Routing
Un LLM classifie l'input user et route vers le bon agent / prompt specialise. Ex : classifier "question medical" vs "question legal" vs "question general" → prompt dedie.

### 2. Orchestrator-Worker
Un agent "orchestrator" decompose la tache en sous-taches, dispatche a des agents "worker" paralleles, puis synthese les resultats. Ex : un agent projet dispatche a 3 sous-agents (design, code, tests) puis assemble.

### 3. Evaluator-Optimizer
Un agent "evaluator" note la sortie d'un agent "generator", puis boucle pour ameliorer iterativement jusqu'a criteria match. Ex : generateur de code + evaluateur "passe les tests ?" → fix loop.

### 4. Human-in-the-Loop
Pause le workflow a des checkpoints critiques pour validation humaine avant de continuer. Ex : agent drafting un email → pause pour review user → envoi.

## Why It Matters

**Pertinent pour Foundation OS Phase 5** :
- **Sante module** : health council multi-agents (cardiologue + nutritionniste + psychiatre) = **Orchestrator-Worker**
- **Trading module** : strategy selection + backtest + risk analysis = **Routing** + **Evaluator-Optimizer**
- **Finance module** : analyse transactions + categorization + reporting = **Routing** + **Human-in-the-Loop**

Actuellement FOS n'implemente **aucun** de ces patterns formellement. Les sous-agents Claude Code (os-architect, dev-agent, doc-agent, review-agent) sont des agents specialises mais sans orchestration formelle multi-step.

## Sources de reference (classement recommandation)

### Gratuit (prioriser)
1. **Anthropic engineering docs** (https://www.anthropic.com/engineering) — patterns officiels Claude
2. **Vercel AI SDK docs** (https://sdk.vercel.ai/docs) — multi-step + tool calling
3. **LangGraph docs** (https://langchain-ai.github.io/langgraph) — orchestration graph

### Paid (dernier recours)
- [[nolly-studio-cult-ui-pro|Cult UI Pro]] ($179) — implementation UI des 4 patterns + Next.js stack. Value marginal si docs gratuites suffisent.

## Cas d'usage Foundation OS potentiels (Phase 5)

| Module | Pattern privilegie | Rationale |
|--------|-------------------|-----------|
| Sante | Orchestrator-Worker | Health council multi-specialistes |
| Trading | Routing + Evaluator-Optimizer | Classifier marche + boucler optimisation strategy |
| Finance | Routing + Human-in-the-Loop | Transaction categorization avec validation user |
| App Builder | Evaluator-Optimizer | Generation UI + validation via tests |

## Connections

- [[nolly-studio-cult-ui-pro]] — source ref implementation UI
- [[Jordan]] / [[Nolly Studio]] — vendor patterns payants
- [[MCP]] — protocole sous-jacent pour tool calling
- [[Foundation OS]] — Phase 5 application potentielle

## Sources

- [[nolly-studio-cult-ui-pro]] — Cult UI Pro patterns AI
