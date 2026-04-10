# Audit Massif Cycle 3 — S3 Fondations Core OS

> Session : S3 | Date : 2026-04-08 | Mode : MOI strict
> Branche : `audit-massif-cycle3` | Tag baseline : `pre-audit-cycle3` (a8519c8)
> Plan source : `docs/plans/2026-04-07-cycle3-implementation.md` lignes 437+
> Pre-conditions : S2 commit valide (15e0a74) + baseline SAIN

---

## 1. Objectif

Verifier que les **4 piliers Core OS** (Cortex / Memory / Monitor / Tools) sont **reels** (implementes et utilises) et non purement theoriques. Capturer les specs ligne par ligne, les confronter au filesystem, identifier les ecarts spec/realite.

Resultat attendu : un verdict reel/theorique par pilier + findings sources + cross-ref avec l'inventaire S2 (4 agents + 4 commands + 8 scripts).

---

## 2. Methodologie (decoupage 6 phases anti-compactage A-F)

| Phase | Action | Statut |
|-------|--------|--------|
| A | Read parallele 5 specs `docs/core/*.md` (cortex, memory, monitor, tools, architecture-core) | DONE |
| B | Read `docs/specs/2026-04-05-foundation-os-v2-design.md` + `docs/decisions-log.md` | DONE |
| C | Test reel chaque pilier (grep Cortex usage, ls memory, run health-check, ls scripts) | DONE |
| D | Cross-ref Core OS specs vs S2 inventaire (4 agents + 4 commands + 8 scripts) | DONE |
| E | Ecrire livrable `03-fondations-core.md` (cette page) | DONE |
| F | Update CONTEXT.md + commit conventional | PENDING |

Mode MOI strict : zero sub-agent invoque. Verification cross-fichier executee par MOI avec contexte global.

---

## 3. Vue d'ensemble Core OS (architecture-core.md L1-22)

```
MODULES  (app, finance, sante)          Projets concrets
CORE OS  (cortex, memory, monitor,      Intelligence
          tools)
TOOLKIT  (OMC, BMAD, MCP)              Outils externes
```

| Pilier | Role | "Phase" architecture-core | Status spec | Runtime documente |
|--------|------|---------------------------|-------------|-------------------|
| Cortex | Routing, contexte, orchestration | Phase 1 | actif | CLAUDE.md, .claude/agents/, .claude/commands/ |
| Memory | Persistance structuree, tiers, decisions | Phase 2 | actif | CONTEXT.md, docs/, auto-memory |
| Monitor | Health indicators, severite, seuils | Phase 3 | actif | Integre dans /sync et review-agent |
| Tools | Validators, scripts, CI/CD | Phase 4 | actif | scripts/, .github/, hooks |

Source : `docs/core/architecture-core.md:17-22`

---

## 4. Pilier 1 — Cortex (cortex.md, 97L)

### 4.1 Specs documentees

- **Section 1 — Routing** (L5-22) : table 4 signaux → 4 agents + 5 regles priorite
- **Section 2 — Contexte** (L24-46) : protocole CONTEXT.md (lecture session-start, mise a jour session-end, invariants)
- **Section 3 — Commands** (L47-65) : registry 4 commands (`/session-start`, `/session-end`, `/new-project`, `/sync`) + detail `/sync`
- **Section 4 — Agents** (L66-89) : protocole uniforme entree → execution → sortie + contraintes communes
- **Section 5 — Limites** (L90-97) : delegue Memory / Monitor / Tools

### 4.2 Test reel

| Verification | Resultat | Source |
|--------------|----------|--------|
| Cortex routing reference dans `.claude/` | 1 fichier (sync.md uniquement) | grep `cortex\|Cortex` .claude/ |
| Cortex reference dans `docs/` | 36 occurrences / 14 fichiers | grep `cortex\|Cortex` docs/ |
| Routing dans CLAUDE.md | Section "Core OS — Routing" L62-68, pointe vers `docs/core/cortex.md` section 1 (source unique) | CLAUDE.md:62 |
| 4 agents portent leurs signaux dans frontmatter `Declencheurs` | dev-agent L5, review-agent L5, os-architect L5, doc-agent L5 (tous coherents avec cortex.md L11-14) | grep frontmatter |
| 4 commands existent | session-start, session-end, new-project, sync (cf S2 inventaire) | docs/audit-massif/02-inventaire-components.md |

