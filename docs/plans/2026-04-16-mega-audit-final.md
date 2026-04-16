---
id: 2026-04-16-mega-audit-final
title: 🪐 Méga Audit Final Foundation OS (16-04-2026)
created: 2026-04-16
status: planning
phases_total: 10
estimated_duration: 4h
decision_ref: null
---

# 🪐 Méga Audit Final Foundation OS

> **For agentic workers:** ce plan est auto-suffisant. Tu n'as PAS besoin du contexte de la conversation précédente. Tout est ici. Lis CLAUDE.md + ce fichier avant d'exécuter.

**Contexte** : Audit exhaustif du 2026-04-16 couvrant 194 fichiers .md du projet. 5 agents opus ont audité : scripts/hooks/CI, wiki/graph, docs/commands/agents, routines/sessions, tags/catégorisation. Findings vérifiés après correction (fantômes wiki invalidés car vault = racine projet).

**Objectif** : Corriger les 63 findings vérifiés + implémenter 9 innovations + journaliser la session. Zéro régression.

**Baseline** : DEGRADED (0 critical, 4 warning pré-existants), Wiki SAIN (40 pages, 5 domaines).

**Protocole anti-régression** :
- `bash scripts/health-check.sh` AVANT et APRÈS chaque phase
- Si verdict passe de DEGRADED → BROKEN : `git checkout .` et stop
- Commit après chaque phase (rollback chirurgical possible)
- Test unitaire de chaque script modifié

---

## DÉJÀ FAIT CETTE SESSION (ne pas re-exécuter)

> **IMPORTANT pour agentic workers** : Ces 7 commits sont déjà sur main. Ne PAS refaire.

| Commit | Résumé |
|--------|--------|
| `39cff18` | fix(wiki): align scripts sur index-wiki.md (ex index.md) — wiki BROKEN → SAIN |
| `6cb443a` | feat(wiki): audit mapping Obsidian — 29 findings, 5 phases, +173 wikilinks, 5 concepts créés |
| `bc02d7a` | docs(os): session-start/end/cockpit alignés état OS actuel — 14 sections brief |
| `4ea4b0c` | fix(wiki): tools-fo — Void Glass + design-system-components (Finding 6 complet) |
| `9144c83` | fix(wiki): Finding 1 phantômes + archive plan audit mapping done |
| `b94e428` | fix(wiki): index-wiki stats sync (27→35 pages) + CONTEXT 6→5 sessions |

**Décisions prises cette session (à documenter Phase 2)** :
- Convention nommage wiki = option (a) garder les espaces (Kevin validé)
- Vault Obsidian = racine projet (Kevin configuré)
- Tags couleurs Obsidian = 5 groupes configurés par Kevin (concept bleu, entity vert, source orange, meta gris, docs/core rouge)

---

## Phase 0 — Journalisation session (5 min, risque ZÉRO)

**Objectif** : CONTEXT.md, hot.md, wiki/log.md, sessions-recent.md reflètent le travail fait CETTE session.

### 0.1 CONTEXT.md Cap : mettre à jour chiffres et prochaine action

Remplacer la section Cap **Direction** par :
```
**Direction** : Foundation OS = OS de travail + second-brain knowledge unifié + autopilote 14 routines. Wiki Obsidian opérationnel (40 pages, 762+ wikilinks, graph connecté, 9 groupes couleurs). Neuroplasticité active (4 réflexes, 3 pages meta). Audit mapping 100% DONE. Méga audit final planifié (63 findings + 9 innovations).
```

Remplacer **Prochaine action** par :
```
**Prochaine action** :
  - **Exécuter méga audit final** : `docs/plans/2026-04-16-mega-audit-final.md` (8 phases, ~3h30).
  - **Créer 14 routines Desktop** : prompts dans `wiki/meta/routines-setup.md` (Kevin dans UI Desktop).
  - **Decision Phase 5** : Finance / Sante / Trading — lequel lancer ?
```

### 0.2 CONTEXT.md "En attente Kevin" : retirer items faits

Retirer :
- "Configurer tags couleurs Obsidian" (FAIT par Kevin)

Garder :
- Test manuel DS composants (46 ui Storybook)
- Validation workflow Desktop (/cockpit + /plan-os)
- Decision Phase 5
- Activer Email confirmations Supabase
- OMC update v4.12.0

### 0.3 CONTEXT.md Decisions : ajouter 2 décisions

Ajouter dans la table Decisions :
```
| D-NAMING-02 Convention nommage wiki espaces | 2026-04-16 | Wiki concepts/entities gardent espaces dans noms fichiers (Obsidian natif). Kebab-case pour sources/meta. Pas de renommage massif. |
| D-VAULT-01 Obsidian vault = racine projet | 2026-04-16 | Vault Obsidian configuré sur `/Users/kevinnoel/foundation-os/` (pas juste wiki/). Tous les .md du repo visibles dans graph. 9 groupes couleurs (5 tags + 4 path:). |
```

### 0.4 wiki/hot.md : mettre à jour

Réécrire les sections :
- **Last Updated** : 2026-04-16 : Audit mapping DONE + méga audit final planifié
- **Recent Changes** : ajouter les 7 commits de cette session
- **Active Threads** : retirer "Phase 8 brief v11" (DONE), ajouter "Méga audit final 8 phases"
- **Next Action** : Exécuter `docs/plans/2026-04-16-mega-audit-final.md` Phase 1-8

### 0.5 wiki/log.md : loguer opérations audit

