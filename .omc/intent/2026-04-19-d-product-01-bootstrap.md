# Intent — d-product-01-bootstrap

**Date** : 2026-04-19
**Session / branche** : claude/bold-neumann-7e682b (worktree: bold-neumann-7e682b)
**Spec** : [docs/core/body.md](../../docs/core/body.md) section 3 (Couche C2)

## 1. Verbatim Kevin

> Ok, en fait, depuis qu'on a commencé le projet, on a totalement délaissé Notion et Asana. Du coup, j'aimerais que l'on réintègre dans tout le workflow l'utilisation de Notion et Asana et, pourquoi pas, créer un skills, un agent PO, chef de projet. Tout ce qu'on fait, toutes les phases, tous les trucs qu'on met en place pour l'articuler aussi visuellement sur Notion et Asana, pour créer des Kanban, des EPICs, des US, etc. J'aimerais un agent ou un skills, ou les deux, qui fassent fonctionner tout l'OS, tout en alimentant en même temps, en plus de tous les MD. Je veux que ce soit bidirectionnel. Je veux une full intégration, le truc le plus complet, mais attention, en toute honnêteté, pragmatisme, en étant conscient des limites. Questions: Q1-a espace Notion dedie, Q2-a 1 projet Asana unique avec sections par module, Q3 compromis EPIC=plan US=phase subtasks=6elements, Q4-b full d'un coup meticuleux, Q5-a archive Notion reset propre, Q6-a archive 2 projets Asana creer nouveau unique.

## 2. Ce que je comprends

Kevin veut creer un 9e module Core OS "Product" qui integre bidirectionnellement FOS ↔ Notion + Asana. Full integration via agent PO + skill `/po` + hooks opt-in. Archive propre des anciens espaces Notion (stale depuis 2026-04-03) et Asana (2 projets Setup/Build). Mapping EPIC=plan, US=phase, subtasks=6 elements. Honnetete sur limites MCP (pas de webhooks, rate limits, last-write-wins conflicts). Full d'un coup meticuleux en 1 session Opus 4.7 1M context (pattern D-BODY-01).

## 3. Scope (ce que je VAIS faire — P1 Bootstrap)

- Creer spec canonique `docs/core/product.md` (11 sections, 4 couches pattern body.md)
- Creer agent stub `.claude/agents/po-agent.md` (sonnet, Task invocable, MCP tools whitelist)
- Creer skill stub `.claude/commands/po.md` (subcommandes init/sync/pull/status)
- Creer `scripts/po-init.sh` (orchestrateur complet P1, manifest-driven pattern)
- Creer stubs forward refs `scripts/po-{sync,pull,status}.sh` (exit 0 + pending message)
- Archive Notion : rename "🪐 Foundation OS" existant → "🪐 Foundation OS — Archive 2026-04"
- Creer nouveau espace Notion "🪐 Foundation OS" avec 3 databases (Decisions / Plans / Sessions)
- Creer projet Asana "Foundation OS" via `create_project_preview` (confirmation UI Kevin requise)
- Update `CONTEXT.md` section Modules (ajout row Product) + Decisions (D-PRODUCT-01)
- Update `docs/core/architecture-core.md` table 8→9 modules Core OS
- Persister IDs Notion + Asana dans `.omc/product-config.json`
- Copier plan dual-path `~/.claude/plans/sunny-sauteeing-truffle.md` → `docs/plans/2026-04-19-product-module-full-integration.md`
- Verifier health-check SAIN + ref-checker 0 broken + scripts stubs testables
- Commit atomique P1 conventional format `feat(os): P1 bootstrap module Product ...`

## 4. Anti-scope (ce que je ne VAIS PAS faire)

- Implementer po-sync.sh / po-pull.sh / po-status.sh complets (ce sont P2/P3)
- Creer tuile brief v12 #16 📊 PRODUCT dans communication.md (c'est P3)
- Creer hooks SessionStart/End product-*.sh + modif settings.json (c'est P4)
- Creer wiki/concepts/{Product Management, Notion integration, Asana integration}.md (c'est P5)
- Push contenu reel (decisions CONTEXT.md, plans, sessions) vers Notion DB ou Asana (c'est P2)
- Pull etat Notion/Asana vers FOS (c'est P3)
- Tester end-to-end scenarios S1-S4 (c'est P5)
- Archive manuelle Notion anciens sous-pages (rename suffit, preservation historique)
- Sync Wiki → Notion (hors scope entierement, spec product.md section 4)
- 3-way merge conflits (YAGNI solo, last-write-wins section 8)
- Modifier `.claude/settings.json` (hooks P4 uniquement)
- git push origin main (attendre P5 ou Kevin validation explicite)

## 5. Signaux de drift anticipes

- Si je modifie plus de 20 fichiers hors scope P1 → alerte (P1 attend ~15-18 fichiers)
- Si je passe plus de 5h sur P1 → alerte (estimate 4-5h)
- Si je me retrouve a implementer po-sync.sh complet → stop, c'est P2 scope
- Si je cree tuile brief v12 ou hooks → stop, c'est P3/P4 scope
- Si je touche wiki/ pages non-meta → stop, c'est P5 scope
- Si health-check passe DEGRADED → stop + fix avant continuer (pattern D-BODY-01 P1 forward stubs)
- Si ref-checker flag broken refs → stop + fix avant commit (stubs forward preventifs)
- Si Kevin challenge cadrage → stop + reouvrir intent, pas defendre
- Si rate limit MCP 429 → batching + sleep, pas de retry aggressif
- Si MCP Notion/Asana errors inattendues → log + remonter a Kevin honnetement P-11

---

**Apres completion** : ce fichier sera lu par `alignment-auditor` (subagent clean-slate) au `/session-end` Phase 7ter, qui comparera scope declare vs actions reelles (git diff) pour produire un rapport JSON append `.omc/alignment/auditor-2026-04-19-d-product-01-bootstrap.json`.
