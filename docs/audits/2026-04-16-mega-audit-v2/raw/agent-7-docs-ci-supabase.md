---
type: audit-raw
agent: 7
zone: "Docs peripheriques + CI + Supabase + .raw"
date: 2026-04-16
scope_files: 17
lines_read: 2275
status: completed
---

# RAPPORT AGENT 7 — DOCS PERIPHERIQUES + CI + SUPABASE + .raw

## Inventaire

TOTAL : 17 fichiers lus, 2 275 lignes.

| Categorie | Fichiers | Lignes |
|---|---|---|
| docs/ racine | architecture.md (176), manifeste.md (296), setup-guide.md (158), index-documentation.md (149), decisions-log.md (46) | 825 |
| docs/specs/ | 2026-04-05-foundation-os-v2-design.md (324), 2026-04-10-cockpit-design.md (208), 2026-04-10-tools-module-v2-design.md (266) | 798 |
| docs/plans/ | _template-plan.md (89) | 89 |
| .github/workflows/ | ci.yml (51), supabase-ping.yml (27), supernova-sync.yml (67) | 145 |
| supabase/migrations/ | 001_create_tables.sql (308), 002_add_delete_policies.sql (20), 003_add_updated_at.sql (35) | 363 |
| .raw/articles/ | karpathy-llm-wiki-pattern-2026-04-15.md (29), agricidaniel-claude-obsidian-2026-04-15.md (26) | 55 |

Presence hors scope : `docs/presentations/Foundation-OS-Claude-Collab.pptx` (647 KB, binaire non lu).

---

## Findings P0 (CI casse, migrations cassees, docs critiques desynchronisees)

### F-01 — Index docs reference `docs/index.md` (n'existe pas) au lieu de lui-meme
- **Fichier** : `docs/index-documentation.md:76`
- **Description** : La ligne `| docs/index.md | Carte navigation (ce fichier) |` reference `docs/index.md` mais le fichier s'appelle `docs/index-documentation.md`. L'auto-reference est cassee.
- **Impact** : Ref cassee dans le fichier qui se veut source de verite navigation. Contredit l'imperatif CLAUDE.md.
- **Recommandation** : Remplacer par `| docs/index-documentation.md | Carte navigation (ce fichier) |`.

### F-02 — Workflow Supernova pointe vers chemin tokens inexistant
- **Fichier** : `.github/workflows/supernova-sync.yml:10-12`
- **Description** : `paths` trigger sur `modules/design-system/src/**` mais un `TODO: adapter path quand tokens/source/ sera cree` est commente. Si le dossier existe mais pas dans paths, le workflow n'est pas reveille.
- **Impact** : Workflow potentiellement dormant.
- **Recommandation** : Verifier si `tokens/source/` existe. Si oui, decommenter paths.

### F-03 — Migration 001 contient seed data — non idempotent
- **Fichier** : `supabase/migrations/001_create_tables.sql:233-292`
- **Description** : Insertions de sessions/decisions/next_steps/risks/context_blocks. Sur re-run, duplication immediate. Pas de ON CONFLICT. Dates hardcodees 2026-04-04 trainent en prod.
- **Impact** : Migration non idempotente ; pollution production.
- **Recommandation** : Splitter seed dans `seed.sql` separe OU ajouter `ON CONFLICT DO NOTHING`.

### F-04 — Migration 001 cree tables sans IF NOT EXISTS
- **Fichier** : `supabase/migrations/001_create_tables.sql:11, 43, 74, 105, 137, 164`
- **Description** : `CREATE TABLE sessions (...)` sans `IF NOT EXISTS`. Un re-run echoue. Policies RLS idem.
- **Impact** : Migration pete sur rerun. Contraint a `supabase db reset` complet. Risque perte donnees.
- **Recommandation** : `CREATE TABLE IF NOT EXISTS`, `CREATE POLICY IF NOT EXISTS` (Postgres 15+).

---

## Findings P1

### F-05 — CLAUDE.md dit "6 tables + triggers" mais 2 families de triggers
- **Fichier** : CLAUDE.md ligne 88
- **Description** : En realite : 6 tables oui, mais 2 families de triggers. Sort_order sur 3 tables + updated_at sur les 6 tables. CLAUDE.md elide sort_order.
- **Recommandation** : Preciser : `6 tables + RLS + triggers (sort_order sur 3, updated_at sur 6)`.