Ajouter section :
```
## 2026-04-16

### Audit Mapping Obsidian (plan `docs/plans/2026-04-16-audit-mapping-obsidian.md` — DONE, archivé)

- **Phase 1** : orphelins connectés (routines-guardrails, routines-setup), log.md header, tools-fo enrichi, source wiki-adoption ajoutée
- **Phase 2** : 26 wikilinks dans 12 fichiers (CLAUDE/CONTEXT/README + 8 "Voir aussi" docs/core/)
- **Phase 3** : frontmatter related: aligné sur 8 pages
- **Phase 4** : overview enrichi, 5 domaines cross-linkés, Void Glass connecté, map stats à jour
- **Phase 5** : 5 concepts créés (Foundation OS, Core OS, Brief v11, Neuroplasticité, TDAH workflow) + tags harmonisés
- **Finding 1** : 6 phantômes retirés ([[A]], [[B]], [[X]], [[page]], [[file]])
- **Finding 6** : tools-fo complété (Void Glass + design-system-components)
- **Stats sync** : index-wiki 27→35 pages, CONTEXT 6→5 sessions

Résultat : 589→762+ wikilinks, 35→40 pages, plan archivé `.archive/plans-done-260416/`

### Session commands alignées

- session-start.md : brief 12→14 sections (HOT + WIKI + SYNC)
- session-end.md : Tour 3 index-wiki stats + plan execution log, brief 7 sections
- cockpit.md : wiki/hot.md read ajouté

### Scripts corrigés

- wiki-health.sh : index.md → index-wiki.md (fix BROKEN → SAIN)
- drift-detector.sh : index.md → index-wiki.md
- knowledge.md : index.md → index-wiki.md

### Méga audit final

- 5 agents opus : scripts/hooks/CI, wiki/graph, docs/commands/agents, routines/sessions, tags/catégorisation
- 63 findings vérifiés (11 bullshit retirés post-vérification vault=root)
- 9 innovations proposées
- Plan créé : `docs/plans/2026-04-16-mega-audit-final.md` (8 phases, 721 lignes)
```

### 0.6 wiki/meta/sessions-recent.md : append cette session

Ajouter en TÊTE (avant la session 2026-04-15/16 existante) :
```
## 2026-04-16 · Audit Mapping + Méga Audit Final

**Durée** : 1 session, ~3h
**Scope** : Audit mapping Obsidian 29 findings (DONE) + méga audit final 63 findings + 9 innovations (plan créé)

**Decisions** :
- D-NAMING-02 : convention nommage wiki = garder espaces
- D-VAULT-01 : vault Obsidian = racine projet, 9 groupes couleurs

**Pages wiki créées** :
- Concepts : [[Foundation OS]], [[Core OS]], [[Brief v11]], [[Neuroplasticite]], [[TDAH workflow]]

**Commits** : 7 (39cff18, 6cb443a, bc02d7a, 4ea4b0c, 9144c83, b94e428, + plan commit)

**Threads ouverts** :
- Exécuter méga audit final (docs/plans/2026-04-16-mega-audit-final.md)
- Créer 14 routines Desktop (Kevin UI)
- Clean 3 worktrees legacy
- Decision Phase 5 module
```

Si sessions-recent.md dépasse 5 sessions, supprimer la plus ancienne (DS Rebuild 2026-04-14).

### Vérification Phase 0
```bash
wc -l CONTEXT.md
# Attendu : < 150 lignes
bash scripts/drift-detector.sh 2>&1 | grep "Sessions"
# Attendu : Sessions (5/5)
```

### Commit Phase 0
```bash
git add CONTEXT.md wiki/hot.md wiki/log.md wiki/meta/sessions-recent.md
git commit -m "docs(os): session journalisee — Cap+hot+log+sessions MAJ, 2 decisions (D-NAMING-02, D-VAULT-01)"
```

---

## Phase 1 — Graph Obsidian (5 min, risque ZÉRO)

**Objectif** : Tous les nœuds du graph ont une couleur logique. 0 fantôme.

### 1.1 Ajouter tag `meta` aux 5 domain-indexes

Pour chaque fichier ci-dessous, ajouter `  - meta` dans la section `tags:` du frontmatter YAML (garder les tags existants).

**wiki/domains/design/index-design.md** :
```yaml
# AVANT
tags:
  - domain-index
  - design

# APRÈS
tags:
  - domain-index
  - design
  - meta
```

Répéter pour :
- `wiki/domains/dev/index-dev.md` → ajouter `- meta`
- `wiki/domains/finance/index-finance.md` → ajouter `- meta`
- `wiki/domains/sante/index-sante.md` → ajouter `- meta`
- `wiki/domains/trading/index-trading.md` → ajouter `- meta`

### 1.2 Ajouter tag `meta` aux 2 templates sans groupe

- `wiki/meta/templates/comparison.md` : ajouter `- meta` dans tags
- `wiki/meta/templates/question.md` : ajouter `- meta` dans tags

### 1.3 Retirer 2 refs de plans archivés dans foundation-os-map.md

Ouvrir `wiki/meta/foundation-os-map.md`. Dans la section "### Plans (docs/plans/)", retirer :
```
- [[2026-04-15-wiki-obsidian-adoption]] — Plan adoption wiki Obsidian (D-WIKI-01, 12 phases, 4050 lignes)
- [[2026-04-16-audit-mapping-obsidian]] — Plan audit mapping Obsidian (29 findings, 5 phases)
```
Remplacer par :
```
- [[_template-plan]] — Template plan Foundation OS
```
(Les plans archivés sont dans `.archive/` et ne doivent plus apparaître dans le graph actif.)

### 1.4 Corriger stat Meta dans index-wiki.md

