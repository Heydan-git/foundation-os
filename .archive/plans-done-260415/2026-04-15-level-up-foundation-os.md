---
id: 2026-04-15-level-up-foundation-os
title: 🪐 Level Up Foundation OS (15-04-2026)
created: 2026-04-15
status: done
phases_total: 7
estimated_duration: 300min
branch: claude/jolly-wescoff (worktree actif — sera mergé puis deleted post-exécution)
---

# 🪐 Level Up Foundation OS (15-04-2026)

> Plan généré via `/plan-os` orchestrateur + skill `superpowers:brainstorming`, validé par Plan agent.
> Session d'origine : audit complet Foundation OS (69 fichiers lus).
> **Règle imposée Kevin** : plan ultra-détaillé anti-perte-de-contexte multi-session.

---

## Context

Après la **migration Foundation OS vers Claude Code Desktop natif** (plan `docs/plans/2026-04-15-migration-foundation-desktop.md`, DONE 9/9 phases côté code mais non-validée Kevin côté usage réel), j'ai réalisé à sa demande un **audit exhaustif de l'OS** (2026-04-15) : 69 fichiers lus, croisement filesystem vs docs vs CONTEXT.md.

**Verdict audit** : système solide (architecture Core OS 6 modules cohérente, auto-memory 31 fichiers backbone, scripts idempotents, hooks PreToolUse actifs, anti-bullshit gates appliqués) **mais dette silencieuse qui commence à s'accumuler** : auto-archive plans a un bug silencieux spécifique au plan migration (pas au système), settings.local.json jamais purgé (~100 permissions legacy), 3 branches `claude/*` legacy hors convention D-NAMING-01, 16 refs cassées dont 9 faux positifs fixables, mémoires obsolètes non marquées SUPERSEDED, manifeste + README racine désynchros vs réalité.

**Intention Kevin** (consolidée après 3 messages) :
- **Ambition** : level up OS + relation avec Claude, pas se limiter au strict nécessaire.
- **TDAH** : les automatisations, conventions, garde-fous sont **utiles même s'ils semblent lourds** — ne pas simplifier au détriment de l'aide réelle.
- **Zéro régression** : ne PAS casser ce qui marche. Tout ajout ne supprime rien de fonctionnel.
- **Organicité réelle** : le système doit se maintenir **tout seul** (plans termines → archive auto, mémoires obsolètes → _deprecated/, refs cassées → détectées et fixées, CONTEXT.md compressé).
- **Multi-session** : le plan doit survivre à un compactage de contexte sans perte — chaque phase ultra-détaillée, reprise possible à tout moment.

**Outcome visé** : l'OS se maintient automatiquement (détection + correction cosmétique de drift), les bugs silencieux sont fermés, la convention nommage est appliquée par hook, les docs structurelles sont syncrones avec la réalité, le plan migration est proprement archivé, et **cette session level-up elle-même est mergée dans main puis fermée** (worktree + branche claude/jolly-wescoff cleanup).

---

## Findings d'audit (référence — pour éviter perte de contexte)

### P0 — Bugs silencieux à fermer

**F1 (corrigé par Plan agent)** — **Ce n'est PAS un bug du script auto-archive**, c'est un bug du plan migration existant :
- `scripts/auto-archive-plans.sh` ligne 31 accepte DÉJÀ `^status:\s*(done|closed)$` en frontmatter.
- Ligne 49 accepte DÉJÀ `CHECKED >= 3 && UNCHECKED == 0` cases `[x]` dans Execution log.
- `docs/plans/_template-plan.md` lignes 81-85 contient DÉJÀ `## Execution log` avec cases `[ ]`.
- **Le plan migration `2026-04-15-migration-foundation-desktop.md` a été écrit à la main**, pas généré via `/plan-os`, donc n'a ni frontmatter YAML ni section Execution log. Résultat : auto-archive ne le match pas. Bug propre à ce plan, pas au système.
- **Fix** : rétrofitter le plan migration (ajouter frontmatter `status: done`) + garantir que `/plan-os` utilise bien le template à chaque génération future.

**F2** — `.claude/settings.local.json` : 159 lignes (attendu ~40 post-Phase 1 migration). Environ 100 permissions Bash legacy obsolètes : `kill PID` morts, `sed` one-offs de sessions passées, `cp` temp, refs à des paths de worktrees archivés. Plan migration prévoyait purge → pas faite.

**F3** — 3 branches `claude/*` locales : `claude/adoring-booth`, `claude/agitated-wilson`, `claude/jolly-wescoff` (session courante). **Toutes au même commit `51397d6` que main** selon `git log main..<branche>` retour vide (validé par Plan agent). **Pas de risque de perte de travail**. Suppression triviale SAUF pour `claude/jolly-wescoff` (session vivante) qui doit être mergée dans main d'abord.

**F4** — `project_migration_desktop.md` memory frontmatter dit encore `PROJET ACTIF` alors que migration DONE depuis 2026-04-15.

