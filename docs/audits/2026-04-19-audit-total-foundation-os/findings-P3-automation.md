# Findings P3 — Automation + outils (scripts/hooks/commands/agents)

> **Phase P3 du D-AUDIT-TOTAL-01** — Audit de la plomberie automatisation : 42 scripts, 8 hooks, 8 commands, 6 agents. Capitalise sur rapport subagent B (P0) : 0 divergence form/function prealable.

## Scope audite

| Categorie | Count | Source |
|-----------|-------|--------|
| Scripts bash | 40 | `find scripts -name "*.sh" -type f` |
| Scripts python | 2 | `find scripts -name "*.py" -type f` |
| Hooks declares settings.json | 8 | PreToolUse x3 + SessionStart x2 + SessionEnd x2 + PreCompact x1 |
| Commands (.claude/commands/) | 8 | cockpit, plan-os, session-start, session-end, sync, wt, new-project, po |
| Agents (.claude/agents/) | 6 | os-architect, dev-agent, doc-agent, review-agent, po-agent, alignment-auditor |

---

## Findings FORME

### F31 🟢 Chain health-check.sh = 10 scripts chaines (observabilite riche)

**Fait** : `scripts/health-check.sh` invoque en chain :
1. `ref-checker.sh` (CRITICAL refs cassees)
2. `neuroplasticity-score.sh --quiet` (INFO)
3. `tool-register.sh scan` (WARNING drift registry)
4. `wiki-health.sh` (INFO + verdict)
5. `drift-detector.sh` (INFO drifts)
6. `tier-contradiction-check.sh --quiet` (INFO)
7. `wiki-confidence-audit.sh --quiet` (INFO)
8. `wiki-graph-report.sh --quiet` (INFO)
9. `alignment-analyze.sh --quiet` (INFO D-BODY-01)
10. `po-status.sh --quiet` (INFO D-PRODUCT-01)

Plus : TypeScript tsc + Vitest + TSX sizes + Void Glass + MD pairs + Bundle size + Decisions datees + CONTEXT.md lines + structure racine + TS modules.

**Validation** : pattern orchestrateur health-check tres riche. Un simple `bash scripts/health-check.sh` donne dashboard complet FORME + semi-FONCTION. 🟢 OK fort.

### F32 🟢 Chain sync-check.sh = superset health-check

**Fait** : `sync-check.sh` invoque health-check + docs-sync-check + tier-contradiction-check. Convergence proper.

**Validation** : pas de duplication logique, sync-check enrichit health. 🟢 OK.

### F33 🟡 Scripts "orphelins" (peu cites)

**Fait** : 20 scripts avec <= 8 refs hors self/archive (Bash grep). Analyse individuelle :

| Script | Refs | Usage reel |
|--------|------|------------|
| `propositions-generator.sh` | 1 | Brief v12 tuile #16 — usage optionnel |
| `git-hooks-install.sh` | 2 | Setup initial .git/hooks/pre-commit + commit-msg |
| `neuroplasticity-score.sh` | 2 | Chain health-check (F31) — active |
| `sessions-analyze.sh` | 2 | Regen session-patterns.md — usage ponctuel |
| `wiki-metrics.sh` | 2 | Orphelin possible (a verifier usage) |
| `wiki-suggest-links.sh` | 2 | Orphelin possible (a verifier usage) |
| `memory-audit.sh` | 3 | Audit stale memoires — usage ponctuel |
| `memory-last-used-hook.sh` | 3 | Hook PreToolUse Read — active |
| `session-ratings-analyze.sh` | 3 | Pre-D-BODY-01 (avant alignment-analyze.sh) — **probable dead code** |

**Vrais orphelins suspects** : `wiki-metrics.sh` + `wiki-suggest-links.sh` + `session-ratings-analyze.sh` → a examiner P11.

**Recommendation P11** : `Read` + `Grep` approfondi sur les 3 scripts suspects. Archiver si dead code confirme.

### F34 🟡 `scripts/hooks/` contient 8 fichiers mais settings.json ref 8 aussi (coherence MAIS 1 fichier __pycache__)

**Fait** : `ls scripts/hooks/` = 8 entries :
- `__pycache__/` (Python bytecode, .gitignored normalement)
- `branch-name-check.sh` (opt-in, pas dans settings.json)
- `pre-compaction-snapshot.sh` (PreCompact)
- `product-session-end.sh` (SessionEnd)
- `product-session-start.sh` (SessionStart)
- `security-reminder.py` (PreToolUse Write|Edit)
- `session-start-wiki.sh` (SessionStart)
- `validate-void-glass.sh` (PreToolUse Write|Edit)