Ouvrir `wiki/index-wiki.md`. Dans la table Statistiques :
```
| Meta | 6 |   →   | Meta | 10 |
```
(10 = foundation-os-map + thinking + sessions-recent + lessons-learned + routines-guardrails + routines-setup + hot + index-wiki + log + overview)

### 1.5 Ajouter frontmatter related: à wiki/log.md

Ouvrir `wiki/log.md`. Après le frontmatter existant, ajouter le champ `related:` :
```yaml
related:
  - "[[index-wiki]]"
  - "[[hot]]"
  - "[[overview]]"
  - "[[foundation-os-map]]"
```

### 1.6 Config Obsidian (ACTION KEVIN)

Kevin doit ajouter 4 groupes dans Obsidian Graph → Settings → Groups (en plus des 5 existants) :

| # | Query | Couleur | Couvre |
|---|-------|---------|-------|
| 6 | `path:docs/travaux-cowork` | Jaune | 20 fichiers cowork |
| 7 | `path:docs` | Violet | architecture, manifeste, plans, specs, index-doc, setup, decisions-log |
| 8 | `path:modules` | Cyan | app (8) + DS (55) |
| 9 | `path:.claude OR path:_bmad OR path:.raw` | Rose | agents, commands, config, plugins, raw sources |

Résultat : 21% → ~98% de nœuds colorés (seuls CLAUDE.md, CONTEXT.md, README.md restent non-colorés car à la racine sans path: matchable — acceptable car ce sont des fichiers pivot visuellement distincts).

Optionnel : dans Graph Settings → Filters, exclure `path:_bmad` si les 31 fichiers BMAD dormants polluent le graph.

### Vérification Phase 1
```bash
bash scripts/health-check.sh 2>&1 | grep "Verdict"
# Attendu : DEGRADED (pas BROKEN)
bash scripts/wiki-health.sh 2>&1 | grep "Verdict"
# Attendu : SAIN
```

### Commit Phase 1
```bash
git add wiki/
git commit -m "fix(wiki): graph Obsidian — 7 tags meta, 2 refs archivees retirees, stats corrigees"
```

---

## Phase 2 — Docs sync : compteurs et chemins (20 min, risque ZÉRO)

**Objectif** : Tous les chiffres hardcodés dans docs/ et fichiers racine reflètent la réalité.

### 2.1 Compteur outils : 97/98 → 109, 26 → 35 règles

Les valeurs réelles sont dans `docs/core/tools/index.json` (`"total_tools": 109`) et `docs/core/tools/routing.json` (35 règles).

| Fichier | Ligne approx. | Chercher | Remplacer par |
|---------|--------------|----------|---------------|
| `CLAUDE.md` | section "## Core OS" | `catalogue 98 outils` | `catalogue 109 outils` |
| `docs/core/tools.md` | ligne ~7 | `97 outils, 9 categories` | `109 outils, 9 categories` |
| `docs/core/tools.md` | ligne ~9 | `26 regles, 14 domaines` | `35 regles, 14 domaines` |
| `docs/core/cortex.md` | ligne ~9 | `26 regles couvrant 97 outils` | `35 regles couvrant 109 outils` |
| `CONTEXT.md` | Decisions D-TOOLS-01 | `98 outils documentes, routing etendu (26 regles)` | `109 outils documentes, routing etendu (35 regles)` |
| `docs/architecture.md` | ligne ~56 | `Catalogue 98 outils` | `Catalogue 109 outils` |
| `docs/index-documentation.md` | ligne ~81 | `Catalogue 98 outils` | `Catalogue 109 outils` |

**Vérification** : `grep -rn "97 outils\|98 outils" docs/ CLAUDE.md CONTEXT.md` → 0 résultat.

### 2.2 Tiers mémoire : 4 → 5

| Fichier | Chercher | Remplacer par |
|---------|----------|---------------|
| `CLAUDE.md` | `regle d'or 4 tiers` | `regle d'or 5 tiers` |
| `docs/core/architecture-core.md` | `4 tiers (session/contexte/reference/auto-memory)` | `5 tiers (session/contexte/auto-memory/reference/wiki)` |
| `docs/architecture.md` | `4 tiers persistance` | `5 tiers persistance (D-WIKI-01)` |
| `docs/index-documentation.md` | `4 tiers persistance` | `5 tiers persistance` |
| `.claude/agents/doc-agent.md` | `Protocole Communication (4 tiers)` | `Protocole Communication (5 tiers)` |
| `docs/decisions-log.md` | chercher `4 tiers` | remplacer par `5 tiers` |
| `CONTEXT.md` D-COM-01 | `4 tiers persistance` | `5 tiers persistance` |

Pour `docs/manifeste.md` : ce fichier est fortement stale (dit "4 piliers Core OS", "Memory" au lieu de "Communication"). Corrections :
- "4 piliers Core OS" → "7 modules Core OS"
- Toute mention "Memory" comme module → "Communication"
- Toute mention "4 tiers" → "5 tiers"
- Ajouter Knowledge, Planner, Worktrees dans la table/description des modules si absents

**Vérification** : `grep -rn "4 tiers" docs/ CLAUDE.md CONTEXT.md .claude/agents/ --include="*.md" | grep -v ".archive"` → 0 résultat (sauf historique dans communication.md section Migration qui dit "ancien: 4 tiers" = OK).

### 2.3 Modules Core OS : 6 → 7

| Fichier | Chercher | Remplacer par |
|---------|----------|---------------|
| `docs/core/architecture-core.md` | header `6 modules + 1 orchestrateur` | `7 modules + 1 orchestrateur` |
| `docs/architecture.md` | table Core OS modules | ajouter ligne Knowledge si absente |

### 2.4 Sections brief : 11 → 14