### 4.3 Verdict Cortex

**REEL** — Le routing est implemente :
- la table signaux/agents vit dans `cortex.md:11-14` (source unique)
- chaque agent porte ses Declencheurs dans son frontmatter (cf S2 finding F-S2-02/03 : minimaliste mais intentionnel)
- CLAUDE.md `Core OS — Routing` (L62-68) pointe vers `cortex.md` sans dupliquer
- 4 commands existent et correspondent au registry cortex.md L51-54

**Faille mineure** : la routing intelligence n'est pas materialisee par du code (pas de "router engine") — c'est une convention de prompt portee par CLAUDE.md + frontmatters d'agents. C'est coherent avec Foundation OS (pas de runtime separe), mais cela signifie que la coherence routing depend integralement de la fidelite humain-LLM aux signaux frontmatter.

---

## 5. Pilier 2 — Memory (memory.md, 103L)

### 5.1 Specs documentees

- **Section 1 — Tiers** (L5-34) : table 4 tiers (Session / Contexte / Reference / Auto-memory) avec duree de vie + qui maj
- **Section 2 — Protocole "quoi va ou"** (L35-50) : table info → tier + regle d'or "une info dans UN tier"
- **Section 3 — Decisions lifecycle** (L51-76) : `proposee → active → supersedee`, format CONTEXT.md, max 15 actives → archivage `docs/decisions-log.md`
- **Section 4 — Sessions ce qui survit** (L77-96) : Toujours / si fondamental / jamais
- **Section 5 — Limites** (L97-103) : delegue Monitor / Tools

### 5.2 Test reel

| Verification | Resultat | Source |
|--------------|----------|--------|
| CONTEXT.md existe et structure | 102L, 9 sections | `cat CONTEXT.md` |
| docs/ contient les references | 14 specs + 5 plans + 3 audits + others | `ls docs/` |
| Auto-memory `~/.claude/projects/.../memory/` existe | 8 fichiers (MEMORY.md + 7 entries) | `ls -la ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/` |
| MEMORY.md liste les entries | 7 entries (vs "6" mentionne dans plan S3 task 3.4 step 2) | MEMORY.md |
| Decisions actives ≤ 15 | 9 dans CONTEXT.md (sous le seuil 15) | CONTEXT.md:51-62 |
| decisions-log.md existe | OUI, 17 archives (7 du 2026-04-01 + 10 phases/livrables) | `cat docs/decisions-log.md` |
| Decisions toutes datees YYYY-MM-DD | 9/9 actives + 17/17 archivees (verifie par health-check.sh L154-156) | health-check.sh output |

### 5.3 Verdict Memory

**REEL** — Les 4 tiers existent et sont alimentes :
- Session : volatile, gere par Claude Code (rien a verifier)
- Contexte : `CONTEXT.md` actif et maintenu (9 sessions hot, table modules, decisions actives, prochaine action)
- Reference : `docs/` riche (5 specs Core OS, 5+ plans, 3 audits, design-system, etc.)
- Auto-memory : 7 entries vivantes dans `~/.claude/projects/.../memory/` (MEMORY.md = index)

Le protocole "max 15 decisions actives → archivage" est respecte (9 actives, 17 archivees, decisions-log.md cree quand le seuil a ete franchi).

**Note** : memory.md L72 dit "max 15", CONTEXT.md actuel = 9 → marge de 6.

---

## 6. Pilier 3 — Monitor (monitor.md, 93L)

### 6.1 Specs documentees

- **Section 1 — Health indicators par severite** (L5-34) :
  - Critical (3) : Build, Structure racine, TypeScript
  - Warning (5) : TSX < 700L, Void Glass, MD pairs, Tests vitest, Refs intactes
  - Info (4) : CONTEXT.md a jour, Decisions datees, Build time, Bundle size
- **Section 2 — Quand verifier** (L36-44) : session-start / session-end / sync / pre-commit / pre-deploy
- **Section 3 — Format de rapport** (L46-67) : `HEALTH — [date]` avec verdicts SAIN / DEGRADED / BROKEN
- **Section 4 — Seuils d'alerte** (L73-85) : Build < 2000ms baseline 800ms, JS < 600KB, CSS < 40KB
- **Section 5 — Limites** (L87-93) : pas de cron, pas de monitoring prod, pas d'alertes push

