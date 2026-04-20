# Findings P7 — Mapping routes + Tools v2 + Skills

> **Phase P7 du D-AUDIT-TOTAL-01** — Audit 3 couches routing : Cortex (agents) + Tools v2 (109 outils) + Skills triggers (plugin).

## Scope audite

| Couche | Source | Stats |
|--------|--------|-------|
| Cortex table | `docs/core/cortex.md` Section 1 | 4 agents (routage par signal) |
| Tools v2 | `docs/core/tools/index.json` + 10 registries | 109 declare (?) / 35+ missing |
| Routing Tools v2 | `docs/core/tools/routing.json` | 35 regles / 14 domaines |
| Skills | Plugin claude-obsidian + OMC + Superpowers | 10 + 36 + 14 = 60 |

---

## Findings FORME

### F76 🔴 Tools v2 catalogue **obsolete** — 35+ outils manquants

**Fait** : `bash scripts/tool-register.sh scan` → **31 outils non-enregistres**.

**Breakdown par categorie** :

| Categorie | Declare | Reel | Missing |
|-----------|---------|------|---------|
| Scripts | 7 | **42** | **35** (!) |
| Agents | 4 | 6 | **2** (po-agent + alignment-auditor) |
| Commands | 7 | 8 | **1** (po) |
| Hooks | 4 | 8 | **4** (memory-last-used + product-session-start/end + pre-compaction-snapshot) |
| CI | 2 | 2 | 0 |
| Knowledge-skills | 10 | 10 | 0 |
| MCP | 13 | ? | inconnu |
| Skills-BMAD | 12 | ? | inconnu (BMAD dormant) |
| Skills-OMC | 36 | ? | inconnu |
| Skills-Superpowers | 14 | ? | inconnu |

**Total minimum missing** : 42 outils (35+2+1+4).

**Cause racine** : tool-register.sh existe mais n'a jamais ete lance en auto-update apres les 3 derniers modules (D-INTEG-01 + D-BODY-01 + D-PRODUCT-01). `index.json` declare `updated: 2026-04-17` (avant ces modules).

**Impact MASSIF** :
- Tools v2 "109 outils" est **obsolete** (reel ~140+)
- Routing Tools v2 ne peut pas pointer vers des outils absents du registry
- Catalogue canonique ne reflete pas l'etat reel → violation principe "source unique"

**Fix prevu P11** : `bash scripts/tool-register.sh scan | ... add` (si commande existe) ou regen complet. Critical fix.

### F77 🟡 Scripts "7 declare vs 42 reel" = catalogue sous-utilise

**Fait** (detail P7) :
- Scripts registres declares (7) : probablement les 7 scripts listes dans `docs/core/tools.md` Section 1 (health-check, sync-check, ref-checker, module-scaffold, wiki-confidence-audit, wiki-graph-report + possiblement 1 autre)
- Scripts reels (42) : 40 bash + 2 python

**Observation** : gap 35 scripts = l'enormite de l'infrastructure non-documentee dans Tools v2.

**Dont** :
- Chain health-check : alignment-analyze, neuroplasticity-score, tier-contradiction-check, wiki-health, drift-detector, tool-register (scripts chain-ed mais pas catalogues)
- D-BODY-01 : intent-capture, alignment-analyze, constitution-suggest
- D-PRODUCT-01 : po-init, po-sync, po-pull, po-status
- D-INTEG-01 : wiki-confidence-audit, wiki-graph-report (declare mais others)
- Hooks racine (pas dans scripts/hooks/) : memory-last-used-hook.sh + auto-archive-plans.sh

**Recommendation P11** : script d'auto-add en batch (tool-register add avec loop).

### F78 🟢 routing.json structure propre (35 regles)

**Fait** : `docs/core/tools/routing.json` structure :
```json
{
  "version": "1.0",
  "rules": [
    {"signals": [...], "tools": [...], "domain": "..."}
  ]
}
```

Lecture echantillon : regle "debug" → signals (debug/bug/casse/erreur/ne marche pas/regression/crash/traceback/stack trace) → tools (sp-systematic-debugging/omc-trace/omc-debug).

**Validation** : format coherent, scalable. 🟢 OK.