| Fichier | Chercher | Remplacer par |
|---------|----------|---------------|
| `CLAUDE.md` | `11 sections cadres box-drawing` | `14 sections cadres box-drawing (post-D-WIKI-01)` |
| `docs/specs/2026-04-10-cockpit-design.md` | `11 sections` (si présent) | `14 sections` |

### 2.5 Chemins cassés

| Fichier | Ref cassée | Fix |
|---------|-----------|-----|
| `.claude/agents/dev-agent.md` | `docs/design-system.md` | → `modules/design-system/src/styles/tokens.css` (ou retirer la ref et mettre "tokens Void Glass dans modules/design-system/") |
| `CONTEXT.md` Cap | `docs/plans/2026-04-16-audit-mapping-obsidian.md` | Retirer cette ligne du Cap (plan DONE, archivé). Mettre à jour la Prochaine action. |
| `docs/core/tools.md` | `docs/core/tools/README.md` | → `docs/core/tools/README-tools-catalogue.md` |
| `docs/index-documentation.md` | `docs/plans/2026-04-15-migration-foundation-desktop.md` | Retirer (plan archivé) ou remplacer par ref archive |
| `docs/decisions-log.md` | `docs/design-system.md` | → `modules/design-system/` |
| `docs/travaux-cowork/COWORK-CONTEXT.md` | `docs/core/memory.md` | → `docs/core/communication.md` |

### 2.6 knowledge.md : double section "9"

`docs/core/knowledge.md` a deux sections numérotées 9. Renumeroter :
- Section "9. Limites / Hors scope" → garde 9
- Section "9. Maintenance" → renumeroter en **10**
- Section "10. Migration" → renumeroter en **11**

### Vérification Phase 2
```bash
grep -rn "97 outils\|98 outils" docs/ CLAUDE.md CONTEXT.md .claude/agents/ --include="*.md" | grep -v ".archive"
# Attendu : 0 résultat
grep -rn "4 tiers" docs/ CLAUDE.md CONTEXT.md .claude/agents/ --include="*.md" | grep -v ".archive" | grep -v "ancien"
# Attendu : 0 résultat (sauf section migration historique)
grep -rn "docs/design-system.md" docs/ .claude/ --include="*.md" | grep -v ".archive"
# Attendu : 0 résultat
bash scripts/health-check.sh 2>&1 | grep "Verdict"
# Attendu : DEGRADED (pas BROKEN)
```

### Commit Phase 2
```bash
git add CLAUDE.md CONTEXT.md docs/ .claude/agents/
git commit -m "fix(docs): sync compteurs — 109 outils, 5 tiers, 7 modules, 14 sections, 6 chemins corriges"
```

---

## Phase 3 — Commands session (10 min, risque BAS)

**Objectif** : session-start, session-end, cockpit et communication.md sont 100% synchronisés.

### 3.1 session-start.md : unifier IMPERATIF et Phase 1

Le bloc IMPERATIF (lignes 4-22) liste 9 tool calls. La Phase 1 body (lignes 30-48) re-liste les mêmes avec des numéros différents et ajoute "Build modules" (step 4) qui est redondant avec health-check.

**Action** : Dans Phase 1 body, retirer le step "4. **Build modules**" (health-check.sh fait déjà le build). Renumeroter les steps suivants. Ajouter un commentaire "Les tool calls IMPERATIF ci-dessus sont autoritaires. Cette section explique POURQUOI, pas QUOI."

### 3.2 session-end.md : fix double numérotation

Tour 1 a un step 5 (`wiki-health.sh`), Tour 2 a aussi un step 5 ("Verifier aucune todo in_progress"). Fix :
- Tour 2 step 5 → renumeroter en **6**
- Tour 2 step 6 → renumeroter en **7**

### 3.3 cockpit.md : ajouter wiki meta reads

Actuellement Tour 1 IMPERATIF a 5 steps. Ajouter après le step 2 (`Read wiki/hot.md`) :
```
> 3. `Read wiki/meta/sessions-recent.md` — memoire court terme
> 4. `Read wiki/meta/lessons-learned.md` — erreurs a ne pas repeter
```
Renumeroter les steps suivants (3→5, 4→6, 5→7).

### 3.4 communication.md : 7 sections brief clôture

`docs/core/communication.md` section 6.2 liste 6 sections. session-end.md en a 7 (ajout "PLANS TERMINES CETTE SESSION"). Aligner la spec :

Dans communication.md section 6.2, remplacer la liste des sections par :
```
1. **Entete** (double trait) : date + statut (DONE / CONCERNS / NEEDS_CONTEXT / BLOCKED)
2. **ETAT TECHNIQUE** : build/tests/health/refs/wiki-health
3. **CE QUI A ETE FAIT** : commits vulgarises + fichiers + decisions
4. **PLANS TERMINES CETTE SESSION** : plans archives cette session (si applicable)
5. **IDEES CAPTUREES** : reflexions/pistes sauvees dans CONTEXT.md
6. **CAP MIS A JOUR** : direction + prochaine action
7. **CONCERNS** (si != DONE) : description du blocage
```

### Vérification Phase 3
```bash
# Vérifier que session-start.md est parseable (pas de syntaxe cassée)
head -25 .claude/commands/session-start.md
head -25 .claude/commands/session-end.md
head -25 .claude/commands/cockpit.md
bash scripts/health-check.sh 2>&1 | grep "Verdict"
```

### Commit Phase 3
```bash
git add .claude/commands/ docs/core/communication.md
git commit -m "fix(os): commands session alignees — numbering, cockpit reads, communication 7 sections"
```

---

## Phase 4 — Routines (5 min, risque ZÉRO)

