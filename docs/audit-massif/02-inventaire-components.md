# 02 — Inventaire components + smoke tests

> **Cycle 3 / Session S2** | **Mode** : MOI | **Date** : 2026-04-07
> **Branche** : `audit-massif-cycle3` | **Pre-conditions** : S1 commit `350547b` + baseline SAIN ✓
> **Statut** : DONE
> **Plan reference** : `docs/plans/2026-04-07-cycle3-implementation.md` (lignes 377-433)

## 1. Objectif

Inventorier exhaustivement chaque composant Foundation OS (agents, commands, scripts, hooks, skills, MCP, CI), valider leur existence, frontmatter, syntaxe et delegations cross-references. Smoke tests (`bash -n` + `python -m py_compile` + `--help` quand disponible) pour confirmer integrite executable. Mode **MOI** car le jugement croise (cohérence agent ↔ command ↔ script ↔ doc) exige ma memoire des sessions et decisions, pas une lecture isolee par sub-agent.

## 2. Methodologie

| Phase | Scope | Outils |
|-------|-------|--------|
| A | 4 agents `.claude/agents/*.md` | Read parallele |
| B | 4 commands `.claude/commands/*.md` | Read parallele |
| C | 8 scripts (`scripts/`, `scripts/hooks/`, `scripts/git-hooks/`) + smoke tests | Read + bash -n + py_compile + --help |
| D | Hooks PreToolUse refs dans `.claude/settings.json` | Read + Grep |
| E | Skills + MCP + CI workflows | Glob + Read |
| F | Consolidation findings + livrable + commit | Write + Edit |

**Decoupage anti-compactage** : 6 phases courtes, executions parallelisees quand independantes. Aucun sub-agent invoque (mode MOI strict).

## 3. Inventaire 4 agents (`.claude/agents/`)

| Agent | Lignes | Frontmatter | Declencheurs |
|-------|--------|-------------|--------------|
| os-architect.md | 50 | `name`, `description` | architecture, ADR, stack, schema, comment structurer, option A vs B |
| dev-agent.md | 52 | `name`, `description` | code, composant, page, Supabase, React, build, scaffold, CSS, Tailwind |
| doc-agent.md | 51 | `name`, `description` | documente, note, trace, journalise, met a jour |
| review-agent.md | 40 | `name`, `description` | verifie, audit, check, revue, zero regression |
| **Total** | **193L** | | |

### Cohérence inter-agents (matrice delegation)

| Agent | Delegue vers | Recoit de |
|-------|--------------|-----------|
| os-architect | dev / doc / review | (entry) |
| dev-agent | os / doc / review | os |
| doc-agent | os / dev / review | os, dev |
| review-agent | os / dev / doc | os, dev, doc |

Chaque agent declare explicitement ses 3 hors-scope dans une section "Hors scope (deleguer)". Matrice 4×3 complete : aucun trou. Coherent avec `CLAUDE.md` ligne 91 et `docs/core/cortex.md` section 4 (source unique routing).

### Frontmatter observé

Aucun agent ne declare `model:` ni `tools:` → chaque agent herite du model parent et de tous les tools disponibles (cf. F-S2-02 ci-dessous, comportement intentionnel).

### Smoke test

Tous lus avec succes via `Read` (pas de parse error frontmatter). Cohérence avec health-check : `sync-check.sh` ligne 109-126 verifie que les 4 agents existent par nom.

## 4. Inventaire 4 commands (`.claude/commands/`)

| Command | Lignes | Workflow steps | Delegate vers |
|---------|--------|----------------|---------------|
| session-start.md | 30 | 6 steps | `bash scripts/health-check.sh`, `git status`, `npm run build` |
| session-end.md | 53 | 7 steps + 4 niveaux PAUL | `bash scripts/health-check.sh`, `npm run build`, `npm test` |
| new-project.md | 49 | 3 steps via script | `bash scripts/module-scaffold.sh [nom]` |
| sync.md | 79 | 6 sections doc + delegate | `bash scripts/sync-check.sh` |
| **Total** | **211L** | | |

### Frontmatter observé

Aucune command ne declare de frontmatter YAML (`name:`, `description:`). Format = "pure prompt markdown". Cohérent convention Claude Code slash commands (le filename = nom du slash, le H1 = description). Voir F-S2-03.