### 6.2 Test reel

Run : `bash scripts/health-check.sh` (execute en session-start ce matin) → Verdict **SAIN**.

| Indicateur monitor.md | Implemente dans health-check.sh | Note |
|-----------------------|----------------------------------|------|
| Build (Critical, L11) | OUI L26-46 | Implementation ajoute WARNING si > 1500ms (spec dit > 2000ms — voir F-S3-04) |
| Structure racine (Critical, L12) | OUI L48-55 | OK |
| TypeScript compile (Critical, L13) | OUI L57-65 | OK |
| TSX < 700 lignes (Warning, L21) | OUI L73-88 | OK |
| Void Glass (Warning, L22) | OUI L90-97 | OK (case-insensitive ajoute en Cycle 1) |
| MD pairs alignes (Warning, L23) | OUI L99-107 | OK (specifique modules/app — voir F-S3-05) |
| Vitest (Warning, L24) | OUI L120-131 | OK |
| Refs intactes (Warning, L25) | OUI L109-118 | OK (delegue a `ref-checker.sh`) |
| CONTEXT.md a jour (Info, L31) | NON | Delegue a `sync-check.sh` (acceptable) |
| Decisions datees (Info, L32) | OUI L154-156 | OK |
| Build time (Info, L33) | OUI L26-46 (categorise CRITICAL pour fail, WARNING pour > seuil) | Voir F-S3-04 |
| Bundle size (Info, L34) | OUI L139-152 | OK (seuils JS>600KB / CSS>40KB) |

### 6.3 Verdict Monitor

**REEL** — Monitor est le pilier le plus mature :
- 11 indicateurs sur 12 implementes (tous sauf "CONTEXT.md a jour" qui vit dans `sync-check.sh`)
- Verdict 3-niveaux SAIN/DEGRADED/BROKEN respecte
- Hooks pre-commit + session-end + review-agent l'invoquent (cf review-agent.md L18, scripts/git-hooks/pre-commit L6)
- Seuils source dans monitor.md mais une derive existe (1500ms vs 2000ms — F-S3-04)

---

## 7. Pilier 4 — Tools (tools.md, 83L)

### 7.1 Specs documentees

- **Section 1 — Inventaire** (L5-36) :
  - Validators (2) : Void Glass + security-reminder
  - Scripts (4) : health-check, sync-check, ref-checker, module-scaffold
  - Git hooks (2) : commit-msg + pre-commit
  - CI/CD (2) : Vercel auto-deploy + supabase-ping
- **Section 2 — Backlog** (L38-46) : 2 outils DROP post-eval (bundle-tracker, context-diff)
- **Section 3 — Conventions** (L48-62) : scripts/, kebab-case, --help, hooks declares dans .claude/settings.json
- **Section 4 — Principes** (L64-70) : pas d'outil sans besoin, idempotent, exit codes 0/1/2
- **Section 5 — Limites** (L72-83)

### 7.2 Test reel (filesystem)

| Type | Spec dit | Filesystem | Match |
|------|----------|------------|-------|
| Validators | 2 (Void Glass + security-reminder) | `scripts/hooks/` : validate-void-glass.sh (1095b) + security-reminder.py (10767b, executable) | OK |
| Scripts | 4 (health-check, sync-check, ref-checker, module-scaffold) | `scripts/` : health-check.sh (6256b) + sync-check.sh (8043b) + ref-checker.sh (5406b) + module-scaffold.sh (5571b) | OK |
| Git hooks | 2 (commit-msg + pre-commit) | `scripts/git-hooks/` : commit-msg (768b) + pre-commit (536b), tous deux executables (chmod fix S1) | OK |
| CI/CD | 2 (Vercel + supabase-ping) | `.github/workflows/` : ci.yml (35L) + supabase-ping.yml (27L) | OK (cf S2 inventaire) |

Total : 8 scripts + 2 CI = 10 outils, conformes a tools.md L8-36.

### 7.3 Verdict Tools

**REEL** — Tous les outils inventories dans la spec existent sur le filesystem, sont executables, et sont reference dans S2 inventaire.

**Mais** : la spec a une derive interne (cf F-S3-01, F-S3-02 ci-dessous) — paths obsoletes et CLAUDE.md non maintenu sur la liste reelle.

