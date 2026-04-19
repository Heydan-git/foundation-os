# /po — Module Product Foundation OS

> Skill qui gere l'integration bidirectionnelle FOS <-> Notion + Asana.
> Decision : D-PRODUCT-01. Spec canonique : `docs/core/product.md`.
> **Stub P1** : subcommandes implementees progressivement P1-P3. Plan : `docs/plans/2026-04-19-product-module-full-integration.md`.

## Subcommandes

### `/po init` (P1, IMPLEMENTE)

Archive contenu existant Notion + Asana (si present) et scaffold nouveaux espaces (espace Notion avec DB Decisions / Plans / Sessions + projet Asana unique avec sections par module + custom field Status).

**Invocation** :

```bash
bash scripts/po-init.sh [--dry-run]
```

**Comportement** :

1. Script genere manifest `.omc/po-manifests/YYYY-MM-DD-HHMM-init.json` listant actions MCP a executer
2. Claude lit manifest + execute MCP calls (Notion : rename / create / DB ; Asana : create_project_preview pour creation)
3. Claude persiste IDs dans `.omc/product-config.json`

**Limites** :

- Archive projet Asana **manuel** (MCP ne supporte pas `update_project archived=true`). Kevin doit archiver via UI.
- Creation projet Asana via `create_project_preview` → confirmation UI Kevin requise.

### `/po sync [--dry-run|--plan <slug>|--since <date>]` (P2, stub P1)

Push FOS → Notion + Asana. Parse etat FOS (CONTEXT.md + plans + sessions) et cree/update rows Notion + tasks Asana.

**Mapping** :

- 1 plan `docs/plans/<slug>.md` = 1 EPIC Asana (section = module detecte)
- 1 phase du plan = 1 US Asana (sous EPIC)
- 1 element des 6-stricts = 1 subtask Asana (sous US)
- 1 decision CONTEXT.md = 1 row Notion DB Decisions
- 1 session wiki/meta/sessions-recent.md = 1 row Notion DB Sessions

**Modes** :

- `--dry-run` : preview actions sans executer
- `--plan <slug>` : sync un seul plan (par slug)
- `--since YYYY-MM-DD` : decisions + sessions recentes seulement

### `/po pull [--preview|--apply|--interactive]` (P3, stub P1)

Pull Notion + Asana → FOS. Detecte changements Kevin (move card, commentaire, priorite) et propose updates FOS.

**Modes** :

- `--preview` : affiche diff sans apply
- `--apply` : auto-apply updates triviales (ordre priorite → TodoWrite order, commentaires → append brief tuile #16)
- `--interactive` : demande confirmation par update

### `/po status` (P3, stub P1)

Diff FOS vs externe. Affiche divergences (decisions manquantes, plans non-synces, conflits log). Chainable dans `scripts/health-check.sh --quiet`.

**Invocation** :

```bash
bash scripts/po-status.sh [--quiet]
```

## Securite

Respecte regle **source of truth** (spec product.md section 8) :

- **FOS gagne structure** (schema, decisions, code)
- **Notion/Asana gagnent ordre/priorite humaine** (Kevin drag cards)
- **Last-write-wins par champ** sur conflit (log `.omc/po-conflicts.log`)

## Hooks auto (P4, opt-in)

Default OFF. Activation via env `PRODUCT_MCP_SYNC=1` :

- SessionStart : pull leger (timeout 10s non-bloquant)
- SessionEnd : push best-effort (retry 1x, skip si MCP down)

## Integration

- **Spec** : `docs/core/product.md`
- **Agent invocable** : `.claude/agents/po-agent.md` (Task pour taches complexes)
- **Scripts** : `scripts/po-{init,sync,pull,status}.sh`
- **Brief v12** : tuile #16 📊 PRODUCT (P3)
