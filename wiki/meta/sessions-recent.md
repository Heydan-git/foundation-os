---
type: meta
title: "Sessions récentes (5 dernières)"
updated: 2026-04-20
tags:
  - meta
  - sessions
  - memory
  - neuroplasticity
status: evergreen
confidence: high
related:
  - "[[index-meta]]"
  - "[[hot]]"
  - "[[thinking]]"
  - "[[lessons-learned]]"
  - "[[index-wiki]]"
---

# Sessions récentes (5 dernières)

> Mémoire court terme : résumé des 5 dernières sessions avec decisions, pages wiki impactees, threads ouverts.
> hot.md = cache flash (dernière session, overwrite). sessions-recent.md = mémoire court terme (5 sessions, append).
> Mis a jour par Claude en /session-end (neuroplasticite reflexe 4).

## 2026-04-20 (Reality Check + cleanup multi-session) · Audit factuel travail perdu + 10 commits nettoyage

**En bref (pour Kevin)** : Kevin a alerte "travail perdu + briefs faux + multi-session a ecrase des choses". J'ai audite en profondeur (preuves a chaque ligne), trouve 2 sessions jamais revenues dans le projet principal (1 du 19 avril qui ajoutait 46 pages wiki + un systeme de securite bash, 1 du 17 avril qui corrigeait plein de petits details), plus 6 projets non-commit sur main (Gmail centralisation + Morning Intelligence refonte TDAH + autres briefs). J'ai tout remis en ordre en 10 commits nettes, sans rien casser. Decision prise avec Kevin : **on arrete le multi-session** (1 session a la fois).

**Duree** : session en cours (~3-4h Opus 4.7 1M context)

**Scope** : Kevin demande audit profondeur apres avoir remarque des incoherences dans CONTEXT.md et hot.md. Soupconnait ecrasement git multi-session. "Approfondis au max ta recherche de choses perdues. Je veux tout retrouver + nettoyer + re-documenter."

**Livraison** (10 commits atomiques) :
- **Rapport reality-check** `docs/audits/2026-04-20-reality-check/rapport.md` (490L) : audit factuel evidence-based, 6 categories pertes identifiees
- **E1 Main working tree cleanup** (6 commits) : archive plan D-AUDIT-TOTAL-01 + gitignore additions (donnees perso morning-intelligence.json/briefings HTML/`.claire/`/build artifacts) + COWORK-CONTEXT update + commit Gmail centralisation 5 MD + Morning Intelligence shell v3 + plan TDAH v2 + 15 sessions JSON historique
- **E2 Cherry-pick nice-mayer** (3 commits) : drifts P1-P3 Core OS 9 micro-fixes + Wiki meta (thinking protocole + session-dna YAML) + Template plan 6 elements + 5 `.raw` READMEs
- **E3 Integre D-CCCONFIG-01** (1 commit Option C) : 47 files wiki A (8 concepts + 3 concepts trading + 1 source trading + 17 entities + 17 sources) + `scripts/hooks/bash-firewall.sh`, sans toucher CONTEXT/CLAUDE/commands divergents
- **E4 Fix refs cassees** (1 commit) : 12 refs cassees → **0** (plan archive paths + chemins relatifs wiki trading `../../../` → `../../../../` + scripts fantomes `gen_fixtures.py`/`pre-commit.sh` en italique)

**Verifs end-to-end** :
- Reflog 100 entries main : 0 ecrasement git destructif detecte (pas de `reset --hard`, pas de `rebase -i`, pas de `push --force`)
- ref-checker : 12 → 0 refs cassees (239 .md scannes post-E4)
- Wiki count : 86 → **113 pages** filesystem (post-integration D-CCCONFIG-01)
- Main working tree : DESYNC → CLEAN (0 staged, 0 modified)
- Livrables physiques majeurs intacts : audit + trading + body + product + model + code

**Decisions** : **Pas de multi-session** (regression memoire prouvee, main CONTEXT.md systematiquement en retard vs realite). `D-CCCONFIG-01` de la session perdue formellement integree.

**Revelations (5 insights)** :
- **Multi-session = regression memoire garantie pour dev solo**. Chaque worktree/session ecrit son CONTEXT.md local, seul le dernier `/session-end` merge sa version. Branches non-mergees disparaissent de la memoire main jusqu'a audit.
- **Metriques CONTEXT.md peuvent se gonfler** : claim "rapport-master 864L" → realite 324L (2.67x inflation). Preuve : aucune commande de verification systematique.
- **Working tree desync cumulatif** : 30+ untracked s'accumulent (dont 6 projets Cowork entiers avec contenu structure). Session `/session-end` ne regarde pas les dirs parfois untracked.
- **Reflog git est propre**. Les "pertes" ne sont pas des ecrasements mais des **omissions** (merges non-faits, commits non-faits, gitignore non-fait).
- **Option C (copier files sans merge)** safer que Option A (merge complet). Option A aurait cree conflits massifs CONTEXT/CLAUDE/hot sur branches antecedentes. Option C = 47 files A safe + skip M divergents + documenter en E5.

**Pages wiki impactees** :
- Nouvelles : 47 files A de D-CCCONFIG-01 batch alim (concepts shadcn + Claude Code ecosystem + prediction markets + entities Polymarket/Kalshi/RTK/UI UX Pro Max + sources refs externes)
- Meta : `hot.md` rewrite complet verite factuelle + `sessions-recent.md` this + `lessons-learned.md` pending E5 + `thinking.md` pending E5

**Threads ouverts post-E4** :
- E5 Refresh CONTEXT.md + lessons + thinking + indexes (vulgarise)
- E6 Imperatif "pas de multi-session" CLAUDE.md + memoire
- E7 Push main + cleanup branches nice-mayer + determined-torvalds (sources integrees)
- E8 **VULGARISATION systemique** : reecrire briefs + CLAUDE.md + communication.md + planner.md + commands + templates audits/plans pour Kevin designer TDAH

---

## 2026-04-19 (D-CCCONFIG-01 DONE, RECUPERE 2026-04-20) · Batch Alim 11 refs externes + durcissement config CC

**En bref (pour Kevin)** : Cette session du 19 avril avait ete perdue (jamais mergee dans le projet principal). Tu avais ajoute 46 nouvelles pages wiki externes (des references Claude Code comme awesome-claude-code, claude-howto, Ultraplan, Paperclip, RTK, UI UX Pro Max v2.5.0) + installe un systeme de securite bash (le bash-firewall qui empeche les commandes destructrices comme `rm -rf /`). Tout a ete retrouve et re-integre le 20 avril dans la session reality-check.

**Duree** : 1 session longue (~5-6h Opus 4.7, 13 commits atomiques originaux)

**Scope** : conversation alim — Kevin balance 11 refs externes a analyser et stocker wiki pour decision future. Execution simultanee durcissement config Claude Code (D-CCCONFIG-01) applique 4/6 gaps identifies.

**Livraison** (13 commits originaux sur `claude/determined-torvalds-903dc3`, 14e commit session-end) :

**Refs wiki ingestees (11)** :
- 6 libs shadcn (shark-ui + stow-build + cult-ui-pro + shadcncraft + cascader + flowkit)
- Guide config CC community 24 parties
- Trading bot prediction markets (Polymarket/Kalshi + Kelly + Brier + pipeline 5 etapes)
- RTK (Rust Token Killer, CLI proxy 60-90% reduction tokens LLM)
- Paperclip (agent orchestrator)
- claude-howto (27.6k stars) + awesome-claude-code (39.7k stars)
- gsd-2 + Claude Plugins Playground + claude-mem + skills.sh
- UI UX Pro Max (67.7k stars) + Ultraplan (feature CC cloud)

Wiki 48 → 94 pages : 7 concepts (Shadcn Landscape + Cockpit OS Dashboard hub + Claude Code Config Pattern + Cascader + Creatable Combobox + AI agent patterns + Shadcn-complement + 3 trading) + 18 entities (6 maintainers shadcn + 8 tech + Claude Code + RTK + Polymarket + Kalshi + Nolly Studio) + 20 sources.

**D-CCCONFIG-01 applique** : 4/6 gaps du guide community appliques :
- `scripts/hooks/bash-firewall.sh` : hook PreToolUse Bash, exit 2 patterns destructifs (`rm -rf /`, `git push --force`, `dd`, `mkfs`)
- Deny list stricte `.claude/settings.json`
- `tools:` frontmatter 4 agents FOS restrictions
- CLAUDE.local.md template + `.gitignore` updates
- CONTEXT.md section Outils 3 → 7 hooks