---

## 8. Coherence inter-piliers + cross-ref S2

### 8.1 Cortex → Memory
Cortex.md L31 dit "lire CONTEXT.md entierement" en session-start. CONTEXT.md = pilier Memory tier "Contexte". Cortex consomme Memory. OK.

### 8.2 Cortex → Tools
Cortex.md L51 dit "/session-start : lire contexte → check structure → build → annoncer". `build` = invocation Tools (`npm run build`). Cortex consomme Tools. OK.

### 8.3 Memory → Tools
Memory.md L73 dit "max 15 decisions actives → docs/decisions-log.md". Le seuil n'a pas de monitoring automatique dans Tools — c'est verifie manuellement. Pas une faille critique (9/15 actuel), mais a reflechir si l'on veut un check Tools dedie.

### 8.4 Monitor → Tools
Monitor.md L11-25 indicators sont implementes dans `health-check.sh` (Tools). Monitor delegue son execution a Tools. OK.

### 8.5 Tools → Cortex
Tools.md L18-21 mentionne `module-scaffold.sh` qui automatise `/new-project` (command Cortex). Tools alimente Cortex. OK.

### 8.6 Coherence vs S2 inventaire (`docs/audit-massif/02-inventaire-components.md`)

| S2 inventaire | Specs Core OS | Coherent ? |
|---------------|---------------|------------|
| 4 agents (193L total) | cortex.md L11-14 (4 signals → 4 agents) + L66-89 (protocole agents) | OK |
| 4 commands (211L total) | cortex.md L51-54 (registry 4 commands) | OK |
| 8 scripts (1088L total) | tools.md L8-29 (2 validators + 4 scripts + 2 git hooks) | OK |
| 2 hooks PreToolUse (.claude/settings.json) | tools.md L8-12 (validators) | OK |
| 2 CI workflows (ci.yml + supabase-ping.yml) | tools.md L32-36 + architecture-core.md L52 | OK |
| 7 MCP connectes | Hors Core OS scope | OOS |
| 0 skill custom | Hors Core OS scope | OOS |

**Conclusion 8.6** : aucun trou d'inventaire entre S2 et les specs Core OS. La realite (filesystem) confirme la theorie (specs).

---

## 9. Findings — F-S3-01 a F-S3-09

### F-S3-01 [P2] — CLAUDE.md "Tools — Existants" obsolete

**Source** : `CLAUDE.md:95-96`
> Existants : validate-void-glass.sh (hook), security-reminder.py (hook), commit-msg (git hook), health-check.sh (Monitor), supabase-ping (GitHub Actions cron), Vercel auto-deploy.
> Backlog : ref-checker (a construire sur demande).

**Realite** :
- `ref-checker.sh` EST construit (5406 bytes, executable, depuis Cycle 1 / Finition OS S2) — pas dans backlog
- `sync-check.sh` (8043 bytes, executable) manquant de la liste
- `module-scaffold.sh` (5571 bytes, executable) manquant de la liste
- `pre-commit` (scripts/git-hooks/pre-commit) manquant de la liste

**Cause racine** : CLAUDE.md a ete ecrit en Phase 4 monitoring DONE, et n'a pas ete maintenu apres les sessions Finition OS / Audit OS profond / Cycle 1 qui ont ajoute 3 nouveaux scripts + 1 hook. Pas de regle "MAJ CLAUDE.md quand un nouveau outil rejoint Tools".

**Severite** : P2 — la liste est consultee comme source de routing par les futures sessions, fournit une info incorrecte.

**Fix propose** : MAJ `CLAUDE.md:95-96` pour refleter la realite + ajouter regle "tout nouveau outil Tools → MAJ CLAUDE.md L95". Reporte en S20 ou plus tot si Kevin valide en post-session.

---

### F-S3-02 [P3] — tools.md L27 path commit-msg incorrect

**Source** : `docs/core/tools.md:27`
> | commit-msg | .git/hooks/commit-msg | Enforce conventional commits (type(scope): description) |

**Realite** : `scripts/git-hooks/commit-msg` (768 bytes, executable, version-controlled) est la SOURCE. `.git/hooks/commit-msg` est le destination d'install. Le `pre-commit` voisin (L28) utilise le bon format `scripts/git-hooks/pre-commit (installe vers .git/hooks/)`, donc asymetrie.