**Objectif** : Les 14 prompts de routine sont corrects et cohérents.

### 4.1 R3 titre horaire

`wiki/meta/routines-setup.md` ligne ~179 :
```
## Routine 3 — Consolidation Knowledge (hebdo dimanche 20h)
→
## Routine 3 — Consolidation Knowledge (hebdo dimanche 18h)
```

### 4.2 R8 titre horaire

Ligne ~446 :
```
## Routine 8 — Evolution & Auto-apprentissage (quotidien 20h)
→
## Routine 8 — Evolution & Auto-apprentissage (quotidien 21h)
```

### 4.3 R6 filename

Ligne ~383, dans le prompt R6 :
```
Mettre a jour docs/core/tools/README.md table resume
→
Mettre a jour docs/core/tools/README-tools-catalogue.md table resume
```

### 4.4 R8 fallback fichiers manquants

Dans le prompt R8 (ligne ~548-554), après la liste des 7 fichiers rapport à lire, ajouter :
```
Pour chaque fichier : si le fichier n'existe pas, noter "R[N] pas encore execute" et continuer.
Ne PAS creer le fichier, ne PAS signaler comme erreur.
```

### Vérification Phase 4
```bash
grep -n "dimanche 20h" wiki/meta/routines-setup.md
# Attendu : 0 résultat
grep -n "quotidien 20h" wiki/meta/routines-setup.md
# Attendu : 0 résultat
grep -n "tools/README.md" wiki/meta/routines-setup.md
# Attendu : 0 résultat (seulement README-tools-catalogue.md)
```

### Commit Phase 4
```bash
git add wiki/meta/routines-setup.md
git commit -m "fix(wiki): routines — R3/R8 horaires corriges, R6 filename, R8 fallback fichiers"
```

---

## Phase 5 — Scripts (15 min, risque MOYEN → tests obligatoires)

**Objectif** : Scripts fonctionnels, code mort retiré, CI correcte.

### 5.1 wiki-health.sh : bug BROKEN_LINKS (subshell pipe)

Fichier : `scripts/wiki-health.sh`, lignes 62-91.
Le `grep ... | while read` crée un subshell. `BROKEN_LINKS` incrémenté dans le subshell est perdu au retour.

**Fix** : Remplacer le pattern pipe par un comptage via fichier temporaire :
```bash
# AVANT (lignes 62-91) :
BROKEN_LINKS=0
for f in ...; do
  grep ... | while IFS= read -r link; do
    ...
    BROKEN_LINKS=$((BROKEN_LINKS + 1))  # ← perdu (subshell)
  done
done

# APRÈS :
BROKEN_LINKS_FILE=$(mktemp)
echo 0 > "$BROKEN_LINKS_FILE"
for f in ...; do
  while IFS= read -r link; do
    ...
    echo $(( $(cat "$BROKEN_LINKS_FILE") + 1 )) > "$BROKEN_LINKS_FILE"
  done < <(grep -oE '\[\[[^]|]+' "$f" 2>/dev/null | sed 's/\[\[//' | sort -u)
done
BROKEN_LINKS=$(cat "$BROKEN_LINKS_FILE")
rm -f "$BROKEN_LINKS_FILE"
```

**Test** :
```bash
bash scripts/wiki-health.sh 2>&1
# Vérifier que BROKEN_LINKS affiche un nombre réel (pas toujours 0)
```

### 5.2 ref-checker.sh : code mort wikilinks scan

Fichier : `scripts/ref-checker.sh`, lignes ~189-194.
Code après `exit 0`/`exit 1` jamais exécuté.

**Fix** : Supprimer les lignes 189-194 (dead code). Le scan wikilinks est déjà fait par wiki-health.sh.

### 5.3 CI : ci.yml test:e2e inexistant

Fichier : `.github/workflows/ci.yml`, job/step "A11y Gate".
`npm run test:e2e` n'existe pas dans `modules/design-system/package.json`.

**Options** :
- **(a)** Ajouter `"test:e2e": "npx playwright test"` dans `modules/design-system/package.json` (si Playwright est installé)
- **(b)** Retirer le step A11y Gate du CI (si pas de tests e2e actifs)

**Recommandation** : option (b) car Playwright n'est pas dans les deps actuelles. Le step échoue silencieusement. Le retirer est plus honnête.

### 5.4 CI : supernova-sync.yml workflow mort

Fichier : `.github/workflows/supernova-sync.yml`.
Trigger sur `modules/design-system/tokens/source/**` qui n'existe pas. Le workflow ne se lance jamais.

**Options** :
- **(a)** Retirer le workflow entier
- **(b)** Adapter le trigger path si les tokens sont ailleurs

**Recommandation** : option (b) — garder le workflow mais commenter le trigger, ajouter un commentaire `# TODO: adapter quand tokens/source/ sera créé`. C'est une infrastructure future, pas du dead code.

### 5.5 module-scaffold.sh : regex 3 colonnes

Fichier : `scripts/module-scaffold.sh`, lignes 121-126.
La regex Python attend `| Module | Status | Detail |` (3 cols) mais CONTEXT.md a `| Module | Status | Path | Detail |` (4 cols).

**Fix** : Mettre à jour la regex pour matcher 4 colonnes, et générer une ligne à 4 colonnes lors de l'ajout.

### Vérification Phase 5
```bash
bash scripts/wiki-health.sh 2>&1
# Vérifier que le Verdict est toujours SAIN et que BROKEN_LINKS affiche un vrai nombre
bash scripts/ref-checker.sh 2>&1 | head -5
# Vérifier pas d'erreur
bash scripts/health-check.sh 2>&1 | grep "Verdict"
# Attendu : DEGRADED (pas BROKEN)
```

