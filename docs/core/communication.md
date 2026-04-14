# Communication — Spec

Module Core OS responsable de la journalisation, l'indexation, la lecture du projet et le briefing de session. Remplace et elargit l'ancien module Memory.

> Ce module definit COMMENT l'information circule entre les sessions. Les 4 fonctions : Journaliser (ecrire), Indexer (organiser), Lire (comprendre), Briefer (presenter).

## 1. Tiers de memoire

| Tier | Support | Duree de vie | Mis a jour par |
|------|---------|-------------|----------------|
| Session | Conversation Claude | 1 session | automatique |
| Contexte | CONTEXT.md | Permanent (chaque session) | session-end |
| Reference | docs/ | Permanent (fondamentaux) | quand architecture change |
| Auto-memory | ~/.claude/projects/.../memory/ | Permanent | Claude Code natif |

### Regle d'or
**Une information ne vit que dans UN tier.** Pas de duplication. Si c'est dans docs/, CONTEXT.md pointe vers le doc.

### Auto-memory — ce qui y va (et ce qui n'y va pas)

Le tier auto-memory (`~/.claude/projects/.../memory/`) est gere par Claude Code natif. Il sert a stocker ce qui est **utile entre sessions mais pas operationnel** :

| Va dans auto-memory | Ne va PAS dans auto-memory |
|---------------------|---------------------------|
| Profil utilisateur (role, preferences, TDAH) | Etat du projet (→ CONTEXT.md) |
| Feedback sur le comportement de Claude | Architecture, specs (→ docs/) |
| Patterns de travail valides | Decisions techniques (→ CONTEXT.md > Decisions) |
| Conventions non-evidentes | Metriques, builds (→ CONTEXT.md > Metriques) |

**Test** : si l'information change a chaque session → CONTEXT.md. Si elle est stable et concerne *comment travailler* plutot que *ou on en est* → auto-memory.

### CONTEXT.md = source unique operationnelle
Tout ce qui est necessaire pour comprendre l'etat courant du projet et produire un brief se trouve dans CONTEXT.md. Aucun autre fichier n'est requis pour le brief. Les fichiers d'archive (decisions-log.md, .archive/) existent pour reference historique, pas pour l'operation courante.

## 2. Nomenclature

Nommage unifie pour toutes les sections de CONTEXT.md et les briefs.

| Ancien nom | Nouveau nom | Raison |
|------------|-------------|--------|
| Dernieres sessions | Sessions recentes | Plus clair, "dernieres" ambigu |
| Decisions actives | Decisions | "actives" implicite (les archivees sont dans decisions-log.md) |
| Prochaine action | Cap | Direction strategique, pas juste une tache |
| Actions manuelles Kevin | En attente Kevin | Plus generique, couvre actions + questions + validations |
| Etat technique | Metriques | Factuel, extensible |
| Cycle 3 progress | Chantier en cours | Generique, reutilisable pour tout chantier |
| Memory (module) | Communication | Couvre journalisation + indexation + lecture + briefing |

### Convention de nommage
- Sections CONTEXT.md : **nom court francais** (2-3 mots max)
- Identifiants decisions : `D-[SCOPE]-NN` (ex: D-COM-01, D-HK-01)
- Statuts session : DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED
- Dates : toujours YYYY-MM-DD

## 3. Journalisation — Comment on ecrit

### 3.1 Format session (CONTEXT.md > Sessions recentes)

**Derniere session (la plus recente) : 4-8 lignes structurees**

```markdown
| 2026-04-10 | **[DONE] Titre court** |
|            | Scope : ce qui a ete touche (modules, fichiers) |
|            | Decisions : D-XX-01 titre, D-XX-02 titre |
|            | Idees capturees : bullets si applicable |
|            | Commits : hash1 titre1, hash2 titre2 |
```

**Sessions 2 a 5 : 1-2 lignes**

```markdown
| 2026-04-10 | **[DONE] Titre court** — resume 1 phrase. N commits. |
```

**Max 5 sessions.** Les plus anciennes sont supprimees (pas deplacees — le detail est dans git log).

### 3.2 Format decisions (CONTEXT.md > Decisions)

**2-3 lignes max par decision :**

```markdown
| Decision | Date | Detail |
| D-COM-01 Titre | 2026-04-10 | 1-2 phrases : ce qui a ete decide + impact. Ref fichier si besoin. |
```