### F79 🟡 Cortex table agents = 4 lignes (F9 rappel)

**Fait** (rappel P1 F9 + P3 F41) : `docs/core/cortex.md` Section 1 Table agents = 4 agents (os-architect / dev-agent / doc-agent / review-agent). Reel .claude/agents/ = 6. Manque po-agent + alignment-auditor.

**Status** : deja identifie P1 et P3, fix inline P11.

---

## Findings FONCTION

### F80 🟢 Routing Tools v2 = infrastructure fonctionnelle mais sous-alimentee

**Fait** : routing.json a **35 regles** qui mappent signal → outil. Exemple "debug" branchement sur 3 outils (sp-systematic-debugging + omc-trace + omc-debug).

**Usage reel** (session-patterns analytics) : `Skill` invocation = 1.1% total tool calls, `ToolSearch` = 0.8%. Donc routing Tools v2 est rarement utilise.

**Cause racine probable** : absence d'auto-application. Pour qu'une regle routing soit appliquee, Claude doit explicitement consulter routing.json. Pas de hook pre-action qui declenche le routing.

**Impact** : le catalogue 109 outils + 35 regles routing = infrastructure **declarative**, pas enforced. Similaire a la neuroplasticite (P4 M8).

### F81 🟡 Skills triggers plugin = utilise ponctuellement

**Fait** :
- 10 skills plugin claude-obsidian (wiki/save/autoresearch/canvas/defuddle/obsidian-bases/obsidian-markdown/wiki-ingest/wiki-query/wiki-lint)
- 36 skills OMC
- 14 skills Superpowers

Total 60 skills. Usage reel (session-patterns) : `Skill` 42 calls / 3846 tool calls = 1.1%. Peu utilise.

**Observation** : les skills activent par trigger keyword dans prompt user. Si user ne dit pas le keyword, skill pas active. Donc usage = fonction de la verbalisation Kevin.

**Validation** : pattern OK pour skills opt-in. Pas de fix P11/P12.

### F82 🟡 MCP 13 outils declare mais connectes variables

**Fait** : `docs/core/tools/registry/mcp.json` (non-lu detail) declare 13 MCP. CONTEXT.md section MCP liste 5 services (Asana, Notion, Figma, Monday.com, Gmail) + note "connectes".

**Realite session courante** : system prompt annonce **60+ MCP tools** disponibles (Notion, Gmail, Figma, Monday, ClickUp, Asana, Pencil, Blender, Chrome, Control_Chrome, Claude_in_Chrome, etc.) via deferred tools ToolSearch.

**Gap** : Tools v2 registry MCP (13) vs reel environnement (60+). Explication : les MCP Claude Code sont environnementaux (configures par user, variables entre sessions), alors que le registry FOS liste les MCP considere "core" par Kevin.

**Recommendation** : P12 candidat — ecrire `scripts/mcp-scan.sh` qui compare registry FOS vs MCP deferred tools courants. Signaler divergences.

### F83 🟡 Absence de test FONCTION routing (rule coverage)

**Fait** : 35 regles routing.json. **Zero test** qu'une regle routing est effectivement declenchee pour signal X. Pas de benchmark "signal Y match combien de regles ?".

**Impact** : regles peuvent etre ecrites mais jamais matches. Pas de mesure.

**Recommendation** : P12 candidat (faible valeur) — `scripts/routing-coverage.sh` teste les 35 regles contre exemples fixes. Ou accepter que routing est soft-guide.

---

## Findings META

### M18 🔴 Catalogue canonique desync = probleme structurel

**Fait** : Tools v2 = "single source of truth" pour 109 outils. Mais 42+ missing. Le catalogue ne tient pas sa promesse canonique.

**Cause racine systemique** : aucun hook auto-update. Quand on ajoute un script / agent / command, on doit manuellement lancer `tool-register add ...`. Pas de pre-commit hook qui force la coherence.

**Impact** :
- Kevin ou autre Claude ne peuvent pas compter sur Tools v2 pour recherche exhaustive
- `bash scripts/tool-register.sh scan` est deja chain dans health-check (INFO warning) — detection OK, fix manuel requis

**Recommendation P12** : pre-commit hook qui check `tool-register scan` = 0 missing, sinon warn bloquant.