### F-06 — CI ne build PAS l'app en premier — ordre inverse de priorite
- **Fichier** : `.github/workflows/ci.yml:25-41`
- **Description** : Sequence : DS build -> TS check app -> build app -> tests app -> tests DS. Pas de step lint. Tests DS en dernier alors que Manifeste dit "99/100 echouent incompatibilite React 19". Si 99/100 echouent, job rouge a chaque push.
- **Impact** : CI potentiellement rouge permanent.
- **Recommandation** : Verifier etat reel tests DS, fixer ou marquer `continue-on-error`. Ajouter step lint.

### F-07 — supabase-ping accepte 200 ou 401 — logique ambigue
- **Fichier** : `.github/workflows/supabase-ping.yml:27`
- **Description** : `[ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "401" ]`. 401 = projet eveille mais cle expiree. Le workflow reussit et laisse penser que Supabase est OK.
- **Impact** : Echec silencieux possible.
- **Recommandation** : Accepter uniquement 200. Ajouter notif sur fail.

### F-08 — Spec v2 "6 tables" vs seed data SQL "Architecture 5-tables"
- **Fichier** : `decisions-log.md:21` vs `supabase/migrations/001_create_tables.sql:239-260`
- **Description** : Decisions-log.md "6 tables". Seed data SQL dit "Architecture 5-tables validee". Contradiction historique.
- **Recommandation** : Reecrire seed ou supprimer hardcode.

### F-09 — Manifeste contradictions internes — Cycle 3
- **Fichier** : `docs/manifeste.md:44 vs 167-169`
- **Description** : L44 "Cycle 3 merge main 2026-04-10". L167 "Cycle 3 en cours, 20 restantes". Contradiction interne.
- **Recommandation** : Reviser section 9.2.

### F-10 — Manifeste stale 8 jours
- **Fichier** : `docs/manifeste.md:219`
- **Description** : Snapshots 04-07 et 04-10 melanges, n'a pas integre migration Desktop 2026-04-15 ni wiki D-WIKI-01. Mentionne "4 modules Core OS" mais 7 specs existent.
- **Recommandation** : Update section 6 et 9.

### F-11 — Specs docs/specs/ DONE mais pas archivees
- **Description** : 3 specs correspondent a plans executes et merges. Equivalents `.archive/specs-done-260415/` existent pour plans. Mix plan-archive + spec-active.
- **Recommandation** : Archiver specs DONE OU documenter frontmatter `status: done`.

### F-12 — CI utilise Node 24 mais package.json/setup-guide declare Node 18
- **Fichier** : `.github/workflows/ci.yml:19` vs `docs/setup-guide.md:8`
- **Description** : package.json racine n'a pas `engines`. Setup-guide "Node >= 18". CI pin Node 24. Ecart prod/local.
- **Recommandation** : Ajouter `"engines": { "node": ">=24" }`. Update setup-guide.

---

## Findings P2

### F-13 — .raw/articles/ duplique wiki/sources/ sans convention documentee
- **Description** : 2 articles `.raw/articles/*-2026-04-15.md` ont leurs pendants dans `wiki/sources/` sans suffixe date.
- **Recommandation** : Documenter convention .raw (originaux) vs wiki/sources (ingerees) dans `docs/core/knowledge.md`.

### F-14 — .raw/ 4 sous-dossiers vides (finance, sante, trading, images) avec .gitkeep
- **Description** : Scaffold Phase 5 vide depuis creation. Images pas dans knowledge.md.
- **Recommandation** : Documenter chaque dossier OU supprimer jusqu'a Phase 5.

### F-15 — Migration 002 : pas de IF NOT EXISTS
- **Fichier** : `supabase/migrations/002_add_delete_policies.sql:4-20`
- **Recommandation** : Ajouter garde.

### F-16 — Migration 003 cree triggers sans drop existing
- **Fichier** : `supabase/migrations/003_add_updated_at.sql:30-35`
- **Description** : Pas de `DROP TRIGGER IF EXISTS` prealable.
- **Recommandation** : Pattern standard DROP IF EXISTS + CREATE.