- Max 15 decisions actives
- Au-dela : archiver les stables (> 30 jours) dans `docs/decisions-log.md`
- Decisions supersedees : remplacer, ajouter "(remplace: ancien)"

### 3.3 Format idees (CONTEXT.md > Idees & Parking)

**Section nouvelle.** Bullets courts, captures au session-end.

```markdown
## Idees & Parking

- 💡 [sujet] : description courte (1 ligne). Source : session du YYYY-MM-DD.
- 🔮 [sujet] : option gardee pour plus tard. Contexte : pourquoi c'est la.
- ❓ [sujet] : question ouverte a trancher.
```

Types d'entrees :
- 💡 Idee concrete (actionnable si on decide de la faire)
- 🔮 Option future (pas urgente, a garder en tete)
- ❓ Question ouverte (necessite reflexion ou decision Kevin)

**Maintenance :** au session-start, les idees sont presentees dans le brief. Si une idee est tranchee (faite ou rejetee), elle est supprimee du parking. Pas d'accumulation infinie — max ~10 entrees, au-dela prioriser et archiver.

### 3.4 Format metriques (CONTEXT.md > Metriques)

Compact, factuel, mis a jour a chaque session-end si changement.

```markdown
## Metriques

| Module | Build | JS | CSS | Tests | Routes |
|--------|-------|----|-----|-------|--------|
| App Builder | OK 199ms | 244 kB | 29 kB | 19/19 | 7 |
| Design System | OK tokens | — | — | 100/100 | — |
```

Seuils d'alerte : JS > 600 kB 🟡, JS > 800 kB 🔴, CSS > 40 kB 🟡.

### 3.5 Protocole session-end — journalisation

A chaque session-end, le protocole ecrit dans CONTEXT.md dans cet ordre :

1. **Sessions recentes** : ajouter en tete, format 3.1, supprimer la 6e si > 5
2. **Decisions** : ajouter si nouvelle, archiver si > 15
3. **Idees & Parking** : capturer les reflexions/pistes de la session, nettoyer les resolues
4. **Cap** : mettre a jour la direction
5. **En attente Kevin** : ajouter/retirer selon session
6. **Metriques** : mettre a jour si build/tests/routes changent
7. **Modules** : mettre a jour si status change
8. **Chantier en cours** : mettre a jour si applicable

**Verification de coherence** : session-end verifie que chaque section a ete revue. Si une section n'a pas ete touchee et aucun changement n'est pertinent → OK. Si un changement est pertinent mais pas reflété → warning explicite.

## 4. Indexation — Comment on organise

### 4.1 Structure CONTEXT.md

Ordre des sections (fixe, ne pas reordonner) :

```
# Foundation OS — Contexte
## Modules                    (table status par module)
## Sessions recentes          (max 5, format 3.1)
## Chantier en cours          (si applicable, sinon absent)
## Cap                        (direction + pourquoi + pistes)
## Idees & Parking            (nouveau)
## En attente Kevin           (actions/questions humaines)
## Decisions                  (max 15 actives, format 3.2)
## Metriques                  (table compacte, format 3.4)
```

### 4.2 Budget de taille

| Section | Budget lignes | Regle |
|---------|--------------|-------|
| Modules | ~15 | 1 ligne par module |
| Sessions recentes | ~20 | derniere 4-8L, anciennes 1-2L |
| Chantier en cours | ~15 | table progress si actif |
| Cap | ~10 | direction + pistes A/B/C |
| Idees & Parking | ~15 | max 10 entrees, 1 ligne chacune |
| En attente Kevin | ~10 | bullets courts |
| Decisions | ~30 | max 15 x 2L |
| Metriques | ~10 | table compacte |
| **Total** | **~125** | **Objectif < 150 lignes** |

**Garde-fou** : si CONTEXT.md depasse 200 lignes → session-end affiche un warning et propose de compresser les sessions/decisions les plus anciennes.

### 4.3 Ce qui ne va PAS dans CONTEXT.md

- Detail debug ou tentatives echouees → session seulement
- Architecture, design tokens, specs → docs/ (reference)
- Preferences utilisateur, feedback → auto-memory
- Historique complet sessions → git log
- Decisions archivees → docs/decisions-log.md