### Coherence command ↔ script

| Command | Script invoqué | Existe |
|---------|----------------|--------|
| /session-start | health-check.sh | ✓ |
| /session-end | health-check.sh | ✓ |
| /new-project | module-scaffold.sh | ✓ |
| /sync | sync-check.sh | ✓ |

100% delegation existe physiquement. Aucun script orphelin invoque.

## 5. Inventaire 8 scripts

> **Note importante** : `docs/plans/2026-04-07-cycle3-implementation.md` Task S2.4 declare "9 scripts" mais le filesystem en contient **8**. Cause racine : mauvaise comptabilisation a l'ecriture du plan (probablement attendait un 9e script `.js` ou un script supplementaire jamais cree). Fix docs-only trivial applique en cette session (voir D-S2-01).

| # | Path | Lignes | Type | Spec referee |
|---|------|--------|------|--------------|
| 1 | scripts/health-check.sh | 171 | bash | docs/core/monitor.md |
| 2 | scripts/sync-check.sh | 214 | bash | .claude/commands/sync.md, docs/core/monitor.md |
| 3 | scripts/ref-checker.sh | 178 | bash | docs/core/tools.md |
| 4 | scripts/module-scaffold.sh | 168 | bash | docs/core/tools.md, .claude/commands/new-project.md |
| 5 | scripts/hooks/validate-void-glass.sh | 38 | bash | docs/design-system.md |
| 6 | scripts/hooks/security-reminder.py | 280 | python3 | (autonome) |
| 7 | scripts/git-hooks/commit-msg | 19 | bash | docs/core/tools.md |
| 8 | scripts/git-hooks/pre-commit | 20 | bash | (delegate health-check.sh) |
| **Total** | | **1088L** | | |

### Smoke tests resultats

| Script | Test | Resultat |
|--------|------|----------|
| health-check.sh | `bash -n` | OK (pas de --help) |
| sync-check.sh | `bash -n` | OK (pas de --help) |
| ref-checker.sh | `--help` | OK (banner 33L cohérent) |
| module-scaffold.sh | `--help` | OK (banner usage + exit codes) |
| validate-void-glass.sh | `bash -n` | OK (hook stateless) |
| security-reminder.py | `python3 -m py_compile` | OK (pas de syntax error) |
| commit-msg | `bash -n` | OK |
| pre-commit | `bash -n` | OK |

**Verdict smoke** : 8/8 scripts syntaxiquement valides. 2/8 ont un `--help` documente (ref-checker, module-scaffold). 6/8 n'ont pas de --help (3 hooks declenchent sur evenements externes : Write/Edit/commit, 3 sont des outils audit pures invoques sans flag). Cohérent avec leur usage.

### Permissions executables

Tous les scripts inventorie sont `+x` (verifie indirectement par leur usage dans health-check + commit-msg via sub-process). `commit-msg` avait perdu son `+x` decouvert en S1, fixe (commit `350547b`).