### F-17 — index-documentation.md ne mentionne pas wiki/ ni knowledge.md
- **Description** : Zero match wiki, knowledge.md, core/knowledge, claude-obsidian. Index stale D-WIKI-01.
- **Recommandation** : Ajouter section Wiki.

### F-18 — index-documentation.md liste Asana MCP actif mais interdit CLAUDE.md
- **Fichier** : `docs/index-documentation.md:120`
- **Description** : "Asana MCP Actif" vs CLAUDE.md "Interdit sans Kevin: Actions Asana/Notion/MCP externes". Ambiguite.
- **Recommandation** : Preciser "Actif (installe, usage manuel seulement)".

### F-19 — supernova-sync.yml reference designSystemId 790241 hardcode
- **Fichier** : `.github/workflows/supernova-sync.yml:55`
- **Description** : ID hardcode dans workflow ET package.json (3 endroits).
- **Recommandation** : Exporter SUPERNOVA_DS_ID en secret GitHub.

### F-20 — Template plan n'inclut pas les 6 elements obligatoires
- **Fichier** : `docs/plans/_template-plan.md:23-44`
- **Description** : CLAUDE.md + memoire `feedback_plans_ultra_detailles.md` imposent 6 elements (pre-conditions, etat repo, actions atomiques, verification, rollback, commit). Template propose 4 sur 6. Manque pre-conditions, etat-repo, rollback.
- **Impact** : Plans generes n'ont pas structure anti-perte-de-contexte.
- **Recommandation** : Ajouter pre-conditions, etat-repo, rollback.

### F-21 — CI n'a aucune step lint — pas de reproduction pre-commit
- **Description** : Pas de ESLint/Prettier. CI ne reproduit pas le pre-commit local health-check.sh.
- **Recommandation** : Ajouter step lint et/ou health-check.

---

## Findings P3

### F-22 — architecture.md redondance avec manifeste sur 4 agents
- **Description** : 3 endroits disent meme chose sur 4 agents. Regle d'or "une info = un tier".
- **Recommandation** : architecture.md source, les autres pointent.

### F-23 — Manifeste "7 plans dates" dans docs/plans/ mais realite = 1 template
- **Fichier** : `docs/manifeste.md:224`
- **Description** : Table obsolete. Les 7 plans sont archives.
- **Recommandation** : Update table.

### F-24 — Spec v2 reference Directive archivee (OK)
- **Description** : Reference `.archive/directive-v1.md`. OK archive.

### F-25 — Workflow supabase-ping cron sans notification
- **Description** : Single point of failure si 2 fails consecutifs.
- **Recommandation** : Notifier Kevin sur fail. 2e cron jeudi.

### F-26 — Manifeste reference tests DS 99 echecs sans suivi fix
- **Description** : Tech debt connue non trackee.
- **Recommandation** : Ajouter next step dans CONTEXT.md.

---

## Obsolescences