### Commit Phase 5
```bash
git add scripts/ .github/workflows/
git commit -m "fix(scripts): wiki-health subshell bug, ref-checker dead code, CI e2e/supernova/scaffold"
```

---

## Phase 6 — Wiki frontmatter related: (15 min, risque ZÉRO)

**Objectif** : Le champ `related:` de chaque page wiki liste toutes les pages effectivement référencées dans le contenu.

### Méthode

Pour chaque page listée ci-dessous :
1. Lire le fichier
2. Extraire TOUS les `[[wikilinks]]` du contenu (hors frontmatter)
3. Comparer avec le champ `related:` actuel
4. Ajouter les manquants dans `related:`
5. NE PAS retirer les existants (related: peut avoir des refs supplémentaires)

### Pages à corriger (18 pages)

| Page | Liens manquants dans related: |
|------|------------------------------|
| `wiki/concepts/Foundation OS.md` | Compounding Knowledge, Hot Cache, foundation-os-desktop-migration, tools-foundation-os |
| `wiki/concepts/Brief v11.md` | TDAH workflow |
| `wiki/concepts/Core OS.md` | Foundation OS |
| `wiki/concepts/TDAH workflow.md` | Neuroplasticite |
| `wiki/concepts/Neuroplasticite.md` | Foundation OS |
| `wiki/concepts/LLM Wiki Pattern.md` | agricidaniel-claude-obsidian, karpathy-llm-wiki-pattern (dans sources: mais pas related:) |
| `wiki/concepts/Compounding Knowledge.md` | Foundation OS |
| `wiki/concepts/Hot Cache.md` | Foundation OS, Brief v11, Neuroplasticite |
| `wiki/entities/Obsidian.md` | Compounding Knowledge, Hot Cache |
| `wiki/entities/AgriciDaniel.md` | agricidaniel-claude-obsidian |
| `wiki/sources/agricidaniel-claude-obsidian.md` | Andrej Karpathy |
| `wiki/sources/session-2026-04-16-neuroplasticity-audit.md` | lessons-learned, sessions-recent, thinking |
| `wiki/overview.md` | LLM Wiki Pattern, Obsidian, foundation-os-map |
| `wiki/domains/design/index-design.md` | design-system-components, Obsidian |
| `wiki/domains/dev/index-dev.md` | foundation-os-desktop-migration, LLM Wiki Pattern, tools-foundation-os |
| `wiki/domains/finance/index-finance.md` | Compounding Knowledge |
| `wiki/domains/trading/index-trading.md` | Compounding Knowledge |
| `wiki/domains/dev/concepts/foundation-os-desktop-migration.md` | Obsidian, index-dev |

**Note** : Les 100+ paires bidirectionnelles (A→B mais pas B→A) seront progressivement fixées par la routine R3 Consolidation une fois qu'elle tourne. Cette phase corrige les `related:` frontmatter, pas les wikilinks dans le contenu.

### Vérification Phase 6
```bash
bash scripts/wiki-health.sh 2>&1 | grep "Verdict"
# Attendu : SAIN
```

### Commit Phase 6
```bash
git add wiki/
git commit -m "fix(wiki): frontmatter related: aligne sur 18 pages — prerequis R3 consolidation"
```

---

## Phase 7 — Innovations (1h30, risque ZÉRO sauf 7.5-7.7)

**Objectif** : 9 innovations implémentées, intégrées dans l'OS.

### 7.1 Script `wiki-suggest-links.sh` (30 min)

Créer `scripts/wiki-suggest-links.sh` :

```bash
#!/bin/bash
# wiki-suggest-links.sh — Suggère les wikilinks manquants dans wiki/
# Pour chaque page wiki, vérifie si des basenames d'autres pages sont
# mentionnés en texte brut sans [[wikilink]].
# Usage : bash scripts/wiki-suggest-links.sh
# Chainable dans routine R1 Wiki Maintenance.

set -uo pipefail
cd "$(git rev-parse --show-toplevel)"

# 1. Collecter tous les basenames de pages wiki
PAGES=()
while IFS= read -r f; do
  bn=$(basename "$f" .md)
  PAGES+=("$bn")
done < <(find wiki/ -name "*.md" -not -path "*/meta/templates/*" -not -name "_index.md")

SUGGESTIONS=0

# 2. Pour chaque page, chercher les basenames non-linkés
for f in $(find wiki/concepts wiki/entities wiki/sources wiki/domains -name "*.md" 2>/dev/null); do
  content=$(cat "$f")
  for page in "${PAGES[@]}"; do
    [ ${#page} -le 3 ] && continue  # ignorer noms courts (hot, log)
    bn_file=$(basename "$f" .md)
    [ "$bn_file" = "$page" ] && continue  # pas se linker soi-même
    # Vérifier : le basename apparaît dans le contenu MAIS PAS comme [[wikilink]]
    if echo "$content" | grep -qi "$page" 2>/dev/null; then
      if ! echo "$content" | grep -q "\[\[.*${page}" 2>/dev/null; then
        echo "SUGGEST: $f → [[${page}]]"
        SUGGESTIONS=$((SUGGESTIONS + 1))
      fi
    fi
  done
done

echo ""
echo "Total suggestions : $SUGGESTIONS"
```

Après création, enregistrer dans `docs/core/tools/index.json` et `docs/core/tools.md`.

### 7.2 Routine execution tracker dans brief (5 min)

Dans `.claude/commands/session-start.md`, Phase 1, ajouter un step :
```
N. **Routines health** : `git log --grep="routine" --since="7 days ago" --oneline | wc -l` → nombre de commits routine cette semaine. Afficher dans brief cadre SANTÉ : "Routines: N commits/7j".
```

