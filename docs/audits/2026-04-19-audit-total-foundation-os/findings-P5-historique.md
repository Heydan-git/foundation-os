# Findings P5 — Historique + decisions + plans archives

> **Phase P5 du D-AUDIT-TOTAL-01** — Audit memoire long-terme Foundation OS : `.archive/` structure + decisions-log + 16 decisions actives CONTEXT.md + plans archives.

## Scope audite

| Source | Count | Detail |
|--------|-------|--------|
| `.archive/` dossiers | 36 (pas 37) | Poubelle structuree FOS |
| `.archive/` size | 5.4M | `du -sh .archive` |
| CONTEXT.md decisions actives | 16 | `grep "^\| D-" CONTEXT.md \| wc -l` |
| decisions-log.md archivees | 24 | 3 archivages : 7+10+7 |
| Plans archives 2026-04-15→19 | 5 dossiers | plans-done-260415/16/17/18/19 |
| Specs archivees | 2 dossiers | specs-done-260415/17 |

**Total decisions FOS** : 16 actives + 24 archivees = **40 decisions tracees depuis 2026-04-01**.

---

## Findings FORME

### F56 🟡 .archive/ size 5.4M = raisonnable mais grossit

**Fait** : 36 dossiers + ARCHIVE-LOG.md + quelques fichiers plats. Top size :
- `ds-reference-base-260417/` : 888K (base DS Figma Make import)
- `ds-rebuild-2026-04-14/` : 836K (plan + artefacts DS rebuild)
- `audit-massif/` : 580K (rapports audit multi-sessions)
- `base-DS-figma-make/` : 376K
- `intelligence/` : 332K

**Observation** : 2026-04 seulement. 5.4M pour 3 semaines de travail = vitesse d'accretion ~1.8M/semaine. Phase 5 (3 nouveaux modules) multipliera x2-3.

**Recommendation** :
- P13 cloture : evaluer si ARCHIVE-LOG.md tracks bien les 36 dossiers (rappel historique)
- Futur : `du -sh .archive/` dans chain health-check INFO pour surveillance croissance

### F57 🟢 Plans archives structure date cohérente