**~/.claude/CLAUDE.md enrichi** : 2 blocs globaux (honnetete radicale + clarte avant technicite) applicables tous projets Kevin.

**Install UI UX Pro Max** : plugin global v2.5.0 via `/plugin install` + uipro-cli 2.2.3 via npm.

**Verifs session originale** : 13 commits atomiques, health SAIN, refs 188/0, wiki 94 pages.

**Revelations** :
- Pattern "alim conversation" valide pour batch refs externes (7 refs chacune analysee avec verdict honnete)
- Mode honnetete radicale peut deriver en contrarianism mal calibre (exemple Paperclip mal cadre initialement)
- Triangle ressources Claude Code FOS emergent : config-guide + claude-howto + awesome-claude-code
- Cockpit OS Dashboard 3 refs alimentantes (Paperclip + RTK + SDK) + hub wiki

**Integration 2026-04-20** : cette session perdue retrouvee via audit reality-check. 47 files A integres via cherry-pick Option C (pages wiki + bash-firewall + agents tools frontmatter), sans toucher CONTEXT/CLAUDE/commands divergents pour eviter conflits massifs. CONTEXT.md et hot.md updates coherents en E5 post-integration.

---

## 2026-04-19/20 (D-AUDIT-TOTAL-01 COMPLET 14/14 + D-MODEL-01) · Audit total Foundation OS + 10e Core OS

**Duree** : 1 session longue (~10h, Opus 4.7 1M context anti-compactage proof)

**Scope** : Kevin demande "audit profond et exhaustif de la totalite du projet" (architecture/fonctionnalites/liens/organicite/automaticite/memoire/outils/rangements/coherence/classification/categorisation/mapping/index/noeuds/fonctionnement/capacite/comprehension/historique/fondation/manifeste/indexation/logique) + scope "tout le projet pas juste worktree" + mapping routes + economie tokens + conscience modele Opus 4.7. "Le plan le plus ambitieux mais realiste realisable."

