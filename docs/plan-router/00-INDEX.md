# Plan-Router — Index

> Initiative Foundation OS — optimisation tokens par phase de plan
> Date d'ouverture : 2026-04-08
> Statut global : PROPOSITION (pending validation Kevin sur 01-spec section 12)

## Objectif

Annoter chaque phase d'un plan Foundation OS avec un profil d'execution (model + effort + agent) defini avant execution, pour que Claude Code utilise le model le moins cher capable de tenir la phase. MD first, source unique versionnee, pas d'auto-magie.

## Contenu du dossier

| # | Fichier | Role | Statut |
|---|---------|------|--------|
| 00 | `00-INDEX.md` | Index de l'initiative (ce fichier) | actif |
| 01 | `01-spec.md` | Spec complete : probleme, catalogue de profils, convention frontmatter, integration, garde-fous, questions ouvertes | PROPOSITION |
| 02 | `02-setup.md` | Plan d'implementation pas a pas, 8 phases dogfoodees (chaque phase porte deja son propre bloc routing) | PROPOSITION |

## Catalogue de profils (resume)

| Profil | Model | Effort | Usage |
|--------|-------|--------|-------|
| SCAN | haiku-4.5 | low | Lire, lister, smoke tests |
| CODE | sonnet-4.6 | medium / `think` | Edition, fix, refactor |
| ARCHITECT | opus-4.6 | high / `ultrathink` | ADR, schema DB, trade-offs |
| AUDIT | sonnet-4.6 | high / `think hard` | Cross-check, hunt findings |
| DOC | haiku-4.5 | low | MAJ CONTEXT, livrables |

Source de verite complete : `01-spec.md` section 3.

## Prochaines actions

1. Kevin lit `01-spec.md` integralement
2. Kevin tranche les 6 questions section 12
3. Go execution `02-setup.md` Phase 2 (en session Claude Code CLI, pas Cowork)

## Decisions liees (a logger dans CONTEXT.md une fois validees)

| ID | Date | Detail |
|----|------|--------|
| D-PR-01 | TBD | Frontmatter HTML comment vs YAML pur |
| D-PR-02 | TBD | Effort = thinking only ou + verbosity |
| D-PR-03 | TBD | Hook PreSessionStart possible ou non |
| D-PR-04 | TBD | Catalogue global v1 ou par-module |
| D-PR-05 | TBD | Seuil calibration (reco : 10 sessions) |
| D-PR-06 | TBD | Annotation retroactive ou non (reco : non) |

## References externes

- `docs/core/cortex.md` — routing actuel mots-cles → agent
- `docs/core/tools.md` — conventions scripts
- `.claude/agents/*.md` — frontmatter sub-agents actuels
- Issue Claude Code 31536 — feature request effortLevel par sub-agent
- Sub-agents docs : https://code.claude.com/docs/en/sub-agents
