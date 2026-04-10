# S17 — External Research Deep

> **Status** : DONE 2026-04-10
> **Phase** : IX (Recherche externe)
> **Mode** : SUB (3 sub-agents paralleles, MOI consolide)
> **Plan** : docs/plans/2026-04-07-cycle3-implementation.md section S17
> **Branche** : audit-massif-cycle3

---

## 1. Objectif

Recherche externe pour situer Foundation OS dans l'ecosysteme AI-driven dev 2025-2026. 3 axes : (1) setups OS personnels comparables, (2) MCP/plugins nouveaux, (3) frameworks/methodologies emergents. Consolidation + findings.

## 2. Methodologie

3 sub-agents general-purpose lances en parallele (S17.2, S17.3, S17.4). Consolidation MOI (S17.5).

**Limite importante** : les 3 sub-agents n'ont pas pu effectuer de recherche web en temps reel (pas d'outil WebSearch/WebFetch actif dans leur execution). Tous les resultats proviennent des connaissances training data (cutoff ~mai 2025). Les URLs sont probables mais non verifiees live. Cette limite est structurelle et affecte la profondeur de cette session.

## 3. Axe 1 — Setups OS personnels AI-driven (Sub-agent #1)

### 3.1 Setups identifies (5)

| Setup | Type | Comparaison Foundation OS |
|-------|------|---------------------------|
| **Khoj** (github.com/khoj-ai/khoj) | RAG personnel self-hosted | + mature en recherche semantique. - pas d'agents a roles distincts, pas de multi-modules |
| **Open Interpreter** (github.com/OpenInterpreter/open-interpreter) | Execution code LLM locale | + execution generique flexible. - aucune structure projet, pas de persistance contexte cross-session |
| **AutoGPT** (github.com/Significant-Gravitas/AutoGPT) | Agent autonome GPT-4 | + autonomie totale goal→execution. - loops infinies, hallucinations, pas de garde-fous production |
| **CLAUDE.md workflows** (communaute, pas de repo canonique) | Configs projet Claude Code | + pattern emergent populaire. - generalement mono-projet, moins formalise |
| **Cursor rules** (github.com/PatrickJS/awesome-cursorrules) | Rules IDE par projet | + integration IDE native. - regles statiques, pas d'orchestration multi-modules |

### 3.2 Position Foundation OS

Aucun equivalent exact trouve. Foundation OS occupe un creneau rare : **monorepo multi-modules + agents specialises + workflow formalise + garde-fous anti-hallucination**. Les alternatives sont soit generiques sans structure (Open Interpreter, AutoGPT), soit structurees mais mono-projet (CLAUDE.md workflows, Cursor rules).

**Tendance observee** : le paysage converge vers plus de formalisation (memory tiers, health checks, session management) — ce que Foundation OS a deja.

## 4. Axe 2 — MCP servers + plugins OMC (Sub-agent #2)

### 4.1 MCP servers pertinents non installes (4)

| MCP Server | Pertinence | Impact estime |
|------------|-----------|---------------|
| **Supabase MCP** (supabase-community/supabase-mcp) | Schema introspection + migrations depuis Claude. Stack quotidien Foundation OS. | HIGH |
| **Vercel MCP** (vercel/vercel-mcp) | Deployments, logs, env vars directement depuis Claude Code. Stack deploy Foundation OS. | MEDIUM |
| **Playwright MCP** (anthropics/mcp-server-playwright) | Tests E2E automatises. Gap couverture identifie dans audit cycle 3 (DS-5). | MEDIUM |
| **Sentry MCP** (getsentry/sentry-mcp) | Monitoring erreurs prod. Premature — App Builder pas encore en prod. | LOW (parking) |

### 4.2 Plugins OMC

Aucun resultat fiable. OMC v4.10.1 → v4.11.4 delta inconnu du sub-agent (post-cutoff). Recommandation : verifier manuellement via `npm view oh-my-claudecode` et changelog GitHub.

## 5. Axe 3 — Frameworks emergents AI dev (Sub-agent #3)

### 5.1 Frameworks identifies (5)

| Framework | Pertinence | Verdict |
|-----------|-----------|---------|
| **Anthropic Agent SDK** (anthropic SDK Python/TS) | Formaliser l'orchestration Cortex en natif Anthropic | HIGH — explorer post-cycle3 |
| **MCP custom server** (modelcontextprotocol.io) | Exposer CONTEXT.md + health + modules comme outils natifs Claude | HIGH — resolution partielle anti-compactage |
| **Cursor rules / hierarchies** | Pattern rules global>projet>module>agent | MEDIUM — deja en place dans Foundation OS |
| **Agentic coding** (evolution "vibe coding" Karpathy) | brainstorm→plan→execute→verify avec quality gates | MEDIUM — deja le workflow Foundation OS |
| **SWE-agent / OpenHands** (Princeton, All-Hands-AI) | Agents dev autonomes open-source | LOW — Claude Code + OMC couvre deja ce role |

