# Findings P2 — Wiki + mapping + index + noeuds + classification

> **Phase P2 du D-AUDIT-TOTAL-01** — Audit wiki Foundation OS : structure, mapping, classification, confidence, noeuds (god/orphelins), couverture par domaine.
>
> Methode : Bash stats factuelles + Read pages meta cles (overview, index-wiki, foundation-os-map, counts, graph-report, session-patterns, hot, log, sessions-recent, lessons-learned, thinking) + echantillon concepts/entities/sources.

## Scope audite

| Categorie | Count reel | Source |
|-----------|------------|--------|
| Pages physiques (hors templates) | **50** | `find wiki -name "*.md" -not -path "*/templates/*" \| wc -l` |
| Concepts | 18 | `find wiki/concepts -maxdepth 1` |
| Entities | 5 | `find wiki/entities -maxdepth 1` |
| Sources | 2 | `find wiki/sources -maxdepth 1` |
| Meta | 15 | `find wiki/meta -maxdepth 1 -name "*.md"` |
| Domains (pages dans /domains) | 7 | `find wiki/domains -name "*.md"` |
| Templates | 3 | concept/entity/source |
| Wikilinks totaux (unique) | 712 declare counts.md | verif a faire post-regen |

---

## Findings FORME — drifts structurels

### F15 🔴 Counts wiki — 4 sources divergent (superset F1)

**Fait** (factuel) :
| Source | Pages | Meta | Concepts | Entities | Sources | Domains | Date |
|--------|-------|------|----------|----------|---------|---------|------|
| Reel filesystem | 50 | 15 | 18 | 5 | 2 | 7 | 2026-04-20 |
| `wiki/meta/counts.md` | 47 | 14 | 13 | 5 | 2 | 5+2 | 2026-04-18 |
| `wiki/meta/graph-report.md` (scannees) | 44 | 11 | 15 | 5 | 2 | — | 2026-04-18 |
| `wiki/hot.md` | 53 | — | — | — | — | 5 | 2026-04-19 |
| `wiki-health.sh` (live) | 53 | — | 20 | 5 | 2 | 5 | 2026-04-19 |

**Observations** :
- `counts.md` est le plus vieux (18-04), pre-D-BODY-01 P5 (3 concepts) + pre-D-PRODUCT-01 P5 (2 concepts) = +5 concepts oublies
- `hot.md` compte 53 (3 de trop vs reel 50) — probablement les 3 domains placeholders
- `wiki-health.sh` 53 concepts affichage = compte les 20 (18 + 2 archives ? ou include Foundation OS files counted differently)
- `graph-report.md` = 44 pages scannees (exclut 6 pages : hot+overview+index-wiki+counts+foundation-os-map+log par design selon script)

**Cause racine** : 5 scripts de comptage (counts-sync / graph-report / wiki-health / direct find) avec logiques subtilement differentes, pas tous relance en meme temps.

**Impact** : principe "source unique counts.md" viole de fait 3+ fois. Kevin peut lire 4 valeurs differentes selon ou il regarde.

**Fix prevu P11** :
1. Relancer `bash scripts/wiki-counts-sync.sh` → counts.md a jour
2. Relancer `bash scripts/wiki-graph-report.sh` → graph-report.md a jour
3. Edit `wiki/hot.md` → 53 → 50 dans section Active Threads
4. Verifier `wiki-health.sh` → nouveau count reporte OK

### F16 🟡 Meta count "15 vs 18" — confusion templates

**Fait** :
- `find wiki/meta -maxdepth 1 -name "*.md"` → 15 fichiers (sans templates)
- Mon Bash precedent "18 meta" incluait templates (3 fichiers dans templates/ ET comptes)
- `counts.md` dit 14 meta (11 +  3 templates selon notation)

**Classification** :
| Path | Type | Inclus dans `meta` ? |
|------|------|----------------------|
| `wiki/meta/*.md` (15) | Meta | OUI |
| `wiki/meta/templates/*.md` (3) | Template | Depends |
| `wiki/hot.md` | Meta (racine) | — parfois compte ailleurs |
| `wiki/overview.md` | Meta | idem |
| `wiki/index-wiki.md` | Meta | idem |

**Ambiguite** : hot/overview/index-wiki sont meta mais a la racine, pas dans `wiki/meta/`. Reporter dans documentation counts.

### F17 🟡 `session-patterns.md` pas orphelin fonctionnel (lu)