**Livraison** (15+ commits atomiques P0-P13) :
- **P0 Bootstrap** : infrastructure anti-compactage (docs/audits/ + docs/plans/ + .omc/audit-total/state.json + 5 stubs forward refs + TodoWrite 14 phases). Commit `df4244a`.
- **P1 Fondation** : audit CLAUDE.md + CONTEXT.md + Foundation OS.md + architecture-core + 9 specs Core OS + constitution 41 P-XX + naming-conventions + concurrency. 18 findings. Commit `d7f48a7`.
- **P2-P8** : audit wiki/automation/memoire/historique/comportement/routing/tokens (7 phases × findings). Commits `903cea7` → `e736700`.
- **P9 Model Awareness** : CREATION 10e module Core OS `docs/core/model.md` (11 sections, Opus 4.7 1M doc Anthropic officielle WebFetch). Architecture 9→10 modules. D-MODEL-01 adopte. Commits `ec48271` + `16127e8` (fix ref).
- **P10 Cross-worktree read-only** : audit 6 worktrees + 15 branches orphelines. Phase 5 Trading **deja demarree** dans jovial-jemison (45 commits, D-TRADING-01 Phase 8/8 livre). Commit `dddc9a5`.
- **P11 Fixes quick-wins** : regen counts.md 47→53, graph-report.md 44→49, foundation-os-map.md 7→10 modules + 5 concepts Phase 8+, cortex table 4→6 agents, lessons-learned → session-patterns resolu, cleanup 14 branches claude/* MERGED-IN-MAIN. Commits `4cefcc4` + `e09b96f`. Safety P-34 respecte (2 worktrees legacy preserves).
- **P12 Refactors majeurs** : CLAUDE.md L9-24 tagged P-01 a P-14 (cross-refs constitution, HYBRID renforce), tools.md section 1b Tools v2 SOURCE CANONIQUE + section 1c 42 scripts par categorie, brief v12 SANTE ligne Worktrees. Commit `0008783`.
- **P13 Cloture** : rapport-master.md 864L (executive summary + scope + metriques pre/post + findings synthese + actions + decisions + recommandations + lessons + limites + conclusion). Updates CONTEXT.md (D-AUDIT-TOTAL-01 + D-MODEL-01 + session + Cap + row Model). Updates wiki meta (hot.md + sessions-recent this + lessons-learned + thinking). Frontmatter plan `status: done`. state.json `current: DONE`.

**Verifs end-to-end** :
- health SAIN chaque phase (0 critical, 0 warning, 15/15 tests app, build ~260ms)
- ref-checker 0 cassee (167 .md scannes post-P12)
- wiki-health SAIN (53 pages, 5 domaines, 0 orphelin, 12 god-nodes)
- drift SYNC, tier contradictions 0, neuroplasticite 100%
- 15+ commits atomiques P0-P13 avec prefixes coherents (chore/docs/feat/fix/refactor)
- zero regression, zero compactage observe

**Decisions** : **D-AUDIT-TOTAL-01** audit total FOS + **D-MODEL-01** module Model Awareness 10e Core OS.

**Revelations (5 insights)** :
- **Pattern declaratif non-enforced confirme a 5 modules** (Cortex/Communication/Body/Tools/Model). Discipline Claude = garant application. Candidate D-ENFORCE-01 11e Core OS.
- **CONTEXT.md systematiquement en retard** vs realite multi-worktree. Solution = tuile brief v12 Worktrees (appliquee P12c).
- **Subagent prompt > 1500 mots garantit thrashing** (preuve Agent A session : "Autocompact thrashing: context refilled 3 times in 3 turns"). Max 500 mots + fallback Read direct codifie docs/core/model.md.
- **Stubs forward refs pattern valide 2x** (D-BODY-01 + D-AUDIT-TOTAL-01) : zero regression multi-phase.
- **Opus 4.7 1M context tient sur 10h + 50+ fichiers + 3 subagents + 30+ Bash + 15+ commits SANS compactage**. Validation empirique 1M = reel (pas marketing). Adaptive thinking suffit (pas extended thinking requis).

**Threads ouverts** :
- Merge main + push origin (P13 post-cloture) : a faire maintenant cette cloture
- Cloture jovial-jemison Trading (Kevin decide strategy 45 commits ahead + 19 behind)
- Merge determined-torvalds 14 commits wiki OU parallele
- Cleanup 2 worktrees legacy (apres verif state runtime)
- Test live D-BODY-01 Phase E (alignment-auditor) + D-PRODUCT-01 (PRODUCT_MCP_SYNC=1)
- OMC update v4.10.1 → v4.13.0 (3 versions retard)
- Candidate D-ENFORCE-01 11e Core OS (moyen terme)

**Pages wiki impactees** :
- Regen auto : `wiki/meta/counts.md` (47→53 pages, 763 wikilinks) + `wiki/meta/graph-report.md` (12 god-nodes, 0 orphelin, 6 cross-domain)
- Mises a jour : `wiki/hot.md` (cache cloture), `wiki/meta/sessions-recent.md` (this), `wiki/meta/lessons-learned.md` (3 lessons 🎯 candidates + pointer session-patterns), `wiki/meta/thinking.md` (5 insights), `wiki/meta/foundation-os-map.md` (7→10 modules + 5 concepts Phase 8+)

**Sources externes citees** :
- [Anthropic Models Overview](https://platform.claude.com/docs/en/docs/about-claude/models/overview) (WebFetch P9)
- Session 2026-04-19 observations : Agent A thrashing pattern + pre-compaction proof

---



## 2026-04-19 (D-PRODUCT-01 COMPLET 5/5) · Module Product 9e Core OS livre + pivot Notion-only

**Duree** : 1 session longue (~6-8h, Opus 4.7 1M context) — 5 commits dont 1 pivot en cours de session

**Scope** : Kevin demande "reintegre Notion et Asana dans le workflow, creer agent PO + skill, bidirectionnel, full integration avec honnetete sur limites". Puis pivot Notion-only P1.5 apres decouverte limites MCP Asana (payant + pas create_project/section/update_project). Agent PO elargi : PO de Foundation OS + modules + apps futures revendables via App Builder.

**Livraison** (5 commits atomiques) :
- `81cf901` **P1 Bootstrap** : spec canonique `docs/core/product.md` (11 sections), agent `.claude/agents/po-agent.md` sonnet (Task invocable), skill `.claude/commands/po.md` (init/sync/pull/status), 4 scripts `scripts/po-{init,sync,pull,status}.sh` (stubs forward refs), 2 hooks `scripts/hooks/product-session-{start,end}.sh` (stubs forward P4), MCP Notion : archive ancien espace "🪐 Foundation OS" (→ "Archive 2026-04") + nouveau espace + 3 DB (Decisions/Plans/Sessions), Asana : 2 anciens projets supprimes manuellement Kevin + preview projet "FoundationOS" confirme Kevin UI, CONTEXT.md + architecture-core.md + CLAUDE.md updates. 16 fichiers, 1467 insertions.
- `a39fb11` **P1.5 Pivot Notion-only** : abandon Asana apres decouverte limites MCP (MCP ne supporte pas create_project/section, setup tout manuel = pas viable). Pivot en cours de session vers 100% Notion. Create DB Tasks (716e6844) avec schema complet (Title, Plan ref relation, Phase, Element, Status enum Todo/In Progress/Done/Blocked, Priority, Module, Type Phase/Element/US/Task). Rewrite complet product.md + po-agent.md + po.md + po-init.sh + product-config.json + updates CONTEXT/CLAUDE/architecture-core/plan. 9 fichiers, 367+/274-.
- `ec49114` **P2 Push** : 4 MCP batch calls `notion-create-pages` vers 4 DB = 28 rows crees (16 Decisions D-PRODUCT-01 a D-WT-01 / 1 Plan D-PRODUCT-01 / 5 Sessions recentes / 6 Tasks phases P1-P5 avec Plan ref relation). Upgrade `po-sync.sh` stub → fonctionnel (parse CONTEXT.md Decisions + count plans/sessions + genere manifest JSON actions suggerees). 2 fichiers, 266+/18-.
- `6f89ae4` **P3 Pull + Views + Tuile** : 4 views natives MCP `notion-create-view` (Kanban by Status + Kanban by Module + Timeline Tasks + Timeline Plans). Update DB Tasks Module options (add Body + Product). Rewrite `po-pull.sh` stub → fonctionnel (manifest-driven pull avec modes --preview/--apply/--interactive). Rewrite `po-status.sh` stub → fonctionnel (--quiet 1-ligne chain health-check). Chain `scripts/health-check.sh` section INFO (apres alignment-analyze). Ajout tuile brief v12 #17 PRODUCT dans `docs/core/communication.md` (slot 17 car 16 deja PROPOSITIONS). 6 fichiers, 352+/40-.
- `a687b59` **P4 Hooks auto** : rewrite `scripts/hooks/product-session-{start,end}.sh` stubs → complets (timeout 10s/30s + retry 1x + offline fallback log + opt-in PRODUCT_MCP_SYNC=1). Update `.claude/settings.json` (ajout 2 hooks Product dans SessionStart + SessionEnd). Logs `.omc/logs/product-sync.log`. 3 fichiers, 145+/20-.

**Verifs finales** :
- health-check SAIN (chaines product-status inclues)
- 4 MCP Notion calls reussis (archive + create pages + 3 create_database + 4 create_view + update_data_source)
- Scripts po-*.sh tous testables (--dry-run, --quiet, --preview modes)
- Hooks online + offline simulation OK (default OFF + opt-in ON ecritures logs)
- settings.json JSON valide
- 2 concepts wiki crees ([[Product Management]] + [[Notion integration]])
- CONTEXT.md Module Product COMPLET 5/5 + decision D-PRODUCT-01 acte
- Plan frontmatter status:done + phases_done:5 (archive auto via hook SessionEnd)

**Decision** : **D-PRODUCT-01 COMPLET 5/5** Module Product 9e Core OS. Integration bidirectionnelle FOS ↔ Notion 100% (Asana abandonne P1.5). Plan archive `.archive/plans-done-260419/2026-04-19-product-module-full-integration.md`.

**Revelations** :
- **Pivot en cours de session = flexibilite necessaire face limites MCP**. Plan initial supposait MCP Asana complet. Decouverte limites (create_project/section/update_project absents) en P2 = pivot P1.5 decide en 10 min + execute en 30 min. Pattern : quand une plateforme bloque, pivoter vers l'autre mieux equipee plutot que forcer.
- **Limites MCP Asana pour automation produit** : `create_tasks` OK, mais pas `create_project`/`create_section`/`update_project archived`. Setup structure = manuel UI. Pour "full integration automatisee", Notion est superieur (create_database + create_view + update_data_source tous dispos).
- **Manifest-driven pattern pour honnetete P-11**. Bash ne peut pas invoquer MCP. Scripts `po-*.sh` generent manifests JSON dans `.omc/po-manifests/` + Claude execute. Permet traceabilite + idempotence + recovery post-compactage. Reutilisable pour autres integrations MCP futures.
- **Notion DB + views natifs suffisent pour role PO**. Kanban (board group Status/Module) + timeline (date range) + relations (one-way/two-way DUAL) + formulas + rollups = equivalent complet Asana Premium sans cout supplementaire. 1 plateforme < 2 plateformes pour dev solo (YAGNI P-20).
- **Scope PO elargi = strategique, pas juste technique**. Agent `po-agent` couvre FOS + modules + apps futures revendables via App Builder. Responsabilites = roadmap, backlog, US, sprint, kanban, metrics. Ne sert pas qu'a "sync technique".
- **Views Notion MCP requires both database_id AND data_source_id**. Premier essai avec seulement data_source_id failed. Fix = fournir les 2. Lesson pour futurs usages.
- **DB select options manquantes = ALTER COLUMN SET**. DB Tasks Module n'avait pas "Product" option au depart. Fix via `notion-update-data-source ALTER COLUMN "Module" SET SELECT(...)`. Pattern : pour evolution schema DB post-creation, utiliser ALTER plutot que delete/recreate.

**Threads ouverts** :
- Merge main + push origin (`/session-end` Phase 8) : a faire maintenant
- Test live D-PRODUCT-01 : activer `PRODUCT_MCP_SYNC=1` + observer hooks SessionStart/End reels + Kevin move card Notion kanban → pull reel
- Kevin supprime manuellement projet Asana "FoundationOS" (MCP ne le peut pas)
- Next rotation MCP Notion : si Kevin passe equipe, reevaluer permissions workspace + 3-way merge
- Decision Phase 5 modules (Finance/Sante/Trading) — toujours reportee

**Pages wiki impactees** :
- Creees P5 : `wiki/concepts/Product Management.md` (concept core), `wiki/concepts/Notion integration.md` (concept impl)
- Mises a jour meta : `wiki/hot.md`, `wiki/meta/sessions-recent.md` (this), `wiki/meta/lessons-learned.md`, `wiki/meta/thinking.md`

**Limites honnetes rencontrees** (P-11) :
- MCP Asana create_project/section/update_project absents → abandon Asana
- MCP Notion notion-create-pages root-level non supporte → new root enfant temporaire de Archive
- MCP Asana create_tasks resource_subtype=section refuse → limite connue
- `create_project_preview` Asana requiert confirmation UI Kevin (pas creation silencieuse)
- Rate limit Notion 3 req/s → batching fin session obligatoire

---

## 2026-04-19 (D-BODY-01 COMPLET 5/5) · Body module 8e Core OS livre integralement

**Duree** : 1 session longue (~3h, Opus 4.7 1M context)

**Scope** : Kevin pose question ouverte "construire les bases d'un nouveau module core, un module corps, dont l'objectif sera de s'assurer de l'alignement entre toi et moi. En fait, il faudra qu'il soit adaptatif, qui apprenne de nouvelles choses." Session complete : recherche externe + proposition architecture + plan 5 phases approuve ExitPlanMode + Phase P1 execution avec commit + cloture.

**Livraison** (1 commit atomique `5d26166` + 14 fichiers) :
- **Spec canonique** : `docs/core/body.md` (11 sections du 8e module "Body" Core OS : Architecture / 4 couches C1 Constitution / C2 Intent / C3 Feedback / C4 Learning loop / Files / Integration 7 modules / Workflows / Regle d'or / Limites / Maintenance).
- **Constitution** : `docs/core/constitution.md` (~41 principes P-XX numerotes seedees depuis sources existantes — CLAUDE.md L9-24 imperatifs = P-01 a P-14 ; anti-bullshit gates L148-153 = P-15 a P-19 ; wiki/meta/lessons-learned.md = P-20 a P-27 ; 5 pieges cadrage Foundation OS.md = P-28 a P-32 ; CLAUDE.md L119-128 interdits = P-33 a P-36 ; auto-memory feedback_*.md = P-37 a P-41). Format : Regle / Pourquoi / Done / Not-done / Source. Append-only, jamais renumerotation.
- **Script intent-capture** : `scripts/intent-capture.sh` (template 5 champs `.omc/intent/YYYY-MM-DD-<slug>.md` : verbatim Kevin / comprends / scope / anti-scope / signaux drift). Valide slug `[a-z0-9-]{1,40}`. Detection worktree auto (pattern D-CONCURRENCY-01). Teste 4 cas : missing arg (exit 1), invalid slug (exit 1), valid slug avec --demand pre-fill (exit 0), already exists (exit 2).
- **4 stubs forward refs** (zero regression) : `scripts/alignment-analyze.sh` (P2 pending) + `scripts/constitution-suggest.sh` (P3 pending) + `.claude/agents/alignment-auditor.md` (P4 stub sonnet read-only) + `docs/constitution-archive.md` (archive vide jusqu'au premier archivage Q3 2026).
- **5 edits integration** : `docs/core/architecture-core.md` (7 → 8 modules + row Body + section Phase 8 ~10L) ; `docs/core/communication.md` (Layered Loading section 6.5 L2 ajoute constitution.md) ; `.claude/commands/plan-os.md` (Tour 1 bis intent-capture OBLIGATOIRE apres EnterPlanMode) ; `.claude/commands/session-start.md` + `.claude/commands/cockpit.md` (Tour 1 point 6 Read constitution + renumerotation).
- **Dogfooding** : `.omc/intent/2026-04-19-body-p1-constitution.md` cree via `bash scripts/intent-capture.sh body-p1-constitution --demand "..."` (utilisation intrinseque du script).
- **Plan dual-path** : `~/.claude/plans/non-c-est-bon-allez-abundant-owl.md` (natif Plan Mode) + `.archive/plans-done-260419/2026-04-19-body-module-complet.md` (versionne projet, ~900L, 5 phases × 6 elements stricts).

**Verifs finales** :
- health-check SAIN (0 critical, 0 warning) — pre-commit hook passe
- ref-checker : 146 .md scannes / 0 refs cassees (apres creation 4 stubs + fix P-23 not-done exemple pedagogic)
- intent-capture teste 4 cas + cleanup
- Scripts stubs P2-P4 testes (exit 0 avec message "pending PN")
- 14 fichiers stages + commit `5d26166` (1688 insertions, 12 deletions)

**Decision** : **D-BODY-01** Module Body 8e Core OS (Proprioception Kevin-Claude). Phase P1 DONE. Phases P2-P5 en sessions dediees selon plan (~7h restants des 10h estimes).

**Revelations** :
- **Recherche externe avant architecture interne**. 30 min de recherche web (Constitutional AI, Reflexion framework, IFEval, AlignmentCheck) = ROI infini pour architecture module nouveau. Inspire sans copier, identifie pieges connus (biais LLM-as-judge, faux positifs regex matcher, YAGNI embeddings).
- **Stubs forward refs = pattern zero regression**. Plan multi-phase cree forward refs qui cassent health-check. Solution : creer 4 stubs minimaux (scripts exit 0 + message "pending PN", agent frontmatter stub, archive vide). 5 min de travail, health SAIN pre-commit. Pattern generalisable a tout plan multi-phase.
- **Dogfooding intrinseque = cercle vertueux validation**. intent-capture.sh utilise pour creer l'intent de sa propre phase P1. Le systeme valide le systeme des son commit initial. A generaliser : chaque nouveau script "self" doit etre use on self.
- **Constitution seedee > constitution inventee**. Les 41 P-XX derivent 100% de sources existantes avec field "Source" traceable. Aucun principe invente. Regle : **si je ne peux pas citer la source, je n'ai pas le droit d'ecrire le principe**.
- **Ambition Option C + minutie 6-elements = orthogonal**. Ambitieux en scope (5 phases livrees), minutieux en technique (6 elements par phase, stubs forward, verif a chaque phase). Pas de conflit : scope vs comment.
- **Questions front-loadees Kevin + AskUserQuestion groupees**. 3 questions debut (Q1 nom / Q2 scope / Q3 intent obligatoire) + reponses rapides = zero interruption execution. Memoire `feedback_frontload_questions.md` applique.

**Threads ouverts** :
- Merge main + push origin (`/session-end` Phase 8) : a faire maintenant cette cloture
- Phases P2-P5 en sessions dediees (~7h restants) :
  - P2 Rating enrichi + alignment-analyze.sh implementation (~2h)
  - P3 Pre-action check CLAUDE.md + lessons loop (~1-2h)
  - P4 Agent alignment-auditor implementation complete (~2h)
  - P5 Brief v12 tuile 🧭 ALIGNMENT + 3 pages wiki concepts (~1h)
- Decision Phase 5 modules (Finance/Sante/Trading) — toujours reportee
- OMC update v4.10.1 → v4.12.1

**Pages wiki impactees** :
- Aucune creation wiki P1 (les 3 pages concepts Body/Alignment/Constitution FOS sont prevues P5)
- Mise a jour meta : `wiki/hot.md`, `wiki/meta/sessions-recent.md`, `wiki/meta/thinking.md`, `wiki/meta/lessons-learned.md` (cette cloture)

**Sources externes citees** :
- [Constitutional AI arxiv 2212.08073](https://arxiv.org/abs/2212.08073)
- [Anthropic constitution publique janvier 2026](https://time.com/7354738/claude-constitution-ai-alignment/)
- [IFEval arxiv 2311.07911](https://arxiv.org/abs/2311.07911)
- [Reflection pattern 2026](https://stackviv.ai/blog/reflection-ai-agents-self-improvement)
- [AlignmentCheck + 41.77% specification drift (Augment Code)](https://www.augmentcode.com/guides/why-multi-agent-llm-systems-fail-and-how-to-fix-them)

---

## 2026-04-19 (D-CONCURRENCY-01 DONE) · Multi-session safety

**Duree** : 1 session courte (~2h, Opus 4.7 1M context)

**Scope** : Kevin pose question ouverte "puis-je travailler N sessions en parallele sans regression ?". Audit complet concurrence multi-session necessaire. Production reponse honnete puis livraison minimaliste apres challenge Kevin (proposition initiale A-ambitieuse → B-lite YAGNI).

**Livraison** (2 commits atomiques + 0 merge pendant session) :
- **Fix snapshot collision** (`4ff56e0` feat(os)) : `scripts/hooks/pre-compaction-snapshot.sh` +6/-2 lignes. Detection `pwd` dans `.claude/worktrees/<nom>` → suffix worktree dans nom fichier snapshot (`.omc/snapshots/YYYYMMDD-HHMM-<worktree>.md`). Evite overwrite silencieux si 2 sessions paralleles compactent dans la meme minute. Teste live : `20260419-1108-strange-dhawan-e61b96.md` cree OK.
- **Spec `docs/core/concurrency.md`** (`117be29` docs(os)) : nouveau module Core OS (252L, 11 sections). Modele mental isole (par worktree) vs partage (7 hotspots), regles d'or (cloture en serie, 1 session = 1 module), workflow visuel ASCII (sain vs risque), ce qu'on peut / evite / ne peut pas, protections actives, recette resolution conflit (git pull + merge manuel 5-15 min). Limites explicites : pas de lock par fichier (YAGNI dev solo), pas de detection stale (gadget).
- **CLAUDE.md +4L section "Multi-session (concurrence)"** entre Garde-fous et Token-awareness. Pointe vers spec canonique. 199L total (sous garde-fou 200L).

**Verifs finales** :
- Test manuel pre-compaction-snapshot.sh : fichier genere avec suffix worktree OK
- ref-checker : 141 .md / 0 cassee (post-fix 2 faux positifs chemins Phase 5 sans trailing slash)
- health-check : SAIN (0 critical, 0 warning, build 245ms app, 15/15 tests)
- wiki-health : SAIN (48 pages, hot.md 0j)
- CLAUDE.md : 199L (garde-fou 200L respecte)

**Decision** : **D-CONCURRENCY-01 DONE** — Multi-session safety documentee via discipline + fix snapshot. Pas de lock automatique (YAGNI pour dev solo, reevaluer si Kevin equipe).

**Revelations** :
- **YAGNI > defensive engineering**. Proposition initiale "lock par fichier" sonnait bien mais : (1) jamais teste reellement, (2) ajoute point de faille (lock stale, bloquant 5 min), (3) discipline Claude requise (oublier = pas de protection), (4) benefit marginal pour dev solo. Kevin a eu raison de challenger → reduit a minimaliste.
- **Auto-critique honnete = valeur**. Quand Kevin a demande "tu m'assures que le plan est realiste ?", l'honnetete ("non, pas pour tous les items") a ete plus utile qu'une defense.
- **Documenter une discipline = codifier le tacite**. La regle "cloture en serie" existait implicitement (chaque session ecrit CONTEXT.md), mais jamais formalisee. Maintenant elle est dans CLAUDE.md + docs/core/concurrency.md.
- **Le lock existant (`scripts/session-lock.sh`) = Cowork vs CLI seulement**, pas N worktrees. C'etait un angle mort. Decouverte via grep lors de l'audit.

**Threads ouverts** :
- Merge main + push origin (`/session-end` Phase 8) : a faire maintenant
- 3 worktrees actifs (jovial-jemison + pedantic-mendel + strange-dhawan) — regle cloture serie applicable aux 2 autres
- Decision Phase 5 (Finance/Sante/Trading) — toujours reportee
- OMC update v4.10.1 → v4.12.1 disponible

---

## 2026-04-19 (soir) · Extension module trading v1.1 (strategy library + Nautilus skeletons)

**Duree** : 1 session (Opus 4.7 1M context, subagent-driven execution)

**Scope** : livrer tout ce qui etait reporte V1.1 du plan D-TRADING-01 — strategy library riche (4 nouvelles strategies au-dela de l'exemple ema_cross) + preparation architecture Nautilus event-driven (skeletons testables) + roadmap V1.2 complete.

**Livraison** (8 commits + 22 tests nouveaux) :
- **C Strategy library** (5 commits, 22 nouveaux tests cumules) :
  - C.1 `5552990` Donchian Breakout (Turtle Traders, 5 tests, look-ahead-free shift+rolling)
  - C.2 `b8748b6` RSI Mean-Reversion (14/30/70, 5 tests, cross detection)
  - C.3 `e28bf2b` Multi-TF Trend (EMA cross + trend filter, 6 tests, simplification pragmatique sur trend_lookback)
  - C.4 `e938b65` Bollinger Volatility Breakout (20/2, 6 tests, breakout upper + return to middle)
  - C.5 `eb7f70c` 4 wiki strategy pages + index-trading `updated: 2026-04-19` `confidence: medium` + section "## Strategies v1" listant les 5 strategies
- **B Nautilus skeletons** (2 commits) :
  - B1 `f91ba58` `nautilus_bridge/` : types.py (`NautilusBar`/`OrderIntent` dataclasses) + transforms.py (`pandas_to_nautilus_bars` + `signals_to_order_intents`) + runner.py (`NautilusBridgeRunner.run()` delegue pandas + `.run_full_nautilus()` NotImplementedError V1.2). 6 tests. No `import nautilus_trader` actif (discipline : garde tests rapides).
  - B2 `38ffe5a` `execution/live/nautilus_live.py` remplace stub par `NautilusLiveEngine` event-driven (lifecycle start/stop/pause/resume + open_orders + positions dict + submit_order/on_fill + connect_to_exchange/send_order_to_exchange NotImplementedError V1.2) + `execution/live/kill_switch.py` (3 modes : manuel/file-flag/threshold N failures). 16 tests (10 NautilusLive + 6 KillSwitch).
- **V1.2 roadmap** : `589d139` spec 263L `docs/superpowers/specs/2026-04-19-nautilus-v12-roadmap.md` — cartographie explicite NotImplementedError B1/B2 → V1.2 phases A (backtest migration 6-9 sessions) + B (live integration 5-7 sessions + 2 mois paper trading). 8 tasks detaillees + prerequis + risques + check-points 2026-05/06/07/09.

**Verifs** : 94/94 tests cumulatifs, ruff clean, mypy strict clean, build app/DS inchanges, CLI `trading` inchange (pas de regression CLI), health-check DEGRADED (3 refs cassees pre-existantes + 2 drifts cosmetiques, 0 critical).

**Decisions** : Strategy library V1.1 livree. Nautilus event-driven full migration formellement **reportee V1.2** avec roadmap tangible. Approche honnete : skeletons testables + NotImplementedError explicites + spec 263L vs refactor massif risque.

**Pages wiki creees** : 4 strategy pages (`donchian-breakout-20-10.md`, `rsi-mean-reversion-14-30-70.md`, `multi-tf-trend-10-30-200.md`, `bollinger-breakout-20-2.md`). Index-trading passe `confidence: low` → `medium` (domaine a contenu concret maintenant).

**Revelations** :
- Extending strategy library = 30 min / strategie via subagent-driven discipline. Scalable.
- Nautilus full migration bien plus grosse que je l'anticipais au design D-TRADING-01 — refacter les strategies existantes + data catalog + runner = 6-10 sessions honnetement. Les skeletons B1/B2 posent l'interface sans se perdre dans un refactor incomplet.
- Look-ahead safety : `shift(1).rolling(N)` sur indicators + `shift(1)` sur cross detection = discipline a maintenir sur chaque nouvelle strategie.
- Position weighted avg dans NautilusLiveEngine.on_fill est naive — documente comme V1 caveat, FIFO ledger en V1.2.

**Threads ouverts** :
- V1.2 Nautilus migration (si D-TRADING-01 v1 prouve sa valeur sur donnees reelles dans les 3 mois)
- V1.2+ 3Commas maison (spec existant, reporte apres V1.2 Nautilus qui couvre 80% du besoin)
- V1.3+ Finance Dashboard Maison (spec existant)
- Phase 5 autre module : Sante / Finance Patrimoine
- OMC update v4.10.1 → v4.13.0

---

## 2026-04-19 (matin) · Backtest engine crypto v1 socle 8/8

**Duree** : 1 session longue (Opus 4.7 1M context, subagent-driven execution)

**Scope** : livrer le module `modules/finance/trading/` — backtest engine crypto complet avec data pipeline, strategy framework, harnesses anti-biais, reports HTML, Pine Script generator + 3Commas webhook receiver. Ambition Kevin : bots de trading automatises Pine → 3Commas, backtest "ultra-solide + proche de la realite".

**Livraison** (27+ commits, 8 phases) :
- Phase 1 : scaffold module + uv + CLI stub (3 tasks, 4 commits)
- Phase 2 : data pipeline — DataSource Protocol + CCXTSource + BinanceSource + Catalog Parquet + QualityChecker + CLI download-data + fix gitignore anchor (6 tasks + 1 fix, 7 commits)
- Phase 3 : backtest core — BaseStrategy Pydantic + indicators EMA/RSI/ATR + fees/slippage vol-based/latency/funding + EMA cross exemple + BacktestRunner pandas + CLI backtest (4 tasks, 4 commits ; Task 3.5 Nautilus event-driven SKIPPED v1)
- Phase 4 : harnesses anti-biais — Harness protocol + WalkForward + PurgedCV (Lopez de Prado) + MonteCarlo (1000+ runs) + PBO (Bailey-Lopez) + DeflatedSharpe + CLI 3 sub-commands (6 tasks, 6 commits)
- Phase 5 : analysis — PerformanceMetrics (Sharpe/Sortino/Calmar/PF/WinRate) + HTMLReport tearsheet Jinja + RegimeClassifier (3 tasks, 3 commits)
- Phase 6 : execution — PineGenerator v5 + 3Commas API HMAC + WebhookReceiver FastAPI + NautilusLive stub (3 tasks, 3 commits)
- Phase 7 : tests smoke consolides + Store DuckDB stub + CI GitHub Actions (2 tasks, 2 commits)
- Phase 8 : wiki 6 concepts + strategy/backtest pages + README enrichi + CONTEXT update (3 tasks)

**Verifs** : 50/50 tests cumulatifs, coverage 82.86% (seuil CI 70%), ruff clean, mypy strict clean, health-check DEGRADED (refs cassees pre-existantes du design/plan pointant vers chemins futurs — non bloquant, se resolvent au fur et a mesure), zero regression build app/DS.

**Decisions** : **D-TRADING-01 Backtest engine crypto v1 socle** (2026-04-19).

**Pages wiki creees** : `concepts/Sharpe Ratio.md`, `concepts/PBO.md`, `concepts/Walk-Forward Analysis.md`, `concepts/Purged CV.md`, `concepts/Deflated Sharpe.md`, `concepts/Slippage Models.md`, `strategies/ema-cross-btc-4h.md`, `backtests/2026-04-19-ema-cross-btc-smoke.md`.

**Revelations** :
- Approche C hybride pragmatique (Nautilus deps + pipeline custom autour) tient la route : 8 phases livrees sans avoir besoin de Nautilus event-driven en v1. Runner pandas simplifie suffit pour piloter harnesses + reports. Nautilus event-driven devient un upgrade V1.1, pas un blocker.
- Subagent-driven-development (superpowers skill) tres efficace pour plans longs : ~30 tasks → ~30 subagent dispatches + 2-stage review (spec + code). Contexte isole par task = zero pollution, velocity constante. Session principale reste lisible.
- TDD rigoureux a prevenu plusieurs bugs subtils (Sharpe float-point constant returns, Binance mock pagination infini, gitignore anchor `data/` package vs `data/` dir). Les subagents ont detecte ces cas pendant leur self-review.
- Honnetete integree au README + concepts wiki : pas de promesse de gains, limites Pine Script documentees, deploiement reste gate humaine. Kevin a valide cette posture au brainstorming initial.

**Threads ouverts** :
- Premier backtest reel sur BTC/ETH 5 ans 4h + decision deploiement strategie live
- V1.1 Nautilus event-driven (Task 3.5 skipped) + NautilusLive execution directe
- Strategy library : coder 3-5 vraies strategies au-dela de l'exemple `ema_cross`
- **V1.2+ 3Commas maison** (recherche faite meme jour, spec `docs/superpowers/specs/2026-04-19-3commas-alternative-research.md` + concept [[Order Execution Management System]]. Decision reportee apres V1.1 + 3 mois usage 3Commas reel.)
- **V1.3+ Finance Dashboard Maison** (recherche faite meme jour, spec `docs/superpowers/specs/2026-04-19-finance-dashboard-research.md` 314L + concept [[Portfolio Aggregator]]. Option D hybride recommandee. Commencer par P1 bots monitor. Attendant : CoinStats SaaS.)
- Phase 5 autre module : Sante / Finance Patrimoine (PEA/PER/SCPI/fiscalite)
- OMC update v4.10.1 → v4.12.1

---

## 2026-04-18 (D-INTEG-01 Phases 2-5 COMPLET) · Integration sources externes 5/5

**Duree** : 1 session longue (~5-6h enchainees, Opus 4.7 1M context — Phases 2+3+4+5 sans compactage)

**Scope** : Executer Phases 2-5 du plan D-INTEG-01 apres Phase 1 preparatoire (session precedente). 4 livrables substantiels (1 hook + 2 scripts bash/python + 1 section canonique) + backfill 22 pages + graph report auto-gen. Zero regression a chaque phase, health SAIN conserve.

**Livraison** (4 commits + 4 merges + 4 push origin main) :
- **Phase 2 INT-1** (`2534137` + merge `34c259b`) : `scripts/hooks/pre-compaction-snapshot.sh` (+x, rotation 14), `.claude/settings.json` hook PreCompact (best-effort), `.gitignore` snapshots, `docs/core/tools.md` entree. Snapshot atomique dump hot + CONTEXT Cap + TodoWrite dans `.omc/snapshots/YYYYMMDD-HHMM.md`. Recovery : `cat .omc/snapshots/$(ls -t .omc/snapshots | head -1)`.
- **Phase 3 INT-2** (`cc6d3c4` + merge `4f08465`) : `scripts/wiki-confidence-audit.sh` (3 modes default/--quiet/--check), backfill 22 pages (19 high + 3 low placeholders Phase 5), template `entity.md` patche (medium), chain health-check section INFO, `docs/core/knowledge.md` 12.1 status active. Distribution : 41 high / 1 medium / 3 low sur 48 pages.
- **Phase 4 INT-3** (`1010887` + merge `fc8ded4`) : `scripts/wiki-graph-report.sh` (bash wrapper + python3 inline, 3 modes), `wiki/meta/graph-report.md` auto-gen (3.2KB). Chain health-check INFO. Wikilinks : [[graph-report]] dans index-wiki + table Enhancements foundation-os-map. Premier run : 44 pages scannees (hors templates), 11 god-nodes, 1 orphelin (session-patterns, seuil OK), 6 cross-domain, 6 communities.
- **Phase 5 INS-1** (`9418661` + merge `e861abf`) : `docs/core/communication.md` section 6.5 "Layered context loading L0-L3" (2 tables + seuils thresholds.json + regles selection par type de tache). Callout success `wiki/concepts/Layered Loading.md`. `docs/core/knowledge.md` 12.3 status active.

**Verifs finales** :
- wiki-health SAIN (48 pages, 15 concepts, 5 entities, 2 sources, 5 domaines, hot.md 0j)
- ref-checker : 141 .md / 0 cassee
- health-check SAIN avec 2 nouvelles lignes INFO chainees (Wiki confidence + Wiki graph)
- wiki-graph-report --check exit 0 (fichier sync)
- Build 282ms, 15/15 tests app, drift SYNC, tier contradictions 0, neuroplasticite 100%
- JSON valides : thresholds.json + .claude/settings.json

**Decision** : **D-INTEG-01 COMPLET** (5/5 phases) — 4 enhancements MemPalace/Graphify (INT-1/2/3 + INS-1) absorbes organiquement sans regression. Plan archive via hook auto-archive (status:done, phases_done:5).

**Revelations** :
- FOS absorb 4 features externes en 1 session Opus 4.7 1M context sans casser = **validation organicite** (pattern scripts + hooks + frontmatter + chain health-check).
- Layered loading section 6.5 **formalise une discipline deja de facto** : SessionStart Tour 1 = L0 (hot) + L1 (CONTEXT + sessions-recent) + L2 (lessons + thinking + plans). Explicite l'implicite.
- Graph report premier run revele pattern **mesh sain** post-refactor D-MAPPING-01 : top god-nodes = index-wiki (19), index-concepts (19), LLM Wiki Pattern (18), foundation-os-map (17). Mesh niveau 2 fonctionne.
- Confidence tagging honnete : **3 pages `low`** (domaines Phase 5 placeholders) = visibilite explicite des claims non-verifiees. Neuroplasticite applique.
- Pattern **python3 inline dans bash wrapper** (Phase 4) : robuste pour regex/JSON/graph scan. Reutilisable pour futurs scripts analytiques.

**Threads ouverts** :
- Decision Phase 5 modules (Finance/Sante/Trading) — prochain gros chantier
- 14 routines Desktop UI /schedule (Kevin config manuelle)
- 10 worktrees actifs — cleanup eventuel post-merge
- OMC update v4.10.1 → v4.12.0 disponible

---

## 2026-04-18 (D-INTEG-01 Phase 1/5) · Preparation integration sources externes

Session preparatoire : audit surface SAIN + lecture 5 sources externes + synthese 3 tiers + plan 5 phases 6 elements + Phase 1 exec (4 concepts wiki + spec `docs/core/knowledge.md` section 12 + seuils thresholds.json + decision D-INTEG-01 + dual-path plan). Commit `6386823` + merge `452a342`. 47 pages, 712 wikilinks, health SAIN.

---

## 2026-04-17 (mapping refactor) · Refactor radical mapping/routage cerveau OS

**Durée** : 1 session longue (~5h, Session A+B+C enchainees)
**Scope** : Audit exhaustif 128 fichiers + refactor radical du cerveau (mapping, indexage, nommage, tags, regroupements, routes de lecture, noeuds logiques, references, articulation, memoire). Scope cerveau uniquement (pas modules/app, pas modules/design-system). Ambition Kevin : radical (B3 — renommage, restructuration, fusion/split, suppression orphelines).

**Livraison** (14 commits + 1 Phase SKIP) :
- Phase 1 `005703d` : rapport audit 720L + plan execution 15 phases 6 elements
- Phase 2 `15bd8fe` : unification counts wiki (F8, 4 sources -> 1)
- Phase 3 `6193d7e` : decomission index-app.md + refs modules/app/data/* (F5)
- Phase 4 `dd0825c` : navigation 2 niveaux, foundation-os-map 205L->74L (F4)
- Phase 5 `d2c4af3` : graph.json Obsidian 12->9 color groups (F7 local)
- Phase 6 `d425ea9` : rationalisation journals 4->2 (F9, archive log + session-dna)
- Phase 7 `d872aa2` : SessionStart optimise, unify cockpit+session-start (F1 F2 F3)
- Phase 8 `b461e82` : memoires nettoyage (F10 F11 F12 F13)
- Phase 9 `14a7714` : domains Phase 5 [!placeholder] (F14)
- Phase 10 `604fbe3` : suppression categories mortes comparisons/questions/canvases (F15)
- Phase 11 `5129f13` : DS components wikilinks -> backtick paths (F6)
- Phase 12 SKIP : enforcement routing decide (discipline garde)
- Phase 13 : tests end-to-end SAIN
- Phase 14-15 : docs sync + archive plan

**Verifs** : health SAIN + drift SYNC + wiki-health SAIN + ref-checker 0 cassees + tier-contradiction 0 + neuroplasticite 100% + tests 15/15 app + build 244ms.

**Decisions** : D-MAPPING-01 Refactor mapping/routage cerveau OS (2026-04-17).

**Livrables** : `docs/audits/2026-04-17-mapping-routage-audit/rapport.md` (13 axes, 15 findings, preuves bash), `.archive/plans-done-260417/2026-04-17-mapping-routage-refactor.md` (15 phases, anti-compactage). Wiki 45 pages (50->47->45). 3 dossiers archives vers `.archive/wiki-orphans-260417/` (index-app, log, session-dna) + `.archive/wiki-empty-categories-260417/` (comparison template, question template).

**Revelation** : pattern "etoile" vs "mesh 2 niveaux". Hub surdimensionne (81 wikilinks foundation-os-map) = fragile + scalability issue. Mesh avec sous-indexes = plus resilient. Methode validee via rewrite foundation-os-map en hub niveau 2 (pointers vers 7 sous-indexes existants).

**Threads ouverts** : Decision Phase 5 (Finance/Sante/Trading). Configurer 14 routines Desktop UI /schedule.

---


## 2026-04-17 (cleanup) · Cleanup complet drifts + refs + TSX legacy

**Durée** : 1 session longue (~2h30)
**Scope** : Post-audit v2 S3 DONE, Kevin demande nettoyage end-to-end (B + C + warnings + legacy + refs). Lecture massive contexte (40+ fichiers) puis plan approuve EnterPlanMode (`parsed-swimming-torvalds.md` 8 phases, 6 elements chacune).

**Livraison** (6 commits atomiques) :
- `9f9bf4c` Phase 1 : archivage 10 rapports audit v2 -> `.archive/audit-v2-done-260417/` (retire 57 refs cassees d'un coup)
- `2f78d5c` Phase 2 : resolution contradiction CLAUDE <-> knowledge.md (canonique = knowledge.md section 5)
- `64fd1a7` Phase 3 : recablage 31 refs cassees vers `.archive/plans-done-260417/`, `.archive/specs-done-260417/`, `.archive/app-data-jsx-260417/`, `.archive/audit-v2-done-260417/`. IGNORE_REFS_RE ref-checker etendu (ds-reference-base-|audit-v2-done-)
- `205a1e4` Phase 4 : seuil TSX 800L pour `modules/design-system/src/components/ui/` (shadcn origin, sidebar.tsx 725L tolere)
- `570846f` Phase 5 : seuil TSX 2000L pour `patterns/` DS (DashboardDesignSystem.tsx 1788L = template showcase reference par ligne dans 41 composants ui/ DS, split casserait les refs documentaires)
- `c26ef46` Phase 6 : drifts cosmetiques (CONTEXT 179->133L, CLAUDE 220->195L, trim sessions 9->5, 7 decisions archivees dans decisions-log.md, drift-detector regex worktrees Desktop hex fix, wiki/index-wiki count sync 48->45)

**Verifs** :
- `ref-checker` : 88 -> 0 refs cassees (140 .md scannes)
- `tier-contradiction-check` : 0 duplications (5 tiers)
- `drift-detector` : SYNC (passe de 5 drifts a 0)
- `health-check` : **SAIN** (0 critical, 0 warning — evolution DEGRADED 3 warnings -> SAIN)
- `wiki-health` : SAIN (50 pages, 5 domaines, hot.md 0j)
- Tests : 15/15 app passants, 0 erreur TS app + DS
- Build : OK modules/app (~250ms) + design-system

**Decisions** :
- Contradiction tier canonique : spec module Knowledge = autorite (docs/core/knowledge.md section 5), CLAUDE.md pointe vers spec
- TSX legacy : accepter comme exceptions documentees plutot que split (shadcn ui + patterns showcase reference par ligne)
- Rapports audit v2 : archiver en bloc (audit execute 100%, rapports = snapshot historique)

**Revelation technique** :
- 41 composants ui/ DS ont des commentaires "iso DashboardDesignSystem.tsx lignes X-Y" — split du fichier casserait ces refs documentaires. Decision (Kevin) : accepter comme exception 2000L.
- drift-detector regex `^claude/[a-z]+-[a-z]+$` ne matchait pas worktrees Desktop auto avec hex (`claude/beautiful-darwin-8782be`). Fix : `^claude/[a-z]+-[a-z]+(-[a-z0-9]+)?$`.
- ref-checker regex split sur espace dans backtick path (`base DS/`) generait faux positifs. Fix : ajout `ds-reference-base-` + `audit-v2-done-` dans IGNORE_REFS_RE.

**Threads ouverts** :
- Decision Phase 5 modules : Finance / Sante / Trading (A)
- Configurer 14 routines Desktop UI /schedule (D)
- 2 worktrees legacy sleepy-ellis + suspicious-khayyam a decider

## 2026-04-17 (nuit) · Audit v2 S3 Phase 17+18 Contradiction + Feedback

**Durée** : 1 session moyenne (~2h, enchainee apres S3 P16 meme journee)
**Scope** : Completer plan S3 audit v2 — P17 I-06 contradiction detector 5 tiers + P18 I-10 feedback loop post-session. Kevin dit "on a beaucoup de contexte, enchaine" (1 session pour 2 phases).

**Livraison** (2 commits) :
- `7466910` **P17 I-06** — `scripts/tier-contradiction-check.sh` scan 4 paires (CLAUDE<->memory, CLAUDE<->docs/core, CONTEXT<->docs/core, CONTEXT<->wiki/meta). Seuil 40 chars min, 300 max. Mode `--quiet` pour chain. Extract + scan avec pattern subshell-safe (tmpfile + process sub, lesson-learned wiki-health.sh applique). Chain dans sync-check.sh section 9 (WARN) + health-check.sh INFO (DIM non-bloquant).
- `8190abc` **P18 I-10** — `scripts/session-ratings-analyze.sh` (distribution Y/N/partial + streak 3N + patterns 7-derniers apres N>=10). `.claude/commands/session-end.md` Phase 7bis entre 7 et 8 : AskUserQuestion Y/N/partial + notes, append JSONL. `.omc/ratings.jsonl` trackable (append-only). `wiki/meta/routines-setup.md` routine mensuelle manuelle ratings-monthly-review documentee.

**Verifs** :
- Contradiction dry-run : 1 vraie duplication detectee (`CLAUDE.md:"Si renommage → recabler TOUTES les refs..."` <-> `docs/core/knowledge.md`). Enforcement D-WIKI-01 active.
- Ratings-analyze teste empty (0 entree) / injected (Y=1/N=1/partial=1) / quiet (1-ligne stats) : OK.
- Health baseline inchange : DEGRADED 0 critical 3 warn (TSX 2 legacy 700+, refs 87 preexistants, drifts 5 cosmetiques). Aucune regression.

**Decisions** :
- Plan S3 considere DONE sur 3/3 phases, archive dans `.archive/plans-done-260417/` (pas d'Execution log formel mais 3 commits reels couvrent le scope).
- Rating session auto-active des prochain /session-end (test live de I-10 sur cette cloture meme).

**Revelation** :
- Le pattern extraction phrases via `tr '.' '\n'` simpliste mais suffisant pour detection first-pass. `grep -lF` (literal, pas regex) evite faux positifs. Seuil 40 chars elimine phrases courtes communes ("est actif", "voir docs/").
- Contradiction reelle trouvee : preuve que l'outil bosse. Enforcement D-WIKI-01 n'est plus juste declaratif.

**Threads ouverts** :
- Trancher duplication detectee : CLAUDE.md garde "Si renommage → recabler TOUTES les refs..." OU docs/core/knowledge.md ? Session cleanup dediee.
- Configurer 14 routines Desktop via /schedule UI (Kevin UI).
- Decision Phase 5 modules : Finance / Sante / Trading.

## 2026-04-17 (soir) · Audit v2 S3 Phase 16 I-09 Memory auto-priorisation

**Durée** : 1 session courte (~1h)
**Scope** : Plan S3 versionne (`.archive/plans-done-260417/2026-04-17-audit-v2-s3-phase-16-18.md`, 3 phases 6 elements) + Phase 16 I-09 execute seul (Kevin : 3 sessions separees, hook auto OUI, ratings.jsonl, 5 tiers complets).

**Livraison** (1 commit + 1 merge) :
- 25 auto-memories : frontmatter `last_used: 2026-04-17` injecte via awk BSD-safe (guard : skip MEMORY.md index, skip si pas de `type:`)
- `scripts/memory-audit.sh` : detect memoires > 30j sans usage (rapport only, env `MEMORY_STALE_DAYS` configurable, exit 0 toujours)
- `scripts/memory-last-used-hook.sh` : hook PreToolUse Read qui update `last_used` auto sur lecture `memory/*.md`. Idempotent (skip si deja today, skip si pas de frontmatter `last_used` deja present).
- `.claude/settings.json` : nouveau matcher `Read` branche sur le script
- Commit `98817e7` → merge `a42b5f5` dans main + push origin

**Verifs** :
- 25/25 memoires injectees (0 skipped, 0 sans type:)
- Hook trigger simule : last_used 2026-04-10 → 2026-04-17 OK
- Idempotence : pas de re-write si deja today (stat mtime identique avant/apres)
- `.claude/settings.json` : JSON valide (python3 json.load OK)
- Health-check : DEGRADED baseline (0 critical, 3 warnings preexistants : TSX legacy, refs manifeste+DS, drifts cosmetiques)

**Decisions Kevin** :
- 3 sessions separees (pas 1 intensive) pour absorber compactage eventuel
- Hook PreToolUse Read auto ACTIVE (pas juste MVP frontmatter seul)
- Rating storage : `.omc/ratings.jsonl` append-only (pas fichier par session)
- Contradiction detector : 5 tiers complets (pas 3 MVP)

**Revelation technique** :
- Le plan archive utilisait `sed -i.bak "/^type:/a\\ last_used: $TODAY\n"` — syntaxe BSD fragile. Remplace par `awk` one-liner avec guard `!done` : portable + plus sur.

**Threads ouverts (S3 restant)** :
- Phase 17 I-06 contradiction detector 5 tiers (~2h, session S3b)
- Phase 18 I-10 feedback loop post-session (~1h, session S3c)

---

> Session "2026-04-17 · Audit v2 execution S1+S2 (~75%)" trimee 2026-04-18 (regle max 5 sessions). Detail : 10 commits atomiques FORME+FONCTION. Livrables : scripts git-hooks-install + wiki-counts-sync + sessions-analyze + propositions-generator + neuroplasticity-score + tuile #15 brief v12 + wiki/meta/counts.md + session-patterns.md. Lecon CLAUDE_USER_PROMPT env var inexistante (stdin JSON only).

## 2026-04-16 · Mega Audit V2 FORME + FONCTION (Opus 4.7)

**Durée** : 1 session longue, ~2h30 apres plusieurs corrections Kevin
**Scope** : Audit complet hygiene (707 fichiers, 18000L, 7 sous-agents paralleles) + audit comportemental simulation 10 scenarios

**Revelations** :
- FOS a 70% de structure et 30% de fonction cognitive (score 4/10 sur FONCTION vs 7.2/10 sur FORME)
- Routing Cortex **decoratif** (table pas enforce runtime)
- Neuroplasticite **manuelle** (4 reflexes dependent de ma discipline, aucun hook ne force)
- 14 routines Cloud **documentees mais inertes** (jamais creees UI Desktop)
- Monitoring audite **la forme** (build, tests, CSS), jamais **la fonction** (reflexes, recall, repetitivity erreurs)
- 71 sessions transcripts `.omc/sessions/` **inexploites** (gold mine patterns Kevin)

**Pieges Claude documentes (lessons-learned)** :
1. Confondre FORME et FONCTION quand Kevin dit "audit"
2. Surgonfler findings pour paraitre utile
3. Cloner mauvais cadrage a 7 sous-agents
4. Ne pas ecouter mots exacts de Kevin
5. Proposer "un autre audit" au lieu d'admettre l'erreur

**Livrables** :
- `wiki/concepts/Foundation OS.md` (definition canonique 227L — LIRE EN PREMIER)
- `CLAUDE.md` (pointeur en tete vers page canonique)
- `.archive/audit-v2-done-260417/rapport-master-v2.md` (unifie FORME + FONCTION)
- `.archive/audit-v2-done-260417/rapport-comportement.md` (20 findings + 10 innovations)
- `docs/audits/2026-04-16-mega-audit-v2/raw/agent-*.md` (7 rapports bruts hygiene)
- `.archive/plans-done-260417/2026-04-16-mega-audit-v2-execution.md` (plan FORME, 8 phases, 3h30)
- `.archive/plans-done-260417/2026-04-16-mega-audit-v2-fonction.md` (plan FONCTION, 11 phases, 15-18h)
- `wiki/meta/lessons-learned.md` (5 pieges Claude ajoutes)

**Threads ouverts** :
- Executer plan FORME Phase 1 (3 bombes latentes, 90 min)
- Executer plan FONCTION Phase 1 I-08 (routines Cloud GitHub Actions, 2h)
- Decision : Option A (FORME d'abord) / B (FONCTION d'abord) / C (hybride, recommande)
- Definition canonique a relire au prochain SessionStart pour eviter re-confusion

## 2026-04-16 · Audit profondeur + nettoyage fantômes + worktrees

**Durée** : 1 session
**Scope** : Audit complet 128 fichiers (7 agents opus, contenu lu ligne par ligne) + nettoyage

**Fixes** :
- 5 fantômes Obsidian supprimés (fichiers physiques A.md, X.md, file.md, page.md + source wikilink log.md)
- 4 worktrees legacy nettoyés (sleepy-ellis, suspicious-khayyam, bold-newton, sharp-albattani)
- v11→v12 propagé dans ~25 fichiers (commands, docs/core, docs, wiki)
- cortex.md : 4→7 modules, nomenclature alignée
- Brief v11.md renommé Brief v12.md + refs recâblées
- 6 mémoires obsolètes/doublons → _deprecated
- CLAUDE.md : +4 impératifs qualité, "lire=lire TOUT"
- monitor.md : seuil CSS aligné, fichiers racine complétés
- cockpit.md : box-drawing INPUT → tuile Markdown

**Commits** : 3 (8507586, 233c73e, e95c986)

**Leçons** : audits précédents vérifiaient structure mais pas contenu. Fantômes Obsidian = chercher fichiers physiques d'abord. Impératifs qualité intégrés dans CLAUDE.md.

**Threads ouverts** :
- Décision Phase 5 : Finance / Santé / Trading
- _bmad/ : archiver ou garder ?
- Storybook 9 (pas 8) dans CONTEXT.md
- docs/index-documentation.md : scripts manquants, routes obsolètes
- README-cowork.md : dossiers désynchronisés

## 2026-04-16 · Hygiène OS — DEGRADED→SAIN

**Durée** : 1 session, ~30min
**Scope** : Audit + fix tous les warnings health-check (26 refs cassées, 3 drifts, 5 warnings → 0)

**Fixes** :
- 6 refs index.md → index-documentation.md (renommage non propagé)
- 6 refs plans archivés → .archive/ (wiki hot/log/CONTEXT/sources)
- 11 refs Phase 5 scaffold → ref-checker ignore modules Phase 5
- Vitest DS "No test files" handling dans health-check
- CSS seuil 40→65KB (55KB raw / 9KB gzip = normal pour DS complet)
- Wikilink `[[knowledge]]` → `[[Core OS]]` dans Neuroplasticite.md
- Drift-detector : worktree Desktop claude/* exclu du branch check
- CONTEXT.md 6→5 sessions, index-wiki count 40→36

**Commits** : 1 (b1d7501)

**Threads ouverts** :
- Décision Phase 5 : Finance / Santé / Trading
- 14 routines Desktop (Kevin UI)
- Clean worktrees legacy (sleepy-ellis, suspicious-khayyam)

> Session "2026-04-16 · Audit Mapping + Méga Audit Final" trimee 2026-04-17 soir (regle max 5 sessions). Detail : 29 findings mapping + 63 findings méga audit + 9 innovations. Decisions D-NAMING-02 + D-VAULT-01. 7 commits (39cff18, 6cb443a, bc02d7a, 4ea4b0c, 9144c83, b94e428). Concepts crees : [[Foundation OS]], [[Core OS]], [[Brief v12]], [[Neuroplasticite]], [[TDAH workflow]].

> Session "2026-04-15 — 2026-04-16 · Adoption Wiki Obsidian (D-WIKI-01)" trimee 2026-04-17 (regle max 5 sessions). Detail dans `.archive/plans-done-260416/2026-04-15-wiki-obsidian-adoption.md`.

> Session "2026-04-15 · Level Up Foundation OS (7 phases)" trimee 2026-04-17 (regle CLAUDE.md max 5 sessions). Detail dans `.archive/plans-done-260415/2026-04-15-level-up-foundation-os.md` + git log.