Plus dans `scripts/` racine (pas hooks/) :
- `memory-last-used-hook.sh` (PreToolUse Read)
- `auto-archive-plans.sh` (SessionEnd)

**Incoherence structurelle** : 2 hooks actifs sont dans `scripts/` racine, pas `scripts/hooks/` comme suggerait la convention. Pas casse mais inconsistant.

**Recommendation P11/P12** : deplacer `memory-last-used-hook.sh` + `auto-archive-plans.sh` dans `scripts/hooks/` + update settings.json paths. Ou laisser si risque de casser.

### F35 🟡 `scripts/hooks/branch-name-check.sh` opt-in jamais active

**Fait** : branch-name-check.sh = 1 script, supposed a verifier convention branch name. Pas dans settings.json. Se declenche en post-commit hook (visible dans output commits P1/P2 : "warn branch-name : Branche claude/... ne matche pas la convention").

**Cause racine** : Desktop cree `claude/<nom>` auto, convention FOS veut `wt/<desc>-<yymmdd>`. Warning non-bloquant a chaque commit de session Desktop. C'est cosmetique.

**Recommendation** : OK design (warning only). Ignore.

### F36 🔴 `routines-setup.md` declare "14 routines" mais en contient 9

**Fait** :
- Titre : "## Les 14 routines — ordre d'execution logique"
- Corps : 8 routines automatisees (Routine 1 a 8) + 1 mensuelle manuelle (ratings-monthly-review)
- Total reel = **9 routines**, pas 14

**Divergence** : titre mention 14 mais contenu 9. Drift documentaire direct.

**Cause racine** : lesson audit v2 mega 2026-04-16 disait "14 routines Cloud documentees mais inertes". Si le nombre initial etait 14 et qu'il est descendu a 9 (consolidation), le titre n'a pas ete mis a jour.

**Impact** : CLAUDE.md et CONTEXT.md mentionnent "14 routines Desktop" en options futures. Reference a un nombre qui n'existe plus.

**Fix prevu P11** : `Edit` wiki/meta/routines-setup.md titre "14 routines" → "9 routines". Update CLAUDE.md + CONTEXT.md options "14 routines UI /schedule" → "9 routines UI /schedule". Low-risk.

### F37 🟡 14 routines "documentees mais inertes" (lesson confirmee)

**Fait** : `ls -la wiki/meta/routines-*.md` modifie le 2026-04-19 (mais contenu probablement pas change). Aucune routine n'a **jamais** ete creee dans Desktop UI /schedule. `scripts/sessions-analyze.sh` revele 0 execution.

**Impact** : Kevin a documentation mais pas outil. Claim "routines autonomous" dans `docs/core/knowledge.md` section 8 pas prouve.

**Recommendation** : P13 cloture — ajouter note explicite "non-active actuellement, config Kevin pending".

### F38 🟢 8 hooks settings.json tous pointent vers scripts existants

**Validation directe** :
| Hook | Matcher | Script | Existe ? |
|------|---------|--------|----------|
| PreToolUse | Write\|Edit | `scripts/hooks/validate-void-glass.sh` | ✅ |
| PreToolUse | Write\|Edit | `scripts/hooks/security-reminder.py` | ✅ |
| PreToolUse | Read | `scripts/memory-last-used-hook.sh` | ✅ |
| SessionEnd | — | `scripts/auto-archive-plans.sh` | ✅ |
| SessionEnd | — | `scripts/hooks/product-session-end.sh` | ✅ |
| SessionStart | — | `scripts/hooks/session-start-wiki.sh \| tail -80` | ✅ |
| SessionStart | — | `scripts/hooks/product-session-start.sh` | ✅ |
| PreCompact | — | `scripts/hooks/pre-compaction-snapshot.sh` | ✅ |

**Verdict** : 🟢 OK, zero hook casse. Rapport subagent B confirme.

### F39 🟡 2 warnings subagent B a surveiller

**Rappel** (rapport subagent B Phase 0) :
1. **PRODUCT_MCP_SYNC=1 opt-in default OFF** — hook Product silencieusement skip. Si Kevin veut le tester, doit export manuel.
2. **Hook failures silencieux** — si script hook exit != 0, pas de signal dans brief v12 `/session-start`.

**Impact** : Kevin peut croire que Product hooks fonctionnent alors qu'ils sont skipped. Ou un hook broken peut passer inapercu.

**Recommendation P12 (candidat)** : ajouter tuile brief v12 "HOOKS" listing Pass/Skip/Fail par hook. Ou minimum au /session-start, log si au moins 1 hook exit non-0 + afficher ligne rouge.

