---
type: concept
title: "Graph Report"
complexity: intermediate
domain: meta
aliases:
  - "god nodes report"
  - "graph health dashboard"
  - "wiki structural report"
created: 2026-04-17
updated: 2026-04-17
tags:
  - concept
  - neuroplasticity
  - graph
  - wiki-health
status: seed
confidence: high
related:
  - "[[index-concepts]]"
  - "[[Neuroplasticite]]"
  - "[[Foundation OS]]"
  - "[[foundation-os-map]]"
  - "[[Confidence Tagging]]"
sources: []
---

# Graph Report

## Definition

Rapport auto-genere de la structure du graphe wiki, consigne dans `wiki/meta/graph-report.md` (pattern source unique comme [[counts]]). Regenere par `scripts/wiki-graph-report.sh` (Phase 4 D-INTEG-01). Quatre sections :

- **God nodes** : pages avec >= N wikilinks entrants (seuil `thresholds.json wiki.graph_report.god_nodes_min_wikilinks`, defaut 10). Ce sont les hubs cognitifs.
- **Orphelins** : pages avec 0 wikilink entrant (hors hot/overview/index-wiki/counts).
- **Surprising connections** : wikilinks reliant 2+ domaines differents (dev ↔ finance, trading ↔ sante).
- **Communities** : groupement des pages par tag primaire ou par cluster de co-citations.

## How It Works

1. Script scanne chaque `.md` dans `wiki/` :
   - compte wikilinks sortants (`grep -oE '\[\[[^]]*\]\]'`)
   - compte wikilinks entrants (`grep -c "[[$basename]]" wiki/ -r`)
2. Classifie chaque page : god node / hub secondaire / feuille / orphelin.
3. Detecte domain(s) via `domain:` frontmatter ou chemin `wiki/domains/<X>/`.
4. Ecrit `wiki/meta/graph-report.md` avec frontmatter `type: meta, status: evergreen`.
5. Mode `--check` compare le fichier existant aux valeurs reelles, exit 1 si drift.
6. Chain dans `scripts/health-check.sh` section INFO (non-bloquant).

## Why It Matters

- **Visibilite structure cognitive** : Kevin voit d'un coup d'oeil quels sont les hubs (pages canoniques) et les orphelins (pages a reconnecter ou archiver).
- **Prevention orphelinage** : complement au ref-checker (qui detecte refs cassees). Le graph report detecte les pages qui *existent* mais que personne ne pointe → futurs fantomes.
- **Detection surprising connections** : les liens cross-domain sont signal de [[Compounding Knowledge]] (ex : pattern trading applique a sante). Interessant pour thinking.md.
- **Complementarite** : ref-checker + wiki-health + counts + graph-report = 4 angles differents sur la meme structure.
- **Scalabilite Phase 5** : quand wiki passe de 43 a 200+ pages (Finance/Sante/Trading), un hub surdimensionne (pattern "etoile") devient fragile. Graph report detecte tot.

## Examples

- `[[Foundation OS]]` avec 12 wikilinks entrants → god node (canonical)
- `[[Void Glass]]` avec 8 wikilinks entrants → hub design
- Hypothetique page `wiki/sources/isolated-paper.md` sans aucun wikilink entrant → orphelin signale
- Wikilink depuis `wiki/concepts/Compounding Knowledge.md` vers `wiki/domains/trading/backtests/*` → surprising connection (cross-domain).

## Connections

- [[Confidence Tagging]] — le graph report peut afficher distribution confidence par community
- [[Neuroplasticite]] — reflex 4 self-check session-end consulte graph report pour detecter stale
- [[foundation-os-map]] — graph report complementaire (map = structure prevue, report = realite observee)
- [[Foundation OS]] — contrat anti-bullshit, pas de metrics inventees, tout verifiable

## Sources

- [Graphify GRAPH_REPORT.md](https://github.com/safishamsi/graphify) — pattern source : god nodes + surprising connections + suggested questions
- Plan : `docs/plans/2026-04-17-integration-sources-externes.md` Phase 4
- Spec canonique : `docs/core/knowledge.md` section 12.2
- Seuils : `scripts/thresholds.json` section `wiki.graph_report`