## 5. Lecture — Comment on comprend

### 5.1 Protocole session-start — lecture

Phase 1 — Collecte (parallele, obligatoire) :

| Source | Quoi lire | Pourquoi |
|--------|-----------|----------|
| CONTEXT.md | Entier (< 150L) | Etat courant complet |
| git status | `--short` | Fichiers non commites |
| git log | `-1 --format="%cr · %h · %s"` | Dernier commit |
| git branch | `--show-current` | Branche active |
| Build | `npm run build -w modules/[nom]` par module actif | Sante build |
| Health-check | `bash scripts/health-check.sh` | Sante globale |

Phase 2 — Verification structure :
- Racine = seulement fichiers autorises (CLAUDE.md, CONTEXT.md, README.md, .gitignore, package.json, package-lock.json + dossiers)
- Modules CONTEXT.md ↔ filesystem coherents

**Aucun autre fichier n'est lu pour le brief.** CONTEXT.md est auto-suffisant.

### 5.2 Acces au detail (a la demande)

Si Claude a besoin de detail sur une session passee → `git log --oneline -10` + `git show [hash]`
Si detail sur une decision archivee → `docs/decisions-log.md`
Si detail architecture → `docs/core/[module].md` ou `docs/`

Ces lectures sont a la demande, pas systematiques.

## 6. Briefing — Comment on presente

### 6.1 Brief de debut de session (v11 — TDAH-friendly)

**12 sections**, chacune dans un **cadre box-drawing** `┌─ TITRE ─┐ ... └─┘`. 2 lignes vides entre cadres.

Principe TDAH : cadres = zones visuelles, alignement strict, labels paddes, respiration entre blocs.

#### Sections

1. **SANTE** : 4 lignes (projet/build/tests/health), barres 12 blocs, % aligne a droite
2. **TRAJECTOIRE** : mission/focus/tendance(▲▶▼)/derniere session
3. **PLANS ACTIFS** (obligatoire) : pour chaque plan `docs/plans/*.md` non cloture :
   - nom + chemin
   - progression globale (N/M blocs ou phases DONE)
   - **hier** : plan + phase/bloc executes + commit
   - **prochain** : bloc(s) suivant(s) de la prochaine session du plan
   - **reste apres** : liste condensee des sessions/blocs restants
   Si 2+ plans en parallele → un sous-cadre par plan. Lister les DEUX meme si un seul a ete touche hier.
4. **MODULES** : groupes Code/Meta/Prevu + sous-section `├─ ACCES ─┤` (URLs + git)
5. **ATTENTION** : alertes/rappels/en attente Kevin
6. **DERNIER TRAVAIL** : commit vulgarise + decisions prises
7. **STATUT PROJET** : barres progression par chantier
8. **IDEES & PARKING** : 💡 concretes / 🔮 futures / ❓ ouvertes
9. **REFLEXION** : questions en suspens + liens idees↔travail
10. **HISTORIQUE** : 3 decisions recentes + echeance
11. **CAP** : direction + pistes A/B/C
12. **INPUT** (double trait `╔═══╗`) : questions groupees + `On y va ?`

#### Regle plans

Un plan est "actif" tant que son `Execution log` contient au moins une case `[ ]` OU son frontmatter `status` != `done`/`closed`. Un plan cloture (F1-F9 done, commit final passe) est retire du brief mais reste trace dans HISTORIQUE sur la session de cloture.

Entete et Input en double trait `╔═══╗` pour ancrer debut/fin visuellement.

### 6.2 Brief de fin de session (v11 — TDAH-friendly)

**6 sections** en cadres box-drawing :

1. **Entete** (double trait) : date + statut (DONE / CONCERNS / NEEDS_CONTEXT / BLOCKED)
2. **ETAT TECHNIQUE** : build/tests/health/refs
3. **CE QUI A ETE FAIT** : commits vulgarises + fichiers + decisions
4. **IDEES CAPTUREES** : reflexions/pistes sauvees dans CONTEXT.md
5. **CAP MIS A JOUR** : direction + prochaine action
6. **CONCERNS** (si != DONE) : description du blocage

Section "Persistance" supprimee (redondante — CONTEXT.md est toujours mis a jour).

### 6.3 Regles de rendu v11