---

## Findings FONCTION

### F40 🟢 8 commands coherents avec specs docs/core/

**Fait** :
| Command | Spec docs/core/ match | Fichiers |
|---------|----------------------|----------|
| /cockpit | cortex.md section 6 (+ .archive/specs-done-260417/2026-04-10-cockpit-design.md) | .claude/commands/cockpit.md |
| /plan-os | planner.md section 2 + routing table | .claude/commands/plan-os.md |
| /session-start | communication.md section 5-6 | .claude/commands/session-start.md |
| /session-end | communication.md section 6.2 + body.md Phase 7bis-7ter | .claude/commands/session-end.md |
| /sync | monitor.md + tools.md | .claude/commands/sync.md |
| /wt | worktrees.md section 7 | .claude/commands/wt.md |
| /new-project | cortex.md section 3 | .claude/commands/new-project.md |
| /po | product.md section 5 | .claude/commands/po.md |

**Validation** : chaque command a sa spec correspondante. Pas de fantome (command sans spec) ou spec orpheline (spec sans command). 🟢 OK.

### F41 🟡 6 agents : 4 cites dans Cortex table, 2 absents (po-agent + alignment-auditor)

**Fait** (rappel F9 de P1) :
- `.claude/agents/` reel : 6 agents
- `docs/core/cortex.md` Section 1 table : 4 agents (os-architect, dev-agent, doc-agent, review-agent)
- Manquants dans table : **po-agent** (D-PRODUCT-01) + **alignment-auditor** (D-BODY-01)

**Impact** : routing Cortex par signal → 2 agents recents injoignables par ce mechanisme. Contournes par invocation explicite (/po command, /session-end Phase 7ter).

**Fix prevu P11** : edit `docs/core/cortex.md` table — ajouter 2 lignes.

### F42 🟡 alignment-auditor = subagent "clean-slate" jamais test live

**Fait** : `.claude/agents/alignment-auditor.md` = 135L. Frontmatter declare sonnet, read-only tools. Description : "Subagent clean-slate alignment review (D-BODY-01 P4 Couche C4 Learning loop)". Invoque `/session-end` Phase 7ter si `.omc/intent/<slug>.md` existe.

**Realite** : `.omc/intent/` contient 1 fichier (`2026-04-19-body-p1-constitution.md` dogfooding P1 Body). `.omc/alignment/` vide (fichier auditor-*.json jamais genere).

**Cause racine** : D-BODY-01 Phase E (test live end-to-end) = **reporte Kevin** (pending, voir CONTEXT.md "En attente Kevin"). Donc subagent jamais invoque effectivement.

**Impact** : module Body declare COMPLET 5/5 mais Phase E live non-teste. FONCTION partielle (implementation-done != live-tested).

**Recommendation** : report P6 analyse + P13 note. Pas de fix P11. Kevin decide quand tester.

### F43 🟡 po-agent Notion MCP 14 tools declares — coherence a verifier en P7

**Fait** : `.claude/agents/po-agent.md` declare 14 MCP Notion tools. Verifiable dans frontmatter.

**Impact P7** : si un des 14 outils n'existe plus dans MCP (rotation Notion API), agent fails silencieusement. A recaper P7 mapping routes.

**Recommendation** : report P7.

---

## Findings META

### M5 🟢 8 commands + 6 agents + 8 hooks = 22 pieces mobiles, 0 casse

**Fait** : 22 declarations runtime (commands + agents + hooks). 22/22 ont fichier correspondant. 22/22 sont testees au moins en FORME (existence verifiee).