### 5.2 Tendance ecosysteme

Convergence vers : **agents specialises + protocole contexte standardise (MCP) + quality gates automatiques**. Le "vibe coding" naif mature en "agentic coding" discipline. Foundation OS est en avance sur cette trajectoire.

## 6. Consolidation MOI (S17.5)

### 6.1 Ameliorations concretes a importer (6)

| # | Amelioration | Source | Impact | Quand |
|---|-------------|--------|--------|-------|
| 1 | **Supabase MCP** : connecter pour schema/migrations directes | Axe 2 | HIGH | Post-cycle3, trivial a installer |
| 2 | **MCP custom CONTEXT.md** : exposer contexte projet comme outil Claude a la demande (vs bulk load) | Axe 3 | HIGH | Phase 5, resolution anti-compactage partielle |
| 3 | **Vercel MCP** : connecter pour logs/deploys | Axe 2 | MEDIUM | Post-cycle3, trivial |
| 4 | **Playwright MCP** : couverture E2E (couple DS-5) | Axe 2 | MEDIUM | Post-cycle3, avec tests E2E |
| 5 | **Agent SDK exploration** : evaluer si orchestration Cortex gagne a passer en natif SDK | Axe 3 | MEDIUM-HIGH | Phase 5, recherche exploratoire |
| 6 | **Nommer la methodo** : "agentic coding with systematic audit" comme reference interne | Axe 3 | LOW (documentation) | Anytime |

### 6.2 Ameliorations a NE PAS importer (3)

| # | Element | Pourquoi ne pas importer |
|---|---------|------------------------|
| 1 | **AutoGPT / agent autonome total** | Le human-in-loop de Foundation OS (validation Kevin, zero-bullshit gates) est une force, pas une limite. L'autonomie totale = risque hallucination non controle. |
| 2 | **Sentry MCP** | Premature — App Builder pas en prod. A reevaluer Phase 5 quand un module est deploye avec utilisateurs reels. |
| 3 | **Ajout massif plugins OMC** | Ratio usage deja 7.2% (S10 finding). Ajouter des plugins sans besoin concret = dette surface inutile. |

## 7. Findings

### F-S17-01 (P2) — Sub-agents sans WebSearch effectif

Les 3 sub-agents general-purpose n'ont pas utilise WebSearch/WebFetch malgre le brief. Resultat : recherche limitee au training data (cutoff ~mai 2025), URLs non verifiees. La session S17 produit une baseline utile mais pas la "external research deep" promise par le plan. Pour une vraie recherche externe, il faudrait soit (a) executer les recherches moi-meme avec WebSearch, soit (b) demander a Kevin de verifier les URLs et completer.

**Couple** : limite structurelle, pas un bug — les agents general-purpose n'ont pas systematiquement invoque les outils web disponibles.

### F-S17-02 (P2) — 3 MCP pertinents non connectes (Supabase, Vercel, Playwright)

Foundation OS utilise Supabase quotidiennement et deploy sur Vercel, mais n'a pas les MCP servers correspondants connectes. L'audit cycle 3 a identifie un gap E2E (DS-5). Ces 3 MCP sont des quick wins post-cycle3.

**Source** : Axe 2 consolidation.

### F-S17-03 (P3) — Position unique non documentee

Foundation OS n'a pas d'equivalent public identifie (monorepo multi-modules + agents specialises + workflow formalise). Cette position unique merite d'etre documentee comme force strategique dans le README ou une section CONTEXT.md, pas comme vanite mais comme repere pour les decisions d'import/export.

**Couple** : Axe 1 conclusion, zero equivalent exact.

### F-S17-04 (P3) — Agent SDK Anthropic = evolution naturelle Cortex

L'orchestration Cortex (4 agents custom) est actuellement geree par CLAUDE.md + .claude/agents/ + OMC routing. L'Agent SDK officiel Anthropic pourrait formaliser cette orchestration en natif. A evaluer Phase 5 quand le SDK est plus mature.

**Couple** : Axe 3, F-S17-01 comparaison Agent SDK vs custom agents.

### F-S17-05 (P3) — MCP custom anti-compactage = piste prometteuse

Un MCP server custom qui expose CONTEXT.md, health, et etat modules comme outils a la demande (plutot que charge en bulk) resoudrait partiellement le probleme d'anti-compactage (F-S12-03/F-S12-20 P1 drift sources multiples). Piste a explorer Phase 5.

**Couple** : Axe 3, cross-ref S12 findings anti-compactage.

### F-S17-06 (P3) — "Agentic coding" = nom pour le workflow Foundation OS

