---
type: concept
title: "Confidence Tagging"
complexity: intermediate
domain: meta
aliases:
  - "frontmatter confidence"
  - "claim granularity"
  - "confidence scale"
created: 2026-04-17
updated: 2026-04-17
tags:
  - concept
  - neuroplasticity
  - frontmatter
  - wiki-schema
status: seed
confidence: high
related:
  - "[[index-concepts]]"
  - "[[Neuroplasticite]]"
  - "[[Foundation OS]]"
  - "[[Core OS]]"
  - "[[Graph Report]]"
sources: []
---

# Confidence Tagging

## Definition

Granularisation systematique de la confiance dans chaque page wiki via la clef frontmatter `confidence:`. Trois valeurs standard :

- **high** : fact verifie multi-session, stable, jamais contredit
- **medium** : observation single-session, pas de contradiction connue
- **low** : draft, hypothese, en attente de validation

Clef optionnelle complementaire `claim_type:` avec valeurs `extracted | inferred | speculated` pour tracer comment le contenu a ete produit (inspire du tagging Graphify EXTRACTED/INFERRED/AMBIGUOUS).

## How It Works

1. Chaque page wiki (concept, entity, source, domain) declare son niveau de confiance dans le frontmatter YAML.
2. Script `scripts/wiki-confidence-audit.sh` (Phase 3 D-INTEG-01) scanne l'absence de la clef :
   - Mode `--check` : exit 1 si drift detecte (chain health-check INFO)
   - Mode `--fix` : prompt interactif high/medium/low par page
3. Templates `wiki/meta/templates/*.md` integrent `confidence: medium` par defaut (seed fraiche = medium, pas high).
4. Mapping automatique en fonction du `status:` existant :
   - `canonical | evergreen | mature` → suggere `high`
   - `seed` (contenu etoffe) → suggere `medium`
   - `seed` (contenu stub < 30L) → suggere `low`

## Why It Matters

- **Preparation Phase 5** (Finance / Sante / Trading) : domaines ou l'ecart entre "fact verifie par biologiste" et "hypothese de Claude" est critique. Pas le droit a l'ambiguite sur un bilan bio.
- **Discipline cognitive Claude** : en lisant une page, Claude sait si citer tel quel (high), avec nuance (medium), ou re-verifier (low).
- **Audit honnete** : permet de detecter les pages "seed" qui trainent depuis 30j sans promotion → signal stale.
- **Scale granulaire** : finding Explore 2026-04-17 F1 revelait 63% pages avec `confidence: high` uniforme, plafond artificiel. La scale granulaire reflete la realite.

## Examples

- `wiki/concepts/Foundation OS.md` (canonical + definition stable multi-session) → `confidence: high`
- `wiki/concepts/Core OS.md` (seed mais stable, architecture 7 modules) → `confidence: high`
- `wiki/concepts/TDAH workflow.md` (seed court, idee encore en cours) → `confidence: medium`
- Hypothese thinking.md "Compounding Knowledge s'applique aux backtests Trading ?" → si formalisee en page, `confidence: low + claim_type: speculated`

## Connections

- [[Graph Report]] — inclura section "pages par confidence" (distribution high/medium/low)
- [[Neuroplasticite]] — reflex 3 lessons-learned peut rabaisser confidence si erreur detectee
- [[Layered Loading]] — L3 wiki recall peut filtrer par confidence minimum
- [[Foundation OS]] — contrat de verite Kevin-Claude, "jamais mentir/halluciner"

## Sources

- [Graphify confidence tags](https://github.com/safishamsi/graphify) — pattern EXTRACTED/INFERRED/AMBIGUOUS
- Finding Explore `2026-04-17 F1` : 37% pages wiki sans confidence, 63% avec `high` uniforme
- Plan : `docs/plans/2026-04-17-integration-sources-externes.md` Phase 3
- Spec canonique : `docs/core/knowledge.md` section 12.1