**Cause racine** : tools.md a ete ecrit avant que `commit-msg` soit migre sous version-control (audit OS profond / Cycle 1). Pas mis a jour depuis.

**Severite** : P3 — doc-only, mais induit en erreur sur la source de verite.

**Fix propose** : MAJ `tools.md:27` :
> | commit-msg | scripts/git-hooks/commit-msg (installe vers .git/hooks/) | Enforce conventional commits (11 types) |

Eligible fix docs-only trivial (D-S0-08). Pas applique en S3 — laisse au pass de fix S20+.

---

### F-S3-03 [P3] — Ambiguite "Phase X" double-namespace

**Sources** :
- `docs/core/architecture-core.md:17-22` : Cortex=Phase 1, Memory=Phase 2, Monitor=Phase 3, Tools=Phase 4 (Core OS implementation phases)
- `docs/specs/2026-04-05-foundation-os-v2-design.md:28+` : Phase 1 Fondations, Phase 2 App Hardening, Phase 3 OS Intelligence, Phase 4 Monitoring, Phase 5 Expansion (project iterative phases)
- `docs/core/cortex.md:97` : "les 4 modules Core OS sont actifs depuis 2026-04-07 (Phase 4 Monitoring DONE)" — utilise namespace v2-design, mais place dans le contexte Core OS = source de confusion

**Cause racine** : 2 namespaces de "Phase" coexistent depuis l'ecriture de architecture-core.md (Cortex=1, Memory=2, etc.) et v2-design.md (Fondations=1, etc.). Ils n'ont pas ete renommes pour eviter la collision.

**Severite** : P3 — confusion possible pour un lecteur qui croit lire "Core OS Phase 4 = Tools" mais c'est la "v2-design Phase 4 = Monitoring".

**Fix propose** : Renommer dans architecture-core.md L17-22 : "Phase 1/2/3/4" → "Etape 1/2/3/4" pour eviter la collision avec v2-design phases. Reporte en S22 (refonte coherence).

---

### F-S3-04 [P3] — Mismatch seuil Build time monitor.md vs health-check.sh

**Source spec** : `docs/core/monitor.md:33` et `:80`
> Build time | Lire output build | < 2000ms (baseline: ~800ms)
> Build time baseline : ~800ms (alerte si > 2000ms)

**Source code** : `scripts/health-check.sh:37`
> if [ "${BUILD_MS_INT:-0}" -gt 1500 ] 2>/dev/null; then
>   echo -e "  ${YEL}[WARN]${RST} Build modules/app ($BUILD_TIME — derive >1500ms, baseline ~800ms)"

**Cause racine** : health-check.sh applique un seuil plus strict (1500ms) que la spec (2000ms). Probable durcissement applique lors de l'audit OS profond / Cycle 1 sans MAJ de monitor.md. Source de verite "monitor.md" violee : le code est plus a jour que la spec.

**Severite** : P3 — pas de regression fonctionnelle (le code est plus strict, donc plus protecteur), mais viole la regle "monitor.md = source unique des seuils" (monitor.md L85).

**Fix propose** : 2 options :
- (a) MAJ monitor.md L33 et L80 pour aligner sur 1500ms (source spec suit le code)
- (b) MAJ health-check.sh L37 pour aligner sur 2000ms (code suit la spec)

Decision Kevin requise. Reporte en S22 (refonte coherence).

---

### F-S3-05 [P3] — Indicateur MD pairs trop specifique au module app

**Source** : `docs/core/monitor.md:23`
> | MD pairs alignes | Comparer `modules/app/data/*.md` ↔ `.archive/artifacts-jsx/fos-*.jsx` | Chaque archive a son MD |

**Probleme** : Cet indicateur est lie a 100% au module app (data/ + .archive/artifacts-jsx/). Quand finance ou sante seront crees, ce check ne s'applique plus tel quel — il faudra le rendre module-specific ou le retirer.

**Cause racine** : Monitor.md a ete ecrit avant la generalisation Core OS multi-modules. C'est un legacy de Phase 2 App Hardening.

**Severite** : P3 — scalabilite, pas de regression actuelle (1 seul module). A traiter avant ajout d'un 2eme module (Phase 5 Expansion).