1. **docs/specs/** (3 fichiers, 798L) — candidats archivage `.archive/specs-done-260415/`.
2. **docs/manifeste.md** (296L) — stale, contradictions internes, refonte necessaire.
3. **docs/plans/** — normal post-session-end si archive fonctionne.
4. **.raw/articles/*-2026-04-15.md** — duplicata de wiki/sources/.
5. **.raw/{finance,sante,trading,images}/** — vides Phase 5.

---

## Contradictions / desynchronisations

| # | Source A | Source B | Contradiction |
|---|---|---|---|
| C1 | CLAUDE.md:88 "6 tables + triggers updated_at" | migrations 001+003 | Manquent triggers sort_order |
| C2 | manifeste.md:44 "Cycle 3 merge 04-10" | manifeste.md:167 "en cours, 20 restantes" | Interne |
| C3 | index-documentation.md:76 "docs/index.md" | realite `docs/index-documentation.md` | Ref cassee |
| C4 | decisions-log.md:21 "6 tables" | migration SQL seed "5-tables" | Schema doc |
| C5 | manifeste.md:223 "7 plans" | `docs/plans/` = 1 template | Metrique obsolete |
| C6 | setup-guide.md:8 "Node >= 18" | ci.yml Node 24 | Version mismatch |
| C7 | architecture.md vs core/architecture-core.md | Pas cross-linked | Complementaires non-lies |
| C8 | index-documentation.md:120 Asana Actif | CLAUDE.md:151 interdit | Ambiguite "Actif" |
| C9 | template-plan.md 4 elements/phase | CLAUDE.md + memoire 6 elements | Template incomplet |
| C10 | index-documentation.md manque wiki/ | wiki/ actif D-WIKI-01 | Index stale |

---

## Innovations / opportunites

### CI
- Matrix paralleles (app + ds) : gain ~2x temps.
- Step lint ESLint + Prettier.
- A11y Gate (deja TODO ligne 43-49).
- Playwright visual regression DS (deja commente).

### Supabase
- Preparer migrations Phase 5 : `004_finance_tables.sql`, `005_health_tables.sql`, `006_trading_tables.sql`.
- Seed separation (convention Supabase).
- Migration linter CI `supabase db lint`.
- RLS function : `auth.uid() = user_id` pour partitionnement Phase 5.

### Documentation
- Refonte manifeste post-migration + wiki.
- Convention .raw/ formalisee.
- Frontmatter specs `status: done|active|superseded`.

### Plans
- Template enrichi avec les 6 elements obligatoires.

### Workflows manquants
- Security audit `npm audit` hebdo.
- Supabase migrations validation PR.

---

## Couverture

**Lu integralement** : 17/17 fichiers du scope, 2 275 lignes. Chaque fichier lu ligne par ligne.

**Verifie par cross-grep** : Refs docs racine <-> core/, specs vs plans archives, versions Node, Supernova IDs, migrations idempotence, workflow cron, .raw vs wiki/sources.

---

## Conclusion zone

Cette zone 7 est un **melting-pot** de docs peripheriques, CI, DB et sources brutes. Le bon et le moins bon coexistent.

**Le bon** : la base SQL est coherente (6 tables + RLS complet + triggers sort_order et updated_at), les specs historiques sont conservees, les 3 workflows CI couvrent build/DB-ping/Supernova-sync, le template plan existe, les articles sources sont archives dans .raw/ et ingerees dans wiki/sources. La structure du monorepo reste lisible.

**Le moins bon** : les 3 migrations SQL sont **toutes non-idempotentes** (F-03, F-04, F-15, F-16) — handicap operationnel evident. Le manifeste est stale de 8 jours et contient des contradictions internes (Cycle 3 en cours vs DONE, 7 plans vs 1 template). L'index-documentation cite `docs/index.md` qui n'existe pas, et n'a pas integre l'adoption du wiki du 2026-04-16. Les specs docs/specs/ sont DONE mais non archivees. Le CI pin Node 24 sans que package.json ne declare `engines.node`.

**Priorite** : fixer les migrations idempotentes avant Phase 5 (eviter erreurs sur `supabase db reset`), corriger F-01 (ref cassee index), rafraichir le manifeste post-migration Desktop+wiki, aligner CLAUDE.md sur la realite triggers.

**Prochaine etape** : nettoyer les specs DONE vers `.archive/specs-done-260416/`, enrichir `docs/plans/_template-plan.md` avec les 6 elements, refondre le manifeste.

---

## Cross-references

- **Agent 1 (Core OS)** : `architecture.md` vs `architecture-core.md` (probable duplication structurelle, non cross-linkees). `knowledge.md` a integrer dans `index-documentation.md`.
- **Agent 2 (Scripts)** : `auto-archive-plans.sh` mentionne CLAUDE.md — verifier hook SessionEnd archive. Git pre-commit (health-check) a reproduire en CI.
- **Agent 3 (Wiki)** : `.raw/articles/*-2026-04-15.md` duplica de `wiki/sources/` — verifier convention.
- **Agent 4 (Memory)** : `feedback_plans_ultra_detailles.md` doit matcher `docs/plans/_template-plan.md` — desaligne.
- **Agent 5 (App)** : `modules/design-system/package.json` scripts supernova:* doivent matcher workflow — F-02 path TODO, F-19 ID hardcode.
- **CONTEXT.md** : manifeste stale et migrations non-idempotentes comme tech debt.