### 7.3 Wiki freshness alerts dans brief (15 min)

Dans `.claude/commands/session-start.md`, Phase 3, dans le cadre WIKI, ajouter :
```
Si des pages wiki (concepts/entities/sources) n'ont pas été modifiées depuis > 30 jours :
afficher "⚠ N stale: pagename (Xj), ..." dans le cadre WIKI (max 3 pages).
Source : `git log -1 --format="%cr" -- "wiki/concepts/Page.md"` pour chaque page.
```

### 7.4 Domain coverage dashboard dans index-wiki.md (15 min)

Ajouter dans `wiki/index-wiki.md` après la section Statistiques :

```markdown
## Couverture par domaine

| Domaine | Concepts | Sources | Pages total | Maturité |
|---------|----------|---------|-------------|----------|
| Trading | 0 | 0 | 1 (index) | 🔴 Vide |
| Finance | 0 | 0 | 1 (index) | 🔴 Vide |
| Santé | 0 | 0 | 1 (index) | 🔴 Vide |
| Design | 1 | 0 | 2 | 🟡 Seed |
| Dev | 1 | 0 | 3 | 🟡 Seed |
| Cross-domain | 9 | 4 | 24 | 🟢 Actif |
```

Mis à jour par routine R1 ou manuellement en session-end.

### 7.5 Session DNA (30 min, risque ZÉRO)

Dans `.claude/commands/session-end.md`, Tour 3, ajouter un step :
```
N. Append session DNA dans `wiki/meta/session-dna.md` (le créer si absent) :
Format YAML :
- date: YYYY-MM-DD
  type: [planning|coding|audit|research|debug]
  zones: [wiki, docs, scripts, modules/app, modules/ds]
  commits: N
  files_touched: N
  decisions: N
  pages_wiki_created: N
  wikilinks_delta: +/-N
```

### 7.6 Knowledge health métriques wiki (30 min)

Créer `scripts/wiki-metrics.sh` qui calcule :
- Connectivité moyenne (wikilinks sortants / page)
- Ratio orphelins (pages sans lien entrant / total)
- Fraîcheur moyenne (jours depuis dernière modif)
- Bidirectionnalité (% paires A↔B complètes)

Affichable dans brief cadre WIKI si `WIKI_METRICS=1` (opt-in).

### 7.7 Réflexe wiki reminder hook (15 min, risque BAS)

Créer `scripts/hooks/wiki-recall-reminder.sh` :
```bash
#!/bin/bash
# Si le fichier édité/lu est dans un domaine wiki, rappeler de lire l'index du domaine
FILE="$1"
for domain in trading finance sante design dev; do
  if echo "$FILE" | grep -qi "$domain"; then
    if [ -f "wiki/domains/$domain/index-$domain.md" ]; then
      echo "⚠ wiki/domains/$domain/ existe — considérer lecture avant réponse"
    fi
  fi
done
```

Configurer dans `.claude/settings.local.json` comme hook PreToolUse sur Read/Write/Edit (opt-in).

**Limite honnête** : C'est un RAPPEL texte, pas une garantie de lecture. Claude peut l'ignorer. Mais c'est mieux que la règle comportementale seule.

### 7.8 Self-healing suggestions (15 min, risque BAS)

Étendre `scripts/drift-detector.sh` avec flag `--suggest` :
Quand un drift est détecté, au lieu de juste l'afficher, écrire dans `.omc/suggestions.md` (fichier OMC, PAS fichier projet — respecte la règle "pas de fichier sans Kevin") :
```
## Suggestion 2026-04-16
- CONTEXT.md sessions > 5 : compresser la 6ème
- wiki/index-wiki.md : Total pages 27 vs 35 filesystem
```

session-start lit ce fichier et l'affiche dans le cadre ATTENTION si non-vide.

### 7.9 Context momentum (15 min, risque ZÉRO — opt-in)

Dans session-start.md, après Tour 1, ajouter un step conditionnel (opt-in via `SMART_CONTEXT=1`) :
```
Si SMART_CONTEXT=1 :
  zones=$(git log -5 --name-only --format="" | grep -oE "^[^/]+" | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
  Si zones = "wiki" → Read wiki/meta/thinking.md en priorité
  Si zones = "modules" → skip wiki meta reads non-essentiels
```

### Vérification Phase 7
```bash
# Test script wiki-suggest-links
bash scripts/wiki-suggest-links.sh 2>&1 | tail -5
# Attendu : suggestions avec "SUGGEST:" ou "Total suggestions : N"

# Test wiki-metrics si créé
bash scripts/wiki-metrics.sh 2>&1

# Health global
bash scripts/health-check.sh 2>&1 | grep "Verdict"
# Attendu : DEGRADED (pas BROKEN)
```

### Commit Phase 7
```bash
git add scripts/ .claude/commands/ wiki/index-wiki.md wiki/meta/ docs/core/tools*
git commit -m "feat(os): 9 innovations — suggest-links, routine tracker, freshness, coverage, session DNA, metrics, wiki-recall, self-heal, momentum"
```

---

## Phase 8 — Session-end (via `/session-end`)

> Cette phase N'EST PAS exécutée manuellement dans ce plan.
> Elle est couverte par le protocole `/session-end` standard à la fin de la session d'exécution.
> `/session-end` met à jour : CONTEXT.md (Sessions récentes, Cap, Métriques), hot.md, sessions-recent.md, thinking.md, lessons-learned.md, log.md.

---

---

## Phase 9 — Worktree cleanup (5 min, risque ZÉRO)