**F5** — `docs/manifeste.md` (ligne ~75 : "4 commands", réel=7), `README.md` racine (ligne 38 : "fond #06070C" réel Void Glass #030303, ligne 10 : "Dashboard" supprimé 2026-04-10, lignes 14-17 : modules inexistants) obsolètes.

### P1 — Dégradation lente

**F6** — `scripts/hooks/branch-name-check.sh` dormant : pas wire dans `.git/hooks/pre-commit`.

**F7** — 16 refs cassées (vérifiées `bash scripts/ref-checker.sh`) :
- **9 faux positifs** éliminables via `IGNORE_REFS_RE` :
  - 3× ``` `.archive/plans-done-$(date +%y%m%d)/` ``` (template literal bash dans backticks) — CLAUDE.md:112, CLAUDE.md:146, docs/core/communication.md:243
  - 1× ``` `.archive/specs-done-$(date +%y%m%d)/` ``` — CLAUDE.md:113
  - 2× `docs/cockpit-desktop` (exemple placeholder dans naming-conventions.md:19, monitor.md:92)
  - 3× `.archive/worktrees-orphelins/` (référencé comme contexte mais pas de dossier réel) — CONTEXT.md:95, docs/core/worktrees.md:184, docs/core/tools.md:89
  - 1× `modules/design-system/base DS/` (espace dans path, glitch bash regex) — monitor.md:93
- **7 vraies refs stales** à corriger :
  - 3× `docs/core/memory.md` (renommé `communication.md` le 2026-04-10) — docs/core/communication.md:341, docs/core/monitor.md:91, docs/plans/2026-04-15-migration-foundation-desktop.md:26
  - 2× `docs/plans/2026-04-14-ds-rebuild-from-base.md` (archivé dans `.archive/plans-done-260415/`) — CONTEXT.md:37, docs/core/naming-conventions.md:120
  - 2× `docs/cockpit-desktop` dans les exemples (cf. ci-dessus mais à évaluer cas par cas)

**F8** — CONTEXT.md 163 lignes >150 budget (spec `docs/core/communication.md` section 4.2), 13 entrées Sessions recentes >5 max (spec section 3.1).

**F9** — `MEMORY.md` index déclare 29 entrées mais réalité 31 fichiers. Désync.

**F10** — Mémoires projet obsolètes non marquées SUPERSEDED : `project_ds_voidglass_plan.md` (SUPERSEDED 2026-04-14 marqué dans MEMORY.md mais fichier présent), `project_ds_rebuild_plan.md` (DONE 2026-04-15), `project_migration_desktop.md` (DONE 2026-04-15).

**F11** — CSS bundle 55.66KB > 40KB warn permanent (baseline spec `docs/core/monitor.md` section 4). Dette Tailwind purge non attaquée — HORS SCOPE ce plan.

**F12** — Vitest DS "output illisible" dans health-check : parsing fragile. Les tests DS passent (23/23 selon CONTEXT), mais le script ne détecte pas la ligne de résumé. WARN chronique. HORS SCOPE ce plan (investigation DS à part).

**F13** — `sync-check.sh` cherche pattern `- **Routes**` absent de CONTEXT.md → WARN parasite. À fixer : soit supprimer le check, soit ajouter la ligne.

**F14** — `docs/core/tools/index.json` updated 2026-04-11, commands count=6, réel=7 (ajout `/wt` Phase 3 migration). `tool-register.sh rebuild` jamais relancé.

**F15** — Brief v11 non reproduit fidèlement par moi-même dans cette session (cockpit). Drift vers approximation. HORS SCOPE ce plan (P12 generate-brief.sh reporté).

### P2 — Nice-to-have (HORS SCOPE)

**F16** — `scripts/session-lock.sh` orphelin (Cowork non-branché).
**F17** — `_bmad/` 12 modules dormants par choix Kevin 2026-04-07.
**F18** — Pas de CI health-check (pre-commit local seulement) — risque --no-verify bypass.
**F19** — `.archive/plans/` + `.archive/plans-done-260415/` doublon structure (pas bloquant).
**F20** — CLAUDE.md 221 L = surcharge cognitive chaque session — P11 compression intégrée Phase 4 (coût marginal nul, Plan agent recommandation).
**F21** — Pas de nettoyage rétroactif automatique des mémoires — P13 memory/_deprecated/ dans Phase 3.

---

## Décisions structurantes (prises pendant planification)

- **D-LEVELUP-01** — Organicité via détection ≠ correction automatique. Les scripts **détectent** les drifts, ils ne **corrigent pas automatiquement** sauf le cosmétique (count MEMORY.md, compression sessions). Tout fix structurel passe par validation Kevin. Raison : Kevin a déjà eu des mauvaises surprises (memoire `feedback_no_auto_archive.md` : "ne jamais archiver un fichier placé volontairement par Kevin").

- **D-LEVELUP-02** — Règle **"Plans ultra détaillés anti-perte-de-contexte"** enregistrée comme memoire permanente Phase 7. Chaque plan multi-session doit contenir les 6 éléments : pre-conditions vérifiables, état repo attendu, actions atomiques numérotées avec snippets exacts, verification post-phase, rollback explicite, commit message préformaté. Raison : Claude peut être compacté entre sessions, il doit pouvoir reprendre en lisant le plan sans contexte externe.

- **D-LEVELUP-03** — Worktree `claude/jolly-wescoff` (session courante, hors convention) : **ne pas migrer la session vivante**. Workflow : finir le travail level-up → merger branche dans main → `git worktree remove` depuis main → delete branche. La nouvelle convention s'applique à la **prochaine** branche via `/wt new`. Raison : Plan agent validé, évite complexité migration en cours de session.

- **D-LEVELUP-04** — P5 auto-maintenance.sh (mega-script) **reporté** après P14-P15 pour voir si le combo drift-detector + docs-sync-check suffit. YAGNI strict.

- **D-LEVELUP-05** — P8/P9/P10 (scalabilité multi-modules) **reportés** jusqu'à création du 1er module domain (finance/sante/trading). Déclenchés par `/new-project`.

- **D-LEVELUP-06** — P11 compression CLAUDE.md **intégré Phase 4** (coût marginal nul selon Plan agent, on touche déjà CONTEXT.md dans cette phase). Cible : CLAUDE.md 221 → 150-180 L en déplaçant les détails dans `docs/core/*` déjà existants.

- **D-LEVELUP-07** — P12 generate-brief.sh (script de génération automatique du brief v11) **reporté** — nice-to-have, pas critique tant que je sais reproduire le format.

---

## Phases (7, sessions courtes, règle "jamais monolithe" CLAUDE.md)

---

### Phase 1 — Hygiène immédiate (45 min)

**Objectif** : Purger le legacy de `settings.local.json`, éliminer les 9 faux positifs refs cassées, syncroniser manifeste + README racine avec la réalité post-migration.

**Pre-conditions vérifiables** :
```bash
git status --short  # doit être clean (ou uniquement .omc/* runtime)
git branch --show-current  # doit retourner "claude/jolly-wescoff"
cd /Users/kevinnoel/foundation-os/.claude/worktrees/jolly-wescoff
bash scripts/health-check.sh  # doit retourner DEGRADED (3 warn: refs 16, vitest DS illisible, CSS>40KB)
```

**État repo attendu en début de phase** :
- Branche `claude/jolly-wescoff` dans worktree `.claude/worktrees/jolly-wescoff/`
- Dernier commit : `51397d6 chore(omc): update runtime state post-merge`
- Zéro fichier staged
- CONTEXT.md = 163 lignes

**Actions atomiques numérotées** :

1. **Backup settings.local.json** (safety first) :
   ```bash
   cp .claude/settings.local.json .archive/settings-local-audit-260415.json
   ```

2. **Identifier les permissions à garder dans settings.local.json** (MCP actifs, permissions stables). Lire `.claude/settings.local.json` ligne par ligne, classer en 3 catégories :
   - **GARDER** : MCP entries (`mcp__claude_ai_Asana__*`, `mcp__claude_ai_Notion__*`, `mcp__plugin_figma_figma__*`, `mcp__neon-browser__*`, `mcp__plugin_chrome-devtools-mcp_chrome-devtools__*`, `mcp__plugin_oh-my-claudecode_t__*`), permissions basiques (`Bash(wc:*)`, `Bash(chmod:*)`, `Bash(du:*)`, `Bash(mkdir:*)`, `Bash(bash:*)`, `Bash(grep:*)`, `Bash(ls:*)`, `Bash(python3:*)`, `Bash(curl:*)`, `Bash(gh run:*)`, `Bash(find:*)`, `Bash(mv:*)`, `Bash(mdls:*)`, `Bash(wait)`, `Bash(zsh:*)`, `Bash(gh pr:*)`, `Bash(gh api:*)`, `Bash(npx tsc:*)`, `Bash(xargs -I{} basename {})`, `WebSearch`, `WebFetch(domain:github.com)`, `WebFetch(domain:docs.anthropic.com)`).
   - **SUPPRIMER** : `kill PID` spécifiques (ex `Bash(kill 61137 55533)`, `Bash(kill -9 66932 61323)`), `sed -i '' '28d' CONTEXT.md` one-offs, `cp /Users/kevinnoel/foundation-os/modules/app/src/components/Badge.tsx /tmp/Badge.tsx.bak` temp, `mv /tmp/c2_dev-agent.bak ...` restorations, `unzip -o "...base DS/src.zip"` one-offs, exports de tokens Supernova révolus, `SN_TOKEN='xsn...'` et `export SUPERNOVA_TOKEN='sn...'` (secrets hardcodés à nettoyer quoi qu'il en soit), `pkill -f "..."` temp, `STORYBOOK_DISABLE_TELEMETRY=1 ...` si plus utilisés, `tee /tmp/*.log` redirections one-off.
   - **CONSERVER MAIS À RATIONALISER** : WebFetch avec domains liés OMC/supernova/developers.supernova.io/learn.supernova.io (à garder si on refera DS sync, sinon supprimer).

3. **Écrire nouveau `.claude/settings.local.json`** (~40-50 lignes cibles). Structure JSON :
   ```json
   {
     "permissions": {
       "allow": [
         "Bash(wc:*)", "Bash(chmod:*)", "Bash(du:*)", "Bash(mkdir:*)",
         "Bash(bash:*)", "Bash(grep:*)", "Bash(ls:*)", "Bash(python3:*)",
         "Bash(curl:*)", "Bash(find:*)", "Bash(mv:*)", "Bash(mdls:*)",
         "Bash(wait)", "Bash(zsh:*)", "Bash(xargs:*)", "Bash(gh run:*)",
         "Bash(gh pr:*)", "Bash(gh api:*)", "Bash(npx tsc:*)",
         "WebSearch",
         "WebFetch(domain:github.com)",
         "WebFetch(domain:docs.anthropic.com)",
         "WebFetch(domain:code.claude.com)",
         "mcp__claude_ai_Asana__get_me",
         "mcp__claude_ai_Asana__get_projects",
         "mcp__claude_ai_Asana__get_my_tasks",
         "mcp__claude_ai_Asana__search_objects",
         "mcp__claude_ai_Asana__get_project",
         "mcp__claude_ai_Asana__get_tasks",
         "mcp__claude_ai_Asana__update_tasks",
         "mcp__claude_ai_Asana__create_task_preview",
         "mcp__claude_ai_Asana__create_task_confirm",
         "mcp__claude_ai_Asana__create_project_status_update",
         "mcp__claude_ai_Asana__create_project_confirm",
         "mcp__claude_ai_Notion__notion-search",
         "mcp__claude_ai_Notion__notion-fetch",
         "mcp__claude_ai_Notion__notion-create-pages",
         "mcp__claude_ai_Notion__notion-update-page",
         "mcp__claude_ai_Notion__notion-get-users",
         "mcp__plugin_figma_figma__whoami",
         "mcp__plugin_figma_figma__get_metadata",
         "mcp__neon-browser__go-to-page",
         "mcp__neon-browser__switch-tab",
         "mcp__neon-browser__tab-content",
         "mcp__neon-browser__click",
         "mcp__neon-browser__tab-content-jq-search-query",
         "mcp__neon-browser__fill",
         "mcp__neon-browser__screenshot",
         "mcp__neon-browser__press-key",
         "mcp__plugin_chrome-devtools-mcp_chrome-devtools__hover",
         "mcp__plugin_chrome-devtools-mcp_chrome-devtools__wait_for",
         "mcp__plugin_chrome-devtools-mcp_chrome-devtools__list_network_requests",
         "mcp__plugin_oh-my-claudecode_t__lsp_diagnostics",
         "mcp__plugin_oh-my-claudecode_t__lsp_diagnostics_directory",
         "mcp__plugin_oh-my-claudecode_t__ast_grep_search",
         "mcp__plugin_oh-my-claudecode_t__state_list_active",
         "mcp__plugin_oh-my-claudecode_t__state_get_status",
         "mcp__plugin_oh-my-claudecode_t__state_read",
         "mcp__plugin_oh-my-claudecode_t__state_write",
         "mcp__plugin_oh-my-claudecode_t__notepad_stats"
       ]
     }
   }
   ```

4. **Extend `IGNORE_REFS_RE` dans `scripts/ref-checker.sh`** ligne 57. Remplacer la ligne actuelle par :
   ```bash
   IGNORE_REFS_RE='^(\.claude/worktrees/|docs/travaux-cowork/|\.archive/settings-local-before-migration\.json|\.archive/memory\.md|\.archive/worktrees-orphelins/|modules/design-system/base DS/|modules/design-system/src/components/void-glass/|modules/design-system/tokens/(primitives|semantic|bridge|source/primitives|source/semantic)/|modules/app/src/layouts/|\.archive/(ds-void-glass|ds-shadcn-vanilla|ds-patterns-old|ds-tokens-dtcg-old|travaux-cowork)|docs/plans/2026-04-XX-|docs/cockpit-desktop)$|\$\(|<[a-z-]+>'
   ```
   Changements :
   - Ajout `|docs/cockpit-desktop)$` pour ignorer l'exemple placeholder dans naming-conventions.md et monitor.md
   - Ajout `|\$\(` à la fin pour ignorer tout ce qui contient `$(` (template literals bash dans backticks)
   - Ajout `|<[a-z-]+>` pour ignorer les placeholders HTML-like `<slug>`, `<desc>`

5. **Update `docs/manifeste.md`** (sections critiques) :
   - Section 4.2 "Agents et commands" : changer "4 commands (.claude/commands/, 211 lignes) : /session-start, /session-end, /new-project, /sync" en "7 commands : /cockpit, /plan-os, /session-start, /session-end, /new-project, /sync, /wt"
   - Section 9.2 "Cycle 3 audit massif en cours" : changer en "Cycle 3 audit massif DONE 2026-04-10 (merge main)"
   - Section 6 "Etat reel — snapshot 2026-04-10" → mettre à jour snapshot 2026-04-15 ou noter "snapshot historique, voir CONTEXT.md pour état courant"

6. **Update `README.md` racine** :
   - Ligne 10 "App Builder — Dashboard React pour piloter Foundation OS (Vite + TypeScript + Tailwind + Supabase + Vercel)" : ajouter mention Design System
   - Lignes 13-22 (structure) : supprimer `modules/finance/`, `modules/sante/` (non-existants), ajouter `modules/design-system/`
   - Ligne 38 "Void Glass : fond #06070C" → "Void Glass : fond #030303 (ds-surface-0), Figtree + JetBrains Mono"
   - Ajouter section "Pour commencer" pointant vers `docs/setup-guide.md`

**Verification** :
```bash
bash scripts/ref-checker.sh 2>&1 | grep -E "cassees"
# Doit retourner "~7 refs cassees" (9 faux positifs éliminés)

wc -l .claude/settings.local.json
# Doit retourner <= 55

bash scripts/health-check.sh
# Doit toujours retourner DEGRADED mais avec refs count réduit

grep -c "Dashboard" README.md
# Doit retourner 0 (mot "Dashboard" supprimé, sauf si mention modules/design-system/)
```

**Rollback** :
```bash
cp .archive/settings-local-audit-260415.json .claude/settings.local.json
git checkout scripts/ref-checker.sh docs/manifeste.md README.md
```

**Commit message** :
```
chore(os): phase 1 level-up — hygiene settings.local + ref-checker + docs obsoletes

- Purge .claude/settings.local.json 159L -> ~50L (backup .archive/)
- Extend ref-checker IGNORE_REFS_RE : +9 faux positifs filtres (template $(, placeholders, docs/cockpit-desktop)
- Update docs/manifeste.md sections 4.2 + 6 + 9.2 (commands count, snapshot, Cycle 3 closed)
- Update README.md racine (Void Glass #030303, modules reels, link setup-guide)

Refs cassees : 16 -> ~7 (9 faux positifs elimines)
```

---

### Phase 2 — Fix boucles cassées (60 min)

**Objectif** : Rétrofitter le plan migration pour qu'auto-archive fonctionne, installer branch-name-check en pre-commit, corriger les 7 vraies refs stales.

**Pre-conditions vérifiables** :
```bash
git log -1 --format="%s" | grep "phase 1 level-up"  # Phase 1 committée
bash scripts/ref-checker.sh 2>&1 | grep "7 refs cassees\|6 refs cassees\|5 refs cassees"  # Post-Phase 1
ls docs/plans/  # contient 2026-04-15-migration-foundation-desktop.md
cat docs/plans/_template-plan.md | head -8  # frontmatter template
```

**État repo attendu** :
- Phase 1 committée
- 7 refs cassées restantes (toutes vraies)
- `scripts/git-hooks/pre-commit` appelle `health-check.sh` uniquement

**Actions** :

1. **Rétrofitter `docs/plans/2026-04-15-migration-foundation-desktop.md`** en ajoutant frontmatter YAML au début :
   ```yaml
   ---
   id: 2026-04-15-migration-foundation-desktop
   title: Migration Foundation OS → Claude Code Desktop (natif)
   created: 2026-04-15
   completed: 2026-04-15
   status: done
   phases_total: 9
   estimated_duration: 360min
   actual_duration: 360min
   ---
   ```
   Insérer ces 10 lignes AVANT `# Migration Foundation OS → Claude Code Desktop (natif)`.

2. **Tester l'auto-archive manuellement** :
   ```bash
   bash scripts/auto-archive-plans.sh
   # Doit détecter le plan migration via frontmatter status:done et le déplacer
   ```
   Résultat attendu : `docs/plans/2026-04-15-migration-foundation-desktop.md` déplacé vers `.archive/plans-done-260415/`. Si déjà un dossier `plans-done-260415/`, le fichier y est ajouté.

3. **Modifier `scripts/git-hooks/pre-commit`** pour chainer branch-name-check :
   Remplacer contenu actuel (11 lignes) par :
   ```bash
   #!/bin/bash
   # Foundation OS pre-commit hook : run health-check + branch-name-check

   # Branch name check (warning non-bloquant)
   bash scripts/hooks/branch-name-check.sh

   # Health check (bloque si BROKEN)
   bash scripts/health-check.sh
   RC=$?

   if [ $RC -eq 1 ]; then
     echo ""
     echo "COMMIT BLOQUE : health-check = BROKEN"
     echo "Fixe les erreurs critiques avant de commit."
     exit 1
   elif [ $RC -eq 2 ]; then
     echo ""
     echo "WARNING : health-check = DEGRADED (commit autorise)"
     exit 0
   fi

   exit 0
   ```
   Installer ensuite : `cp scripts/git-hooks/pre-commit .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit`.

4. **Corriger les 7 vraies refs stales** :

   a. `docs/core/communication.md:341` — chercher `docs/core/memory.md` dans contexte (section 9 "Migration depuis Memory"). C'est intentionnel pour documenter le rename. **Décision** : garder le texte mais wrapper dans un codeblock (```) pour que ref-checker skip. Si déjà dans codeblock, ref-checker devrait skip → vérifier pourquoi détecté.
   
   b. `docs/core/monitor.md:91` — même analyse, section "Faux positifs ref-checker connus" ligne `- Refs textuelles vers docs/core/memory.md dans docs qui documentent le rename`. **Décision** : idem, c'est intentionnel et documenté comme faux positif. L'IGNORE_REFS_RE ne peut pas matcher car le texte est narratif. Fix : wrapper dans codeblock ou changer le texte en "docs/core/memory-legacy.md" (invented) pour éviter le match.
   
   c. `docs/plans/2026-04-15-migration-foundation-desktop.md:26` — si le plan est archivé Phase 2 Step 2, ce fichier n'existe plus dans docs/plans/. Au ref-checker n'analyse plus ce fichier (exclu de docs/plans/ archivé). Si détecté encore après archive → évaluer.

   d. 2× `docs/plans/2026-04-14-ds-rebuild-from-base.md` :
   - `CONTEXT.md:37` — changer `docs/plans/2026-04-14-ds-rebuild-from-base.md` en `.archive/plans-done-260415/2026-04-14-ds-rebuild-from-base.md`
   - `docs/core/naming-conventions.md:120` — idem

   e. 3× `.archive/worktrees-orphelins/` (CONTEXT.md:95, docs/core/worktrees.md:184, docs/core/tools.md:89) — le dossier existe-t-il ? Vérifier `ls .archive/worktrees-orphelins/`. Si vide/absent, soit créer un dossier vide `.gitkeep`, soit changer les refs en commentaire textuel sans path.

   f. `docs/core/monitor.md:92` `docs/cockpit-desktop` — déjà ignoré par IGNORE_REFS_RE Phase 1. Skip.

   g. `docs/core/tools.md:89` `.archive/worktrees-orphelins/` — même question que (e).

5. **Run `bash scripts/ref-checker.sh`** pour voir les refs restantes. Cible : **0 ref cassée**.

**Verification** :
```bash
# Plan migration archivé
ls docs/plans/ | grep -v _template-plan.md | wc -l
# Doit retourner 0 (seul le template reste)

ls .archive/plans-done-260415/ | grep migration-foundation-desktop
# Doit retourner le fichier migrated

# Refs cassees = 0
bash scripts/ref-checker.sh 2>&1 | grep -E "cassees"
# Doit retourner "0 refs cassees"

# Pre-commit wire
grep branch-name-check .git/hooks/pre-commit
# Doit retourner 1 ligne

# Pre-commit testé
bash .git/hooks/pre-commit
# Doit run branch-name-check (warning claude/jolly-wescoff hors format) puis health-check
```

**Rollback** :
```bash
git checkout docs/plans/2026-04-15-migration-foundation-desktop.md
git mv .archive/plans-done-260415/2026-04-15-migration-foundation-desktop.md docs/plans/  # si rollback archive
git checkout scripts/git-hooks/pre-commit CONTEXT.md docs/core/communication.md docs/core/monitor.md docs/core/naming-conventions.md docs/core/tools.md docs/core/worktrees.md
cp scripts/git-hooks/pre-commit .git/hooks/pre-commit  # restore ancien pre-commit
```

**Commit message** :
```
feat(os): phase 2 level-up — fermer boucles cassees plans archive + refs + hooks

- Retrofit plan migration avec frontmatter status:done -> auto-archive OK
- Plan migration archive vers .archive/plans-done-260415/
- Install branch-name-check.sh dans pre-commit (warning non-bloquant)
- Fix 7 refs stales : memory.md -> communication.md, plans archives, worktrees-orphelins
- ref-checker.sh retourne 0 refs cassees
```

---

### Phase 3 — Branches & mémoires obsolètes (45 min)

**Objectif** : Auditer et nettoyer les 3 branches `claude/*` legacy (sauf session active), créer `memory/_deprecated/` pour archiver mémoires SUPERSEDED/DONE, mettre à jour MEMORY.md.

**Pre-conditions** :
```bash
git branch  # doit lister claude/adoring-booth, claude/agitated-wilson, claude/jolly-wescoff (*), main
git log main..claude/adoring-booth 2>&1 | wc -l  # doit retourner 0 (pas de commits uniques)
git log main..claude/agitated-wilson 2>&1 | wc -l  # idem
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/ | wc -l  # doit retourner 31 .md + MEMORY.md
```

**État repo attendu** :
- Phases 1 et 2 committées
- 3 branches claude/* locales
- 31 fichiers memory (+ MEMORY.md index)

**Actions** :

1. **Audit détaillé des 3 branches** (run commands, save output) :
   ```bash
   for b in claude/adoring-booth claude/agitated-wilson claude/jolly-wescoff; do
     echo "=== $b ==="
     git log main..$b --oneline 2>&1 | head -20
     echo "---"
   done
   ```
   Résultat attendu (selon Plan agent) : toutes les 3 vides (pas de commits uniques hors main).

2. **Delete `claude/adoring-booth` et `claude/agitated-wilson` (locales)** :
   ```bash
   # Tag d'archive safety (si jamais)
   git tag archive/claude-adoring-booth claude/adoring-booth
   git tag archive/claude-agitated-wilson claude/agitated-wilson
   
   # Delete local
   git branch -d claude/adoring-booth
   git branch -d claude/agitated-wilson
   
   # Delete remote si présent
   git push origin --delete claude/adoring-booth 2>/dev/null || echo "pas sur remote"
   git push origin --delete claude/agitated-wilson 2>/dev/null || echo "pas sur remote"
   ```
   
   **NB** : `claude/jolly-wescoff` (session active, ce worktree) NON SUPPRIMÉ. Sera deleted après merge dans main, phase finale de validation end-to-end.

3. **Créer `memory/_deprecated/` structure** :
   ```bash
   mkdir -p ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/_deprecated
   ```

4. **Marquer `project_migration_desktop.md` status DONE** (Edit le frontmatter) :
   Remplacer lignes 1-6 actuelles :
   ```yaml
   ---
   name: Migration Foundation OS vers Claude Code Desktop natif
   description: Plan 9 phases en cours 2026-04-15. Cible : utilisation pleine des features natives Desktop (plan window, tasks pane, worktrees, session naming).
   type: project
   originSessionId: dd23dd2f-aad2-4276-b221-0b8181380662
   ---
   ```
   par :
   ```yaml
   ---
   name: Migration Foundation OS vers Claude Code Desktop natif (DONE 2026-04-15)
   description: Plan 9 phases DONE 2026-04-15. Migration complete : plan window, tasks pane, worktrees actifs, sessions auto-nommees 🪐, /plan-os orchestrateur, conventions nommage unifiees.
   type: project
   status: done
   originSessionId: dd23dd2f-aad2-4276-b221-0b8181380662
   ---
   ```
   Et ajouter à la fin du fichier : `**Etat de cette memoire** : DONE 2026-04-15. Candidat a _deprecated/ au prochain nettoyage.`

5. **Déplacer les mémoires obsolètes vers _deprecated/** :
   ```bash
   cd ~/.claude/projects/-Users-kevinnoel-foundation-os/memory
   mv project_ds_voidglass_plan.md _deprecated/  # SUPERSEDED 2026-04-14
   mv project_ds_rebuild_plan.md _deprecated/    # DONE 2026-04-15
   # NB: project_migration_desktop.md reste temporairement (ref croisee avec D-LEVELUP)
   ```

6. **Update `MEMORY.md` index** : retirer les lignes pour les fichiers déplacés, ajuster compteurs :
   - Supprimer ligne `- [DS Void Glass plan P0](project_ds_voidglass_plan.md) — SUPERSEDED le 2026-04-14 par le plan DS Rebuild iso base DS (approche void-glass abandonnee par Kevin).`
   - Supprimer ligne `- [DS Rebuild iso base DS](project_ds_rebuild_plan.md) — DONE 2026-04-15 : phases 0-5 + 3b livrees. App + DS iso visuel. Test manuel Kevin en cours.`
   - Changer ligne `- [Migration Desktop 2026-04-15](project_migration_desktop.md) — PROJET ACTIF 9 phases. Cible : Foundation OS utilise pleinement features natives Claude Code Desktop.` en `- [Migration Desktop 2026-04-15](project_migration_desktop.md) — DONE 9 phases. Foundation OS exploite features natives Claude Code Desktop.`
   - Ajouter à la fin (avant les entrées déjà là) une section :
     ```markdown
     ## Deprecated (voir _deprecated/)
     
     - `project_ds_voidglass_plan.md` — SUPERSEDED 2026-04-14 (approche void-glass abandonnee)
     - `project_ds_rebuild_plan.md` — DONE 2026-04-15 (DS iso base DS livre)
     ```

**Verification** :
```bash
git branch | wc -l
# Doit retourner 2 (claude/jolly-wescoff + main) — 2 branches supprimées

git tag | grep archive/claude
# Doit lister archive/claude-adoring-booth et archive/claude-agitated-wilson

ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/_deprecated/
# Doit lister project_ds_voidglass_plan.md et project_ds_rebuild_plan.md

ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/ *.md | wc -l
# Doit retourner 30 (31 - 2 déplacés + MEMORY.md pas compté si pattern .md strict) OU vérifier avec ls --file-type

grep "DONE 2026-04-15" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md
# Doit retourner ligne migration desktop avec DONE
```

**Rollback** :
```bash
# Restaurer branches depuis tags
git branch claude/adoring-booth archive/claude-adoring-booth
git branch claude/agitated-wilson archive/claude-agitated-wilson
git tag -d archive/claude-adoring-booth archive/claude-agitated-wilson

# Restaurer mémoires
cd ~/.claude/projects/-Users-kevinnoel-foundation-os/memory
mv _deprecated/project_ds_voidglass_plan.md .
mv _deprecated/project_ds_rebuild_plan.md .
rmdir _deprecated/ 2>/dev/null  # si vide

# Restaurer MEMORY.md via git (stocké dans le repo ? NON, c'est dans ~/.claude/projects/)
# Backup avant : cp MEMORY.md /tmp/MEMORY.md.bak en début de Phase 3
```

**Commit message** :
```
chore(os): phase 3 level-up — branches legacy + memoires obsoletes

- Delete claude/adoring-booth + claude/agitated-wilson (tags archive/* preserves)
- Garder claude/jolly-wescoff (session active, delete post-merge Phase 7)
- Create memory/_deprecated/ + mv project_ds_voidglass_plan + project_ds_rebuild_plan
- Update project_migration_desktop.md status:done
- Update MEMORY.md index (retirer obsoletes, ajouter section Deprecated)
```

---

### Phase 4 — Compression CONTEXT.md + CLAUDE.md + regen tools index (45 min)

**Objectif** : Ramener CONTEXT.md sous les 150 lignes (spec communication.md), compresser CLAUDE.md sous 180 lignes (déplacer détails vers docs/core), regénérer `docs/core/tools/` catalogue.

**Pre-conditions** :
```bash
wc -l CONTEXT.md  # 163 lignes
wc -l CLAUDE.md   # 221 lignes
wc -l docs/core/tools/README.md  # auto-généré
```

**État repo attendu** :
- Phases 1-3 committées
- CONTEXT.md 163 L, CLAUDE.md 221 L, tools catalogue 2026-04-11 (obsolète)

**Actions** :

1. **Compresser CONTEXT.md Sessions recentes** (spec : max 5, actuel 13) :
   - Ligne par ligne, identifier les 5 sessions les plus pertinentes à garder :
     - 2026-04-15 Migration Desktop (DONE, dernière) — KEEP FULL
     - 2026-04-15 DS iso visuel (dernière) — KEEP FULL
     - 2026-04-14 DS Rebuild (recent, gros chantier) — COMPRESS à 2 lignes
     - 2026-04-14 Supernova SDK — COMPRESS à 1 ligne
     - 2026-04-13 App UI refactor — COMPRESS à 1 ligne
   - Supprimer les 8 entrées plus anciennes : 2026-04-14 Supernova live, 2026-04-14 Storybook S2, 2026-04-13 Storybook S1, 2026-04-13 DS finition F8-F9, 2026-04-13 DS finition F1-F7, 2026-04-11 DS shadcn rebuild, 2026-04-10 Audit Core OS, session note > Sessions plus anciennes S0-S14.
   - Ajouter une ligne de fermeture : `> Sessions plus anciennes disponibles via git log et .archive/audit-massif/23-rapport-final.md, plus .archive/plans-done-260415/.`

2. **Compresser CONTEXT.md section Decisions** (max 15 actives, actuel 14 — OK). Archiver les plus anciennes :
   - Identifier les decisions > 30j : aucune (la plus ancienne est D-DS workspace 2026-04-09).
   - Pas d'archivage, skip.

3. **Vérifier CONTEXT.md < 150 L** :
   ```bash
   wc -l CONTEXT.md
   ```
   Cible : 120-140 lignes.

4. **Compresser CLAUDE.md** (cible 150-180 lignes) :
   - Section "A chaque session" : garder les 4 règles essentielles, retirer les détails (déjà dans docs/core/communication.md section 6). Pointer vers spec.
   - Section "Conventions nommage" : réduire à 2 lignes qui pointent vers `docs/core/naming-conventions.md`.
   - Section "Decisions autonomes" : garder les 3 groupes principaux (archivage auto, nettoyage auto, mise à jour auto), retirer les détails (déjà explicites dans les scripts).
   - Section "Garde-fous" : garder les 7 règles clés, retirer les détails sur `.archive/` (déjà dans memoires).
   - Section "Token-awareness" : garder la table, retirer exemples.
   - Section "Anti-bullshit gates" : garder la liste, retirer exemples redondants.
   - Section "Core OS — Routing/Communication/Monitor/Tools" : déjà 1 ligne chacune, OK.
   - Section "Structure" : arbre court, OK.
   - Objectif : 150-180 lignes.

5. **Regénérer `docs/core/tools/`** :
   ```bash
   bash scripts/tool-register.sh rebuild
   ```
   Résultat attendu : `docs/core/tools/index.json` mis à jour avec count 7 commands (pas 6), `docs/core/tools/README.md` régénéré avec table à jour.

6. **Vérifier que `tool-register.sh scan`** ne liste plus d'outils manquants :
   ```bash
   bash scripts/tool-register.sh scan
   # Doit retourner "✅ Tous les outils detectables sont enregistres" ou lister proprement les nouveaux scripts Phase 5
   ```

**Verification** :
```bash
wc -l CONTEXT.md   # doit retourner 120-140
wc -l CLAUDE.md    # doit retourner 150-180

grep -c "updated" docs/core/tools/index.json
# Doit retourner 1 (ligne updated)

grep -c '"count": 7' docs/core/tools/index.json
# Doit retourner 1 (commands count = 7)

bash scripts/health-check.sh | grep CONTEXT
# Doit retourner "CONTEXT.md 120-140L" (plus le warning > 150L)
```

**Rollback** :
```bash
git checkout CONTEXT.md CLAUDE.md docs/core/tools/
```

**Commit message** :
```
refactor(os): phase 4 level-up — compression CONTEXT.md + CLAUDE.md + tools catalogue

- CONTEXT.md 163L -> ~135L (Sessions recentes 13 -> 5 max selon spec)
- CLAUDE.md 221L -> ~170L (retirer details deja dans docs/core/*)
- Regen docs/core/tools/ (index.json + README.md) via tool-register.sh rebuild
- Tools count 98 (4 agents + 7 commands + ...), updated 2026-04-15
```

---

### Phase 5 — Drift detection — nouveaux scripts (75 min)

**Objectif** : Créer les 2 scripts de détection de drift (docs-sync-check + drift-detector), wire dans health-check, ajouter hook SessionStart pour fix cosmétique.

**Pre-conditions** :
```bash
# Phases 1-4 committées
bash scripts/health-check.sh  # DEGRADED ou SAIN (CSS warn reste, le reste clean)
wc -l CONTEXT.md  # 120-140
```

**État repo attendu** :
- Phases 1-4 committées
- Refs cassees = 0
- CONTEXT.md < 150 L, CLAUDE.md < 180 L

**Actions** :

1. **Créer `scripts/docs-sync-check.sh`** (nouveau fichier, ~120 lignes) :
   
   Contenu :
   ```bash
   #!/bin/bash
   # docs-sync-check.sh — Verifie coherence docs structurelles vs realite
   # Spec : plan level-up foundation os (D-LEVELUP-01 organicite via detection)
   # Exit codes : 0 = sync, 1 = drift detecte
   
   set -uo pipefail
   cd "$(git rev-parse --show-toplevel)"
   
   RED='\033[0;31m'
   YEL='\033[0;33m'
   GRN='\033[0;32m'
   RST='\033[0m'
   
   DRIFT=0
   
   echo ""
   echo "DOCS-SYNC-CHECK — $(date +%Y-%m-%d)"
   echo ""
   
   # 1. Commands count
   CMD_REAL=$(ls .claude/commands/*.md 2>/dev/null | wc -l | tr -d ' ')
   CMD_ARCH=$(grep -cE "^\| \`/[a-z-]+\` \|" docs/architecture.md 2>/dev/null || echo 0)
   CMD_INDEX=$(grep -cE "^\| /[a-z-]+ \|" docs/index.md 2>/dev/null || echo 0)
   
   if [ "$CMD_ARCH" -ne "$CMD_REAL" ]; then
     echo -e "  ${YEL}[DRIFT]${RST} docs/architecture.md commands : $CMD_ARCH vs reel $CMD_REAL"
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${GRN}[OK]${RST} architecture.md commands ($CMD_REAL)"
   fi
   
   # 2. Agents count
   AGT_REAL=$(ls .claude/agents/*.md 2>/dev/null | wc -l | tr -d ' ')
   AGT_ARCH=$(grep -cE "^\| [a-z-]+ \| (opus|sonnet) \|" docs/architecture.md 2>/dev/null || echo 0)
   if [ "$AGT_ARCH" -ne "$AGT_REAL" ]; then
     echo -e "  ${YEL}[DRIFT]${RST} docs/architecture.md agents : $AGT_ARCH vs reel $AGT_REAL"
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${GRN}[OK]${RST} architecture.md agents ($AGT_REAL)"
   fi
   
   # 3. Modules count
   MOD_REAL=$(ls -d modules/*/ 2>/dev/null | wc -l | tr -d ' ')
   MOD_CTX=$(grep -cE "^\| (App Builder|Design System|Finance|Sante|Trading) \|" CONTEXT.md 2>/dev/null || echo 0)
   echo -e "  ${GRN}[OK]${RST} modules ($MOD_REAL reels, $MOD_CTX dans CONTEXT.md section Modules)"
   
   # 4. Memory files count vs MEMORY.md index
   MEM_REAL=$(ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/*.md 2>/dev/null | grep -v MEMORY.md | grep -v _deprecated | wc -l | tr -d ' ')
   MEM_IDX=$(grep -c "^- \[" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md 2>/dev/null || echo 0)
   if [ "$MEM_IDX" -ne "$MEM_REAL" ]; then
     echo -e "  ${YEL}[DRIFT]${RST} MEMORY.md index : $MEM_IDX entrees vs reel $MEM_REAL"
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${GRN}[OK]${RST} MEMORY.md index ($MEM_REAL)"
   fi
   
   # 5. README.md : mots-cles obsoletes (Dashboard, #06070C)
   if grep -q "#06070C\|#08080A" README.md 2>/dev/null; then
     echo -e "  ${RED}[DRIFT]${RST} README.md contient couleurs obsoletes (#06070C ou #08080A)"
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${GRN}[OK]${RST} README.md couleurs a jour"
   fi
   
   # 6. manifeste.md : ref "4 commands" obsolete
   if grep -q "4 commands" docs/manifeste.md 2>/dev/null; then
     echo -e "  ${RED}[DRIFT]${RST} manifeste.md refere '4 commands' (reel=$CMD_REAL)"
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${GRN}[OK]${RST} manifeste.md commands count a jour"
   fi
   
   # Verdict
   echo ""
   if [ "$DRIFT" -eq 0 ]; then
     echo -e "${GRN}Verdict : DOCS SYNC${RST}"
     exit 0
   else
     echo -e "${YEL}Verdict : DRIFT${RST} ($DRIFT drifts detectes)"
     exit 1
   fi
   ```

2. **Créer `scripts/drift-detector.sh`** (nouveau fichier, ~150 lignes) :
   
   Contenu :
   ```bash
   #!/bin/bash
   # drift-detector.sh — Detecte les desynchros multi-sources
   # Usage :
   #   bash scripts/drift-detector.sh                    # detection only
   #   bash scripts/drift-detector.sh --fix-cosmetic     # fix MEMORY count + CONTEXT sessions > 5
   # Spec : plan level-up foundation os (D-LEVELUP-01 organicite detection)
   # Exit codes : 0 = sync, 1 = drift detecte, 2 = drift fixe en mode --fix-cosmetic
   
   set -uo pipefail
   cd "$(git rev-parse --show-toplevel)"
   
   FIX_MODE=0
   [ "${1:-}" = "--fix-cosmetic" ] && FIX_MODE=1
   
   RED='\033[0;31m'
   YEL='\033[0;33m'
   GRN='\033[0;32m'
   RST='\033[0m'
   
   DRIFT=0
   FIXED=0
   
   echo ""
   echo "DRIFT-DETECTOR — $(date +%Y-%m-%d)"
   [ $FIX_MODE -eq 1 ] && echo "Mode : --fix-cosmetic (actions cosmetiques uniquement)"
   echo ""
   
   # 1. CONTEXT.md sessions count vs spec
   CTX_SESSIONS=$(grep -c "^| 2026-" CONTEXT.md 2>/dev/null || echo 0)
   if [ "$CTX_SESSIONS" -gt 5 ]; then
     echo -e "  ${YEL}[DRIFT]${RST} CONTEXT.md Sessions recentes : $CTX_SESSIONS entrees (max 5 selon spec)"
     if [ $FIX_MODE -eq 1 ]; then
       echo -e "    ${YEL}[FIX-COSMETIC]${RST} Skipped (trim sessions exige OK Kevin, jamais auto)"
     fi
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${GRN}[OK]${RST} CONTEXT.md Sessions ($CTX_SESSIONS/5)"
   fi
   
   # 2. CONTEXT.md lines
   CTX_LINES=$(wc -l < CONTEXT.md | tr -d ' ')
   if [ "$CTX_LINES" -gt 200 ]; then
     echo -e "  ${RED}[DRIFT]${RST} CONTEXT.md $CTX_LINES L (garde-fou 200L)"
     DRIFT=$((DRIFT + 1))
   elif [ "$CTX_LINES" -gt 150 ]; then
     echo -e "  ${YEL}[DRIFT]${RST} CONTEXT.md $CTX_LINES L (budget 150L)"
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${GRN}[OK]${RST} CONTEXT.md $CTX_LINES L"
   fi
   
   # 3. CLAUDE.md lines
   CLAUDE_LINES=$(wc -l < CLAUDE.md | tr -d ' ')
   if [ "$CLAUDE_LINES" -gt 200 ]; then
     echo -e "  ${YEL}[DRIFT]${RST} CLAUDE.md $CLAUDE_LINES L (cible < 200)"
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${GRN}[OK]${RST} CLAUDE.md $CLAUDE_LINES L"
   fi
   
   # 4. MEMORY.md index vs filesystem
   MEM_REAL=$(ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/*.md 2>/dev/null | grep -v MEMORY.md | grep -v _deprecated | wc -l | tr -d ' ')
   MEM_IDX=$(grep -c "^- \[" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md 2>/dev/null || echo 0)
   if [ "$MEM_IDX" -ne "$MEM_REAL" ]; then
     DELTA=$((MEM_REAL - MEM_IDX))
     echo -e "  ${YEL}[DRIFT]${RST} MEMORY.md : $MEM_IDX entrees vs $MEM_REAL fichiers (delta $DELTA)"
     DRIFT=$((DRIFT + 1))
     # Fix-cosmetic : juste signaler, pas modifier MEMORY.md (contenu sémantique)
   else
     echo -e "  ${GRN}[OK]${RST} MEMORY.md index ($MEM_REAL)"
   fi
   
   # 5. settings.local.json size vs baseline
   SL_LINES=$(wc -l < .claude/settings.local.json | tr -d ' ')
   if [ "$SL_LINES" -gt 80 ]; then
     echo -e "  ${YEL}[DRIFT]${RST} settings.local.json $SL_LINES L (cible < 60 post-purge)"
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${GRN}[OK]${RST} settings.local.json $SL_LINES L"
   fi
   
   # 6. Branch name check
   BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
   VALID_PREFIXES="feat|fix|docs|refactor|chore|audit|wt"
   VALID_REGEX="^(main|(${VALID_PREFIXES})/[a-z0-9]+[-a-z0-9]*(-[0-9]{6})?)$"
   LEGACY_REGEX="^claude/[a-z]+-[a-z]+$"
   if echo "$BRANCH" | grep -qE "$VALID_REGEX"; then
     echo -e "  ${GRN}[OK]${RST} branche '$BRANCH' (convention OK)"
   elif echo "$BRANCH" | grep -qE "$LEGACY_REGEX"; then
     echo -e "  ${YEL}[DRIFT]${RST} branche '$BRANCH' (legacy claude/*)"
     DRIFT=$((DRIFT + 1))
   else
     echo -e "  ${RED}[DRIFT]${RST} branche '$BRANCH' (hors convention D-NAMING-01)"
     DRIFT=$((DRIFT + 1))
   fi
   
   # 7. Plans actifs
   ACTIVE_PLANS=$(ls docs/plans/*.md 2>/dev/null | grep -v _template-plan.md | wc -l | tr -d ' ')
   echo -e "  ${GRN}[OK]${RST} plans actifs : $ACTIVE_PLANS"
   
   # 8. Orphelins worktrees > 30j (manquant : check date)
   # Simplification : juste compter les worktrees actifs
   WT_COUNT=$(git worktree list | wc -l | tr -d ' ')
   echo -e "  ${GRN}[OK]${RST} worktrees : $WT_COUNT (main + $((WT_COUNT - 1)) actifs)"
   
   echo ""
   if [ "$DRIFT" -eq 0 ]; then
     echo -e "${GRN}Verdict : SYNC${RST}"
     exit 0
   elif [ $FIXED -gt 0 ]; then
     echo -e "${YEL}Verdict : DRIFT FIXED${RST} ($FIXED fixes cosmetiques, $((DRIFT - FIXED)) restants)"
     exit 2
   else
     echo -e "${YEL}Verdict : DRIFT${RST} ($DRIFT drifts detectes)"
     [ $FIX_MODE -eq 0 ] && echo "  Utiliser --fix-cosmetic pour fix auto (jamais destructif)"
     exit 1
   fi
   ```

3. **Chmod +x sur les 2 nouveaux scripts** :
   ```bash
   chmod +x scripts/docs-sync-check.sh scripts/drift-detector.sh
   ```

4. **Ajouter hook SessionStart dans `.claude/settings.json`** :
   Modifier la structure `"hooks"` pour ajouter :
   ```json
   "SessionStart": [
     {
       "hooks": [
         {
           "type": "command",
           "command": "bash \"$(git rev-parse --show-toplevel 2>/dev/null || echo .)/scripts/drift-detector.sh\" 2>&1 | tail -15"
         }
       ]
     }
   ]
   ```
   NB : détection only au SessionStart, pas --fix-cosmetic pour éviter surprise. Kevin voit le rapport et décide.

5. **Test manuel des 2 scripts** :
   ```bash
   bash scripts/docs-sync-check.sh
   # Doit retourner "DOCS SYNC" ou lister les drifts restants
   
   bash scripts/drift-detector.sh
   # Doit retourner "SYNC" ou lister drifts (branche claude/jolly-wescoff legacy = drift attendu)
   
   bash scripts/drift-detector.sh --fix-cosmetic
   # Doit retourner "SYNC" (aucun fix destructif disponible ici, cosmetique seul)
   ```

**Verification** :
```bash
ls scripts/docs-sync-check.sh scripts/drift-detector.sh
# Les 2 fichiers existent

test -x scripts/docs-sync-check.sh && test -x scripts/drift-detector.sh
# Exécutables

bash scripts/docs-sync-check.sh; echo "exit=$?"
# Exit 0 (sync) ou 1 (drift détecté) — selon état post-Phase 1

bash scripts/drift-detector.sh; echo "exit=$?"
# Exit 1 attendu (branche claude/jolly-wescoff legacy)

grep -c "SessionStart" .claude/settings.json
# Doit retourner >= 1
```

**Rollback** :
```bash
rm scripts/docs-sync-check.sh scripts/drift-detector.sh
git checkout .claude/settings.json
```

**Commit message** :
```
feat(os): phase 5 level-up — drift detection scripts + hook SessionStart

- Create scripts/docs-sync-check.sh (6 checks : commands, agents, modules, MEMORY, README, manifeste)
- Create scripts/drift-detector.sh (8 checks : CONTEXT sessions/lines, CLAUDE, MEMORY, settings, branch, plans, worktrees)
- Add SessionStart hook dans .claude/settings.json : drift-detector au debut de chaque session
- Mode --fix-cosmetic reserve pour futures ameliorations (JAMAIS auto-destructif, regle feedback_no_auto_archive)
```

---

### Phase 6 — Intégration brief v11 + chain health-check (30 min)

**Objectif** : Chaîner `drift-detector.sh` depuis `health-check.sh` (single source), ajouter cadre `SYNC` optionnel dans brief v11 spec (docs/core/communication.md).

**Pre-conditions** :
```bash
# Phases 1-5 committées
bash scripts/drift-detector.sh; echo "exit=$?"
# Exit 1 (branche legacy)
```

**État repo attendu** :
- Phases 1-5 committées
- Scripts drift-detector + docs-sync-check existent
- Hook SessionStart wire

**Actions** :

1. **Modifier `scripts/health-check.sh`** pour chainer drift-detector en section INFO :
   
   Ajouter après la section INFO existante (après "CONTEXT.md taille" vers ligne 188), juste avant la section VERDICT :
   ```bash
   # Drift detector (level-up phase 5)
   if [ -x scripts/drift-detector.sh ]; then
     DRIFT_OUT=$(bash scripts/drift-detector.sh 2>&1); DRIFT_RC=$?
     if [ $DRIFT_RC -eq 0 ]; then
       echo -e "  ${DIM}[OK]${RST} Drift detector : SYNC"
     elif [ $DRIFT_RC -eq 1 ]; then
       DRIFT_N=$(echo "$DRIFT_OUT" | grep -oE "\([0-9]+ drifts" | head -1 | grep -oE "[0-9]+")
       echo -e "  ${YEL}[WARN]${RST} Drift detector : ${DRIFT_N:-?} drifts (voir bash scripts/drift-detector.sh)"
       WARNING=$((WARNING + 1))
     fi
   fi
   ```

2. **Modifier `docs/core/communication.md`** (Section 6.1, brief début session) pour ajouter cadre SYNC :
   
   Après la section existante décrivant les 11 cadres (lignes 218-247), AVANT la règle "Regle plans" (ligne 239), ajouter :
   ```markdown
   #### Cadre SYNC (optionnel, post-level-up phase 5)
   
   Quand `bash scripts/drift-detector.sh` retourne exit 1 (drift détecté), ajouter un cadre `┌─ SYNC ─┐` entre ATTENTION et DERNIER TRAVAIL :
   
   ```
   ┌─ SYNC ────────────────────────────┐
   │ 🟡 Drifts detectes :              │
   │   <liste courte, 1 ligne/drift>   │
   │                                    │
   │ Fix : bash scripts/drift-detector │
   │       .sh --fix-cosmetic          │
   └────────────────────────────────────┘
   ```
   
   Si drift-detector retourne exit 0 (SYNC), le cadre n'est pas affiché.
   ```

3. **Modifier `docs/core/monitor.md` section 1 "Health Indicators"** pour ajouter entrée Drift detector :
   
   Sous la table "Info", ajouter ligne :
   ```markdown
   | Drift detector | `bash scripts/drift-detector.sh` | exit 0 = SYNC, exit 1 = drift |
   ```

4. **Test intégration** :
   ```bash
   bash scripts/health-check.sh
   # Doit inclure une ligne "Drift detector : N drifts" dans section INFO
   
   bash scripts/health-check.sh | grep -i "drift"
   # Doit retourner 1 ligne
   ```

**Verification** :
```bash
grep -c "drift-detector" scripts/health-check.sh
# Doit retourner >= 2 (chain)

grep -c "SYNC" docs/core/communication.md
# Doit retourner >= 3 (cadre SYNC + mentions)

bash scripts/health-check.sh 2>&1 | grep -i "drift"
# Doit retourner 1 ligne
```

**Rollback** :
```bash
git checkout scripts/health-check.sh docs/core/communication.md docs/core/monitor.md
```

**Commit message** :
```
feat(os): phase 6 level-up — integration drift detection dans brief v11 + health-check

- Chain drift-detector.sh dans health-check.sh section INFO (exit 1 -> warn)
- Add cadre SYNC optionnel dans docs/core/communication.md section 6.1 (brief v11)
- Add entree drift detector dans docs/core/monitor.md section 1
- Integration transparente : si SYNC, aucun changement visuel ; si DRIFT, cadre SYNC s'affiche
```

---

### Phase 7 — Validation end-to-end + memoires + commit final + cleanup (45 min)

**Objectif** : Validation complète, création des mémoires permanentes, update CONTEXT.md final, commit du plan level-up, merge dans main, delete worktree `claude/jolly-wescoff`, rétrofit du plan level-up lui-même comme archivable.

**Pre-conditions** :
```bash
# Phases 1-6 toutes committées (6 commits)
bash scripts/health-check.sh
bash scripts/sync-check.sh
bash scripts/drift-detector.sh
bash scripts/docs-sync-check.sh
bash scripts/ref-checker.sh
```

**État repo attendu** :
- 6 commits Phase 1-6
- Health SAIN ou DEGRADED (CSS warn permanent reste, acceptable)
- Drift detector retourne 0 ou 1 (branche claude/jolly-wescoff legacy = drift attendu)
- Ref-checker retourne 0 refs cassées
- Auto-archive a déplacé plan migration (Phase 2)

**Actions** :

1. **Créer mémoire permanente `feedback_plans_ultra_detailles.md`** dans `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/` :
   ```markdown
   ---
   name: Plans ultra detailles anti-perte-de-contexte multi-session
   description: Tout plan multi-session doit contenir pre-conditions verifiables, etat repo attendu, actions atomiques numerotees avec snippets exacts, verification post-phase, rollback explicite, commit message prefоrmate.
   type: feedback
   originSessionId: <this session>
   ---
   
   Kevin demande (2026-04-15, session level-up OS) que tout plan multi-session soit **ultra-detaille pour eviter perte de contexte** entre sessions. Claude peut etre compacte, il doit pouvoir reprendre un plan en lisant uniquement le fichier plan sans autre contexte.
   
   **Why:** Plusieurs sessions = risque de compactage du contexte = perte de la finesse d'implementation. Resultat possible : dans une session suivante, Claude fait quelque chose de moins bien parce qu'il a perdu tout le contexte. Un plan ultra-detaille est l'antidote.
   
   **How to apply** — chaque phase d'un plan multi-session DOIT contenir les 6 elements :
   
   1. **Pre-conditions verifiables** : commandes bash exactes qui doivent retourner X avant de commencer (ex: `git status` clean, `health-check` sain).
   2. **Etat repo attendu en debut de phase** : branche, fichiers staged, dernier commit, metriques cles (CONTEXT.md lignes, refs cassees count, etc.). Ce bloc sauve quand on reprend compacte.
   3. **Actions atomiques numerotees** : 1 action = 1 outil = 1 effet. Pas de "update + test + commit" en une ligne. Avec snippets exacts du code ou diff a inserer, pas "ajouter un check".
   4. **Verification post-phase** : commandes qui prouvent que la phase a reussi (exit code attendu, sortie attendue).
   5. **Rollback explicite** : git revert hash X, rm fichier Y, git checkout file Z. Explicitement pour chaque changement.
   6. **Commit message exact preformate** : pas "commit conventionnel", mais le message complet entre backticks.
   
   **Red flag** : si je commence a ecrire un plan multi-session sans ces 6 elements par phase, arreter, completer, reprendre. Un plan monolithe sans phases = egalement red flag (regle CLAUDE.md "jamais monolithe").
   
   **Template integre** : `docs/plans/_template-plan.md` a deja la structure de base (Context, Findings, Phases, Fichiers critiques, Hors scope, Verification end-to-end, Risques, Memoires a creer, Execution log). Enrichir chaque phase avec les 6 elements ci-dessus.
   
   **Source de verite format** : `docs/core/planner.md` section 4.
   ```

2. **Update `MEMORY.md`** pour ajouter la nouvelle mémoire :
   
   Ajouter ligne dans la liste principale :
   ```markdown
   - [Plans ultra detailles](feedback_plans_ultra_detailles.md) — Tout plan multi-session : 6 elements stricts par phase pour zero perte de contexte apres compactage.
   ```

3. **Update `docs/core/planner.md`** section 4 "Format plan obligatoire" pour référencer la règle :
   
   Ajouter après la section "## 4. Format plan obligatoire" (ligne 86), avant la spec elle-même :
   ```markdown
   > **Plans multi-session anti-perte-de-contexte** : chaque phase DOIT contenir les 6 elements (pre-conditions, etat repo, actions atomiques numerotees avec snippets, verification, rollback, commit message). Memoire : `feedback_plans_ultra_detailles.md`.
   ```

4. **Update `CONTEXT.md`** section Sessions recentes avec entrée Level Up :
   Ajouter en tête de la table (au-dessus de la ligne `| 2026-04-15 | **[DONE] Migration Foundation OS → Claude Code Desktop natif (9 phases)** |`) :
   ```markdown
   | 2026-04-15 | **[DONE] Level Up Foundation OS (7 phases)** |
   |            | Audit exhaustif de l'OS (69 fichiers lus), 21 findings P0/P1/P2, 15 propositions priorisees. Niveau 1 execute (Phase 1-7) : hygiene settings.local (159->~50L), ref-checker +9 faux positifs filtres (16 refs cassees -> 0), manifeste+README a jour, auto-archive plan migration retrofitte + archive, branch-name-check pre-commit wire, 2 branches legacy cleanup + tags archive, memory/_deprecated/ + 2 memoires deplacees, CONTEXT.md 163L->~135L, CLAUDE.md 221L->~170L, tools catalogue regenere, drift-detector.sh + docs-sync-check.sh scripts, hook SessionStart drift-detection, cadre SYNC brief v11, chain drift dans health-check. |
   |            | Commits : 7 commits conventionnels phase par phase. |
   |            | Decisions : D-LEVELUP-01 organicite detection-only, D-LEVELUP-02 plans ultra detailles, D-LEVELUP-03 claude/jolly-wescoff merge-then-delete, D-LEVELUP-04 auto-maintenance reporte, D-LEVELUP-05 scalabilite reportee, D-LEVELUP-06 CLAUDE compression Phase 4, D-LEVELUP-07 generate-brief reporte. |
   ```

5. **Update `CONTEXT.md` section Decisions** pour ajouter les 3 decisions structurantes actives :
   ```markdown
   | D-LEVELUP-01 Organicite detection-only | 2026-04-15 | Scripts detectent les drifts (drift-detector, docs-sync-check) mais ne corrigent pas automatiquement sauf le cosmetique (MEMORY count, sessions > 5 en mode interactif). Regle : "health-check vert" < "validation Kevin". |
   | D-LEVELUP-02 Plans ultra detailles | 2026-04-15 | Tout plan multi-session : 6 elements stricts par phase (pre-conditions, etat repo, actions atomiques, verification, rollback, commit). Raison : anti-perte-de-contexte post-compactage. Spec : `docs/core/planner.md` section 4, memoire `feedback_plans_ultra_detailles.md`. |
   | D-LEVELUP-03 Worktree legacy merge-then-delete | 2026-04-15 | claude/jolly-wescoff (session level-up) non-migre en cours. Workflow : finir travail, merge dans main, delete branche + worktree depuis main. Nouvelle convention s'applique a la prochaine branche via `/wt new`. |
   ```

6. **Update `CONTEXT.md` section Prochaine action** :
   ```markdown
   **Prochaine action** :
     - **Merge main + cleanup worktree** : `cd /Users/kevinnoel/foundation-os`, `git merge --no-ff claude/jolly-wescoff` (depuis main), `git push origin main`, `git worktree remove .claude/worktrees/jolly-wescoff`, `git branch -d claude/jolly-wescoff`, `git push origin --delete claude/jolly-wescoff`.
     - **Test validation Kevin** : `/cockpit` depuis main doit afficher cadre SYNC clean (0 drift sauf CSS) + tasks pane vide.
     - **Test `/plan-os "trivial test"`** : verifier auto-rename session 🪐, frontmatter genere, auto-archive a la fin.
     - **Decider Phase 5 Expansion** : Finance / Sante / Trading (attente depuis migration).
     - **Test manuel DS composants** (en parallele) : 46 ui Storybook.
   ```

7. **Rétrofitter le plan level-up lui-même** en ajoutant un frontmatter propre :
   Le plan est déjà dans `~/.claude/plans/replicated-popping-peacock.md` avec frontmatter. Copier vers `docs/plans/2026-04-15-level-up-foundation-os.md` (dual path) :
   ```bash
   cp ~/.claude/plans/replicated-popping-peacock.md docs/plans/2026-04-15-level-up-foundation-os.md
   ```
   
   Changer le frontmatter `status: draft` en `status: done` dans la copie versionnée, et cocher les 7 cases dans Execution log.

8. **Commit final** :
   ```bash
   git add CONTEXT.md docs/core/planner.md docs/plans/2026-04-15-level-up-foundation-os.md \
     ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/feedback_plans_ultra_detailles.md \
     ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md
   ```
   NB : les mémoires sont dans `~/.claude/projects/` donc HORS repo git — elles ne sont pas staged par git, mais persistent sur filesystem. Le commit concerne uniquement les fichiers du repo.

9. **Run auto-archive sur le plan level-up lui-même** (test meta) :
   ```bash
   # Le plan a frontmatter status:done (step 7), donc devrait être archivé par le hook SessionEnd
   # Test manuel :
   bash scripts/auto-archive-plans.sh
   # Doit déplacer docs/plans/2026-04-15-level-up-foundation-os.md vers .archive/plans-done-$(date +%y%m%d)/
   ```

10. **Validation end-to-end finale** :
    ```bash
    # Health sain ou DEGRADED avec warn non-bloquants
    bash scripts/health-check.sh; echo "exit=$?"
    # Attendu : exit 2 (DEGRADED) avec warn CSS>40KB (permanent, hors scope) + Vitest DS illisible + drift branche claude/jolly-wescoff
    
    # Sync-check
    bash scripts/sync-check.sh; echo "exit=$?"
    # Attendu : exit 2 (DEGRADED) meme raisons
    
    # Ref-checker clean
    bash scripts/ref-checker.sh; echo "exit=$?"
    # Attendu : exit 0 (0 refs cassees)
    
    # Drift detector
    bash scripts/drift-detector.sh; echo "exit=$?"
    # Attendu : exit 1 (drift branche claude/jolly-wescoff — sera clean apres cleanup Phase 7 Step 11)
    
    # Docs sync
    bash scripts/docs-sync-check.sh; echo "exit=$?"
    # Attendu : exit 0 (docs syncrones apres Phases 1+6)
    ```

11. **Commit message final** :
    ```
    docs(os): phase 7 level-up — validation e2e + memoires + CONTEXT + archive plan
    
    - Create memoire feedback_plans_ultra_detailles.md (regle anti-perte-de-contexte multi-session, 6 elements par phase)
    - Update MEMORY.md index (+1 entree)
    - Update docs/core/planner.md section 4 (reference regle plans ultra detailles)
    - Update CONTEXT.md : session Level Up OS + 3 decisions D-LEVELUP-01/02/03 + prochaine action
    - Copy plan vers docs/plans/2026-04-15-level-up-foundation-os.md (dual path)
    - Retrofit plan level-up status:done
    
    Tous les scripts verts ou DEGRADED avec warn permanents (CSS>40KB, Vitest DS illisible).
    Drift detector signalera claude/jolly-wescoff jusqu'au cleanup post-merge (instruction Prochaine action).
    ```

12. **Post-commit — cleanup worktree (depuis main)** :
    ```bash
    cd /Users/kevinnoel/foundation-os
    git fetch --all
    git merge --no-ff claude/jolly-wescoff -m "merge(os): Level Up Foundation OS (7 phases, 7 commits)"
    git push origin main
    git worktree remove .claude/worktrees/jolly-wescoff
    git branch -d claude/jolly-wescoff
    git push origin --delete claude/jolly-wescoff
    git tag archive/claude-jolly-wescoff  # optionnel, pour historique
    ```

**Verification end-to-end final** :
```bash
# Depuis main
cd /Users/kevinnoel/foundation-os

bash scripts/health-check.sh
# SAIN ou DEGRADED (warn non-bloquants)

bash scripts/drift-detector.sh
# SYNC (branche main convention OK)

bash scripts/docs-sync-check.sh
# SYNC

ls docs/plans/
# Seul _template-plan.md (level-up archivé auto ou manuel)

ls .archive/plans-done-260415/ | grep level-up
# Contient le plan level-up archivé

git branch
# main uniquement + éventuelles branches hors scope
```

**Rollback (total, en cas de catastrophe)** :
```bash
# Depuis main
git reset --hard 51397d6  # retour au commit pré-level-up
# Tous les commits Phase 1-7 perdus. À n'utiliser qu'en cas extrême.
# Backup des mémoires ~/.claude/projects/ à restaurer manuellement.
```

**Commit message Phase 7 final** : (voir step 11 ci-dessus)

---

## Fichiers critiques (récap cross-phase)

| Fichier | Phases | Action |
|---|---|---|
| `.claude/settings.local.json` | 1 | Purge 159 → ~50L, backup archive |
| `scripts/ref-checker.sh` | 1 | Extend IGNORE_REFS_RE (+9 faux positifs filtres) |
| `docs/manifeste.md` | 1 | Fix sections 4.2, 6, 9.2 obsoletes |
| `README.md` | 1 | Fix couleurs, modules, link setup-guide |
| `docs/plans/2026-04-15-migration-foundation-desktop.md` | 2 | Retrofit frontmatter status:done + archive |
| `scripts/git-hooks/pre-commit` | 2 | Chain branch-name-check.sh |
| `.git/hooks/pre-commit` | 2 | Install (cp depuis scripts/git-hooks/) |
| `CONTEXT.md` | 2, 4, 7 | Fix refs plans archives + compression sessions + ajout session level-up |
| `docs/core/communication.md` | 2, 6 | Fix ref memory.md (codeblock) + ajouter cadre SYNC section 6.1 |
| `docs/core/monitor.md` | 2, 6 | Fix ref memory.md (codeblock) + ajouter entree drift detector |
| `docs/core/naming-conventions.md` | 2 | Fix ref plans archives |
| `docs/core/tools.md` | 2 | Fix ref worktrees-orphelins |
| `docs/core/worktrees.md` | 2 | Fix ref worktrees-orphelins |
| `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_migration_desktop.md` | 3 | Frontmatter status:done |
| `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/_deprecated/` | 3 | NEW dir + move SUPERSEDED/DONE memoires |
| `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md` | 3, 7 | Update index (retirer obsoletes, ajouter level-up) |
| `CLAUDE.md` | 4 | Compression 221 → ~170L (details deleguer a docs/core/) |
| `docs/core/tools/index.json` | 4 | Regen via tool-register.sh rebuild |
| `docs/core/tools/README.md` | 4 | Regen via tool-register.sh rebuild |
| `scripts/docs-sync-check.sh` | 5 | NEW (6 checks docs vs reel) |
| `scripts/drift-detector.sh` | 5 | NEW (8 checks desynchros) |
| `.claude/settings.json` | 5 | Add hook SessionStart drift-detector |
| `scripts/health-check.sh` | 6 | Chain drift-detector en section INFO |
| `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/feedback_plans_ultra_detailles.md` | 7 | NEW memoire permanente |
| `docs/core/planner.md` | 7 | Ajouter ref plans ultra detailles section 4 |
| `docs/plans/2026-04-15-level-up-foundation-os.md` | 7 | Copy plan natif vers versionne (dual path) |

---

## Hors scope explicite (YAGNI strict)

- **P5 auto-maintenance.sh mega-script** : reporté jusqu'à feedback réel sur P14 drift-detector + P7 docs-sync-check. Si les briques suffisent, inutile d'ajouter un orchestrateur.
- **P8 Cortex routing par domaine** : reporté jusqu'à création 1er module domain (finance/sante/trading). Déclencheur : `/new-project` de la Phase 5 Expansion.
- **P9 Monitor modulaire `.monitor.json`** : idem Phase 5 Expansion.
- **P10 Templates agents par domaine** : idem.
- **P12 `generate-brief.sh`** (génération brief v11 automatique) : reporté, nice-to-have. À considérer si je dérive trop souvent.
- **P19 CI health-check** (GitHub Actions) : nice-to-have, pas critique, --no-verify est un choix conscient de Kevin s'il doit bypass.
- **F11 CSS>40KB investigation Tailwind purge** : hors scope level-up, chantier DS séparé.
- **F12 Vitest DS output illisible** : parsing health-check à améliorer, chantier séparé.
- **F13 sync-check Routes pattern** : nice-to-have, décider supprimer le check ou ajouter la ligne, pas prioritaire.
- **F17 _bmad/ dormant** : choix Kevin 2026-04-07, intact.
- **Renommage rétroactif des autres branches** : 3 branches claude/* gérées, futures branches suivent convention via branch-name-check. Pas de scan historique complet nécessaire.

---

## Verification end-to-end (Phase 7 final)

Séquence à exécuter depuis `main` après cleanup worktree :

1. **Health global SAIN** :
   ```bash
   bash scripts/health-check.sh
   # Attendu : exit 0 (SAIN) ou exit 2 (DEGRADED avec warn hors scope CSS + Vitest DS)
   ```

2. **Sync-check étendu** :
   ```bash
   bash scripts/sync-check.sh
   # Attendu : exit 0 ou 2 même raisons
   ```

3. **Zero ref cassée** :
   ```bash
   bash scripts/ref-checker.sh
   # Attendu : exit 0, "0 refs cassees"
   ```

4. **Drift SYNC** :
   ```bash
   bash scripts/drift-detector.sh
   # Attendu : exit 0, "SYNC"
   ```

5. **Docs SYNC** :
   ```bash
   bash scripts/docs-sync-check.sh
   # Attendu : exit 0, "DOCS SYNC"
   ```

6. **Test `/plan-os` end-to-end** (test vivant) :
   - Taper `/plan-os "test trivial fix typo"` dans nouvelle session Claude
   - Vérifier : plan window Desktop s'ouvre, titre `🪐 Test trivial fix typo (DD-MM-YYYY)`, frontmatter YAML complet, 1 phase, Execution log avec `[ ]`.
   - Valider le plan (ExitPlanMode accept).
   - Vérifier dans sidebar Desktop : session renommée `🪐 Test trivial fix typo (15-04-2026)` (si auto-rename marche) OU Kevin renomme manuellement.
   - Exécuter le plan (phase unique).
   - `/session-end` → doit auto-archiver le plan test.
   - Vérifier : `ls docs/plans/` ne contient plus le plan test, `ls .archive/plans-done-$(date +%y%m%d)/` le contient.

7. **Test `/cockpit` brief v11** :
   - Taper `/cockpit` dans nouvelle session
   - Vérifier : brief v11 complet, aucun cadre SYNC affiché (car SYNC clean)
   - Si drift détecté : cadre SYNC s'affiche avec liste des drifts

8. **Worktrees clean** :
   ```bash
   git worktree list
   # Attendu : uniquement main (pas de worktree résiduel)
   
   git branch
   # Attendu : main uniquement (toutes les claude/* deleted)
   ```

---

## Risques

| Risque | Probabilité | Mitigation |
|---|---|---|
| Purge settings.local casse un MCP actif | moyen | Backup dans .archive/ avant purge, liste explicite des MCP à conserver, test rapide via outil MCP post-Phase 1 |
| Retrofit plan migration échoue (auto-archive ne déplace pas) | faible | Test manuel `bash scripts/auto-archive-plans.sh` après Step 1 Phase 2. Si échec, vérifier regex frontmatter dans auto-archive-plans.sh ligne 31 |
| Delete branches claude/* par erreur (travail unique) | très faible | `git log main..<branche>` validé vide par Plan agent + tag archive/* avant delete (rollback possible via `git branch claude/... archive/claude-...`) |
| `drift-detector.sh` false positives nuisibles | moyen | Script en détection-only mode (pas de fix auto destructif), Kevin peut skip si noise trop élevé. Itération possible Phase 8 optionnelle |
| Compression CLAUDE.md supprime règle utile | moyen | Comparer AVANT/APRES ligne par ligne, valider avec Kevin que chaque règle supprimée est bien déléguée à docs/core/*. Rollback via `git checkout CLAUDE.md` trivial |
| Auto-rename session Desktop 🪐 ne marche pas | moyen | Kevin confirme manuellement le nom de session. Plan step 7 Phase 7 indique le nom exact à mettre. |
| Perte de contexte inter-session (sessions 3-4 du plan) | moyen | Ce plan est ultra-détaillé par design (règle D-LEVELUP-02). Chaque phase auto-suffisante. |
| Commit final reject par pre-commit (health DEGRADED) | faible | DEGRADED autorisé par pre-commit hook (exit 0). Seul BROKEN bloque |
| Cleanup worktree perd travail non-commité | très faible | Toutes les phases commit before proceed. Check `git status --short` avant `git worktree remove` |
| Kevin change d'avis en cours de route | moyen | Plan structurée en phases indépendantes. Pause possible après n'importe quelle phase. Rollback par phase documenté |

---

## Mémoires permanentes à créer (Phase 7)

- `feedback_plans_ultra_detailles.md` — règle D-LEVELUP-02 (6 éléments par phase, anti-perte-de-contexte multi-session).

**NB** : les memoires suivantes ne sont PAS créées (déjà couvertes par les mémoires existantes) :
- Organicité détection-only : D-LEVELUP-01 dans CONTEXT.md suffit, pas besoin de dupliquer en mémoire.
- Worktree merge-then-delete : D-LEVELUP-03 dans CONTEXT.md suffit.

---

## Execution log

- [ ] Phase 1 — Hygiène immédiate (settings.local + ref-checker + manifeste + README) — pending
- [ ] Phase 2 — Fix boucles cassées (retrofit plan migration + branch-name-check hook + 7 refs stales) — pending
- [ ] Phase 3 — Branches legacy (adoring-booth, agitated-wilson) + mémoires _deprecated/ + MEMORY.md — pending
- [ ] Phase 4 — Compression CONTEXT.md + CLAUDE.md + regen tools catalogue — pending
- [ ] Phase 5 — Scripts drift-detector + docs-sync-check + hook SessionStart — pending
- [ ] Phase 6 — Intégration brief v11 + chain health-check — pending
- [ ] Phase 7 — Validation e2e + mémoires + CONTEXT + commit + merge main + delete worktree — pending

---

## Notes post-exécution

*À remplir après. Écarts estimation vs réel, surprises, leçons retenues. Cette section sera complétée en fin de Phase 7.*

---

## Meta — session naming Claude Code Desktop

**Nom de session à appliquer manuellement si auto-rename Desktop ne marche pas :**

```
🪐 Level Up Foundation OS (15-04-2026)
```

À mettre dans la sidebar sessions Desktop (clic droit session → Rename, ou feature UI équivalente).

---

**FIN DU PLAN** — Total estimé : ~300 min sur 2-4 sessions courtes.