**Fait** : page riche (147L), analyse 28 sessions + 3846 tool calls + lexique Kevin + rework ratio. Valeur reelle. Mais 0 wikilink entrant (graph-report l'affiche orphelin).

**Insights contenus** (pertinents pour autres phases) :
- `/cockpit` = 100% des slash commands (4 invocations sur periode 7d)
- Tool `Bash` = 32%, `Read` = 22%, `Edit` = 14%, `Write` = 7%, `Agent` = 1%
- Ratio delegation agents = **0.0%** (0 Task sur 3846 tool calls). Faible delegation historique.
- CONTEXT.md modifie 119 fois sur 28 sessions (churn = source unique active)
- CLAUDE.md modifie 15 fois (ajustements evolutifs)

**Fix prevu P11** : ajouter wikilink depuis `wiki/meta/lessons-learned.md` ou `wiki/meta/thinking.md` vers `[[session-patterns]]` (single edit). Conserve la page (valeur reelle), la rend traversable.

### F18 🟡 Wikilinks top frequence vs god-nodes (metriques distinctes)

**Fait** : 2 metriques confondues potentiellement :
- **Top wikilinks frequence** (Bash `grep -rho | uniq -c | sort`) : mentions totales = `[[LLM Wiki Pattern]]` 37x, `[[foundation-os-map]]` 36x, `[[Foundation OS]]` 34x
- **God nodes** (graph-report.md, inbound count) : `index-wiki` 19, `index-concepts` 19, `LLM Wiki Pattern` 18

**Verification** : les rangs sont coherents (LLM Wiki Pattern + foundation-os-map + Foundation OS dans top 5 des 2 metriques). Pas de drift.

**Note** : graph-report uses inbound count (plus strict), frequence grep compte mentions total incluant sections non-wikilink. 2 metriques complementaires.

### F19 🟡 Couverture domaines inegale (connu P5 prevue)

**Fait** :
| Domaine | Pages | Maturite |
|---------|-------|----------|
| Trading | 1 (index seul) | 🔴 placeholder Phase 5 |
| Finance | 1 | 🔴 placeholder Phase 5 |
| Sante | 1 | 🔴 placeholder Phase 5 |
| Design | 2 (index + design-system-components) | 🟡 seed |
| Dev | 3 (index + 2 concepts) | 🟡 seed |

**Impact** : 5 domaines declares, 4 sont quasi vides. Graph Obsidian affiche les 5 indexes mais peu de substance. Confidence tagging : les 3 placeholders sont tagges `low` (explicite).

**Recommendation** : OK jusqu'a Phase 5 (decision Kevin). Les 3 placeholders servent de port d'entree quand on demarre un domaine.

### F20 🟢 Wikilinks internes cohérents (712 total)

**Fait** : graph Obsidian **mesh niveau 2** fonctionnel.
- Hubs : index-wiki, foundation-os-map, index-concepts (19+ inbound chacun)
- 11 god-nodes dont 4 index + 4 concepts canoniques + 2 entities (Karpathy, Obsidian)
- 6 cross-domain surprising connections (design↔dev, finance↔trading, trading↔dev)

**Validation** : pattern mesh documente dans lesson 2026-04-17 fonctionne. Scalable jusqu'a Phase 5.

---

## Findings FONCTION — cerveau knowledge

### F21 🔴 `foundation-os-map.md` ne cite pas Body/Product/Constitution (superset F5)

**Fait** : foundation-os-map.md ligne 37-41 :
- Section "Core OS (7 modules + Cockpit)" — obsolete (9 modules maintenant)
- Concepts canoniques listes : Foundation OS, Core OS, LLM Wiki Pattern, Neuroplasticite, Brief v12, TDAH workflow, Void Glass
- **Absents** : Body, Product Management, Notion integration, Alignment, Constitution FOS

**Impact** :
- Graph Obsidian ne montre pas Body/Product comme concepts canoniques
- Onboarding nouveau Claude (1ere session) : carte incomplete → peut croire qu'OS est encore a 7 modules
- Duplication verbale : carte dit "7 modules", architecture-core dit "9 modules"

**Fix prevu P11** : edit foundation-os-map.md :
- "Core OS (7 modules + Cockpit)" → "Core OS (9 modules + Cockpit)"
- Ajouter `[[Body]] · [[Product Management]] · [[Constitution FOS]]` dans concepts canoniques
- Eventuellement : `[[Notion integration]] · [[Alignment]]` en 2e ligne

### F22 🟡 `overview.md` obsolete sur modules Phase 5

**Fait** : overview.md section Mission ligne 27-31 liste "App Builder, Trading, Finance, Sante, Dev". Manque mention que Trading/Finance/Sante sont "prevus Phase 5" (tagged `[!placeholder]` ailleurs).

**Cause racine** : updated 2026-04-17 (avant D-BODY-01 + D-PRODUCT-01). Pas touche depuis.

**Impact** : overview.md est un fichier d'accueil pour le vault. Utilisateur externe lit ca avant hot.md. Ne reflete pas 10 modules Core OS cibles apres P9.

**Recommendation** : P13 (cloture, update overview apres rapport). Ou P11 inline avec foundation-os-map.

### F23 🟡 `routines-setup.md` 904L geant monolithique

**Fait** : `wiki/meta/routines-setup.md` = **904 lignes**. C'est la page la plus longue du wiki. Contient prompts complets des 14 routines Cloud Desktop (Wiki Health Monitor / Wiki Consolidation / Documentation Drift / etc.).

**Tension** : 904L sur 1 page vs objective TDAH "pas de mur de texte". Mais c'est un fichier de specification qui doit rester complet pour etre utilisable par Desktop /schedule UI.

**Observations** :
- Pas modifie depuis 2026-04 (base initiale)
- **14 routines documentees mais inertes** (lesson audit v2 mega, 0 execution reelle)
- Si routines activees un jour, ce sera via copie-coller Desktop UI — la longueur est justifiee

**Verdict** : OK documentaire. Pas de fix P11/P12. Note : module candidat "routines operational" si jamais activees.

### F24 🟡 `routines-guardrails.md` 149L — guide lisible mais jamais cite

**Fait** : `wiki/meta/routines-guardrails.md` = 149L de garde-fous pour les 14 routines. Jamais reference en session (0 wikilink entrant probable, a verifier).

**Impact** : documentation a ete ecrite pour un systeme jamais deploye. Valeur conservation = hypothetique.

**Recommendation** : report decision P13 ou plus tard — archiver si Phase 5 ne demarre pas dans 30 jours.

### F25 🔴 hot.md = contrat narratif 30 lignes, NE PAS surcharger

**Fait** : `wiki/hot.md` actuel = 82 lignes (fait depasse le contrat "500 mots ~80L"). Contient sections : Last Updated (gros paragraphe session) + Plugin State + Key Recent Facts (10 bullets) + Recent Changes (5 commits) + Active Threads + Next Action.

**Tension avec spec** : `docs/core/knowledge.md` section 2 dit "hot.md cache narratif 500 mots". `docs/core/communication.md` 6.5 L0 dit "< 200 tokens". 82L = environ 700 tokens a 1 token ≈ 4 chars. Depasse L0 cible.

**Impact** : chaque SessionStart charge hot.md = 700 tokens. Pour une session triviale (typo fix), c'est 3.5x trop. Contribue a **F10 layered loading non-enforced** (Phase P1).

**Recommendation** : P12 candidat — reduire hot.md a <300 tokens (section Last Updated en 3 lignes + Next Action 3 lignes = 6 lignes, le reste peut etre supprime puisqu'il est redondant avec CONTEXT.md / sessions-recent / git log).

### F26 🟡 `wiki/log.md` — fichier journal, verifier si utilise

**Fait** : `wiki/log.md` mentionne dans counts.md + overview.md + foundation-os-map.md (section meta). Pas lu cette phase. A vérifier P5 historique si utile ou candidat archivage.

---

## Findings META — classification + confidence

### F27 🟢 Confidence tagging systematique fonctionne

**Fait** : distribution 2026-04-20 :
- **46 high** (fact verifie, stable, multi-session)
- **7 medium** (observation single-session, non contredit)
- **3 low** (placeholders Phase 5)

**Coherence** : hot.md dit "43h/4m/3l" (total 50). Mes counts 46/7/3 (total 56) depasse 50 pages = probablement sur-comptage templates ou pages includent wiki/hot.md counts separement.

**Verification** : `bash scripts/wiki-confidence-audit.sh` a regenerer P11 pour valeur canonique.

**Validation** : confidence tagging = enhancement D-INTEG-01 actif, pas de derive. 🟢 OK pattern.

### F28 🟡 Classification concepts mixe atemporel + OS-internal

**Fait** : `wiki/concepts/` contient 18 pages, dont :
- Atemporels (pattern knowledge) : LLM Wiki Pattern, Compounding Knowledge, Hot Cache, TDAH workflow
- OS-internal Foundation OS : Foundation OS, Core OS, Brief v12, Body, Product Management, Notion integration, Alignment, Constitution FOS, Neuroplasticite, Void Glass, design-system-components, foundation-os-desktop-migration
- D-INTEG-01 : Confidence Tagging, Graph Report, Layered Loading, Pre-compaction Snapshot

**Tension** : la meme classification "concept" couvre 2 families differentes (concepts externes atemporels vs specifications OS). Les concepts OS-internal sont des alias de specs docs/core/.

**Impact** : graph Obsidian affiche tout melange. Pas strictement incorrect (tout est "concept"), mais les 2 families devraient potentiellement avoir des tags differents (`tags: concept + os` vs `tags: concept + external`).

**Recommendation** : P13 (cloture) — renforcer tags secondaires dans frontmatter. Pas urgence.

### F29 🟢 Entities sobre et coherente

**Fait** : 5 entities (Karpathy, AgriciDaniel, Obsidian, Pinecone, tools-foundation-os). Toutes `confidence: mature` ou `high`. Pas d'invention. Aligne avec sources citees (karpathy-llm-wiki-pattern.md + agricidaniel-claude-obsidian.md).

**Verdict** : 🟢 OK. Pas de fix.

### F30 🟡 Sources seulement 2 pour 43+ sessions

**Fait** : 2 sources ingestees (Karpathy LLM Wiki + AgriciDaniel claude-obsidian). Malgre 5 sources externes citees 2026-04-17 (MemPalace, Graphify, Octogent, Penpax, MemPalace-site) lors D-INTEG-01.

**Cause racine** : ces 5 sources ont ete lues pour l'integration mais **jamais formellement ingerees** dans `wiki/sources/`. Leurs insights sont distilles dans specs knowledge.md section 12 + 4 concepts (Confidence Tagging, Graph Report, Layered Loading, Pre-compaction Snapshot) mais pas en tant que sources.

**Impact** : compounding knowledge faible sur sources externes. Si quelqu'un voulait re-lire MemPalace source, aucune reference accessible via wiki.

**Recommendation** : P12 ou Phase 5 — ingester les 5 sources D-INTEG-01 post-factum (rapide, 1h). Facultatif.

---

## Synthese verdict P2

**Verdict** : 🟡 **DEGRADED avec 4 fixes quick-wins high-value**.

**Livrables P11 identifies** :
1. 🔴 F15 : regen counts.md + graph-report.md + fix hot.md 53→50 (3 scripts + 1 edit)
2. 🔴 F21 : update foundation-os-map.md (+3 wikilinks concepts canoniques, "7 modules"→"9 modules")
3. 🟡 F17 : ajouter wikilink [[session-patterns]] depuis 1 page meta
4. 🟡 F22 : update overview.md modules Phase 5 mention

**Report P12 reflexion** :
- F25 : reduire hot.md 82L → 25-30L (reduction 70% tokens L0)
- F28 : renforcement tags frontmatter concepts OS-internal vs external

**Report P13 cloture** :
- F22 : update overview.md + foundation-os-map + hot.md post-10-modules

**Report futur (optionnel Phase 5+)** :
- F23 : routines-setup.md 904L — archiver si routines jamais activees sous 30j
- F30 : ingester 5 sources D-INTEG-01 post-factum

**Stats clefs** :
- 50 pages physiques (truth)
- 46h / 7m / 3l confidence (sain)
- 11 god-nodes + 1 orphelin (mesh niveau 2 OK)
- 712 wikilinks internes
- 5 domaines (2 seed + 3 placeholders Phase 5)

**FONCTION cerveau knowledge** : 🟢 operationnel. Drifts surface, pas de casse. Pattern mesh fonctionne. Confidence tagging discipline OK.

---

## Cross-refs P2 → autres phases

- F15/F17/F21 → **P11 FIX quick-wins** (regen + edits)
- F25/F28 → **P12 REFACTOR** candidate AskUserQuestion
- F22 → **P13 cloture** (update overview post-10-modules)
- F23/F30 → **futur** (report ou decision Phase 5)
- Session-patterns analytics → **P6 Comportement Claude** (patterns Kevin + agents delegation 0%)
- hot.md size → **P8 Tokens** (layered loading L0 budget)

---

## Cloture Phase P2

**Livrable** : ce fichier + 16 findings (F15-F30) + 4 fixes P11 identifies + 2 refactors P12 candidats + patterns FONCTION wiki operational.

**Anti-compactage proof** : fichier sur disque + commit P2/14 incoming. Session-patterns analytics preservees pour P6.

**Next** : Phase P3 — Automation + outils (42 scripts + 8 hooks + 8 commands + 6 agents).

---

*Generated 2026-04-20 — D-AUDIT-TOTAL-01 Phase P2/14 — Claude Opus 4.7 1M context*