**Objectif** : Nettoyer les 3 worktrees legacy qui polluent `git worktree list`.

### 9.1 Identifier les worktrees

```bash
git worktree list
```

Worktrees attendus :
- `/Users/kevinnoel/foundation-os` (main) — garder
- `.claude/worktrees/bold-newton` (claude/bold-newton) — session courante
- `.claude/worktrees/sleepy-ellis` (claude/sleepy-ellis) — legacy, probablement vide
- `.claude/worktrees/suspicious-khayyam` (claude/suspicious-khayyam) — legacy, probablement vide

### 9.2 Vérifier fichiers non-commités dans chaque worktree

```bash
cd .claude/worktrees/sleepy-ellis && git status --short 2>/dev/null | wc -l
cd .claude/worktrees/suspicious-khayyam && git status --short 2>/dev/null | wc -l
```

Si 0 fichiers non-commités → safe to remove.
Si fichiers non-commités → STOP, lister, demander Kevin.

### 9.3 Vérifier si branches sont mergées dans main

```bash
git branch --merged main | grep -E "sleepy-ellis|suspicious-khayyam"
```

Si mergées → safe. Si non-mergées → vérifier si des commits uniques existent (`git log main..claude/sleepy-ellis --oneline`).

### 9.4 Cleanup (AVEC VALIDATION KEVIN)

Pour chaque worktree safe :
```bash
git worktree remove .claude/worktrees/sleepy-ellis --force
git branch -d claude/sleepy-ellis
git worktree remove .claude/worktrees/suspicious-khayyam --force
git branch -d claude/suspicious-khayyam
```

Pour bold-newton (session courante) :
- NE PAS supprimer pendant qu'on y travaille
- Après merge final dans main, depuis main :
```bash
git worktree remove .claude/worktrees/bold-newton --force
git branch -d claude/bold-newton
```

### Vérification Phase 9
```bash
git worktree list
# Attendu : uniquement main (+ bold-newton si pas encore nettoyé)
```

### Commit Phase 9
Pas de commit (pas de fichier modifié, juste cleanup git).

---

## Phase 10 — Vérification finale (5 min)

### 10.1 Health check complet
```bash
bash scripts/health-check.sh 2>&1
# Attendu : DEGRADED (0 critical, mêmes 4 warnings qu'avant)
# Si nouveau warning → investiguer
```

### 10.2 Wiki health
```bash
bash scripts/wiki-health.sh 2>&1
# Attendu : SAIN
```

### 10.3 Drift detector
```bash
bash scripts/drift-detector.sh 2>&1
# Attendu : 0 drift (branche legacy nettoyée Phase 9)
```

### 10.4 Wikilinks count
```bash
grep -roh '\[\[' wiki/ docs/ CLAUDE.md CONTEXT.md README.md 2>/dev/null | wc -l
# Attendu : > 762 (baseline post-audit mapping)
```

### 10.5 Zéro régression
```bash
npm run build -w modules/app 2>&1 | tail -3
# Attendu : build OK
cd modules/app && npx vitest run 2>&1 | tail -5
# Attendu : 19/19 tests pass
```

### 10.6 Graph Obsidian (ACTION KEVIN)
Ouvrir Obsidian → Graph View → vérifier :
- 9 groupes couleurs actifs
- Clusters logiques par domaine/type
- 0 nœud blanc (sauf CLAUDE.md, CONTEXT.md, README.md = pivot)
- foundation-os-map reste le hub central mais plus de fantômes

---

## Risques

| Risque | Phase | Mitigation |
|--------|-------|------------|
| CONTEXT.md format table cassé | 0, 2 | Lire avant, vérifier après, wc -l < 150 |
| hot.md/sessions-recent format | 0 | Lire avant d'écrire |
| Casser format table Markdown en éditant docs | 2 | Lire avant, vérifier après |
| Casser parsing commands Claude Code | 3 | Tester manuellement après |
| wiki-health.sh subshell fix introduit bug | 5 | Test unitaire du script |
| CI workflow modifié | 5 | Review diff avant push |
| Nouveau script wiki-suggest-links faux positifs | 7 | Le script SUGGÈRE, ne modifie rien |
| Hook wiki-recall trop agressif | 7 | Opt-in via variable env |
| Worktree remove perd du travail | 9 | Vérifier status + merged AVANT remove |

## Résumé quantitatif

| Métrique | Valeur |
|----------|--------|
| Findings corrigés | 63 |
| Décisions documentées | 2 (D-NAMING-02, D-VAULT-01) |
| Fichiers modifiés estimés | ~50 |
| Scripts créés | 3 (wiki-suggest-links, wiki-metrics, wiki-recall-reminder) |
| Innovations implémentées | 9 |
| Worktrees nettoyés | 2-3 |
| Commits prévus | 10 (1 par phase) |
| Temps estimé total | ~4h |
| Risque régression | Contrôlé (health-check par phase) |

## Execution log

- [ ] Phase 0 — Journalisation session (5 min)
- [ ] Phase 1 — Graph Obsidian (5 min)
- [ ] Phase 2 — Docs sync compteurs et chemins (20 min)
- [ ] Phase 3 — Commands session (10 min)
- [ ] Phase 4 — Routines (5 min)
- [ ] Phase 5 — Scripts (15 min)
- [ ] Phase 6 — Wiki frontmatter related: (15 min)
- [ ] Phase 7 — Innovations (1h30)
- [ ] Phase 8 — CONTEXT.md session-end (fait par /session-end)
- [ ] Phase 9 — Worktree cleanup (5 min)
- [ ] Phase 10 — Vérification finale (5 min)