**Fix propose** : Marquer cet indicateur comme "module-specific (app)" dans monitor.md, ou le deplacer vers une section "App Builder specifique". Reporte en S4 (audit scalabilite) ou S22 (refonte).

---

### F-S3-06 [P3] — review-agent.md L23 cite ".git/hooks/commit-msg" (deja note F-S2-07)

**Source** : `.claude/agents/review-agent.md:23`
> Commits conventionnels (`type(scope): description`) — enforce automatiquement par `.git/hooks/commit-msg`

**Realite** : meme erreur que F-S3-02 (et que tools.md L27). Source = `scripts/git-hooks/commit-msg`, install = `.git/hooks/commit-msg`.

**Note** : Ce finding etait deja capture en S2 (F-S2-07). Re-confirme en S3 dans le contexte Core OS coherence — il fait partie de la dette "paths obsoletes apres migration commit-msg version-control".

**Severite** : P3 — duplique de F-S3-02, meme cause racine, meme fix.

**Fix propose** : Lot de fix groupe avec F-S3-02 — MAJ tous les paths `.git/hooks/commit-msg` → `scripts/git-hooks/commit-msg (installe vers .git/hooks/)` dans tools.md L27 + review-agent.md L23 (et grep elargi pour traquer d'autres occurrences).

---

### F-S3-07 [P3] — CLAUDE.md `Reference` section incomplete

**Source** : `CLAUDE.md:128-131`
> ## Reference
> - Directive complete : docs/directive-v1.md
> - Design spec v2 : docs/specs/2026-04-05-foundation-os-v2-design.md
> - Plan Phase 1 : docs/plans/2026-04-05-phase1-fondations.md

**Realite** : 5+ plans existent dans `docs/plans/` (cf docs/index.md L65-67) :
- 2026-04-05-phase1-fondations.md
- 2026-04-07-phase2-app-hardening.md
- 2026-04-07-phase3-os-intelligence.md
- 2026-04-07-phase4-monitoring.md
- 2026-04-07-finition-os.md
- 2026-04-07-audit-massif-final.md
- 2026-04-07-cycle3-implementation.md

CLAUDE.md ne mentionne que Phase 1. La maintenance de cette section a ete oubliee.

**Cause racine** : meme que F-S3-01 — CLAUDE.md n'a pas de regle d'auto-update quand de nouveaux plans ou outils sont ajoutes.

**Severite** : P3 — info incomplete, mais `docs/index.md` (qui EST a jour) compense.

**Fix propose** : Soit retirer la section `Reference` de CLAUDE.md (laisser docs/index.md gerer), soit la maintenir activement. Decision Kevin. Reporte en S20.

---

### F-S3-08 [P3] — Plan S3 task 3.4 step 2 dit "6 entries" auto-memory, realite 7

**Source** : `docs/plans/2026-04-07-cycle3-implementation.md:466`
> Verifier que MEMORY.md existe, contient les 6 entries listed

**Realite** : MEMORY.md liste 7 entries (Kevin profil, Structure projet, Zero bullshit, Minimal files, Outils installes, Patterns de travail, Sous-agents restreints).

**Cause racine** : Plan ecrit le 2026-04-07 avant l'ajout de `feedback_subagents_context.md` durant S1 (audit massif Cycle 3 S1 a enrichi auto-memory).

**Severite** : P3 — plan obsolete, pas un finding spec/code mais plan/realite. Doc-only.

**Fix propose** : MAJ plan `docs/plans/2026-04-07-cycle3-implementation.md:466` : "6" → "7". Eligible fix trivial D-S0-08. Applique en post-session si Kevin OK.

---

### F-S3-09 [P3] — settings.local.json bloat non-resolu (deja note F-S2-06)

**Source spec** : `docs/specs/2026-04-05-foundation-os-v2-design.md:62`
> .claude/settings.local.json | Trimmer | Garder : Asana, Notion, Figma, LSP. Supprimer : neon-browser, permissions trop larges

**Realite** : Cette action n'a JAMAIS ete executee (F-S2-06 a constate "~50 entries bloat settings.local.json" en S2).

**Cause racine** : Action backlog v2-design Phase 1 jamais traquee. Manque d'un mecanisme de "spec → fait verifie".

**Severite** : P3 — duplique de F-S2-06, meme cause, meme fix. Cf S2 livrable.

**Fix propose** : Reporte en S21 (Tools backlog cleanup).

---

## 10. Decisions — D-S3-01 a D-S3-05

### D-S3-01 [Verdict piliers] — 2026-04-08
Les **4 piliers Core OS sont REELS** : Cortex (routing via CLAUDE.md + frontmatters), Memory (CONTEXT.md + docs/ + auto-memory 7 entries + decisions-log.md 17 archivees), Monitor (health-check.sh = 11/12 indicators implementes), Tools (10/10 outils confirmes filesystem). La theorie matche la realite a >95%.

### D-S3-02 [9 findings P2/P3] — 2026-04-08
S3 a produit **9 findings** : 0 P1, 1 P2 (F-S3-01 CLAUDE.md liste outils obsolete), 8 P3. Aucun n'est bloquant. Aucun fix applique en S3 (mode MOI strict, livrable doc uniquement). Tous les fixes proposes sont reportes en S20+ (cycle 3 fixes batch).

### D-S3-03 [Coherence S2 vs Core OS] — 2026-04-08
**Aucun trou d'inventaire** entre S2 (4 agents + 4 commands + 8 scripts + 2 CI) et Core OS specs. La realite filesystem confirme integralement la theorie. Section 8.6 cross-ref complete.

### D-S3-04 [Pilier Cortex = convention de prompt] — 2026-04-08
Cortex n'est pas un runtime separe (pas de "router engine") — c'est une convention portee par CLAUDE.md + frontmatters d'agents. Coherent avec Foundation OS minimaliste mais necessite une discipline humain-LLM constante. Pas de finding hard, mais a noter pour S22 refonte (option : ajouter un check "frontmatter declencheurs vs cortex.md routing table" dans review-agent).

### D-S3-05 [Build time seuil derive] — 2026-04-08
Le seuil Build time est plus strict dans le code (`health-check.sh:37` = 1500ms) que dans la spec (`monitor.md:33` = 2000ms). Decision Kevin requise pour aligner (option a : spec suit le code | option b : code suit la spec). Reporte en S22.

---

## 11. Learnings metaboliques — L-S3-01 a L-S3-06

### L-S3-01 — Lecture parallele de specs courtes = gain de temps
Phase A (5 specs Core OS, total ~17KB) lue en une seule passe parallele. Pour les specs courtes (<5KB chacune), Read parallele est optimal. Pour les specs longues (>15KB), garder Read individuel pour eviter de saturer la fenetre. **Pattern a re-utiliser pour S4 (architecture orga) et S5 (workflows).**

### L-S3-02 — health-check.sh est la materialisation de monitor.md
La meilleure facon de tester un pilier "Monitor" est de lire le code qui l'implemente (health-check.sh) et le confronter ligne par ligne a la spec (monitor.md). Cela revele les derives de seuils (F-S3-04). **Pattern : pour chaque spec, identifier le code qui l'implemente et faire le diff.**

### L-S3-03 — Le routing Cortex est une convention de prompt, pas du code
Cortex.md decrit un routing intelligent, mais il n'y a aucun "router engine". L'intelligence vit dans CLAUDE.md + frontmatters d'agents + discipline LLM. **C'est un choix architectural valide pour Foundation OS** (pas de runtime separe), mais la dependance a la discipline humaine est totale. Aucune verification automatique que les agents portent bien les bons signaux.

### L-S3-04 — Les fichiers plan vivent moins longtemps que les specs
Plan S3 task 3.4 step 2 dit "6 entries" mais realite = 7 (F-S3-08). Cause : le plan a ete ecrit le 2026-04-07, le contenu auto-memory a evolue le meme jour. **Les plans doivent etre traites comme des snapshots a date — verifier les comptes/inventaires au moment de l'execution, pas se fier au plan.**

### L-S3-05 — CLAUDE.md vit moins bien que docs/index.md
F-S3-01 (Tools liste obsolete) et F-S3-07 (Reference plans incomplete) montrent que CLAUDE.md n'a pas de mecanisme d'auto-update quand le filesystem change. docs/index.md, lui, est mieux maintenu. **Hypothese : CLAUDE.md devrait pointer vers docs/index.md pour les listes evolutives, et garder uniquement les regles immuables.**

### L-S3-06 — Le double-namespace "Phase X" est une dette de naming
F-S3-03 montre que "Phase 4" peut signifier soit "Tools (Core OS implementation)" soit "Monitoring (v2-design iteration)". **Pattern : eviter de reutiliser les memes mots-cles a travers des dimensions orthogonales.** Renommer en "Etape 1-4" pour Core OS (architecture-core.md) eviterait l'ambiguite sans toucher v2-design.

---

## 12. References utilisees

| Fichier | L (lignes) | Role en S3 |
|---------|-----------|------------|
| `docs/core/cortex.md` | 97 | Specs Cortex (routing, contexte, commands, agents) |
| `docs/core/memory.md` | 103 | Specs Memory (4 tiers, decisions lifecycle, sessions persist) |
| `docs/core/monitor.md` | 93 | Specs Monitor (health indicators, severite, seuils) |
| `docs/core/tools.md` | 83 | Specs Tools (validators, scripts, hooks, CI/CD) |
| `docs/core/architecture-core.md` | 61 | Vue d'ensemble Core OS 4 modules |
| `docs/specs/2026-04-05-foundation-os-v2-design.md` | 324 | Phases v2 (1 Fondations → 5 Expansion) |
| `docs/decisions-log.md` | 44 | 17 decisions archivees |
| `CONTEXT.md` | 102 | Etat actuel + 9 decisions actives |
| `CLAUDE.md` | 132 | Imperatifs + Core OS resumes |
| `MEMORY.md` (auto-memory) | 7 | 7 entries auto-memory |
| `docs/index.md` | 100 | Index navigation projet |
| `.claude/agents/review-agent.md` | 41 | Verifier integration health-check.sh |
| `.claude/agents/{dev,doc,os-architect}.md` | grep frontmatter | Verifier signaux Declencheurs |
| `scripts/health-check.sh` | 172 | Implementation Monitor (11/12 indicators) |
| `scripts/git-hooks/commit-msg` | 19 | Verifier path source vs install |
| `scripts/git-hooks/pre-commit` | 20 | Verifier appel health-check.sh |
| `docs/audit-massif/02-inventaire-components.md` | 277 | Cross-ref S2 inventaire |

**Total : 17 fichiers lus / ~1700L scannees** (mode MOI strict, 0 sub-agent).

---

## 13. Hors scope (OOS)

| Item | Pourquoi OOS S3 | Reporte a |
|------|-----------------|-----------|
| Scalabilite Core OS multi-modules | Architecture orga | S4 |
| Test reel chaque command (`/sync`, `/new-project`, etc.) | Workflows et orchestration | S5 |
| Audit MCP, OMC, BMAD detail | Toolkit externe (pas Core OS) | S15-S18 |
| Fix F-S3-01 a F-S3-09 | Mode MOI strict S3 = livrable doc only | S20+ |
| 2 fichiers untracked (`docs/audit-massif/read-log-S1-code.md`, `foundation-os-manifeste-realiste.pdf`) | Hors scope Core OS specs | a clarifier avec Kevin avant S4 |
| Settings.local.json bloat (F-S3-09 = F-S2-06) | Tools backlog | S21 |

---

## 14. Prochaine action (S4)

**S4 — Architecture organicite/scalabilite/maintenabilite (mode MOI)**

Plan source : `docs/plans/2026-04-07-cycle3-implementation.md:485-522`

Tasks :
- S4.2 Audit organicite (deps agents/commands/scripts, deps docs cross-refs, code mort)
- S4.3 Audit scalabilite (1 module → 5 modules → 10 modules : qu'est-ce qui casse ?)
- S4.4 Audit maintenabilite (stat code/doc ratio, gros fichiers, doublons, dette TODO/FIXME)

Pre-conditions S4 :
- S3 commit valide
- Baseline SAIN
- Clarifier les 2 fichiers untracked (read-log-S1-code.md, foundation-os-manifeste-realiste.pdf)

Livrable : `docs/audit-massif/04-architecture-orga.md`

---

> **Resume executif S3** : Les 4 piliers Core OS sont REELS, alignes a >95% avec leurs specs. 9 findings P2/P3 dont 1 P2 (CLAUDE.md liste outils obsolete) et 8 P3 (paths obsoletes, ambiguite naming, plans desynchronises, settings.local.json bloat). 0 fix applique en S3 (mode doc-only). Cross-ref S2 vs Core OS = 0 trou d'inventaire. Health SAIN maintenu. Zero regression.