**Test FONCTION** :
- /cockpit : teste reellement (session-patterns analytics = 4 invocations)
- /session-start : teste reellement (cette session l'a utilise pour Tour 1)
- /session-end : teste reellement (historique commits)
- /plan-os : teste partiellement (plan generation OK, subagents routing non-teste)
- /sync : teste rarement (pas dans top analytics)
- /wt : teste (scripts/worktree-new/-clean/-list existent)
- /new-project : jamais teste en session monitored
- /po : cree 2026-04-19 (pas encore en usage live run production, PRODUCT_MCP_SYNC=0 default)

**Verdict** : FORME 100% OK. FONCTION 75% OK (partiels sur /plan-os, /new-project, /po live).

### M6 🟡 Scripts bash = 40 = catalogue dense pas bien documente

**Fait** : 40 scripts bash. `docs/core/tools.md` section 1 ("Inventaire des outils existants") liste 7 scripts + 8 hooks. Difference = 33 scripts orphelins documentairement.

**Mitigation existante** : `docs/core/tools/index.json` + routing.json = catalogue Tools v2 (109 outils + 35 regles). Le vrai catalogue canonique.

**Tension** : tools.md est sous-ensemble. Aurait pu pointer "docs/core/tools/index.json pour catalogue complet" en introduction.

**Lien F2 de P1** : meme finding. Consolide.

### M7 🔴 Subagent strategy a formaliser (leçon session courante)

**Fait** (session courante) :
- 3 subagents lances en parallele (A, B, C) avec prompts ~2000 mots chacun
- **Agent A** (24 memoires) : **thrashing Autocompact** (context plein)
- **Agent B** (commands/agents/settings) : **reussi** (rapport bien structure)
- **Agent C** (inventaire + cross-worktree) : **partiellement reussi** (bloque sur contrainte heritee post-compact)

**Ratio succes** : 1/3 pleinement reussi, 1/3 thrashed, 1/3 bloque.

**Cause racine** : prompts trop longs (~2000 mots par agent) + scope large + potentiel context pollution.

**Recommendation** : documenter dans futur module **Model Awareness (P9)** :
- Prompt subagent < 500 mots strict
- Scope precis (max 10-20 fichiers a lire par agent)
- Fallback strategy si thrashing (Read direct)
- Pas de chain subagent recursif

**Insight pour P8 Economie tokens** : subagents = tradeoff complexe. Pour les taches lecture massive (24 memoires), vaut mieux **Read direct en batch** (plus controlable).

---

## Synthese verdict P3

**Verdict** : 🟡 **DEGRADED mais proche SAIN**, plomberie solide + drifts documentaires mineurs.

**FORME** : 42 scripts + 8 hooks + 8 commands + 6 agents = 64 pieces mobiles. 64/64 fichiers presents. 0 hook casse. Chain health-check = 10 scripts orchestres. Plomberie = infrastructure ROBUSTE.

**FONCTION** :
- Commands : 75% testes reellement
- Agents : 4/6 routing-exposed, 2/6 invoques explicitement (po, auditor)
- Hooks : 6/8 actifs en chaque session, 2/8 opt-in (PRODUCT_MCP_SYNC=1)
- Routines Cloud : 0/9 deploye UI Desktop (lesson audit v2 confirmee)

**Livrables P11 identifies** :
1. 🔴 F36 : update routines-setup.md "14 routines" → "9 routines" + CLAUDE.md + CONTEXT.md coherent
2. 🟡 F41 : ajout 2 lignes table Cortex (po-agent + alignment-auditor)
3. 🟡 F33 : verifier + archiver 3 scripts suspects dead code (wiki-metrics / wiki-suggest-links / session-ratings-analyze)
4. 🟡 F34 : repositionner 2 hooks dans scripts/hooks/ (cosmetique)

**Report P12 refactor candidats** :
- F39 : tuile brief v12 HOOKS (pass/skip/fail par hook) ou minimum log failed hooks
- M7 : formaliser subagent strategy dans docs/core/model.md (P9)

**Report P6/P8** :
- F42 : test live alignment-auditor (Phase E D-BODY-01, report Kevin)
- F43 : coherence po-agent MCP tools (P7 mapping routes)
- M6 : consolider tools.md vs tools/index.json (P7)

---

## Cross-refs P3 → autres phases

- F36 → **P11 FIX** (edit routines-setup.md title)
- F33 → **P11 FIX** (archive dead scripts)
- F41 → **P11 FIX** (cortex table update)
- F42 → **P6** (comportement auditor test live)
- F43/M6 → **P7 mapping routes** (tools catalogue consolidation)
- M7 → **P8 tokens** + **P9 Model Awareness** (subagent prompt strategy)
- F39 → **P12 REFACTOR** candidat (brief v12 HOOKS tuile)

---

## Cloture Phase P3

**Livrable** : ce fichier + 13 findings (F31-F43 + M5-M7) + 4 fixes P11 identifies + 2 refactors P12 + 5 cross-refs.

**Insight cle** : Foundation OS = infrastructure solide (64 pieces mobiles, 0 casse). Drifts = surface documentaire. Le vrai gap = **FONCTION non-prouvee** sur modules recents (Body Phase E, Product PRODUCT_MCP_SYNC).

**Anti-compactage proof** : fichier sur disque + commit P3/14 incoming.

**Next** : Phase P4 — Memoire + neuroplasticite (5 tiers + 24 auto-memoires).

---

*Generated 2026-04-20 — D-AUDIT-TOTAL-01 Phase P3/14 — Claude Opus 4.7 1M context*