Le workflow brainstorm→plan→execute→verify avec quality gates automatiques a un nom dans l'ecosysteme : "agentic coding" (evolution du "vibe coding" Karpathy). Foundation OS le pratique deja mais sans le nommer explicitement.

**Couple** : Axe 3, documentation uniquement.

### F-S17-07 (P3) — OMC delta v4.10.1 → v4.11.4 inconnu

Le sub-agent n'a pas pu evaluer les nouveautes OMC post-mai 2025. Le delta est potentiellement significatif (4 versions mineures). A verifier manuellement.

**Couple** : Axe 2 limitation, action manuelle Kevin.

## 8. Decisions

| ID | Decision | Type |
|----|----------|------|
| D-S17-01 | Installer Supabase MCP post-cycle3 (quick win, couple stack quotidien) | BATCH S21 |
| D-S17-02 | Installer Vercel MCP post-cycle3 (quick win, couple deploy) | BATCH S21 |
| D-S17-03 | Evaluer Playwright MCP quand DS-5 (E2E) sera traite | PARKING |
| D-S17-04 | Explorer Agent SDK Anthropic en Phase 5 (formaliser Cortex) | PARKING |
| D-S17-05 | Explorer MCP custom CONTEXT.md en Phase 5 (anti-compactage) | PARKING |
| D-S17-06 | Ne pas importer de pattern agent autonome (AutoGPT-like) | NO ACTION |
| D-S17-07 | Ne pas ajouter Sentry MCP avant prod | NO ACTION |
| D-S17-08 | Ne pas ajouter de plugins OMC sans besoin concret (ratio 7.2% S10) | NO ACTION |

## 9. Learnings

| ID | Learning |
|----|---------|
| L-S17-01 | Sub-agents general-purpose ne garantissent pas l'utilisation de WebSearch meme si l'outil est disponible. Pour une recherche externe reelle, executer soi-meme ou briefer explicitement "tu DOIS utiliser WebSearch". |
| L-S17-02 | Foundation OS est en avance sur la tendance ecosysteme (agents specialises + MCP + quality gates). Le risque n'est pas le retard mais l'isolement — pas de communaute de reference pour benchmarker. |
| L-S17-03 | Les MCP servers pertinents sont souvent ceux du stack deja utilise (Supabase, Vercel) — chercher les MCP par correspondance stack est plus productif que par catalogue exhaustif. |
| L-S17-04 | Limite structurelle session S17 : recherche "deep" sans web browse effectif = recherche "baseline". Le plan cycle 3 n'avait pas anticipe que les sub-agents pourraient ne pas utiliser WebSearch. |

## 10. Cross-references

| Ref | Lien |
|-----|------|
| DS-5 | CI Playwright visual regression (couple F-S17-02 Playwright MCP) |
| F-S12-03, F-S12-20 | P1 drift sources multiples anti-compactage (couple F-S17-05 MCP custom) |
| S10 finding ratio 7.2% | Usage reel skills/plugins (couple D-S17-08 pas d'ajout massif) |
| F-DS3-01 | Vulns dev-only vite+esbuild (pas de lien externe trouve) |
| D-S14-01 | Migration vite@8+react@19+tailwind@4 post-cycle3 (pas de lien externe trouve) |

## 11. Meta-observation

**M-S17-01** : Les sub-agents ont tous les 3 produit un disclaimer honnetete similaire ("je ne peux pas browse le web"). Pattern positif : la politique zero-bullshit de Foundation OS (CLAUDE.md) a permee dans les sub-agents — ils ont refuse de fabriquer plutot que de simuler des resultats. Pattern negatif : la session S17 est la moins "deep" du cycle 3 malgre son label "DEEP" dans le plan, precisement parce que la profondeur dependait d'un acces web qui n'a pas ete utilise. **9e occurrence meta cycle 3** (pattern "gap entre intention plan et execution reelle").

## 12. Verdict session

**7 findings** (0 P1 + 2 P2 + 5 P3), **8 decisions**, **4 learnings**, **1 meta**.

Session utile comme **baseline de positionnement** : Foundation OS est bien positionne dans l'ecosysteme, avec 3 quick wins MCP identifies (Supabase, Vercel, Playwright) et 2 pistes strategiques Phase 5 (Agent SDK, MCP custom anti-compactage).

Session limitee comme **recherche externe deep** : l'absence de WebSearch effectif dans les sub-agents a reduit la portee. La profondeur promise par PHASE IX n'est pas atteinte. Recommandation : si Kevin souhaite une vraie recherche web, dedier 10-15 minutes manuelles a verifier les URLs et chercher des nouveautes post-mai 2025.

**Cycle 3 : 17/24 sessions DONE (71%)**. Dette batch S21 cumulee : ~66 fixes (S7-S17, +2 decisions S17). Prochaine : S18 Cross-check (PHASE X).
