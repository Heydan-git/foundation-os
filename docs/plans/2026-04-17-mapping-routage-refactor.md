---
id: 2026-04-17-mapping-routage-refactor
title: "🪐 Audit mapping + refactor radical OS (17-04-2026)"
created: 2026-04-17
status: draft
phases_total: 15
estimated_duration: 10h
sessions_planned: 3
---

# 🪐 Audit mapping + refactor radical OS (17-04-2026)

> **ANTI-COMPACTAGE** : chaque phase est AUTONOME. Tout futur Claude (meme compacte) reprend ce plan SEUL et sait exactement : ou on en est, ce qui a ete fait, ce qui reste, l'etat attendu, et la commande exacte a executer. Format 6 elements par phase (memoire `feedback_plans_ultra_detailles.md`, D-LEVELUP-02).
>
> **AU DEMARRAGE D'UNE NOUVELLE SESSION** : lire d'abord ce plan INTEGRAL + l'Execution log (bas de fichier) pour savoir ou on en est. Consulter aussi `docs/audits/2026-04-17-mapping-routage-audit/rapport.md` (rapport d'audit ecrit Phase 1) pour le detail des drifts.

## Context

Kevin demande (2026-04-17) un audit massif + refactor radical du **cerveau** Foundation OS : mapping, indexage, nommage, tags, regroupements, routes de lecture, noeuds logiques, autoroutes de reflexion, references, articulation globale, memoire 5 tiers. Objectif fonctionnel : SessionStart qui lit **les bons noeuds au bon moment**, budget tokens equivalent (~45k) mais plus intelligent, deterministe (pas contextuel). Scope : **cerveau uniquement** (CLAUDE + CONTEXT + docs/core + wiki + commands + agents + scripts + memory + .obsidian/graph.json) — **pas les modules/app et modules/design-system** (code applicatif), **pas le contenu .archive/** (juste verifier les refs qui pointent dedans).

**Pourquoi maintenant** : l'OS a grossi vite (adoption wiki D-WIKI-01 2026-04-15, mega audit 2026-04-16, audit v2 S1-S3 2026-04-17, cleanup drifts B+E 2026-04-17). Chaque iteration a laisse des drifts localises dans le mapping/navigation. L'audit v2 S3 a corrige la FONCTION cognitive (6 mecanismes auto-gouvernes) mais n'a pas touche au mapping/routage — c'est le perimetre manquant.

**Probleme structurel detecte (audit exhaustif 128 fichiers lus ligne par ligne, 2026-04-17)** : 15 drifts / problemes repartis sur 13 axes fonctionnels. Voir section Findings ci-dessous. Le probleme racine : **pas d'enforcement automatique** des conventions (routing Cortex decoratif, tier arbitral non-enforce, 4 reflexes neuroplasticite manuels) + **duplication structurelle** (5 points de verite pour les stats wiki + 4 journals redondants + 3 sources verite counts).

**Intention Kevin consolidee** : refactor **radical** (option B3 — renommage, restructuration, fusion/split, suppression pages orphelines). Suppression pure des categories mortes (comparisons/, questions/, canvases/). Marquage `[!placeholder]` des domains Phase 5 vides (reversible). SessionStart deterministe. 1 source verite par information. Suppression hubs surdimensionnes au profit de navigation 2 niveaux.

**Outcome vise** : un cerveau Foundation OS ou **(a)** SessionStart lit ~5-7 fichiers deterministes (CONTEXT + hot + sessions-recent + lessons-learned + git + health + plans) pour ~35-45k tokens mais avec garantie que ces fichiers sont DENSES et A JOUR ; **(b)** le graph Obsidian est un mesh connecte (pas une etoile fragile via foundation-os-map a 81 wikilinks) ; **(c)** chaque info vit dans UN seul tier avec pointeurs explicites ; **(d)** les categories mortes sont supprimees, les domains Phase 5 marques placeholder ; **(e)** les 4 journals sont fusionnes en 2 ; **(f)** les counts sont une source unique regeneree par script.

**Hors scope strict** : **modules/app/\***, **modules/design-system/\***, le **contenu** de .archive/ (juste refs), les SQL migrations Supabase, les GitHub Actions workflows, le code JavaScript/TypeScript (sauf si scripts bash touches = exception). Decision Phase 5 modules (Finance/Sante/Trading) **reportee**.

## Findings (audit 2026-04-17, 128 fichiers lus)

> Preuve brute + detail par axe : `docs/audits/2026-04-17-mapping-routage-audit/rapport.md` (ecrit Phase 1).
> Resume ci-dessous pour navigation rapide.

### Top 15 drifts / problemes

| # | Axe | Finding | Gravite |
|---|-----|---------|---------|
| F1 | Routage SessionStart | `/cockpit` Tour 1 ≠ `/session-start` Tour 1 (5 vs 8 reads, divergence) | 🟡 |
| F2 | Routage SessionStart | `session-start-wiki.sh` tronque `hot.md` a `head -60` (fichier 96L → tronque) | 🟡 |
| F3 | Routage SessionStart | Double appel `drift-detector` : hook + health-check chain | 🟡 |
| F4 | Mapping | `wiki/meta/foundation-os-map.md` = 81 wikilinks = hub etoile fragile redondant avec `index-wiki` + sous-indexes | 🔴 |
| F5 | Mapping | `wiki/meta/index-app.md` : 7 wikilinks casses vers `modules/app/data/*` (archives) | 🔴 |
| F6 | Mapping | `design-system-components.md` wikilinks `[[01-button]]..[[46-carousel]]` resolvent hors vault `wiki/` | 🟡 |
| F7 | Tags | `graph.json` : 3 paires couleurs dupliquees (`tag:#core-os`=`path:docs/core`, `tag:#cowork`=`path:docs/travaux-cowork`, `tag:#app`=`path:modules`) | 🟡 |
| F8 | Counts | 4 sources verite pour pages wiki (counts.md=50, hot.md=48, index-wiki=45, wiki-health=50) | 🔴 |
| F9 | Journals | 4 journals redondants : `log.md` + `sessions-recent.md` + `session-dna.md` + `session-patterns.md` | 🟡 |
| F10 | Memoires | `project_structure.md` obsolete ("Storybook 8", "tokens DTCG") | 🟡 |
| F11 | Memoires | `project_audit_v2_s3_handoff.md` status:active mais S3 DONE | 🟡 |
| F12 | Memoires | `tools-foundation-os.md` wiki : "26 tools" vs "109 tools" + "177+ points" bullshit | 🟡 |
| F13 | Memoires | `feedback_tout_automatique.md` meta-duplique 30% contenu des 7 memoires pointees | 🟢 |
| F14 | Domaines | Trading/Finance/Sante indexes = 100% squelettes vides (3 nodes isoles graph) | 🟡 |
| F15 | Categories | `wiki/comparisons/` + `wiki/questions/` + `wiki/canvases/` = 0 pages (scaffold jamais utilise) | 🟢 |

### Root cause

- **Croissance rapide** + iterations successives + pas de re-alignement global = drifts localises
- **Pas d'enforcement auto** : routing Cortex + tier test arbitral + 4 reflexes = discipline manuelle qui drift
- **Duplication structurelle** : 5 points verite pour stats, 4 journals, 3 sources counts
- **Audit v2 S3 a traite FONCTION, pas MAPPING** : c'est le gap qu'on comble ici

## Phases (sessions courtes, anti-monolithe)

### Session A (~3h) — Sources verite + Navigation

Phases 1-5. But : rapport d'audit + unification des sources verite + navigation 2 niveaux + clean graph colors.

### Session B (~4h) — Rationalisation structure

Phases 6-11. But : fusion journals, SessionStart optimise, nettoyage memoires, domains/categories rationalises, wikilinks DS hors-vault.

### Session C (~3h) — Tests + Docs sync + Archive

Phases 12-15. But : enforcement decide (DROP), tests end-to-end, docs sync, archive rapport.

---

## Phase 1 — Rapport audit ecrit (~1h30) [Session A]

**Objectif** : produire `docs/audits/2026-04-17-mapping-routage-audit/rapport.md` (document de reference 13 axes, 15 findings, preuves, gravite, commandes verification). Sert de base a toutes les phases suivantes + archive historique.

### Pre-conditions verifiables

```bash
# Branche de travail propre
git branch --show-current                    # → claude/keen-mahavira-a1664e (worktree)
git status --short                           # → vide ou .omc/project-memory.json seul
# Dossier cible doit pouvoir etre cree
ls docs/audits/ 2>/dev/null                  # → "No such file" OK, sera cree
# Health-check baseline
bash scripts/health-check.sh 2>&1 | tail -3  # → Verdict : SAIN
```

### Etat repo attendu au debut de Phase 1

- Branche courante : `claude/keen-mahavira-a1664e` (worktree Desktop, sync main HEAD `9a60cc7`)
- Dernier commit : `9a60cc7 merge: session 2026-04-17 B+E (drifts P1-P3 Phase 7-9 + legacy refs)`
- `docs/audits/` : inexistant (sera cree cette phase)
- Counts wiki : 50 physiques / 45 fonctionnelles (selon counts.md) ou 48/43 (selon hot.md) — INCOHERENCE ATTENDUE (c'est F8 qu'on corrige en Phase 2)
- Health-check : SAIN (0 critical, 0 warning)

### Actions atomiques

1. **Creer dossier audit** :
   ```bash
   mkdir -p docs/audits/2026-04-17-mapping-routage-audit
   ```

2. **Write `docs/audits/2026-04-17-mapping-routage-audit/rapport.md`** avec structure suivante (taille cible ~400-600 lignes) :
   - Frontmatter YAML : `type: audit`, `title`, `created: 2026-04-17`, `scope: cerveau`, `findings_total: 15`, `status: active`
   - Section 1 : Contexte (qui, quoi, pourquoi, quand)
   - Section 2 : Perimetre (cerveau uniquement, exclusions)
   - Section 3 : Methodologie (128 fichiers lus, 8 Grep strategiques, lecture ligne par ligne sauf modules/)
   - Section 4 : 13 axes audites avec findings par axe (preuves bash/grep)
   - Section 5 : Top 15 findings ordonnes par gravite
   - Section 6 : Root cause analysis
   - Section 7 : Recommandations → plan `docs/plans/2026-04-17-mapping-routage-refactor.md`
   - Section 8 : Commandes verification par finding (reproductibilite)

3. **Write `docs/audits/2026-04-17-mapping-routage-audit/README.md`** (5-10 lignes) : pointe vers rapport.md + explique scope.

4. **Copier ce plan natif vers versionne** :
   ```bash
   cp ~/.claude/plans/warm-launching-octopus.md docs/plans/2026-04-17-mapping-routage-refactor.md
   ```

5. **Ajouter a l'Execution log** : marquer `[x] Phase 1 — DONE` (dans ce fichier puis copie versionnee).

### Verification post-phase

```bash
# 1. Fichiers crees
ls -la docs/audits/2026-04-17-mapping-routage-audit/
# → doit contenir : rapport.md + README.md
wc -l docs/audits/2026-04-17-mapping-routage-audit/rapport.md
# → attendu : 400-600 lignes

# 2. Plan versionne
ls docs/plans/2026-04-17-mapping-routage-refactor.md
# → doit exister

# 3. Refs checker
bash scripts/ref-checker.sh 2>&1 | tail -3
# → doit retourner 0 (aucune ref cassee introduite)

# 4. Health-check inchange
bash scripts/health-check.sh 2>&1 | tail -3
# → Verdict : SAIN
```

### Rollback explicite

```bash
# Si probleme avec le rapport :
rm -rf docs/audits/2026-04-17-mapping-routage-audit/
rm docs/plans/2026-04-17-mapping-routage-refactor.md
# Retour a l'etat pre-phase, zero impact autre
```

### Commit message preformate

```
docs(audit): rapport mapping/routage — 13 axes + 15 findings

- docs/audits/2026-04-17-mapping-routage-audit/rapport.md (400-600L)
- docs/audits/2026-04-17-mapping-routage-audit/README.md (pointeur)
- docs/plans/2026-04-17-mapping-routage-refactor.md (plan execution 15 phases)

Lecture exhaustive 128 fichiers cerveau (docs/core 7 + docs 7 + wiki 50
+ commands 7 + agents 4 + scripts 12 + memory 25 + config 4 + cowork 3).
Preuves par grep. Source pour phases 2-15.
```

---

## Phase 2 — Unification counts wiki (~30min) [Session A]

**Objectif** : `wiki/meta/counts.md` devient source unique universelle. Toutes les autres pages qui mentionnent des counts pointent vers elle. F8 resolu.

### Pre-conditions verifiables

```bash
# Phase 1 terminee
ls docs/audits/2026-04-17-mapping-routage-audit/rapport.md   # doit exister
# Script wiki-counts-sync.sh operationnel
bash scripts/wiki-counts-sync.sh --check 2>&1 | head -3      # [OK] ou [DRIFT]
# Counts actuels constates :
grep -o "[0-9]\+ pages" wiki/hot.md wiki/overview.md wiki/index-wiki.md wiki/meta/counts.md | head -10
# → 48, 48, 45, 50 (au moins 3 valeurs differentes)
```

### Etat repo attendu au debut

- Phase 1 DONE (rapport audit ecrit + commite)
- `wiki/meta/counts.md` genere par script, source unique officielle
- `wiki/hot.md` ligne 77 : "48 pages (43 fonctionnelles), 791 wikilinks"
- `wiki/overview.md` ligne 77-84 : "Pages : 48 (43 fonctionnelles), Wikilinks : 791"
- `wiki/index-wiki.md` ligne 25 : "Total pages: 45 (hors templates)"
- `wiki/index-wiki.md` ligne 103-118 : table Statistiques 48/43 + 791
- `wiki/log.md` ligne 36 : "35→40 pages, 589→762+ wikilinks"
- `wiki/meta/foundation-os-map.md` ligne 205 : "Total connecte: 94"

### Actions atomiques

1. **Regenerer counts.md depuis filesystem** :
   ```bash
   bash scripts/wiki-counts-sync.sh
   # Le script overwrite wiki/meta/counts.md avec les valeurs reelles
   ```

2. **Edit `wiki/hot.md`** ligne 77 :
   - Remplacer `- Wiki operationnel : 48 pages (43 fonctionnelles), 791 wikilinks, 5 domaines — voir [[counts]] pour source unique`
   - Par : `- Wiki operationnel : voir [[counts]] (source unique)`

3. **Edit `wiki/overview.md`** lignes 75-84 (section Stats) :
   - Remplacer toute la section stats par 1 ligne : `> **Stats live** : voir [[counts]] (source unique regeneree par \`bash scripts/wiki-counts-sync.sh\`).`

4. **Edit `wiki/index-wiki.md`** :
   - Ligne 25 : remplacer `Last updated: 2026-04-17 | Total pages: 45 (hors templates) | Sources ingested: 4 — voir [[counts]] source unique`
   - Par : `Last updated: 2026-04-17 | Stats : voir [[counts]]`
   - Lignes 99-118 (section Statistiques + Couverture) : garder uniquement "Couverture par domaine" (qualitatif), supprimer la table "Statistiques" chiffree. Remplacer par : `> Stats chiffrees : voir [[counts]].`

5. **Edit `wiki/log.md`** ligne 36 :
   - Remplacer `Résultat : 589→762+ wikilinks, 35→40 pages` par `Résultat : wikilinks et pages voir [[counts]] (historique dans git)`

6. **Edit `wiki/meta/foundation-os-map.md`** ligne 189-206 (section Statistiques) :
   - Remplacer toute la table "Total connecte: ~94" par : `> Stats wiki : voir [[counts]]. Cette carte liste les *relations*, pas les counts.`

7. **Update `wiki/meta/counts.md`** : ajouter en tete de section "Comment regenerer" un bloc `## Consumers` listant les pages qui pointent vers counts :
   ```markdown
   ## Consumers (pages qui pointent ici)
   - `wiki/hot.md` (ligne ~77)
   - `wiki/overview.md` (section Stats)
   - `wiki/index-wiki.md` (ligne 25 + section Statistiques)
   - `wiki/log.md` (ligne ~36)
   - `wiki/meta/foundation-os-map.md` (section Statistiques)
   ```

### Verification post-phase

```bash
# 1. Regenerer counts.md et verifier coherence
bash scripts/wiki-counts-sync.sh --check
# → [OK] counts.md sync

# 2. Aucune autre page ne duplique les chiffres
grep -rn "[0-9]\+ pages\|[0-9]\+ wikilinks" wiki/ --include="*.md" | grep -v "counts.md" | grep -v ".archive"
# → doit retourner uniquement sessions-recent.md (narratif historique OK)

# 3. Refs cohérentes
bash scripts/ref-checker.sh 2>&1 | tail -3
# → 0 refs cassees

# 4. Wiki health
bash scripts/wiki-health.sh 2>&1 | tail -3
# → Verdict : SAIN

# 5. Counter Obsidian wikilinks
grep -c '\[\[counts\]\]' wiki/ -r --include="*.md"
# → doit retourner 5+ (les consumers pointent vers counts)
```

### Rollback explicite

```bash
git checkout wiki/hot.md wiki/overview.md wiki/index-wiki.md wiki/log.md wiki/meta/foundation-os-map.md wiki/meta/counts.md
# Retour a l'etat pre-phase, counts.md regenerable par le script
```

### Commit message preformate

```
refactor(wiki): unification counts — source unique counts.md (F8)

- wiki/meta/counts.md : regenere + section Consumers
- wiki/hot.md : retrait ligne stats dupliquee
- wiki/overview.md : section Stats -> pointer vers counts
- wiki/index-wiki.md : header + table Stats -> pointer vers counts
- wiki/log.md : retrait chiffres dupliques
- wiki/meta/foundation-os-map.md : section Stats -> pointer vers counts

4 sources verite (hot/overview/index-wiki/counts) -> 1 seule (counts.md).
Resolution F8 audit mapping/routage 2026-04-17.
```

---

## Phase 3 — Decomission `index-app.md` + refs modules/app/data/ (~45min) [Session A]

**Objectif** : supprimer les 7 wikilinks casses dans `wiki/meta/index-app.md` (pointent vers archive `modules/app/data/*`) + contextualiser toutes les autres refs actives vers `modules/app/data/*` dans docs actifs. F5 resolu.

### Pre-conditions verifiables

```bash
# Phase 2 DONE
grep -c "\[\[counts\]\]" wiki/hot.md wiki/overview.md wiki/index-wiki.md wiki/log.md wiki/meta/foundation-os-map.md
# → chacun >= 1

# Confirmer etat actuel : 7 wikilinks casses index-app
grep "modules/app/data" wiki/meta/index-app.md | wc -l
# → attendu : 7

# Confirmer refs actives hors wiki
grep -rn "modules/app/data/" docs/core/ .claude/agents/ CLAUDE.md CONTEXT.md docs/architecture.md docs/manifeste.md docs/index-documentation.md docs/core/tools/README-tools-catalogue.md 2>/dev/null | grep -v ".archive"
# → attendu : 4-6 refs actives (monitor.md, doc-agent.md, manifeste.md, tools catalogue)
```

### Etat repo attendu au debut

- Phase 2 DONE (counts unifies)
- `wiki/meta/index-app.md` : existe avec 7 wikilinks pointant vers `modules/app/data/*` (archive)
- `.claude/agents/doc-agent.md` ligne 6 : `docs/, modules/app/data/*. Declencheurs...`
- `docs/core/monitor.md` ligne 23 : `MD pairs alignes | Comparer modules/app/data/*.md ↔ .archive/artifacts-jsx/...`
- `docs/manifeste.md` ligne 260 : mentionne `modules/app/data/*.md` archive
- `docs/core/tools/README-tools-catalogue.md` ligne 28 : doc-agent description `modules/app/data/*`

### Actions atomiques

1. **Archiver `wiki/meta/index-app.md`** (7 wikilinks casses + redondant avec foundation-os-map qui couvre App Builder) :
   ```bash
   mkdir -p .archive/wiki-orphans-260417
   git mv wiki/meta/index-app.md .archive/wiki-orphans-260417/index-app.md
   ```

2. **Retirer refs `[[index-app]]`** dans pages wiki qui pointent vers :
   ```bash
   grep -rln "\[\[index-app\]\]" wiki/ --include="*.md"
   ```
   Pour chaque fichier resultat, Edit : remplacer `[[index-app]]` par retrait ligne ou commentaire inline.
   Fichiers attendus : `wiki/index-wiki.md` (ligne 19), `wiki/meta/foundation-os-map.md` (lignes 110-123 cluster App Builder).

3. **Edit `.claude/agents/doc-agent.md`** ligne 6 :
   - Remplacer `docs/, modules/app/data/*. Declencheurs` par `docs/. Declencheurs`

4. **Edit `docs/core/monitor.md`** ligne 23 :
   - Remplacer la ligne "MD pairs alignes | Comparer modules/app/data/*.md ↔ .archive/artifacts-jsx/fos-*.jsx | Chaque archive a son MD"
   - Par : "MD pairs alignes (archive) | Comparer `.archive/app-data-jsx-260417/data/*.md` ↔ `.archive/artifacts-jsx/fos-*.jsx` | Historique fige, chaque MD = JSX pair archive"

5. **Edit `docs/manifeste.md`** ligne 260-265 (section 13.6 MD pairs figes) :
   - Clarifier que `modules/app/data/*` a ete archive 2026-04-17 dans `.archive/app-data-jsx-260417/data/`. La tension "fige mais lu" est resolue : archive read-only pure, plus lu par l'app runtime.

6. **Edit `docs/core/tools/README-tools-catalogue.md`** ligne 28 :
   - Remplacer `modules/app/data/*` par `docs/` (doc-agent description alignee avec agent file post-action 3).

7. **Update `wiki/meta/index-meta.md`** : retirer le pointer vers `[[index-app]]` s'il existe (probable ligne 22 "Meta & Neuroplasticite" ou similaire).

### Verification post-phase

```bash
# 1. Plus de refs casses modules/app/data/ dans wiki
grep -rn "modules/app/data" wiki/ --include="*.md" | grep -v ".archive"
# → doit retourner 0 (sauf narratif sessions-recent OK)

# 2. Plus de refs modules/app/data/ actives dans docs cerveau
grep -rn "modules/app/data/" .claude/agents/ docs/core/ docs/manifeste.md docs/index-documentation.md CLAUDE.md CONTEXT.md 2>/dev/null | grep -v "\.archive"
# → doit retourner 0 (ou uniquement commentaires explicites "archived")

# 3. index-app.md archive
ls .archive/wiki-orphans-260417/index-app.md
# → exist

# 4. Aucune ref cassee [[index-app]] restante
grep -rn "\[\[index-app\]\]" . --include="*.md" | grep -v ".archive"
# → 0

# 5. Health + refs
bash scripts/health-check.sh 2>&1 | tail -3   # SAIN
bash scripts/ref-checker.sh 2>&1 | tail -3    # 0 refs cassees
```

### Rollback explicite

```bash
# Restaurer index-app.md
git mv .archive/wiki-orphans-260417/index-app.md wiki/meta/index-app.md
# Checkout des 4-5 fichiers edites
git checkout .claude/agents/doc-agent.md docs/core/monitor.md docs/manifeste.md docs/core/tools/README-tools-catalogue.md wiki/index-wiki.md wiki/meta/foundation-os-map.md wiki/meta/index-meta.md
```

### Commit message preformate

```
refactor(wiki): decomission index-app + refs modules/app/data actives (F5)

- wiki/meta/index-app.md -> .archive/wiki-orphans-260417/ (7 wikilinks casses)
- .claude/agents/doc-agent.md : retrait ref modules/app/data/
- docs/core/monitor.md : MD pairs check pointe vers .archive/app-data-jsx-260417/
- docs/manifeste.md : clarification archive post-2026-04-17
- docs/core/tools/README-tools-catalogue.md : description doc-agent alignee
- wiki/index-wiki.md + foundation-os-map.md + index-meta.md : retrait pointeurs [[index-app]]

Resolution F5 audit mapping/routage 2026-04-17.
```

---

## Phase 4 — Navigation 2 niveaux (~30min) [Session A]

**Objectif** : reduire le hub etoile `foundation-os-map.md` (81 wikilinks fragile) au profit de `index-wiki.md` minimal + sous-indexes existants. F4 resolu. Pattern "mesh" au lieu de "etoile".

### Pre-conditions verifiables

```bash
# Phase 3 DONE
ls .archive/wiki-orphans-260417/index-app.md                 # archive existe

# Etat actuel
wc -l wiki/meta/foundation-os-map.md                         # ~205 lignes
grep -c "\[\[" wiki/meta/foundation-os-map.md                # ~81 wikilinks
wc -l wiki/index-wiki.md                                      # ~130 lignes
```

### Etat repo attendu au debut

- Phase 3 DONE
- `wiki/meta/foundation-os-map.md` : 205 lignes, 81 wikilinks (hub surdimensionne)
- `wiki/index-wiki.md` : 130 lignes avec master index + couverture + stats (supprimees Phase 2)
- 7 sous-indexes existent : `index-concepts`, `index-entities`, `index-sources`, `index-meta`, `index-core-os`, `index-app` (archive Phase 3 — a retirer du map), `index-cowork`

### Actions atomiques

1. **Refactor `wiki/meta/foundation-os-map.md`** : compresser 205L → ~60L, 81 wikilinks → ~15 wikilinks (uniquement hubs, pas feuilles) :
   - Garder : Navigation top (index-wiki, hot, overview, log) + pointeurs vers les 7 sous-indexes + 4 concepts canoniques ([[Foundation OS]], [[Core OS]], [[LLM Wiki Pattern]], [[Neuroplasticite]])
   - Retirer : toutes les listes exhaustives (concepts individuels, entities individuelles, sources individuelles, pages cowork, pages modules) — remplacees par pointers vers sous-indexes
   - Conclusion : la carte devient un **hub de 2e niveau** (pointe vers sous-indexes) pas un **hub de 1er niveau** (listant tout)

2. **Edit `wiki/index-wiki.md`** : s'assurer qu'il reste le hub principal niveau 1 :
   - Garder : Navigation + table sous-indexes + Couverture par domaine (qualitatif)
   - Deja supprime Phase 2 : stats chiffrees
   - Verifier : pointers vers 7 sous-indexes tous presents et navigables

3. **Edit chaque sous-index (`wiki/meta/index-*.md`)** pour garantir qu'ils remontent vers `[[index-wiki]]` et `[[foundation-os-map]]` dans leur header Navigation.

4. **Update `wiki/hot.md`** bloc Navigation (ligne 18) :
   - Verifier qu'il pointe vers `[[index-wiki]] | [[log]] | [[overview]]` (3 hubs top niveau, pas foundation-os-map qui est niveau 2)

### Verification post-phase

```bash
# 1. foundation-os-map compresse
wc -l wiki/meta/foundation-os-map.md
# → attendu : 50-80 lignes (vs 205 avant)
grep -c "\[\[" wiki/meta/foundation-os-map.md
# → attendu : 10-20 wikilinks (vs 81 avant)

# 2. index-wiki toujours hub top niveau
grep -c "\[\[" wiki/index-wiki.md
# → >= 30 wikilinks (vers les pages principales)

# 3. Chaque sous-index pointe vers index-wiki
for f in wiki/meta/index-concepts.md wiki/meta/index-entities.md wiki/meta/index-sources.md wiki/meta/index-meta.md wiki/meta/index-core-os.md wiki/meta/index-cowork.md; do
  echo -n "$f: "
  grep -c "\[\[index-wiki\]\]\|\[\[foundation-os-map\]\]" "$f"
done
# → chaque >= 1

# 4. Refs + health
bash scripts/ref-checker.sh 2>&1 | tail -3
bash scripts/health-check.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
git checkout wiki/meta/foundation-os-map.md wiki/index-wiki.md wiki/meta/index-concepts.md wiki/meta/index-entities.md wiki/meta/index-sources.md wiki/meta/index-meta.md wiki/meta/index-core-os.md wiki/meta/index-cowork.md wiki/hot.md
```

### Commit message preformate

```
refactor(wiki): navigation 2 niveaux — foundation-os-map compress (F4)

- wiki/meta/foundation-os-map.md : 205L -> ~70L, 81 wikilinks -> ~15 (hub niveau 2)
- wiki/index-wiki.md : reste hub niveau 1 (35+ wikilinks vers pages principales)
- 7 sous-indexes : remontent vers index-wiki + foundation-os-map
- wiki/hot.md : Navigation vers hubs niveau 1 uniquement

Pattern etoile fragile -> mesh 2 niveaux.
Resolution F4 audit mapping/routage 2026-04-17.
```

---

## Phase 5 — Clean `graph.json` Obsidian (~15min) [Session A]

**Objectif** : retirer les 3 paires couleurs dupliquees de `.obsidian/graph.json`. Passer de 12 groupes → 9 groupes. F7 resolu.

### Pre-conditions verifiables

```bash
# Phase 4 DONE
# Inspecter groupes actuels
python3 -c "import json; g = json.load(open('.obsidian/graph.json'))['colorGroups']; print(len(g), 'groupes'); [print(x['query']) for x in g]"
# → 12 groupes, liste affichee
```

### Etat repo attendu au debut

- `.obsidian/graph.json` : 12 `colorGroups` dont :
  - `tag:#concept` (15381256 = yellow)
  - `tag:#entity` (16347926 = orange)
  - `tag:#source` (15680580 = red)
  - `tag:#meta` (13935988 = beige)
  - `path:docs/core` (3900150 = blue) + `tag:#core-os` (3900150 DUP)
  - `path:docs/travaux-cowork` (1357990 = cyan) + `tag:#cowork` (1357990 DUP)
  - `path:docs` (9133296 = violet)
  - `path:modules` (2278750 = green) + `tag:#app` (2278750 DUP)
  - `path:.claude` (6514417 = indigo)

### Actions atomiques

1. **Edit `.obsidian/graph.json`** : retirer 3 objets du tableau `colorGroups` :
   - `tag:#core-os` (rgb 3900150)
   - `tag:#cowork` (rgb 1357990)
   - `tag:#app` (rgb 2278750)
   - Reste : 9 groupes (4 tags + 5 paths)

### Verification post-phase

```bash
# 1. 9 groupes restants
python3 -c "import json; g = json.load(open('.obsidian/graph.json'))['colorGroups']; print(len(g))"
# → 9

# 2. Aucun doublon couleur
python3 -c "
import json
g = json.load(open('.obsidian/graph.json'))['colorGroups']
colors = [x['color']['rgb'] for x in g]
assert len(colors) == len(set(colors)), 'DOUBLON: ' + str(sorted(colors))
print('OK : 9 couleurs uniques')
"
# → OK : 9 couleurs uniques

# 3. JSON valide
python3 -c "import json; json.load(open('.obsidian/graph.json'))"
# → pas d'erreur

# 4. Health-check
bash scripts/health-check.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
git checkout .obsidian/graph.json
```

### Commit message preformate

```
refactor(obsidian): clean graph colors — 12 -> 9 groupes (F7)

Retrait 3 duplicates couleurs (meme rgb que path:) :
- tag:#core-os (= path:docs/core)
- tag:#cowork (= path:docs/travaux-cowork)
- tag:#app (= path:modules)

Resolution F7 audit mapping/routage 2026-04-17.
```

---

## Phase 6 — Rationaliser journals (~45min) [Session B]

**Objectif** : reduire 4 journals redondants a 2. F9 resolu.

### Pre-conditions verifiables

```bash
# Session A DONE (Phases 1-5)
# Etat actuel 4 journals
ls -la wiki/log.md wiki/meta/sessions-recent.md wiki/meta/session-dna.md wiki/meta/session-patterns.md
wc -l wiki/log.md wiki/meta/sessions-recent.md wiki/meta/session-dna.md wiki/meta/session-patterns.md
```

### Etat repo attendu au debut

- `wiki/log.md` : chronologique (38 lignes, operations wiki)
- `wiki/meta/sessions-recent.md` : 247 lignes, 5 dernieres sessions (narratif riche)
- `wiki/meta/session-dna.md` : 89 lignes, YAML structure par session (~5 sessions)
- `wiki/meta/session-patterns.md` : 146 lignes, analytics auto-regenere (scripts/sessions-analyze.sh)

### Decision structure finale

**Garder (2)** :
- `wiki/meta/sessions-recent.md` — narratif 5 sessions, append, lecture SessionStart
- `wiki/meta/session-patterns.md` — analytics cumulatif, auto-regenere, lecture a la demande

**Decomissionner (2)** :
- `wiki/log.md` — redondant avec sessions-recent (chronologique), archiver
- `wiki/meta/session-dna.md` — YAML par session, fusionner dans sessions-recent comme bloc YAML append OU archiver (choix recommande : **archiver** car sessions-recent couvre tout le narratif + patterns couvre les metriques)

### Actions atomiques

1. **Archiver `wiki/log.md`** :
   ```bash
   mkdir -p .archive/wiki-orphans-260417
   git mv wiki/log.md .archive/wiki-orphans-260417/log.md
   ```

2. **Archiver `wiki/meta/session-dna.md`** :
   ```bash
   git mv wiki/meta/session-dna.md .archive/wiki-orphans-260417/session-dna.md
   ```

3. **Grep refs `[[log]]`** dans tout le cerveau et les retirer :
   ```bash
   grep -rln "\[\[log\]\]" wiki/ docs/ CLAUDE.md CONTEXT.md README.md 2>/dev/null | grep -v ".archive"
   ```
   Pour chaque fichier, Edit : remplacer `[[log]]` par retrait ou `[[sessions-recent]]` selon contexte.
   Fichiers probables : `wiki/hot.md` (Navigation), `wiki/index-wiki.md`, `wiki/overview.md`, `wiki/meta/foundation-os-map.md`, `wiki/meta/index-meta.md`, concepts/Hot Cache.md.

4. **Grep refs `[[session-dna]]`** + retrait similaire :
   ```bash
   grep -rln "\[\[session-dna\]\]" wiki/ docs/ 2>/dev/null | grep -v ".archive"
   ```

5. **Edit `.claude/commands/session-end.md`** Tour 3 actions 12 + 15 :
   - Retirer action "12. `Edit wiki/log.md` — ajouter operations wiki" → remplacer par retrait (plus d'update log.md)
   - Retirer action "15. Append session DNA dans wiki/meta/session-dna.md" → remplacer par "15. Append resume session dans wiki/meta/sessions-recent.md (deja fait action 9)"

6. **Edit `docs/core/knowledge.md`** section 8 (Pages meta neuroplasticite) :
   - Supprimer la ligne `| wiki/log.md | Chronological operations log | Append \`/session-end\` |`
   - Supprimer si present session-dna
   - Garder : hot.md, sessions-recent.md, lessons-learned.md, thinking.md

7. **Edit `docs/core/communication.md`** si mentionne log.md ou session-dna.md explicitement :
   ```bash
   grep -n "log\.md\|session-dna" docs/core/communication.md
   ```
   Puis retirer/mettre a jour.

8. **Edit `wiki/meta/index-meta.md`** : retirer `[[log]]` et `[[session-dna]]` du tableau Operations et Neuroplasticite.

9. **Edit `wiki/meta/routines-setup.md`** : retirer refs `wiki/log.md` dans les routines (R1, R3, R10) — remplacer par sessions-recent si pertinent OU retirer si journal pur.

### Verification post-phase

```bash
# 1. 2 journals restants
ls wiki/meta/sessions-recent.md wiki/meta/session-patterns.md   # existent
ls wiki/log.md wiki/meta/session-dna.md 2>/dev/null             # n'existent plus

# 2. Archives
ls .archive/wiki-orphans-260417/log.md .archive/wiki-orphans-260417/session-dna.md   # existent

# 3. Zero ref casse
grep -rn "\[\[log\]\]\|\[\[session-dna\]\]" . --include="*.md" | grep -v ".archive"
# → 0

# 4. session-end.md command a jour
grep -c "session-dna\|wiki/log.md" .claude/commands/session-end.md
# → 0

# 5. Full health
bash scripts/ref-checker.sh 2>&1 | tail -3
bash scripts/wiki-health.sh 2>&1 | tail -3
bash scripts/health-check.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
git mv .archive/wiki-orphans-260417/log.md wiki/log.md
git mv .archive/wiki-orphans-260417/session-dna.md wiki/meta/session-dna.md
git checkout .claude/commands/session-end.md docs/core/knowledge.md docs/core/communication.md wiki/meta/index-meta.md wiki/meta/routines-setup.md wiki/hot.md wiki/index-wiki.md wiki/overview.md wiki/meta/foundation-os-map.md wiki/concepts/Hot\ Cache.md
```

### Commit message preformate

```
refactor(wiki): rationalisation journals 4 -> 2 (F9)

Garde :
- wiki/meta/sessions-recent.md (narratif 5 sessions, SessionStart)
- wiki/meta/session-patterns.md (analytics cumul, auto-regenere)

Archive :
- wiki/log.md -> .archive/wiki-orphans-260417/ (redondant sessions-recent)
- wiki/meta/session-dna.md -> .archive/wiki-orphans-260417/ (redondant)

Impact :
- .claude/commands/session-end.md Tour 3 : retrait actions 12 + 15
- docs/core/knowledge.md + communication.md : pages meta alignees
- wiki/index-meta + routines-setup + hot + overview + concepts/Hot Cache : refs retirees

Resolution F9 audit mapping/routage 2026-04-17.
```

---

## Phase 7 — SessionStart optimise (~1h) [Session B]

**Objectif** : unifier `/cockpit` et `/session-start` Tour 1 + fixer tronquage hot.md + retirer double drift-detector. F1 F2 F3 resolus.

### Pre-conditions verifiables

```bash
# Session A + Phase 6 DONE
# Etat actuel
grep -c "Read\|Bash" .claude/commands/session-start.md       # beaucoup
grep -c "Read\|Bash" .claude/commands/cockpit.md             # moins

# Confirmer hook tronquage
grep "head -60" scripts/hooks/session-start-wiki.sh
# → "head -60 wiki/hot.md"

# Confirmer double appel drift
grep -c "drift-detector" scripts/hooks/session-start-wiki.sh scripts/health-check.sh
# → 1 + 1 = 2 (double appel confirme)
```

### Etat repo attendu au debut

- `.claude/commands/session-start.md` Tour 1 : 9 actions (CONTEXT + hot + sessions-recent + lessons-learned + thinking + git + health + wiki-health + plans)
- `.claude/commands/cockpit.md` Tour 1 : 7 actions (CONTEXT + hot + sessions-recent + lessons-learned + git + health + plans) — skip thinking + wiki-health
- `scripts/hooks/session-start-wiki.sh` : `head -60 wiki/hot.md` → tronque si > 60L
- `scripts/health-check.sh` : chain `drift-detector` section INFO → redondant avec hook
- `wiki/hot.md` actuellement 96L

### Decisions

**A. Unifier Tour 1** : aligner `/cockpit` sur `/session-start` (9 reads) car session-start est spec canonique.

**B. Hook hot.md** : supprimer `head -60` → afficher fichier complet (hot.md est cense etre < 500 mots = ~40-70 lignes, mais on laisse liberté)

**C. Double drift-detector** : retirer du hook SessionStart (garde dans health-check chain). Le hook SessionStart focus uniquement sur hot.md (c'est son role : pattern Karpathy).

### Actions atomiques

1. **Edit `scripts/hooks/session-start-wiki.sh`** :
   - Retirer lignes 10-13 (appel drift-detector)
   - Remplacer `head -60 wiki/hot.md` ligne 20 par `cat wiki/hot.md`
   - Le hook devient purement "cat wiki/hot.md" (pattern Karpathy LLM Wiki)

2. **Edit `.claude/commands/cockpit.md`** Tour 1 :
   - Ajouter action `Read wiki/meta/thinking.md` apres lessons-learned
   - Ajouter action `Bash bash scripts/wiki-health.sh 2>&1 | tail -10` apres health-check
   - Total : 9 actions alignees avec session-start

3. **Edit `.claude/commands/session-start.md`** (garder comme canon, clarifier nombre reads) :
   - En-tete : preciser "Tour 1 : 9 reads (parallele)"
   - Pas de changement structurel

4. **Update CLAUDE.md** section "Tool calls OBLIGATOIRES selon command invoquee" :
   - Bloc `/cockpit ou /session-start` : ajouter note que Tour 1 = **meme 9 reads** pour les deux commands (point d'entree uniforme)

5. **Verifier `scripts/health-check.sh`** (relecture) :
   - Confirmer que drift-detector chain est bien dans section INFO (non-critique)
   - Pas de modification necessaire si deja le cas

6. **Optionnel (decider en session)** : retirer `thinking.md` du Tour 1 si son ROI est faible (45 lignes, lu 100% sessions, mais contenu peu actionnable immediat). Si retire : lecture lazy sur demande. **Recommandation** : **garder** (cheap, 45L, informative pour Claude). Pas de modification.

### Verification post-phase

```bash
# 1. Hook simplifie
cat scripts/hooks/session-start-wiki.sh
# → ne contient plus "drift-detector" et plus "head -60"

# 2. Cockpit aligne session-start
grep -c "^> [0-9]\|Read\|Bash" .claude/commands/cockpit.md .claude/commands/session-start.md
# → Tours 1 equivalents

# 3. Pas de regression
bash scripts/hooks/session-start-wiki.sh
# → affiche HOT CACHE + contenu complet hot.md (pas tronque)

bash scripts/health-check.sh 2>&1 | tail -3
# → SAIN, drift-detector bien dans INFO (appel unique)

# 4. Health + refs
bash scripts/ref-checker.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
git checkout scripts/hooks/session-start-wiki.sh .claude/commands/cockpit.md .claude/commands/session-start.md CLAUDE.md
```

### Commit message preformate

```
refactor(os): SessionStart optimise — unify cockpit+session-start, fix hook (F1 F2 F3)

- scripts/hooks/session-start-wiki.sh :
  * retrait drift-detector (double appel, garde dans health-check chain)
  * retrait head -60 sur wiki/hot.md (cat complet, pattern Karpathy)
- .claude/commands/cockpit.md Tour 1 : aligne session-start (9 reads)
- .claude/commands/session-start.md : entete clarifiee (9 reads)
- CLAUDE.md : bloc /cockpit et /session-start unifie

Resolution F1 F2 F3 audit mapping/routage 2026-04-17.
```

---

## Phase 8 — Memoires nettoyage (~45min) [Session B]

**Objectif** : corriger les 4 memoires outdated/redondantes. F10 F11 F12 F13 resolus.

### Pre-conditions verifiables

```bash
# Phase 7 DONE
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_structure.md
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_audit_v2_s3_handoff.md
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/feedback_tout_automatique.md
ls wiki/entities/tools-foundation-os.md
```

### Etat repo attendu au debut

- `project_structure.md` : mentions "Storybook 8", "tokens DTCG", "46 ui" (realite = Storybook 9, tokens CSS `--ds-*`, 46 ui OK)
- `project_audit_v2_s3_handoff.md` : status:active, contenu Handoff Phase 16-18 (DONE)
- `feedback_tout_automatique.md` : liste 7 memoires + duplique leur contenu
- `wiki/entities/tools-foundation-os.md` : "OMC v4.10.1" (ok actuel), "26 tools" (faux, 109), "177+ points d'invocation" (bullshit)

### Actions atomiques

1. **Edit `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_structure.md`** :
   - Ligne ~13 : `Storybook 8` → `Storybook 9`
   - Ligne ~13 : `tokens DTCG + 46 ui` → `tokens CSS --ds-* (source unique modules/design-system/src/styles/tokens.css) + 46 ui`
   - Ajouter `last_used: 2026-04-17` dans frontmatter (si deja pas a jour)

2. **Deprecier `project_audit_v2_s3_handoff.md`** :
   ```bash
   mkdir -p ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/_deprecated
   git mv ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_audit_v2_s3_handoff.md ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/_deprecated/
   ```
   Puis Edit MEMORY.md : retirer ligne `- [Audit v2 S3 handoff]...` de la section Actives + ajouter dans section Deprecated "Deprecated 2026-04-17 (mapping refactor)".

3. **Edit `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/feedback_tout_automatique.md`** :
   - Remplacer listes dupliquees des 7 memoires (sections "How to apply (checklist auto...)") par pointers courts :
     ```markdown
     **Checklist auto debut session** (voir chaque memoire pour detail) :
     1. [Thinking francais](feedback_thinking_francais.md)
     2. [Nommage sessions 🪐](feedback_sessions_nommage_planete.md)
     3. [Nommage branches](feedback_branches_convention.md)
     4. [Worktrees /wt](feedback_worktrees_actifs.md)
     5. [Plans orchestrateur](feedback_plans_orchestrateur.md)
     6. [TodoWrite systematique](feedback_todowrite_systematique.md)
     7. Brief v12 : source unique `docs/core/communication.md` section 6
     ```
   - Reduction de ~60L → ~30L

4. **Edit `wiki/entities/tools-foundation-os.md`** :
   - Section "Claude Code" : retirer "CLAUDE.md (~177 lignes), 4 agents custom, 6+ commands" → remplacer par : "CLAUDE.md, 4 agents, 7 commands, 4 hooks actifs. Voir [[tools]] (docs/core/tools.md) pour catalogue complet 109 outils."
   - Section "Total" : supprimer la ligne "~177+ points d'invocation" (bullshit non verifiable)
   - Section "OMC" : laisser "v4.10.1" (actuel Kevin) ou mettre a jour vers v4.12.0 si Kevin accepte update (prompter ou laisser pour Kevin)
   - Update date `updated: 2026-04-17`

5. **Edit `~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md`** :
   - Mettre a jour "Actives (25)" → "Actives (24)" apres deprecation audit_v2_s3_handoff
   - Verifier count coherent (total actives + deprecated)

### Verification post-phase

```bash
# 1. project_structure corrige
grep "Storybook 9\|--ds-\*" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_structure.md
# → 2 matches

grep "Storybook 8\|tokens DTCG" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_structure.md
# → 0 matches

# 2. Audit v2 handoff deprecated
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_audit_v2_s3_handoff.md 2>/dev/null
# → fichier absent
ls ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/_deprecated/project_audit_v2_s3_handoff.md
# → existe

# 3. MEMORY.md index a jour
grep -c "Actives (24)\|Actives (25)" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md
# → 24 est le bon count

grep "project_audit_v2_s3_handoff" ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md
# → uniquement dans section deprecated

# 4. tools-foundation-os propre
grep "177\|26 tools" wiki/entities/tools-foundation-os.md
# → 0 matches

# 5. feedback_tout_automatique compact
wc -l ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/feedback_tout_automatique.md
# → < 35 lignes (etait ~60)

# 6. Health
bash scripts/health-check.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
git mv ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/_deprecated/project_audit_v2_s3_handoff.md ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_audit_v2_s3_handoff.md
git checkout ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/project_structure.md ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/feedback_tout_automatique.md ~/.claude/projects/-Users-kevinnoel-foundation-os/memory/MEMORY.md wiki/entities/tools-foundation-os.md
```

### Commit message preformate

```
chore(memory): nettoyage memoires outdated (F10 F11 F12 F13)

- project_structure.md : Storybook 8 -> 9, tokens DTCG -> CSS --ds-* (F10)
- project_audit_v2_s3_handoff.md -> _deprecated/ (F11, S3 DONE)
- feedback_tout_automatique.md : retrait duplication 7 memoires -> pointers (F13)
- wiki/entities/tools-foundation-os.md : retrait "26 tools" + "177+ points" bullshit (F12)
- MEMORY.md : index actives 25 -> 24

Resolution F10 F11 F12 F13 audit mapping/routage 2026-04-17.
```

---

## Phase 9 — Domains vides marque [!placeholder] (~30min) [Session B]

**Objectif** : les 3 domaines Phase 5 (trading/finance/sante) sont vides (juste index). Marquer explicitement `[!placeholder] Phase 5 non-demarree` pour clarifier l'intention et eviter confusion Claude futur. F14 resolu (option (a) reversible).

### Pre-conditions verifiables

```bash
# Phase 8 DONE
ls wiki/domains/trading/index-trading.md wiki/domains/finance/index-finance.md wiki/domains/sante/index-sante.md
# → 3 fichiers existent
find wiki/domains/trading wiki/domains/finance wiki/domains/sante -name "*.md" | wc -l
# → 3 (juste les indexes, rien d'autre)
```

### Etat repo attendu au debut

- `wiki/domains/trading/index-trading.md` : 53L, structure scaffold mais aucune page concepts/sources
- `wiki/domains/finance/index-finance.md` : 52L, meme
- `wiki/domains/sante/index-sante.md` : 57L, meme

### Actions atomiques

1. **Edit `wiki/domains/trading/index-trading.md`** : ajouter en tete (apres frontmatter) :
   ```markdown
   > [!placeholder] **Phase 5 non-demarree** (2026-04-17)
   > Ce domaine est scaffolde mais 100% vide (aucune page `concepts/`, `sources/`, `strategies/`, `backtests/`, `instruments/`). Il sera actif quand le module `modules/trading/` sera lance (decision Kevin Phase 5).
   > **Pour demarrer** : ingerer un whitepaper via `.raw/trading/` + `wiki-ingest` OU creer concept atemporel (ex: Sharpe ratio, momentum).
   ```

2. **Edit `wiki/domains/finance/index-finance.md`** : callout `[!placeholder]` similaire (adapter aux sous-dossiers finance : concepts/decisions/sources).

3. **Edit `wiki/domains/sante/index-sante.md`** : callout `[!placeholder]` similaire (adapter sous-dossiers sante : bilans/concepts/protocoles/sources).

4. **Update `wiki/index-wiki.md`** section Domaines :
   - Ajouter emoji `🔴 placeholder` ou `⚫ prevu Phase 5` a cote des 3 domaines vides (visibilite immediate)

5. **Update `wiki/meta/foundation-os-map.md`** (deja compresse Phase 4) :
   - Dans la liste Domaines, marquer les 3 Phase 5 comme `🔴` ou ajouter note `(placeholder Phase 5)`

### Verification post-phase

```bash
# 1. Callouts places
grep -c "\[!placeholder\]" wiki/domains/trading/index-trading.md wiki/domains/finance/index-finance.md wiki/domains/sante/index-sante.md
# → chacun >= 1

# 2. index-wiki marque visuellement
grep -c "placeholder\|Phase 5\|🔴" wiki/index-wiki.md
# → >= 3

# 3. Health
bash scripts/wiki-health.sh 2>&1 | tail -3
bash scripts/health-check.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
git checkout wiki/domains/trading/index-trading.md wiki/domains/finance/index-finance.md wiki/domains/sante/index-sante.md wiki/index-wiki.md wiki/meta/foundation-os-map.md
```

### Commit message preformate

```
docs(wiki): domains Phase 5 marques [!placeholder] (F14)

- wiki/domains/trading/index-trading.md : callout placeholder + hint demarrage
- wiki/domains/finance/index-finance.md : idem
- wiki/domains/sante/index-sante.md : idem
- wiki/index-wiki.md : emoji 🔴 visibilite immediate 3 domaines vides
- wiki/meta/foundation-os-map.md : note (placeholder Phase 5)

Resolution F14 (reversible). Phase 5 decision Kevin reportee.
Resolution F14 audit mapping/routage 2026-04-17.
```

---

## Phase 10 — Categories mortes supprimees (~30min) [Session B]

**Objectif** : supprimer les 3 categories wiki qui ont 0 pages et ne seront probablement jamais utilisees. F15 resolu (suppression pure).

### Pre-conditions verifiables

```bash
# Phase 9 DONE
ls wiki/comparisons/ wiki/questions/ wiki/canvases/
find wiki/comparisons wiki/questions wiki/canvases -name "*.md" | wc -l
# → 0 pages dans les 3 dossiers (hors .md de meta/templates qui sont dans wiki/meta/templates/)
```

### Etat repo attendu au debut

- `wiki/comparisons/` : dossier vide (ou juste `.gitkeep`)
- `wiki/questions/` : dossier vide (ou juste `.gitkeep`)
- `wiki/canvases/` : dossier vide (ou `.gitkeep`)
- `wiki/meta/templates/comparison.md` et `wiki/meta/templates/question.md` existent (templates mais sans usage)

### Decision

**Option retenue (5)** : **suppression pure** des 3 dossiers + suppression des 2 templates inutiles (`comparison.md`, `question.md`).

**Justification** :
- 0 pages = 0 usage reel depuis adoption wiki 2026-04-15 (1 mois+)
- Les 2 templates ne sont invoques par aucun workflow
- Le graph Obsidian montre ces dossiers mais sans nodes → pollution visuelle
- Si un jour besoin : recreer en 30 secondes avec mkdir + template

### Actions atomiques

1. **Archiver les 3 dossiers vides + 2 templates** :
   ```bash
   mkdir -p .archive/wiki-empty-categories-260417
   # Dossiers vides (rmdir-safe)
   rmdir wiki/comparisons 2>/dev/null || git rm -rf wiki/comparisons
   rmdir wiki/questions 2>/dev/null || git rm -rf wiki/questions
   rmdir wiki/canvases 2>/dev/null || git rm -rf wiki/canvases
   # Templates inutilises
   git mv wiki/meta/templates/comparison.md .archive/wiki-empty-categories-260417/
   git mv wiki/meta/templates/question.md .archive/wiki-empty-categories-260417/
   ```

2. **Edit `wiki/index-wiki.md`** section Cross-domain :
   - Retirer les sections `### Comparisons` et `### Questions` (vides)
   - Retirer eventuellement les templates dans meta (si listes)

3. **Edit `wiki/meta/index-meta.md`** :
   - Section Templates : retirer `[[meta/templates/comparison]]` et `[[meta/templates/question]]`
   - Garder : `concept`, `entity`, `source` (utilises)

4. **Edit `wiki/meta/foundation-os-map.md`** :
   - Retirer eventuelles refs vers comparisons/questions/canvases

5. **Edit `docs/core/knowledge.md`** section 1 (Vault structure) :
   - Retirer les dossiers `comparisons/`, `questions/`, `canvases/`
   - Retirer les templates `comparison`, `question` de la liste des 5 → reste 3 (concept, entity, source)

6. **Edit `docs/core/tools.md`** section 1c (Skills + Templates) :
   - Ajuster mention "5 templates" → "3 templates"

### Verification post-phase

```bash
# 1. Dossiers supprimes
ls wiki/comparisons wiki/questions wiki/canvases 2>/dev/null
# → No such file (les 3)

# 2. Templates reduits a 3
find wiki/meta/templates -name "*.md" | wc -l
# → 3

# 3. Refs retirees partout
grep -rn "comparisons/\|questions/\|canvases/\|meta/templates/comparison\|meta/templates/question" wiki/ docs/ | grep -v ".archive"
# → 0 (ou uniquement mentions narratives explicites)

# 4. knowledge.md dit 3 templates
grep "3 templates\|5 templates" docs/core/knowledge.md docs/core/tools.md
# → "3 templates" apparait

# 5. Health complet
bash scripts/wiki-health.sh 2>&1 | tail -3
bash scripts/ref-checker.sh 2>&1 | tail -3
bash scripts/health-check.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
mkdir -p wiki/comparisons wiki/questions wiki/canvases
git mv .archive/wiki-empty-categories-260417/comparison.md wiki/meta/templates/comparison.md
git mv .archive/wiki-empty-categories-260417/question.md wiki/meta/templates/question.md
git checkout wiki/index-wiki.md wiki/meta/index-meta.md wiki/meta/foundation-os-map.md docs/core/knowledge.md docs/core/tools.md
```

### Commit message preformate

```
refactor(wiki): suppression categories mortes (F15)

Supprime :
- wiki/comparisons/ (0 pages, jamais utilise)
- wiki/questions/ (0 pages, jamais utilise)
- wiki/canvases/ (0 pages, jamais utilise)
- wiki/meta/templates/comparison.md (archive)
- wiki/meta/templates/question.md (archive)

Docs alignees :
- wiki/index-wiki.md : sections Comparisons + Questions retirees
- wiki/meta/index-meta.md : templates 5 -> 3
- wiki/meta/foundation-os-map.md : refs retirees
- docs/core/knowledge.md : vault structure + templates 3
- docs/core/tools.md : 5 templates -> 3

Resolution F15 audit mapping/routage 2026-04-17.
```

---

## Phase 11 — Wikilinks DS hors-vault (~30min) [Session B]

**Objectif** : les wikilinks `[[01-button]]..[[46-carousel]]` dans `design-system-components.md` resolvent vers `modules/design-system/docs-supernova/components/` qui est HORS du vault wiki/ (OK selon D-VAULT-01 vault=racine mais pas navigable si vault restreint a wiki/). Clarifier. F6 resolu.

### Pre-conditions verifiables

```bash
# Phase 10 DONE
grep -c '\[\[0[1-9]\|\[\[[1-4][0-9]' wiki/domains/design/concepts/design-system-components.md
# → ~46 wikilinks composants

ls modules/design-system/docs-supernova/components/*.md 2>/dev/null | wc -l
# → attendu si existe
```

### Etat repo attendu au debut

- `wiki/domains/design/concepts/design-system-components.md` (162L) liste 46 composants avec `[[01-button]]..[[46-carousel]]` + 6 foundations
- Les fichiers cibles sont dans `modules/design-system/docs-supernova/components/*.md` (dans module, pas dans wiki/)
- Vault Obsidian = racine projet (D-VAULT-01) → ces refs resolvent, mais pas "wiki-native"

### Decision

**Option retenue** : remplacer wikilinks par **backtick refs explicites** avec path complet, pour clarifier que ces composants sont DANS le module design-system (pas dans wiki/). Evite confusion "composant = page wiki".

### Actions atomiques

1. **Edit `wiki/domains/design/concepts/design-system-components.md`** :
   - Pour chaque ligne `- [[XX-nom]] — Description`, remplacer par : `- \`modules/design-system/docs-supernova/components/XX-nom.md\` — Description`
   - Meme traitement pour foundations : `- [[01-colors]]` → `- \`modules/design-system/docs-supernova/foundations/01-colors.md\``
   - Note : verifier que `docs-supernova/` existe bien + foundations/ + components/ (sinon ajuster path)

2. **Ajouter en tete de la page** un callout :
   ```markdown
   > [!note] **Refs composants = paths module**
   > Les composants UI et foundations sont documentes dans `modules/design-system/docs-supernova/` (genere par Supernova SDK). Les refs ci-dessous sont des **paths**, pas des wikilinks wiki.
   ```

3. **Update frontmatter** : `updated: 2026-04-17`

4. **Verifier absence autres wikilinks hors-vault** : 
   ```bash
   # Chercher d'autres wikilinks suspects vers modules/ dans wiki/
   grep -rn '\[\[modules/\|\[\[supabase/\|\[\[\.claude/' wiki/ --include="*.md"
   ```
   Si matches : traiter similairement.

### Verification post-phase

```bash
# 1. Plus de wikilinks casses hors-vault dans DS page
grep '\[\[0[1-9]\|\[\[[1-4][0-9]' wiki/domains/design/concepts/design-system-components.md
# → 0

# 2. Backtick refs en place
grep -c 'modules/design-system/docs-supernova' wiki/domains/design/concepts/design-system-components.md
# → ~52 (46 components + 6 foundations)

# 3. Health complet
bash scripts/wiki-health.sh 2>&1 | tail -3
bash scripts/ref-checker.sh 2>&1 | tail -3
# → ref-checker doit rester 0 (les paths existent dans module)

bash scripts/health-check.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
git checkout wiki/domains/design/concepts/design-system-components.md
```

### Commit message preformate

```
refactor(wiki): DS components refs wikilinks -> backtick paths (F6)

- wiki/domains/design/concepts/design-system-components.md :
  * 46 components : [[01-button]] -> `modules/design-system/docs-supernova/components/01-button.md`
  * 6 foundations : [[01-colors]] -> `modules/design-system/docs-supernova/foundations/01-colors.md`
  * Callout explicite : refs = paths module, pas wikilinks vault

Resolution F6 audit mapping/routage 2026-04-17.
Clarifie frontiere vault wiki/ vs module docs-supernova/.
```

---

## Phase 12 — SKIP Enforcement routing (~0min) [Session C]

**Objectif** : **PHASE SKIP** par decision Kevin + recommandation Claude. Documentee pour coherence du plan 15 phases.

### Justification du skip

- **Risque** : enforcement automatique du routing Cortex (hook PreToolUse qui checke signaux → agent) pourrait casser des workflows subtils (Kevin choisit agent manuellement parfois).
- **Benefice faible** : routing decoratif actuel fonctionne (discipline Kevin + table dans CLAUDE.md).
- **Complexite** : API hooks Claude Code + pattern matching signaux = ~2h implementation + tests multiples + risque faux positifs.
- **Decision** : GARDER routing decoratif. Discipline manuelle suffit pour dev solo.

### Actions atomiques

**Aucune**. Phase documentee comme SKIPPED.

### Verification post-phase

Aucune (pas d'action).

### Rollback

Aucun (pas de changement).

### Commit

Aucun (phase vide).

**Execution log** : marquer `[~] Phase 12 — SKIP (decision Claude + Kevin)`.

---

## Phase 13 — Tests end-to-end (~30min) [Session C]

**Objectif** : valider que tout l'etat post-Phase 11 est coherent, health SAIN, drift SYNC, Obsidian graph rend bien.

### Pre-conditions verifiables

```bash
# Phases 1-11 DONE (Phase 12 SKIP)
# Execution log : 11 phases [x], 1 phase [~] (Phase 12 skip)
```

### Etat repo attendu au debut

- Tous les commits Phases 1-11 poussses sur branche worktree
- Health-check SAIN (0 critical, 0 warning)
- Wiki pages : ~47 (50 - 3 categories mortes supprimees Phase 10)
- Wikilinks : counts.md doit refleter valeur reelle post-refactor
- Obsidian graph : 9 color groups (vs 12 avant)

### Actions atomiques

1. **Health-check complet** :
   ```bash
   bash scripts/health-check.sh 2>&1 | tee /tmp/health-post-refactor.log
   # → Verdict : SAIN attendu
   ```

2. **Drift-detector** :
   ```bash
   bash scripts/drift-detector.sh 2>&1 | tee /tmp/drift-post-refactor.log
   # → Verdict : SYNC
   ```

3. **Wiki-health** :
   ```bash
   bash scripts/wiki-health.sh 2>&1 | tee /tmp/wiki-health-post-refactor.log
   # → Verdict : SAIN, pages ~47
   ```

4. **Ref-checker** :
   ```bash
   bash scripts/ref-checker.sh 2>&1 | tee /tmp/ref-checker-post-refactor.log
   # → 0 refs cassees
   ```

5. **Tier-contradiction** :
   ```bash
   bash scripts/tier-contradiction-check.sh
   # → 0 duplications ou baisse vs baseline
   ```

6. **Sync-check** (audit complet) :
   ```bash
   bash scripts/sync-check.sh 2>&1 | tee /tmp/sync-check-post-refactor.log
   # → Verdict : SAIN
   ```

7. **Obsidian graph** (verification visuelle) :
   - Ouvrir Obsidian, inspect graph view
   - Verifier : 9 groupes couleurs (au lieu de 12)
   - Verifier : les 3 nodes trading/finance/sante sont tagges placeholder
   - Verifier : foundation-os-map n'est plus surdimensionne (moins de rayonnage)
   - Screenshot avant/apres si possible (chrome-devtools MCP si Obsidian web) — sinon note manuelle
   - **Regle Kevin** : memoire `feedback_visual_verification.md` — Kevin valide visuellement avant claim "fait"

8. **Tests app/DS (build + vitest)** — non touche normalement mais verification :
   ```bash
   cd modules/app && npm run build
   cd modules/app && npm test
   cd modules/design-system && npm run build 2>/dev/null
   ```

### Verification post-phase

Synthese dans Execution log Phase 13 :

```markdown
- [x] Phase 13 — tests
  * Health-check : SAIN
  * Drift : SYNC  
  * Wiki-health : SAIN (47 pages, 5 domaines, hot.md <1j)
  * Refs : 0 cassees
  * Tier-contradiction : 0 duplications
  * Sync-check : SAIN
  * Obsidian graph : 9 groupes couleurs, trading/finance/sante placeholder
  * App build + tests : OK
```

### Rollback explicite

Aucun changement dans cette phase → pas de rollback.

### Commit message preformate

Aucun commit direct (phase verification). Sauf si on commit les logs :

```
test(audit): verification end-to-end post-refactor mapping

Logs dans /tmp/*.log pour reference.
11 phases + 1 skip = tout SAIN.
```

(optionnel — peut etre omis).

---

## Phase 14 — Docs sync (~1h) [Session C]

**Objectif** : synchroniser CLAUDE.md + CONTEXT.md + wiki/hot.md + docs/core/* avec l'etat post-refactor. Aligner narratif + compteurs.

### Pre-conditions verifiables

```bash
# Phase 13 DONE, tout SAIN
wc -l CLAUDE.md CONTEXT.md wiki/hot.md
# → valeurs actuelles pour comparaison post-update
```

### Etat repo attendu au debut

- 11 phases refactor DONE + Phase 12 SKIP + Phase 13 tests OK
- CLAUDE.md : 195L (pre-refactor)
- CONTEXT.md : 135L
- wiki/hot.md : 96L (pas encore update avec refactor)
- docs/core/* : pas encore update

### Actions atomiques

1. **Edit `wiki/hot.md`** : overwrite avec nouveau contenu post-refactor.
   - Section "Last Updated" : "2026-04-17 (mapping refactor) : Refactor radical mapping/routage cerveau OS. 11 phases + rapport audit + archive (F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 F13 F14 F15). Wiki 50 -> 47 pages (3 categories mortes supprimees), 12 -> 9 color groups Obsidian, 4 -> 2 journals, foundation-os-map 205L -> 70L. Source counts unique counts.md. SessionStart unifie cockpit+session-start Tour 1."
   - Section "Recent Changes" : mettre a jour les 3-5 derniers commits
   - Section "Next Action" : mettre a jour

2. **Edit `CONTEXT.md`** :
   - Section "Sessions recentes" : ajouter nouvelle entree "2026-04-17 (mapping refactor)" (decrire scope + 15 findings + 11 phases)
   - Section "Modules" : verifier no change
   - Section "Cap" : mettre a jour (post-refactor, prochain = Phase 5 modules OU autre)
   - Section "Decisions" : ajouter "D-MAPPING-01 Refactor mapping/routage 2026-04-17" si decision structurante

3. **Edit `CLAUDE.md`** :
   - Si nouvelles conventions (peu probable post-refactor, c'est surtout nettoyage) : alignement
   - Verifier refs + counts mis a jour (5 templates -> 3 templates Phase 10, 7 commands inchange, etc.)

4. **Edit `docs/core/knowledge.md`** :
   - Section 1 Vault structure : aligne Phase 10 (sans comparisons/questions/canvases)
   - Section 10 Maintenance : aligne Phase 6 (sans log.md, session-dna.md)

5. **Edit `docs/core/communication.md`** :
   - Section 1 Tiers memoire : aligne
   - Section 6 Brief v12 : aligne si besoin

6. **Edit `docs/core/tools.md`** :
   - Section 1c Skills : "5 templates" → "3 templates"

7. **Edit `wiki/index-wiki.md`** :
   - Section Meta (Templates 5 → 3)
   - Tout le reste deja fait dans Phases 4, 9, 10

8. **Edit `wiki/meta/sessions-recent.md`** :
   - Append nouvelle session "2026-04-17 (mapping refactor)" en tete (5 max, la plus ancienne supprimee si > 5)
   - Format 4-8 lignes structurees (scope, livres, verifs, decisions, threads)

9. **Edit `wiki/meta/thinking.md`** (si insight cette session) :
   - Ajouter reflexion sur "refactor mapping → organicite cerveau" ou similaire

10. **Edit `wiki/meta/lessons-learned.md`** :
    - Ajouter si lecon identifee pendant refactor (ex: "pattern etoile vs mesh")

11. **Bash update counts** :
    ```bash
    bash scripts/wiki-counts-sync.sh
    # Regenere counts.md avec valeurs post-refactor
    ```

### Verification post-phase

```bash
# 1. hot.md updated
head -5 wiki/hot.md
# → date 2026-04-17

# 2. CONTEXT.md session ajoutee
grep "2026-04-17.*mapping" CONTEXT.md
# → match

# 3. Templates count coherent
grep "3 templates\|5 templates" docs/core/knowledge.md docs/core/tools.md CLAUDE.md | grep -v "3 templates"
# → 0 (toutes les refs "3 templates")

# 4. counts.md a jour
grep "Pages physiques" wiki/meta/counts.md
# → ~47

# 5. Full health
bash scripts/health-check.sh 2>&1 | tail -3
bash scripts/ref-checker.sh 2>&1 | tail -3
bash scripts/wiki-health.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
git checkout CLAUDE.md CONTEXT.md wiki/hot.md docs/core/knowledge.md docs/core/communication.md docs/core/tools.md wiki/index-wiki.md wiki/meta/sessions-recent.md wiki/meta/thinking.md wiki/meta/lessons-learned.md wiki/meta/counts.md
```

### Commit message preformate

```
docs(os): sync docs post-refactor mapping/routage

- wiki/hot.md : overwrite avec summary refactor 11 phases
- CONTEXT.md : session 2026-04-17 (mapping refactor) + decision D-MAPPING-01
- CLAUDE.md : counts aligne (3 templates), refs update
- docs/core/knowledge.md : vault structure sans comparisons/questions/canvases
- docs/core/communication.md : tiers alignes
- docs/core/tools.md : templates 5 -> 3
- wiki/index-wiki.md : templates 5 -> 3
- wiki/meta/sessions-recent.md : append session mapping refactor
- wiki/meta/thinking.md : insight pattern etoile vs mesh
- wiki/meta/lessons-learned.md : lessons refactor
- wiki/meta/counts.md : regenere (47 pages)

Phase 14/15 refactor mapping/routage 2026-04-17.
```

---

## Phase 15 — Rapport post-exec + archive (~30min) [Session C]

**Objectif** : mettre a jour le rapport d'audit avec les resultats d'execution puis archiver le tout. Cloturer le chantier.

### Pre-conditions verifiables

```bash
# Phases 1-14 DONE (Phase 12 SKIP)
ls docs/audits/2026-04-17-mapping-routage-audit/rapport.md
# → existe (ecrit Phase 1)
```

### Etat repo attendu au debut

- Rapport audit existe (Phase 1) : 13 axes + 15 findings + recommandations
- 11 phases refactor DONE
- Phase 13 tests OK
- Phase 14 docs sync OK

### Actions atomiques

1. **Edit `docs/audits/2026-04-17-mapping-routage-audit/rapport.md`** :
   - Ajouter Section 9 : "Execution results"
   - Sous-section pour chaque finding F1-F15 : **Status** (RESOLU/SKIP/DEFERRE) + **Resolution** (quel commit/phase) + **Verification** (commande OK)
   - Note de cloture : verdict final + lessons

2. **Mettre a jour l'Execution log de ce plan** :
   - 15 checkboxes : Phase 1-11 + 13-15 = [x], Phase 12 = [~]

3. **Archiver le plan versionne** :
   ```bash
   mkdir -p .archive/plans-done-260417
   git mv docs/plans/2026-04-17-mapping-routage-refactor.md .archive/plans-done-260417/
   ```
   Note : hook SessionEnd fera auto-archive si Execution log all [x], mais cette etape explicite assure.

4. **Archiver le rapport audit** (optionnel, Kevin decide) :
   - Si Kevin veut garder `docs/audits/` actif : laisser
   - Si Kevin veut archiver : `git mv docs/audits/2026-04-17-mapping-routage-audit/ .archive/audit-mapping-done-260417/`
   - Recommandation : **garder actif** un moment (reference pour review ulterieure), archiver apres validation Kevin

5. **Verifier Execution log** dans le plan archive + ce plan natif :
   ```bash
   grep "\[ \]" .archive/plans-done-260417/2026-04-17-mapping-routage-refactor.md
   # → 0 (tout [x] ou [~])
   ```

6. **Proposer commit final** a Kevin (pas auto — attendre OK).

### Verification post-phase

```bash
# 1. Rapport a jour
grep "Execution results\|RESOLU\|SKIP" docs/audits/2026-04-17-mapping-routage-audit/rapport.md 2>/dev/null || grep "Execution results\|RESOLU\|SKIP" .archive/audit-mapping-done-260417/rapport.md
# → matches

# 2. Plan archive
ls .archive/plans-done-260417/2026-04-17-mapping-routage-refactor.md
# → existe

# 3. docs/plans/ : aucun plan actif si Phase 15 est la derniere du workflow
ls docs/plans/*.md 2>/dev/null | grep -v _template-plan
# → 0 (ou les autres plans actifs s'il y en a)

# 4. Health final
bash scripts/health-check.sh 2>&1 | tail -3
```

### Rollback explicite

```bash
git mv .archive/plans-done-260417/2026-04-17-mapping-routage-refactor.md docs/plans/
# Editeur : retirer ajouts section 9 du rapport
git checkout docs/audits/2026-04-17-mapping-routage-audit/rapport.md
```

### Commit message preformate

```
docs(audit): cloture refactor mapping/routage + archive plan

- docs/audits/2026-04-17-mapping-routage-audit/rapport.md : section Execution results (15 findings status)
- docs/plans/2026-04-17-mapping-routage-refactor.md -> .archive/plans-done-260417/
- Execution log complet : 14 [x] + 1 [~] Phase 12 SKIP

Refactor mapping/routage DONE. 14 phases executees sur 15 plans.
Wiki 50 -> 47 pages, hub etoile -> mesh 2 niveaux, 4 journals -> 2,
counts source unique, categories mortes supprimees, domains placeholder,
SessionStart unifie, graph colors clean (12 -> 9).

Verdict : SAIN post-refactor (health-check + drift + wiki-health + refs).
```

---

## Fichiers critiques (recap table)

| Fichier | Phases touchees | Action principale |
|---|---|---|
| `docs/audits/2026-04-17-mapping-routage-audit/rapport.md` | 1, 15 | Creer + update post-exec |
| `docs/audits/2026-04-17-mapping-routage-audit/README.md` | 1 | Creer pointeur |
| `docs/plans/2026-04-17-mapping-routage-refactor.md` | 1, 15 | Copie versionnee + archive |
| `wiki/meta/counts.md` | 2, 14 | Regenerer + section Consumers |
| `wiki/hot.md` | 2, 4, 6, 14 | Unifier counts + Nav + overwrite final |
| `wiki/overview.md` | 2 | Stats → counts |
| `wiki/index-wiki.md` | 2, 3, 4, 6, 9, 10, 14 | Hub principal, aligne tout |
| `wiki/log.md` | 2, 6 | Unifier counts puis archive |
| `wiki/meta/foundation-os-map.md` | 2, 4, 9, 10 | Compresser 205→70L, mesh |
| `wiki/meta/index-app.md` | 3 | Archive |
| `wiki/meta/index-meta.md` | 3, 6, 10 | Retrait refs supprimees |
| `wiki/meta/index-concepts.md` | 4 | Remonter vers hubs |
| `wiki/meta/index-entities.md` | 4 | Idem |
| `wiki/meta/index-sources.md` | 4 | Idem |
| `wiki/meta/index-core-os.md` | 4 | Idem |
| `wiki/meta/index-cowork.md` | 4 | Idem |
| `wiki/meta/session-dna.md` | 6 | Archive |
| `wiki/meta/sessions-recent.md` | 6, 14 | Garde + append session |
| `wiki/meta/routines-setup.md` | 6 | Retrait refs log.md |
| `wiki/meta/thinking.md` | 14 | Append insight |
| `wiki/meta/lessons-learned.md` | 14 | Append lecons |
| `wiki/meta/templates/comparison.md` | 10 | Archive |
| `wiki/meta/templates/question.md` | 10 | Archive |
| `wiki/comparisons/` | 10 | Supprime |
| `wiki/questions/` | 10 | Supprime |
| `wiki/canvases/` | 10 | Supprime |
| `wiki/domains/trading/index-trading.md` | 9 | Callout [!placeholder] |
| `wiki/domains/finance/index-finance.md` | 9 | Idem |
| `wiki/domains/sante/index-sante.md` | 9 | Idem |
| `wiki/domains/design/concepts/design-system-components.md` | 11 | wikilinks → backtick paths |
| `wiki/entities/tools-foundation-os.md` | 8 | Nettoyage bullshit |
| `.obsidian/graph.json` | 5 | 12 → 9 color groups |
| `.claude/commands/cockpit.md` | 7 | Align Tour 1 session-start |
| `.claude/commands/session-start.md` | 7 | Clarification entete |
| `.claude/commands/session-end.md` | 6 | Retrait actions log/session-dna |
| `.claude/agents/doc-agent.md` | 3 | Retrait modules/app/data/ |
| `scripts/hooks/session-start-wiki.sh` | 7 | Retrait drift + head -60 |
| `scripts/wiki-counts-sync.sh` | 2, 14 | Execute (pas modifie) |
| `CLAUDE.md` | 7, 14 | Refs + unifi cockpit/session-start |
| `CONTEXT.md` | 14 | Session + decision D-MAPPING-01 |
| `docs/core/knowledge.md` | 6, 10, 14 | Vault structure aligne |
| `docs/core/communication.md` | 6, 14 | Tiers aligne |
| `docs/core/tools.md` | 10, 14 | 5 → 3 templates |
| `docs/core/monitor.md` | 3 | MD pairs → archive |
| `docs/core/tools/README-tools-catalogue.md` | 3 | Doc-agent aligne |
| `docs/manifeste.md` | 3 | Section 13.6 clarifiee |
| `~/.claude/projects/.../memory/project_structure.md` | 8 | Storybook 9 + --ds-* |
| `~/.claude/projects/.../memory/project_audit_v2_s3_handoff.md` | 8 | Deprecie |
| `~/.claude/projects/.../memory/feedback_tout_automatique.md` | 8 | Compresse |
| `~/.claude/projects/.../memory/MEMORY.md` | 8 | Actives 25 → 24 |

## Hors scope explicite

- **`modules/app/**`** : code App Builder, zero modification
- **`modules/design-system/**`** : code DS, zero modification (sauf refs textuelles DS si needed Phase 11, mais niveau wiki pas code DS)
- **`supabase/migrations/`** : SQL, zero modification
- **`.github/workflows/`** : CI, zero modification
- **`.archive/` contenu** : lecture seule (on verifie les refs qui y pointent, on ne touche pas le contenu archive)
- **Phase 5 decision** (Finance/Sante/Trading) : NON decide ici. Reste reportee Kevin.
- **Enforcement routing Cortex** (Phase 12) : SKIP par decision. Garde decoratif.
- **Routines Cloud 14 Desktop** : pas touche (Kevin UI /schedule separe)
- **OMC update v4.12.0** : pas touche (decision Kevin separee, memoire `tools-foundation-os.md` ligne OMC laissee "v4.10.1" sauf si Kevin valide update explicite)

## Verification end-to-end (apres Phase 15)

```bash
# 1. Wiki coherent
bash scripts/wiki-health.sh            # Verdict : SAIN, pages ~47, 5 domaines
bash scripts/wiki-counts-sync.sh --check  # [OK] sync

# 2. Refs intactes
bash scripts/ref-checker.sh            # 0 refs cassees

# 3. Drifts
bash scripts/drift-detector.sh          # Verdict : SYNC
bash scripts/docs-sync-check.sh         # Verdict : DOCS SYNC

# 4. Tier contradictions
bash scripts/tier-contradiction-check.sh  # 0 duplications (ou baisse vs baseline)

# 5. Health global
bash scripts/health-check.sh           # Verdict : SAIN

# 6. Obsidian graph
# Ouvrir Obsidian → graph view
# Confirmer : 9 color groups, domains placeholder, foundation-os-map compresse, zero fantome

# 7. App code intact
cd modules/app && npm run build        # OK ~250ms
cd modules/app && npm test             # 15/15
cd modules/design-system && npm run build 2>/dev/null  # OK

# 8. SessionStart test reel
# Nouvelle session /session-start → brief v12 s'affiche sans erreur, tous Tour 1 reads OK
```

## Risques

| # | Risque | Proba | Impact | Mitigation |
|---|--------|-------|--------|------------|
| R1 | Suppression accidentelle page wiki utilisee | faible | moyen | Actions atomiques + verification grep avant archive + rollback explicite |
| R2 | Casser ref vers foundation-os-map.md quand on compresse | moyen | faible | Ref-checker apres Phase 4 + grep refs entrantes avant |
| R3 | Obsidian graph rend mal apres changement colors | faible | faible | Phase 13 verification visuelle + rollback graph.json |
| R4 | Compactage session entre phases → perte contexte | moyen | moyen | Plan ultra-detaille (6 elements par phase) + memoires + hot.md + CONTEXT update |
| R5 | Changement SessionStart casse workflow Desktop | faible | moyen | Phase 7 verifications + Phase 13 test SessionStart reel + rollback immediat |
| R6 | Refactor memoires casse `last_used` auto-update hook | faible | faible | Hook idempotent (skip si pas de frontmatter last_used) + Phase 8 preserve frontmatter |
| R7 | Phase 10 suppression dossiers vides casse graph Obsidian | faible | faible | Dossiers vides = rien a casser. Obsidian juste affiche moins de dossier dans sidebar |
| R8 | Kevin veut garder un de ces elements supprimes | moyen | faible | Tout est archivable, rollback facile en git |

## Memoires permanentes a creer (post-execution)

- `feedback_mapping_anti_star_pattern.md` — Retenu lecon : eviter hubs surdimensionnes > 50 wikilinks, preferer mesh 2 niveaux + sous-indexes. Declencheur : quand un fichier accumule beaucoup de wikilinks, decouper.
- `project_mapping_refactor_done.md` — Trace du refactor 2026-04-17 (scope, findings, phases, resultats) pour reference future si similar chantier.

(Ces memoires seront creees en Phase 14 ou 15, update MEMORY.md index).

## Execution log

- [x] Phase 1 — Rapport audit ecrit (~1h30) [Session A]
- [x] Phase 2 — Unification counts wiki (~30min) [Session A]
- [x] Phase 3 — Decomission index-app.md + refs modules/app/data/ (~45min) [Session A]
- [ ] Phase 4 — Navigation 2 niveaux (~30min) [Session A]
- [ ] Phase 5 — Clean graph.json Obsidian (~15min) [Session A]
- [ ] Phase 6 — Rationaliser journals 4→2 (~45min) [Session B]
- [ ] Phase 7 — SessionStart optimise (~1h) [Session B]
- [ ] Phase 8 — Memoires nettoyage (~45min) [Session B]
- [ ] Phase 9 — Domains vides [!placeholder] (~30min) [Session B]
- [ ] Phase 10 — Categories mortes supprimees (~30min) [Session B]
- [ ] Phase 11 — Wikilinks DS hors-vault (~30min) [Session B]
- [~] Phase 12 — SKIP Enforcement routing (decision) [Session C]
- [ ] Phase 13 — Tests end-to-end (~30min) [Session C]
- [ ] Phase 14 — Docs sync (~1h) [Session C]
- [ ] Phase 15 — Rapport post-exec + archive (~30min) [Session C]

## Notes post-execution

(A remplir apres execution. Ecarts estimation vs reel, surprises, lecons retenues.)

---

## SESSION RENAME (a copier-coller dans sidebar Desktop apres ExitPlanMode)

```
🪐 Audit mapping + refactor radical OS (17-04-2026)
```

---

## Recap pour futur Claude compacte

**Si tu lis ce plan apres un compactage et tu dois reprendre** :

1. Lis INTEGRALEMENT ce fichier AVANT toute action.
2. Lis l'Execution log en bas : les [x] = deja fait, [ ] = a faire, [~] = skip decide.
3. Va directement a la premiere phase non-cochee.
4. Avant d'agir : execute les Pre-conditions verifiables de cette phase. Si pas match → STOP + diagnose.
5. Execute Actions atomiques DANS L'ORDRE.
6. Execute Verification post-phase. Si FAIL → Rollback explicite + diagnose.
7. Commit avec le message preformate.
8. Mark phase [x] dans Execution log.
9. Move to next phase.

**Contexte rapide** (si tu n'as pas du tout le contexte) :
- Kevin a demande un audit + refactor RADICAL du mapping/routage/memoire Foundation OS le 2026-04-17.
- Lecture exhaustive 128 fichiers cerveau faite. 15 findings detectes.
- Plan 15 phases sur 3 sessions (A/B/C).
- Tu refactores le **cerveau uniquement** (CLAUDE + CONTEXT + docs/core + wiki + commands + agents + scripts + memory + graph.json). PAS les modules/app ou modules/design-system.
- Source de verite fondamentale : `docs/audits/2026-04-17-mapping-routage-audit/rapport.md` (ecrit Phase 1).
- Regle d'or : rollback facile par phase, anti-compactage par plan detaille, verifications systematiques.