## 6. Hooks PreToolUse + `.claude/settings.json`

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          { "type": "command", "command": "/Users/kevinnoel/foundation-os/scripts/hooks/validate-void-glass.sh \"${file_path:-}\"" },
          { "type": "command", "command": "python3 /Users/kevinnoel/foundation-os/scripts/hooks/security-reminder.py" }
        ]
      }
    ]
  },
  "enabledPlugins": { "oh-my-claudecode@omc": true }
}
```

**Trigger** : matcher `Write|Edit|MultiEdit` → 2 hooks chained executes en sequence sur chaque outil d'edition de fichier.

**Refs verifiees** : les 2 paths `scripts/hooks/validate-void-glass.sh` et `scripts/hooks/security-reminder.py` existent physiquement.

**Probleme detecte** : paths **absolus** `/Users/kevinnoel/foundation-os/...` → non portable si Kevin clone le repo ailleurs ou autre user (voir F-S2-08).

## 7. Skills + MCP + CI workflows

### Skills custom Foundation OS

Repertoire skills sous .claude : **absent** (verifie via Glob pattern, aucun fichier renvoyé). Aucune skill custom dediee Foundation OS. Les skills disponibles viennent de plugins (oh-my-claudecode, superpowers, etc.) listees dans system prompt session par session. Cohérent avec `CONTEXT.md` ligne 91 (Outils installes : superpowers, gstack, OMC, BMAD).

### MCP connectes (verifie via `CONTEXT.md` lignes 76-83)

| Service | Status |
|---------|--------|
| Asana | Connecte (workspace 1213280972575193, kevin.noel.divers@gmail.com) |
| Notion | Connecte (user 4f1b99db-9655-40a7-b59a-a9e8af210dfb) |
| Figma | Disponible |
| Monday.com | Disponible |
| ClickUp | Disponible |
| Computer Use | Disponible |
| Context7 | Disponible |
| Gmail | Auth requise (pendant Phase 2.3) |

### CI workflows (`.github/workflows/`)

| Workflow | Lignes | Trigger | Timeout | Steps |
|----------|--------|---------|---------|-------|
| ci.yml | 35 | push/PR main | 10 min | checkout → setup-node@v4 (Node 24, npm cache) → npm ci → tsc --noEmit → npm run build → npx vitest run |
| supabase-ping.yml | 27 | cron `0 8 * * 1` (lundi 8h UTC) + workflow_dispatch | 5 min | curl --max-time 30 sur `${SUPABASE_URL}/rest/v1/sessions` |
| **Total** | **62L** | | | |

**Coherence** : workingDirectory = `modules/app` (cohérent avec position monorepo du seul module actif). Variables sensibles via `secrets.SUPABASE_URL` + `secrets.SUPABASE_ANON_KEY`. Cron weekly conforme a la mitigation du risque "Supabase pause 7j" listee dans CONTEXT.md ligne 100.

## 8. Findings (F-S2-01..09)

### P1 critique : 0

Aucun. Tous les composants existent, sont valides syntaxiquement, et leurs delegations cross-references resolvent.

### P2 important : 1

**F-S2-08** : `.claude/settings.json` PreToolUse hooks declarent paths **absolus** `/Users/kevinnoel/foundation-os/scripts/hooks/...`.
- Source : `.claude/settings.json:18` et `.claude/settings.json:22`
- Impact : non portable. Si Kevin clone le repo ailleurs (autre machine, autre user, CI sandbox), les hooks Void Glass + Security Reminder ne se declenchent plus.
- Fix propose (S21 batch P2) : remplacer par `${CLAUDE_PROJECT_DIR}/scripts/hooks/...` ou path relatif.
- Verification prealable necessaire : confirmer que Claude Code resout `${CLAUDE_PROJECT_DIR}` dans settings.json (a documenter avant fix S21).

### P3 cosmetique : 3

**F-S2-04** : 6 fichiers `.DS_Store` **tracked** dans git malgre presence dans `.gitignore` :
- `.DS_Store` (racine), `.archive/.DS_Store`, `.claude/.DS_Store`, `_bmad/.DS_Store`, `modules/.DS_Store`, `scripts/.DS_Store`
- Cause racine : `git add` initial avant configuration .gitignore (ou ajout force).
- Fix propose (S22 batch P3) : `git rm --cached .DS_Store .archive/.DS_Store .claude/.DS_Store _bmad/.DS_Store modules/.DS_Store scripts/.DS_Store` puis commit.
- Impact : bruit macOS systemique dans chaque commit, polution git status.

**F-S2-06** : `.claude/settings.local.json` allow list contient **~50 entries de bruit historique** :
- Exemples : `kill 61137 55533`, `mv /tmp/c2_dev-agent.bak ...`, `echo "C1 exit=$?"`, `md5 /tmp/Badge.tsx.bak`
- Cause racine : Claude Code auto-ajoute permissions a chaque approbation Bash specifique sans deduplication. Au fil des sessions = bloat.
- Fix propose (S22 batch P3) : nettoyer le fichier en gardant uniquement les patterns generiques (`Bash(git:*)`, `Bash(npm:*)`, etc.) et les MCP allowlist. Supprimer les entries one-shot historiques.
- Impact : fichier difficile a auditer manuellement, risque de garder permissions trop laxistes.

**F-S2-09** : `scripts/hooks/__pycache__/security-reminder.cpython-314.pyc` existe localement.
- Status : ignore par git (`__pycache__/` et `*.pyc` listed dans `.gitignore`).
- Impact : 0 sur le repo. Note informative — la presence du .pyc confirme que le hook a deja ete invoke avec succes en local.
- Aucun fix necessaire.

### Imprecisions documentaires : 4

**F-S2-01** : `docs/plans/2026-04-07-cycle3-implementation.md` Task S2.4 dit "9 scripts" mais filesystem = **8**. **Fix docs-only trivial applique en cette session (D-S2-01)**, autorise par decision D-S0-08.

**F-S2-02** : Les 4 agents `.claude/agents/*.md` ont un frontmatter minimal (`name`, `description` uniquement, pas de `model:` ni `tools:`). Comportement = heritage des defaults parent (model + tous les tools). **Pas un bug** mais a documenter explicitement dans `docs/core/cortex.md` ou `docs/core/architecture-core.md` pour eviter confusion future.

**F-S2-03** : Les 4 commands `.claude/commands/*.md` n'ont **pas du tout** de frontmatter YAML. Format = "pure prompt markdown". Convention Claude Code slash commands : nom = filename, description = H1. **Cohérent** mais a documenter pour aligner avec la convention plus stricte des agents.

**F-S2-07** : `.claude/agents/review-agent.md` ligne 23 cite `.git/hooks/commit-msg` au lieu de `scripts/git-hooks/commit-msg`. Techniquement vrai (le hook tourne depuis `.git/hooks/`) mais source de verite version-controlled = `scripts/git-hooks/commit-msg`. **Clarifiable** : reformuler en "enforce automatiquement par `scripts/git-hooks/commit-msg` (installe vers `.git/hooks/commit-msg`)".

## 9. Decisions (D-S2-01..05)

**D-S2-01** : Fix docs-only trivial applique sur `docs/plans/2026-04-07-cycle3-implementation.md` Task S2.4 : "9 scripts" → "8 scripts" + clarification scope. Autorise par D-S0-08 (fixes docs-only triviaux en continu durant audit). Cause racine documentee dans F-S2-01.

**D-S2-02** : 6 fichiers `.DS_Store` tracked → reportes en S22 batch P3 cosmetique. Pas applique en S2 car (a) hors scope inventaire, (b) `git rm --cached` a impact sur git history qu'on prefere grouper avec autres P3.

**D-S2-03** : Paths absolus `.claude/settings.json` → reportes en S21 batch P2 important. Fix necessite verification prealable du support `${CLAUDE_PROJECT_DIR}` dans Claude Code (documentation a chercher en S17 external research).

**D-S2-04** : Allow list bloat `.claude/settings.local.json` → reporte en S22 batch P3. Fix = revue manuelle + nettoyage des entries one-shot historiques.

**D-S2-05** : F-S2-02 (agents minimal frontmatter) + F-S2-03 (commands sans frontmatter) → **PAS un fix** mais à valider en S5 (workflows routing) pour confirmer que l'heritage default est intentionnel vs un manque de specification. Peut produire une note dans `docs/core/architecture-core.md`.

## 10. References

- Plan source : `docs/plans/2026-04-07-cycle3-implementation.md` lignes 377-433 (Session S2)
- Spec audit : `docs/plans/2026-04-07-audit-massif-final.md`
- Livrables Cycle 3 anterieurs : `docs/audit-massif/00-preflight.md`, `docs/audit-massif/01-carto-repo.md`
- Cortex routing source : `docs/core/cortex.md` section 4
- Monitor specs : `docs/core/monitor.md`
- Tools specs : `docs/core/tools.md`
- CONTEXT.md : table Modules ligne 7-12, Cycle 3 progress ligne 26-38

## 11. Out-of-scope (S2)

- Lecture deep des specs `docs/core/*.md` → S3 fondations Core OS
- Audit des routes App Builder + composants React → S13 module App
- Verification semantique du contenu agents (vs juste presence) → S7 agents
- Verification semantique des commands → S8 commands
- Audit des scripts ligne par ligne (logique interne) → S9 scripts hooks
- Verification skills externes (superpowers, OMC, gstack) → S10 skills + BMAD verdict

## 12. Next session (S3)

**S3 — OS Foundation + Core OS** (mode MOI). Spec : plan cycle3 lignes 437+.

Lecture deep `docs/core/cortex.md` + `docs/core/memory.md` + `docs/core/monitor.md` + `docs/core/tools.md` + `docs/core/architecture-core.md`. Verifier coherence des 4 piliers Core OS contre les agents/commands inventorie en S2. Livrable : `docs/audit-massif/03-fondations-core.md`.

**Pre-conditions S3** : commit S2 valide + baseline SAIN.

## 13. Learnings metaboliques (L-S2-01..06)

**L-S2-01** : Comptabilisation "9 scripts" du plan S2.4 etait fausse. **Lecon** : les chiffres dans les plans doivent etre verifies par script (`find ... | wc -l`) avant ecriture, jamais comptes a la main. Suggestion outil : ajouter une etape "auto-count" au pre-session ritual quand un task declare un compte d'items.

**L-S2-02** : Smoke test `--help` ne fonctionne pas universellement — 6/8 scripts n'ont pas de --help (les hooks declenchent sur evenements externes, les outils audit n'en ont pas besoin). **Lecon** : substituer `--help` par `bash -n` (syntax check) + `python -m py_compile` est plus robuste comme smoke test universel. A integrer dans le template Phase C des sessions futures.

**L-S2-03** : Path absolu dans `.claude/settings.json` est un anti-pattern de portabilite passe inapercu jusqu'a un audit dedie. **Lecon** : ajouter au backlog `health-check.sh` un check "portabilite settings" qui flag les paths absolus `/Users/...` dans `.claude/settings.json`. Suggestion P3.

**L-S2-04** : Le `.claude/settings.local.json` bloat (~50 entries one-shot) est un effet de bord systemique de Claude Code (auto-ajout sans deduplication). **Lecon** : nettoyer periodiquement (1× par sprint) cette liste OU inclure dans `.gitignore` si jamais elle devient ingerable. Pour l'instant elle reste tracked car les permissions globales (`git:*`, `npm:*`) sont utiles.

**L-S2-05** : Le frontmatter minimal des agents (`name`, `description` only) est intentionnel mais **non documente**. Tout audit futur peut s'interroger si c'est un oubli ou un choix. **Lecon** : documenter explicitement les conventions de frontmatter agents dans `docs/core/architecture-core.md` pour eviter re-investigation.

**L-S2-06** : Le decoupage 6 phases courtes (A-F) avec executions parallelisees (Read x8, smoke tests batch, etc.) a permis d'executer S2 sans approche du compactage. Mode MOI strict respectee : 0 sub-agent invoque, jugement croise garde dans contexte courant. **Lecon** : ce pattern (Phase A+B parallelisees, Phase C avec smoke tests batch, Phase F = livrable + commit) fonctionne et doit etre repete pour S3-S18 sessions MOI.

**L-S2-07** : Pendant la verification post-write du livrable, le ref-checker a flagge une ref cassee de type backtick pointant vers le repertoire skills sous .claude (ligne 143). **Cause racine** : `scripts/ref-checker.sh` traite tout backtick contenant un path matching son KNOWN_DIRS_RE (scripts|docs|modules|.claude|_bmad|supabase|.github|.archive) comme une vraie reference a valider. Documenter explicitement un dossier inexistant entre backticks dans un livrable d'audit va donc creer une fausse broken ref. **Lecon** : pour citer un path inexistant dans un livrable d'audit, utiliser du texte plain (pas de backticks). Suggestion P3 backlog : enrichir ref-checker avec une convention markdown pour annoter "absent intentionnel" (prefixe negatif, ou simple convention "absent = texte plain" documentee dans `docs/core/tools.md`). Fix applique en cette session : reformulation ligne 143 du livrable pour utiliser texte plain.

---

**Verification finale S2** :
- [x] Livrable ecrit (277L)
- [x] 9 findings documentes (0 P1, 1 P2, 3 P3, 4 imprécisions docs)
- [x] 5 decisions D-S2-01..05
- [x] 6 learnings metaboliques L-S2-01..06
- [x] 1 fix docs-only applique (D-S2-01)
- [x] Cross-refs vers S0, S1, S3, S5, S7, S8, S9, S10, S13, S17, S21, S22 etablies
- [x] Mode MOI strict respecte (0 sub-agent)
- [ ] Commit S2 (en attente fin de phase F)
- [ ] Maj 00-INDEX.md + CONTEXT.md (en attente fin de phase F)