#### Structure visuelle
- **Cadres** : `┌─ TITRE ─┐ ... └─┘` (42 chars largeur fixe)
- **Entete/Input** : double trait `╔═══╗ ... ╚═══╝` (ancrage visuel debut/fin)
- **Sous-sections** : `├─ SOUS-TITRE ─┤` (subdivision interne)
- **Blanc** : 2 lignes vides entre chaque cadre
- **Indentation** : 3 espaces apres `│`

#### Alignement
- Labels : emoji + mot, padde a 12 chars
- Valeurs numeriques : alignees a droite
- Barres : `████████████` (12 blocs) toujours a la meme colonne
- Colonnes consistantes dans chaque cadre

#### Couleurs et symboles
- Emojis couleur : 🟢 OK / 🟡 warning / 🔴 casse / 🔵 pause / ⚪ vide / ⚫ prevu / 🔮 futur
- Tendance : ▲ mieux / ▶ pareil / ▼ pire
- Barres : `█` plein, `░` vide

#### Texte
- Lignes courtes : ~55 chars max (interieur cadre)
- Vulgariser : glose 3-4 mots pour tout jargon
- Mise en garde : `⚠ [risque]` si simplification cache un danger
- Mots interdits : revolution, historique, accomplish, reference mondiale

### 6.4 Sources de donnees pour le brief

| Section brief | Source dans CONTEXT.md | Source live |
|---------------|----------------------|------------|
| Sante | — | health-check + build |
| Trajectoire | Cap + Sessions recentes | git log -1 |
| Plans actifs | Sessions recentes (pointeur) | `docs/plans/*.md` Execution log + frontmatter |
| Modules + Acces | Modules | git status + branch |
| Attention | En attente Kevin | health-check |
| Dernier travail | Sessions recentes + Decisions | git log -1 |
| Statut projet | Modules + Chantier en cours | — |
| Idees | Idees & Parking | — |
| Reflexion | Idees & Parking | — |
| Historique | Decisions (3 recentes) | — |
| Cap | Cap | — |

## 7. Capture d'idees — Mecanisme

### Quand capturer
- **Pendant la session** : si une reflexion/piste emerge, la noter mentalement
- **Au session-end** : phase dediee "Capture idees" — passer en revue la session et extraire les idees qui meritent de survivre

### Quoi capturer
- Pistes techniques non explorees ("on pourrait faire X pour Y")
- Questions strategiques ("est-ce qu'on devrait Z avant W ?")
- Options gardees pour plus tard ("si un jour on veut A, penser a B")
- Retours d'experience ("la prochaine fois, faire C au lieu de D")

### Quoi NE PAS capturer
- Taches concretes → Cap ou chantier en cours
- Decisions tranchees → section Decisions
- Bugs a fixer → Cap ou En attente Kevin
- Detail technique → code ou docs/

### Lifecycle d'une idee
```
capturee (session-end) → presentee (session-start brief)
  → tranchee (faite OU rejetee OU transformee en decision/tache)
  → supprimee du parking
```

Max 10 idees en parking. Au-dela, forcer une priorisation : garder les 10 plus pertinentes, archiver ou supprimer le reste.

## 8. Relation avec les autres modules Core OS

| Module | Relation avec Communication |
|--------|---------------------------|
| Cortex | Communication fournit le contexte que Cortex utilise pour router |
| Monitor | Communication consomme les metriques de Monitor pour le brief |
| Tools | session-start et session-end sont des commands (outils) qui executent les protocoles Communication |

## 9. Migration depuis Memory

Cette spec remplace l'ancien module Memory (archive : `.archive/memory.md`). Les changements :

| Aspect | Memory (ancien) | Communication (nouveau) |
|--------|----------------|------------------------|
| Scope | Persistance uniquement | Journalisation + Indexation + Lecture + Briefing |
| Tiers | 4 tiers definis | 4 tiers + protocoles de lecture/ecriture |
| Format sessions | Libre (blobs) | Structure a champs fixes |
| Decisions | Format table simple | Format compact + archivage auto |
| Idees | Non couvert | Section dediee + lifecycle |
| Brief | Non couvert (dans commands/) | Spec complete v10 |
| Nomenclature | Non definie | Table de nommage unifiee |
| Budget taille | Non defini | < 150L CONTEXT.md, garde-fou 200L |