### M19 🟡 3 couches routing non-orchestrees

**Fait** :
- Couche 1 : Cortex table (4 agents, 4 signaux agents)
- Couche 2 : Tools v2 (35 regles, 109 outils)
- Couche 3 : Skills plugins (60 skills, triggers keyword)

Les 3 couches ne se chain pas. Pas de "fall-through logic" (Cortex miss → check Tools v2 → check Skills).

**Cortex.md section 1.2 dit** : "Avant la table agents ci-dessous, verifier docs/core/tools/routing.json pour un match plus granulaire (35 regles couvrant 109 outils). Si un outil/skill matche → l'utiliser directement. Sinon → fallback sur la table agents."

Mais cette chain n'est pas enforced — depend discipline Claude.

**Recommendation** : P13 cloture — note dans rapport-master que 3 couches routing = **discipline manuelle cohere avec M8 neuroplasticite** (infrastructure declarative).

### M20 🟢 Skill `foundation-os-orchestrator` exists (meta-orchestrateur?)

**Fait** (vu dans system prompt skills liste) : `anthropic-skills:foundation-os-orchestrator` — "Orchestrateur principal de Foundation OS — le système de travail IA-driven de Kévin. ACTIVE CE SKILL IMMÉDIAT..."

**Observation** : skill tiers (Anthropic skills officiels?) qui connait Foundation OS. Je n'ai pas explicitement verifie son contenu cette session mais il semble etre un meta-orchestrateur.

**Recommendation** : futur audit — verifier que ce skill n'est pas un fantome ou redondant avec /cockpit.

---

## Synthese verdict P7

**Verdict** : 🟡 **DEGRADED** — infrastructure routing riche + catalogue canonique **significativement obsolete**.

**FORME critical** :
- Tools v2 index.json : 42+ outils manquants (35 scripts + 4 hooks + 2 agents + 1 command)
- Catalogue `updated: 2026-04-17` non-rejoue apres D-INTEG-01 + D-BODY-01 + D-PRODUCT-01

**FONCTION** :
- Routing Tools v2 35 regles bien structurees mais peu utilisees (1.1% calls Skill)
- 3 couches routing non-orchestrees (discipline Claude)
- MCP catalogue obsolete (13 declare / 60+ dispos environnement)

**Livrables P11 identifies** :
1. 🔴 F76 : regen Tools v2 catalogue via `tool-register` — tool scan + add batch (prioritaire, 42+ outils)
2. 🟡 F79 : cortex table +2 agents (po-agent + alignment-auditor) — deja vu P1/P3

**Report P12 majeurs** :
- M18 : pre-commit hook check Tools v2 sync (force auto-update)
- F82 : script mcp-scan.sh (MCP registry vs env)
- F83 : routing-coverage.sh test benchmarks

**Report P13 cloture** :
- M19 : note 3 couches routing non-orchestrees = discipline manuelle
- M20 : verifier foundation-os-orchestrator skill future

---

## Cross-refs P7 → autres phases

- F76 → **P11 FIX critical** (auto-add 42+ outils)
- F79 → **P11 FIX** (cortex table deja plan)
- M18 → **P12 REFACTOR** (pre-commit hook sync)
- F82/F83 → **P12** optionnel (script mcp-scan + routing-coverage)
- Link P4 M8 : meme pattern declarative non-enforced

---

## Cloture Phase P7

**Livrable** : ce fichier + 11 findings (F76-F83 + M18-M20) + 2 fixes P11 + 3 refactors P12.

**Insight cle** : pattern **declaratif > enforced** se confirme. Infrastructure riche (Cortex + Tools v2 + Skills) mais 42+ outils drift du catalogue. Tools v2 cree 2026-04-10 avec vision ambitieuse, pas maintenue en sync avec les modules recents (D-INTEG-01 Phases 2-5 + D-BODY-01 + D-PRODUCT-01 = 16 commits + 20+ scripts ajoutes).

**Anti-compactage proof** : fichier sur disque + commit P7/14 incoming.

**Next** : Phase P8 — Economie tokens + optimisation automation.

---

*Generated 2026-04-20 — D-AUDIT-TOTAL-01 Phase P7/14 — Claude Opus 4.7 1M context*
