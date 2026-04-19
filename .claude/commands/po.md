# /po — Module Product Foundation OS (Notion only)

> Skill qui gere l'integration bidirectionnelle FOS <-> **Notion**.
> Decision : D-PRODUCT-01. Pivot Notion-only P1.5 (2026-04-19). Spec canonique : `docs/core/product.md`.
> **Stub P1** : subcommandes implementees progressivement P1-P3. Plan : `.archive/plans-done-260419/2026-04-19-product-module-full-integration.md`.

## Subcommandes

### `/po init` (P1, IMPLEMENTE)

Archive contenu existant Notion + scaffold nouveaux espace et 4 databases (Decisions / Plans / Sessions / Tasks) + views (Kanban / Board / Timeline).

**Invocation** :

```bash
bash scripts/po-init.sh [--dry-run]
```

**Comportement** :

1. Script genere manifest `.omc/po-manifests/YYYY-MM-DD-HHMM-init.json` listant actions MCP a executer
2. Claude lit manifest + execute MCP Notion calls (rename / create_pages / create_database x4 / create_view x3-4)
3. Claude persiste IDs dans `.omc/product-config.json`

**Limites** :

- Nouveau root Notion cree enfant temporaire de l'archive (limite MCP : creation workspace-level non supportee). Kevin peut deplacer manuellement au top-level via Notion UI.

### `/po sync [--dry-run|--plan <slug>|--since <date>]` (P2, stub P1)

Push FOS → Notion. Parse etat FOS (CONTEXT.md + plans + sessions + TodoWrite) et cree/update rows Notion.

**Mapping** :

- 1 plan `docs/plans/<slug>.md` = 1 row DB Plans
- 1 phase du plan = 1 row DB Tasks (Type=Phase, Plan ref=relation)
- 1 element des 6-stricts = 1 row DB Tasks (Type=Element, Phase=P1-P5, Element=1-6)
- 1 TodoWrite item courant = 1 row DB Tasks (Type=Task)
- 1 decision CONTEXT.md = 1 row DB Decisions
- 1 session wiki/meta/sessions-recent.md = 1 row DB Sessions

**Modes** :

- `--dry-run` : preview actions sans executer
- `--plan <slug>` : sync un seul plan (par slug)
- `--since YYYY-MM-DD` : decisions + sessions recentes seulement

### `/po pull [--preview|--apply|--interactive]` (P3, stub P1)

Pull Notion → FOS. Detecte changements Kevin (Status move kanban, commentaire, priorite) et propose updates FOS.

**Modes** :

- `--preview` : affiche diff sans apply
- `--apply` : auto-apply updates triviales (Status → TodoWrite order, commentaires → append brief tuile #16)
- `--interactive` : demande confirmation par update

### `/po status` (P3, stub P1)

Diff FOS vs Notion. Affiche divergences (decisions manquantes, plans non-synces, tasks orphelines, conflits log). Chainable dans `scripts/health-check.sh --quiet`.

**Invocation** :

```bash
bash scripts/po-status.sh [--quiet]
```

## Securite

Respecte regle **source of truth** (spec product.md section 8) :

- **FOS gagne structure** (schema, decisions, code)
- **Notion gagne ordre/priorite humaine** (Kevin drag cards kanban)
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
- **Config** : `.omc/product-config.json` (IDs 4 DB Notion)