**Fait** : 5 dossiers `plans-done-YYMMDD/` :
- `plans-done-260415/` : migration Desktop + level-up OS + DS rebuild
- `plans-done-260416/` : mega audit v2 + hygiene + mapping
- `plans-done-260417/` : cleanup drifts + wiki S3 + mapping refactor
- `plans-done-260418/` : D-INTEG-01 integration sources externes
- `plans-done-260419/` : D-BODY-01 + D-PRODUCT-01 (2 plans, aujourd'hui)

**Validation** : auto-archive hook `scripts/auto-archive-plans.sh` (SessionEnd) fonctionne bien. Plans `status:done` deplaces immediat. 🟢 OK.

### F58 🟡 ARCHIVE-LOG.md existence mais pas lu (confidence low)

**Fait** : `.archive/ARCHIVE-LOG.md` existe (visible `ls .archive/`). Pas lu cette phase.

**Recommendation** : verifier P13 qu'il est a jour. Sinon update avec derniers archives 260418+260419.

### F59 🟡 decisions-log.md = 3 archivages sur 40+ decisions

**Fait** : decisions-log.md contient :
- **Archivage 2026-04-07** : 7 decisions initiales (stack, design, architecture, commits, anti-bullshit, garde-fous, schema DB)
- **Archivage 2026-04-07** : 10 decisions Phases/Specs/Memoire/Core OS/module-scaffold (archive meme jour, housekeeping S3)
- **Archivage 2026-04-17** : 7 decisions avril (D-PLAN-01/TOOLS/COCKPIT/BRIEF/COM/HK-02 + compactage)

Total archive = 24. Avec 16 actives CONTEXT.md = **40 decisions totales**.

**Observation** : pas d'archivage depuis 2026-04-17. Les 16 actives incluent des decisions tres recentes (D-BODY-01/D-PRODUCT-01 2026-04-19) mais aussi des plus anciennes (D-DS-REBUILD 2026-04-11, D-WT-01 2026-04-11) qui pourraient etre archivees.

**Recommendation P12** : faire un nouveau archivage CONTEXT.md → decisions-log.md pour les decisions 2026-04-11/15/16 stables. Passerait CONTEXT.md de 16 → ~10 decisions actives.

### F60 🟢 CONTEXT.md 16 decisions = sous seuil compression (seuil 15 declencheur mentionne communication.md)

**Fait** : CONTEXT.md section Decisions contient 16 lignes. Protocole communication.md section 3.2 : "Max 15 decisions actives. Au-dela : archiver les stables (> 30 jours) dans `docs/decisions-log.md`."

**Gap leger** : 16 = 1 de plus que seuil. Pas alarmant mais declencheur theoretique.

**Verification** : mais selon decisions-log.md "Archivage 2026-04-07" protocole dit "Quand CONTEXT.md depasse 15 decisions actives". Donc 16 >= 15 → declenche. Statut : overdue.

**Fix potentiel P11/P12** : mini archivage 2-3 decisions stables (D-DS-REBUILD / D-WT-01 / D-NAMING-02 / D-VAULT-01 ? selon stabilite).

---

## Findings FONCTION

### F61 🟢 Decisions datation 100% (all 16 ont date)

**Fait** : `health-check.sh` INFO "Decisions datees: 16" (toutes datees). Coherent avec P-XX constitution (traceabilite temporelle).

**Validation** : 🟢 OK.

### F62 🟡 Nomenclature D-SCOPE-NN inegale sur certaines decisions

**Fait** : examen decisions CONTEXT.md et decisions-log.md :
- Forme stricte `D-SCOPE-NN` : D-PRODUCT-01, D-BODY-01, D-CONCURRENCY-01, D-INTEG-01, D-WIKI-01, D-LEVELUP-01/02/03, D-MAPPING-01, D-PLAN-01/02, D-TOOLS-01, D-COCKPIT-01, D-BRIEF-01, D-COM-01, D-HK-02, D-DS-REBUILD (pas -01), D-WT-01, D-NAMING-01/02, D-VAULT-01, D-DESKTOP-01
- Forme libre (non-D-SCOPE-NN) : "Stack", "Design", "Architecture", "Commits", "Anti-bullshit", "Garde-fous", "Schema DB" (7 initiales 2026-04-01) + "Memoire", "Foundation v2", "Phase 1/2/3/4 DONE", "module-scaffold"

**Observation** : 
- 7 decisions 2026-04-01 = initiales, sans prefix D-
- 10 decisions 2026-04-07 = Phase/spec DONE + module-scaffold, sans prefix D-
- Decisions >= 2026-04-10 = toutes D-SCOPE-NN

**Cause racine** : convention D-SCOPE-NN introduite apres coup (~2026-04-10). Les 17 anciennes gardent leur forme libre pour ne pas casser refs.

**Recommendation** : OK historique. Pas de fix. Note dans P13 rapport-master.

### F63 🔴 D-DS-REBUILD sans numero (anomalie unique)

**Fait** : `D-DS-REBUILD` (2026-04-11) casse la convention `D-SCOPE-NN` (doit etre D-DS-01 ou D-DS-REBUILD-01).

**Impact** : anomalie unique dans la table. Futur decision DS (si vient) = D-DS-01 ou D-DS-02 ? Conflit naming.

**Fix prevu P11** : rename `D-DS-REBUILD` → `D-DS-01` dans CONTEXT.md + grep + update refs ailleurs.

### F64 🟡 Plans archives coherence frontmatter

**Fait** : hook `scripts/auto-archive-plans.sh` deplace plans `status:done` OU `[x] >= 3` cases. Verification non-approfondie ici sur les 5 dossiers archives.

**Recommendation** : accepter statut fait-accompli. Si Kevin pense que certains plans archives 2026-04-15/16/17 etaient premature, a voir P13 mais pas urgence.

### F65 🟡 .archive/ contient des fichiers racine (pas dossiers)

**Fait** : en plus des 36 dossiers :
- `ARCHIVE-LOG.md` (fichier)
- `directive-v1.md` (fichier)
- `memory.md` (fichier, ancien renomme en docs/core/communication.md)
- `tools-audit.md` (fichier)
- `settings-local-audit-260415.json` (fichier)
- `settings-local-before-migration-260415.json` (fichier)

**Observation** : 6 fichiers plats dans .archive/ + 36 dossiers. Convention usuelle = tout en dossiers dates. Pattern hybride.

**Recommendation** : OK pragmatique. Les fichiers plats sont des artefacts specifiques (log, memoire renomme, audit ponctuel). Pas de fix P11.

---

## Findings META

### M12 🟢 Historique coherent + traceable

**Fait** : git log depuis 2026-04-01 visible. Chaque decision a sa date. Plans archives separes par date. Rapport d'audit massif (audit-v2-done-260417) stocke. Memoires deprecated conservees (pas supprimees). Pattern `.archive/` = poubelle structuree respecte.

**Validation** : 🟢 OK fort. Kevin peut faire du "time travel" a n'importe quelle date avril 2026.

### M13 🟡 Pas d'index canonique multi-archives

**Fait** : `.archive/` contient 36 dossiers dates mais pas d'index chronologique global. Si Kevin veut "tous les plans executed + archives sur 2026-04" il doit faire `ls -la .archive/plans-done-*`. Pas de page wiki index-archives.md.

**Recommendation** : P12 candidat (faible valeur) — creer `.archive/ARCHIVE-LOG.md` update systematique ou page wiki `wiki/meta/index-archives.md`.

### M14 🟡 Decisions-log.md pas versionne dans wiki

**Fait** : `docs/decisions-log.md` reference historique. Pas copie ni pointe dans `wiki/` (pattern knowledge atemporel). Pourtant decisions = knowledge historique (pattern Compounding Knowledge).

**Cause racine** : decisions-log.md est spec technique → docs/, pas knowledge atemporel → wiki/. Choix tier correct.

**Nuance** : pourrait etre surface dans wiki via `wiki/concepts/Foundation OS Decisions Timeline.md` (concept atemporel). Pas urgent.

---

## Synthese verdict P5

**Verdict** : 🟢 **SAIN**, historique robuste avec petits drifts cosmetiques.

**FORME** : 
- 36 dossiers .archive/ structures par date
- 5.4M size (raisonnable, 1.8M/semaine)
- 5 dossiers plans-done + 2 specs-done = chronologie claire

**FONCTION** :
- 40 decisions tracees (16 actives + 24 archives) 
- 100% datees (health-check confirme)
- Auto-archive plans fonctionne (hook SessionEnd actif)
- decisions-log.md maintient historique en 3 archives

**Livrables P11 identifies** :
1. 🔴 F63 : rename `D-DS-REBUILD` → `D-DS-01` dans CONTEXT.md (+ grep refs)
2. 🟡 F60 : petit archivage CONTEXT.md → decisions-log.md (2-3 decisions stables ~30j : D-DS-01 + D-WT-01 + D-NAMING-02/VAULT-01)
3. 🟡 F58 : verifier + update .archive/ARCHIVE-LOG.md avec 260418+260419 dossiers

**Report P12/P13** :
- F56 : monitoring croissance .archive/ (Phase 5 = x2-3)
- M13 : creer wiki/meta/index-archives.md si utilite emerge
- F62 : accepte nomenclature historique ancienne (pas de retro-rename)

---

## Cross-refs P5 → autres phases

- F63 → **P11 FIX** (rename D-DS-REBUILD canonique)
- F60 → **P11 FIX** (archivage 2-3 decisions stables)
- F58 → **P11 FIX** (update ARCHIVE-LOG.md)
- F56 → **P8 tokens** (pas direct mais eventuelle chain health-check .archive/ size)

---

## Cloture Phase P5

**Livrable** : ce fichier + 10 findings (F56-F65 + M12-M14) + 3 fixes P11 identifies + 3 recommendations report.

**Insight cle** : Foundation OS a une **historiographie mature** (3 semaines, 40 decisions tracees, 36 dossiers archives). Aucun probleme structurel. Les 3 fixes P11 sont cosmetiques (nomenclature + 1 archivage + 1 update log).

**Anti-compactage proof** : fichier sur disque + commit P5/14 incoming.

**Next** : Phase P6 — Comportement Claude + alignement constitution.

---

*Generated 2026-04-20 — D-AUDIT-TOTAL-01 Phase P5/14 — Claude Opus 4.7 1M context*
